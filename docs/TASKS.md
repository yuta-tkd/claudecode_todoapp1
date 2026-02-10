# 実装タスクリスト

## 進捗状況

| Phase | タスク | ステータス |
|-------|--------|-----------|
| 1 | プロジェクト初期化 (create-next-app + 型定義 + lib) | :white_check_mark: 完了 |
| 2 | 状態管理フック実装 | :white_check_mark: 完了 |
| 3 | 基本UI（CRUD）コンポーネント構築 | :white_check_mark: 完了 |
| 4 | カテゴリとフィルタ機能 | :white_check_mark: 完了 |
| 5 | ドラッグ＆ドロップ機能 | :white_check_mark: 完了 |
| 6 | 仕上げ（トースト、レスポンシブ、ポリッシュ） | :white_check_mark: 完了 |

---

## Phase 1: プロジェクト初期化 :white_check_mark:

- [x] `npx create-next-app@latest` で初期化（TypeScript, Tailwind CSS, App Router, src/）
- [x] ボイラープレート整理
- [x] `src/types/todo.ts` に型定義（Todo, Category, AppState, Priority, TodoStatus）
- [x] `src/lib/storage.ts` - localStorage 読み書き + バージョニング
- [x] `src/lib/constants.ts` - 優先度設定、カテゴリカラー、ソートオプション
- [x] `src/lib/utils.ts` - isOverdue, formatDate, cn ユーティリティ

## Phase 2: 状態管理フック実装 :white_check_mark:

- [x] `src/hooks/useTodoStore.ts` - useReducer + localStorage永続化 + ハイドレーション
- [x] `src/hooks/useFilteredTodos.ts` - フィルタリング・ソートロジック
- [x] `src/hooks/useFilterState.ts` - フィルタUI状態管理
- [x] `src/hooks/useToast.ts` - トースト通知管理
- [x] `src/components/TodoApp.tsx` - メインクライアントコンポーネント（ハイドレーション境界）
- [x] `src/components/TodoAppSkeleton.tsx` - ローディングスケルトン

## Phase 3: 基本UI（CRUD）コンポーネント構築 :white_check_mark:

- [x] `src/components/ui/Modal.tsx` - dialog要素ベースのモーダル
- [x] `src/components/ui/Badge.tsx` - バッジコンポーネント
- [x] `src/components/Header.tsx` - アプリヘッダー + 検索バー + デスクトップ追加ボタン
- [x] `src/components/TodoList.tsx` - TODO一覧
- [x] `src/components/TodoItem.tsx` - 個別TODO行
- [x] `src/components/TodoFormModal.tsx` - TODO作成/編集モーダル
- [x] `src/components/AddTodoButton.tsx` - モバイルFAB追加ボタン
- [x] `src/components/ConfirmDialog.tsx` - 削除確認ダイアログ
- [x] `src/components/EmptyState.tsx` - 空状態表示
- [x] `src/components/Toast.tsx` - トーストコンテナ

## Phase 4: カテゴリとフィルタ機能 :white_check_mark:

- [x] `src/components/Sidebar.tsx` - カテゴリ一覧、フィルタ、ソート制御、レスポンシブドロワー
- [x] `src/components/CategoryFormModal.tsx` - カテゴリ作成/編集モーダル（カラーピッカー付き）
- [x] フィルタリング・ソート機能の結合

## Phase 5: ドラッグ＆ドロップ機能 :white_check_mark:

- [x] `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities` インストール
- [x] `TodoList.tsx` に DndContext + SortableContext + DragOverlay 統合
- [x] SortableTodoItem コンポーネントで useSortable 適用
- [x] ソートモード連動（手動時のみドラッグ有効）

## Phase 6: 仕上げ :white_check_mark:

- [x] トースト通知のアニメーション（slideUp keyframe）
- [x] レスポンシブ対応（モバイルサイドバードロワー、FAB配置、デスクトップ追加ボタン）
- [x] 期限切れ表示の視覚強化（赤色 + 警告アイコン）
- [x] 完了TODOスタイリング（取り消し線 + 透明度低下）
- [x] `npm run build` で本番ビルド確認 -> 成功
