# TODO アプリケーション仕様書

## Context

Next.js を使用した TODO アプリケーションを新規構築する。プロジェクトは空の Git リポジトリ状態からスタートし、フル機能の TODO 管理アプリを構築する。

**技術スタック:** Next.js (App Router) + TypeScript + Tailwind CSS + localStorage

---

## 1. データモデル

`src/types/todo.ts` に全型定義を配置する。

```typescript
export type Priority = "high" | "medium" | "low";
export type TodoStatus = "incomplete" | "complete";

export interface Category {
  id: string;          // crypto.randomUUID()
  name: string;
  color: string;       // プリセットカラー名 (例: "blue", "red", "green")
  createdAt: string;   // ISO 8601
}

export interface Todo {
  id: string;          // crypto.randomUUID()
  title: string;
  description: string;
  status: TodoStatus;
  priority: Priority;
  categoryId: string | null;  // null = 未分類
  dueDate: string | null;     // ISO 8601 日付文字列
  sortOrder: number;          // ドラッグ&ドロップ用の並び順
  createdAt: string;          // ISO 8601
  updatedAt: string;          // ISO 8601
}

export interface AppState {
  todos: Todo[];
  categories: Category[];
}
```

**設計方針:**
- ID は `crypto.randomUUID()` を使用（uuid ライブラリ不要）
- 日付は ISO 8601 文字列で保存（JSON シリアライズとの互換性）
- `sortOrder` は整数値（ドラッグ時に再計算）
- カテゴリ削除時、紐づく TODO の `categoryId` は `null` に設定（TODO は削除しない）

---

## 2. 機能一覧

### 基本 CRUD
- TODO の追加（タイトル、説明、優先度、カテゴリ、期限を設定）
- TODO の一覧表示
- TODO の編集（モーダルダイアログ）
- TODO の削除（確認ダイアログ付き）
- TODO の完了/未完了トグル

### カテゴリ管理
- カテゴリの作成（名前 + カラー選択）
- カテゴリの編集・削除
- カテゴリ別フィルタリング
- 「すべて」「未分類」の擬似カテゴリ

### 優先度
- 3 段階: 高 (red) / 中 (yellow) / 低 (green)
- 優先度別フィルタリング・ソート

### 期限管理
- 日付ピッカーで期限設定
- 期限切れの視覚的インジケーター（赤色表示 + 警告アイコン）
- 期限順ソート

### 検索
- タイトル・説明文を対象とした全文検索（大文字小文字不問）

### ドラッグ＆ドロップ
- TODO の並び替え（ソートが「手動」の時のみ有効）
- @dnd-kit ライブラリを使用

### ステータスフィルタ
- すべて / 未完了 / 完了 で絞り込み

### ソート
- 期限順 / 優先度順 / 作成日順 / 手動並び替え

---

## 3. ページ構成

シングルページ構成（`/` のみ）。フィルタ・検索状態はコンポーネント内 state で管理。

```
src/app/
  layout.tsx      -- ルートレイアウト（Server Component）
  page.tsx        -- ルートページ（Server Component シェル → TodoApp を描画）
  globals.css     -- Tailwind ディレクティブ
```

---

## 4. コンポーネント構成

Server/Client 境界は `<TodoApp />` に設定。layout.tsx と page.tsx は Server Component、それ以下はすべて Client Component。

```
<TodoApp /> ("use client" - ハイドレーション境界)
  ├── <Header />           -- アプリタイトル、検索バー
  ├── <Sidebar />          -- カテゴリ一覧、フィルタ、ソート制御
  ├── <TodoList />         -- DndContext + SortableContext ラッパー
  │   └── <TodoItem />     -- 個別 TODO 行（ソート可能）
  ├── <AddTodoButton />    -- TODO 追加ボタン（モバイルでは FAB）
  ├── <TodoFormModal />    -- TODO 作成/編集モーダル
  ├── <CategoryFormModal />-- カテゴリ作成/編集モーダル
  └── <ConfirmDialog />    -- 削除確認ダイアログ
```

---

## 5. 状態管理

外部ライブラリ不使用。React `useReducer` + カスタムフックで実装。

### `useTodoStore` フック（中核）
- `useReducer` で TODO・カテゴリの全状態を管理
- マウント時に localStorage から読み込み（HYDRATE アクション）
- 状態変更時に自動で localStorage へ永続化（useEffect）
- `hydrated` フラグでハイドレーション完了を管理

### `useFilteredTodos` フック
- フィルタ条件（ステータス、カテゴリ、優先度、検索文字列）とソート条件を受け取り、絞り込み・並び替え済みの配列を返す
- `useMemo` で計算結果をメモ化

### `useFilterState` フック
- フィルタ・ソート・検索の UI 状態を管理

---

## 6. localStorage 戦略

- **キー:** `"todo-app-state"`
- **バージョニング:** `version` フィールドでスキーマ変更に対応
- **ハイドレーション:** サーバーと初回クライアントレンダリングは同一のスケルトンを描画し、`useEffect` で localStorage 読み込み後に実 UI を表示（ミスマッチ回避）
- **エラーハンドリング:** `JSON.parse` 失敗時は空状態にフォールバック。`QuotaExceededError` を catch してユーザーに通知

```typescript
// src/lib/storage.ts
const STORAGE_KEY = "todo-app-state";
const CURRENT_VERSION = 1;
```

---

## 7. UI/UX 設計

### レスポンシブレイアウト
- **デスクトップ (>=1024px):** 固定左サイドバー (280px) + メインコンテンツ
- **タブレット (768-1023px):** スライドインドロワー形式サイドバー
- **モバイル (<768px):** ドロワーサイドバー + FAB（フローティングアクションボタン）

### ビジュアル
- 優先度バッジ: 高=赤、中=黄、低=緑
- 期限切れ: 赤色テキスト + 警告アイコン
- 完了済み TODO: 取り消し線 + 透明度低下
- カテゴリ: カラードット + バッジ表示
- モーダル: ネイティブ `<dialog>` 要素 + Tailwind でスタイリング

### トースト通知
- TODO 作成/削除、カテゴリ削除時に表示
- 3 秒で自動消去

---

## 8. 依存ライブラリ

| ライブラリ | 用途 |
|-----------|------|
| `next` (^15.x) | フレームワーク |
| `react` / `react-dom` (^19.x) | UI |
| `typescript` (^5.x) | 型安全性 |
| `tailwindcss` (^4.x) | CSS |
| `@dnd-kit/core` (^6.x) | ドラッグ＆ドロップ |
| `@dnd-kit/sortable` (^10.x) | ソータブルリスト |
| `@dnd-kit/utilities` (^3.x) | DnD ユーティリティ |

**意図的に不採用:**
- 状態管理ライブラリ（useReducer で十分）
- 日付ライブラリ（ネイティブ Date + Intl.DateTimeFormat で対応）
- フォームライブラリ（フォームがシンプルなため不要）

---

## 9. ディレクトリ構成

```
src/
  app/
    layout.tsx
    page.tsx
    globals.css
  components/
    TodoApp.tsx
    TodoAppSkeleton.tsx
    Header.tsx
    Sidebar.tsx
    TodoList.tsx
    TodoItem.tsx
    TodoFormModal.tsx
    CategoryFormModal.tsx
    ConfirmDialog.tsx
    AddTodoButton.tsx
    EmptyState.tsx
    Toast.tsx
    ui/
      Badge.tsx
      Modal.tsx
  hooks/
    useTodoStore.ts
    useFilteredTodos.ts
    useFilterState.ts
    useToast.ts
  lib/
    storage.ts
    constants.ts
    utils.ts
  types/
    todo.ts
```

---

## 10. 実装フェーズ

### Phase 1: プロジェクト初期化
1. `npx create-next-app@latest` で初期化（TypeScript, Tailwind CSS, App Router, src/ ディレクトリ）
2. ボイラープレートの整理
3. `src/types/todo.ts` に型定義
4. `src/lib/storage.ts`、`constants.ts`、`utils.ts` の実装

### Phase 2: 状態管理
5. `useTodoStore` フック実装
6. `useFilteredTodos` フック実装
7. `useFilterState` フック実装
8. `TodoApp.tsx` + `TodoAppSkeleton.tsx` のハイドレーション処理

### Phase 3: 基本 UI（CRUD）
9. `ui/` コンポーネント群（Badge, Modal）
10. Header、TodoList、TodoItem の構築
11. TodoFormModal（作成・編集）
12. AddTodoButton、ConfirmDialog、EmptyState

### Phase 4: カテゴリとフィルタ
13. Sidebar（カテゴリ一覧、フィルタ、ソート制御）
14. CategoryFormModal
15. フィルタリング・ソート機能の結合

### Phase 5: ドラッグ＆ドロップ
16. @dnd-kit のインストールと統合
17. TodoList に DndContext、TodoItem に useSortable 適用
18. ソートモード連動（手動時のみ有効化）

### Phase 6: 仕上げ
19. トースト通知
20. レスポンシブ対応（モバイルサイドバー、FAB）
21. 期限切れ表示、完了スタイリング
22. エッジケーステスト

---

## 11. 検証方法

1. `npm run dev` でローカル開発サーバーを起動
2. TODO の CRUD 操作を一通り実行
3. ブラウザリロード後にデータが保持されていることを確認
4. カテゴリの作成・フィルタ・削除を確認
5. 各ソートモードでの正しい並び順を確認
6. ドラッグ＆ドロップで並び替え後、リロードしても順序が保持されることを確認
7. Chrome DevTools で localStorage の内容を確認
8. レスポンシブレイアウトを DevTools のデバイスモードで確認
9. localStorage をクリアした状態で空状態の表示を確認
