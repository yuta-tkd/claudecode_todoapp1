# TODO App

Next.js + TypeScript + Tailwind CSS で構築したモダンな TODO アプリケーション。

## 🌐 デモ

**https://yuta-tkd.github.io/claudecode_todoapp1/**

## ✨ 機能

- ✅ **TODO 管理**: 作成、編集、削除、完了/未完了の切り替え
- 🏷️ **カテゴリ管理**: カスタムカラー付きカテゴリで TODO を分類
- 🔍 **検索・フィルタ**: テキスト検索、ステータスフィルタ、カテゴリフィルタ
- 📊 **ソート機能**: 期限日、作成日、優先度、手動並び替え
- 🎯 **優先度設定**: 高・中・低の3段階
- 📅 **期限管理**: 期限切れの自動検出と視覚的な警告
- 🖱️ **ドラッグ＆ドロップ**: 直感的な手動並び替え（@dnd-kit）
- 💾 **ローカルストレージ**: バックエンド不要、ブラウザに自動保存
- 📱 **レスポンシブデザイン**: モバイル・タブレット・デスクトップ対応
- 🎨 **モダンUI**: Tailwind CSS による洗練されたデザイン
- 🔔 **トースト通知**: 操作フィードバック

## 🛠️ 技術スタック

| カテゴリ | 技術 |
|---------|------|
| フレームワーク | Next.js 15 (App Router) |
| UI ライブラリ | React 19 |
| 言語 | TypeScript 5 |
| スタイリング | Tailwind CSS 4 |
| ドラッグ＆ドロップ | @dnd-kit |
| 状態管理 | React hooks (useReducer) |
| データ永続化 | localStorage |
| ホスティング | GitHub Pages |
| CI/CD | GitHub Actions |

## 🚀 開発

### 前提条件

- Node.js 20 以上
- npm

### セットアップ

```bash
# リポジトリをクローン
git clone https://github.com/yuta-tkd/claudecode_todoapp1.git
cd claudecode_todoapp1

# 依存関係をインストール
npm install

# 開発サーバーを起動
npm run dev
```

ブラウザで http://localhost:3000 にアクセス

### コマンド

```bash
npm run dev    # 開発サーバー起動
npm run build  # 本番ビルド
npm run lint   # ESLint 実行
```

## 📦 ビルド & デプロイ

このプロジェクトは静的サイトとして GitHub Pages にデプロイされています。

### ローカルビルド

```bash
npm run build
```

`out/` ディレクトリに静的ファイルが生成されます。

### 自動デプロイ

`main` ブランチへの push で GitHub Actions が自動的にビルド & デプロイを実行します。

詳細は [docs/DEPLOY.md](docs/DEPLOY.md) を参照してください。

## 📁 プロジェクト構成

```
src/
├── app/              # Next.js App Router
│   ├── layout.tsx    # ルートレイアウト
│   ├── page.tsx      # トップページ
│   └── globals.css   # グローバルスタイル
├── components/       # React コンポーネント
│   ├── ui/           # 汎用UIコンポーネント（Modal, Badge）
│   ├── TodoApp.tsx   # メインアプリコンポーネント
│   ├── TodoList.tsx  # TODO一覧（ドラッグ＆ドロップ対応）
│   ├── TodoItem.tsx  # TODO項目
│   ├── Sidebar.tsx   # フィルタ・カテゴリサイドバー
│   └── ...           # その他のコンポーネント
├── hooks/            # カスタムフック
│   ├── useTodoStore.ts        # TODO状態管理
│   ├── useFilteredTodos.ts    # フィルタリング・ソート
│   ├── useFilterState.ts      # フィルタUI状態
│   └── useToast.ts            # トースト通知
├── lib/              # ユーティリティ
│   ├── storage.ts    # localStorage操作
│   ├── constants.ts  # 定数定義
│   └── utils.ts      # ヘルパー関数
└── types/            # TypeScript型定義
    └── todo.ts       # Todo, Category型など
```

## 📚 ドキュメント

- [仕様書](docs/SPEC.md) - 詳細な機能仕様
- [タスクリスト](docs/TASKS.md) - 開発進捗
- [デプロイガイド](docs/DEPLOY.md) - デプロイ方法とトラブルシューティング

## 🎯 設計の特徴

### クライアントサイドのみ

- バックエンド不要（localStorage 使用）
- 認証なし（個人利用想定）
- Next.js の静的エクスポート機能で GitHub Pages にホスティング

### 状態管理

- `useReducer` による集中管理
- カスタムフックで関心の分離
- 外部ライブラリ不使用（軽量化）

### SSR ハイドレーション対策

1. 初回レンダリング時はスケルトン表示
2. `useEffect` で localStorage からデータ読み込み
3. 実際の UI を表示

これにより、サーバー/クライアント間のハイドレーションエラーを回避。

## 📝 ライセンス

MIT

## 🙏 謝辞

このプロジェクトは [Claude Code](https://claude.com/claude-code) を使用して開発されました。
