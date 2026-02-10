# TODO App - Claude Code プロジェクト設定

## プロジェクト概要

Next.js (App Router) + TypeScript + Tailwind CSS で構築する TODO アプリケーション。
データは localStorage に保存（バックエンド不要、認証なし）。

## ドキュメント

- 仕様書: `docs/SPEC.md`
- タスクリスト: `docs/TASKS.md`

## 技術スタック

- Next.js 15 (App Router)
- React 19
- TypeScript 5
- Tailwind CSS 4
- @dnd-kit（ドラッグ＆ドロップ）

## ディレクトリ構成

```
src/
  app/         - Next.js App Router（layout.tsx, page.tsx, globals.css）
  components/  - React コンポーネント（すべて Client Component）
  hooks/       - カスタムフック（useTodoStore, useFilteredTodos, useFilterState, useToast）
  lib/         - ユーティリティ（storage.ts, constants.ts, utils.ts）
  types/       - TypeScript 型定義（todo.ts）
```

## コーディング規約

- コンポーネントは `"use client"` ディレクティブ付き（layout.tsx, page.tsx を除く）
- 状態管理は `useReducer` + カスタムフック（外部ライブラリ不使用）
- localStorage アクセスは `src/lib/storage.ts` 経由のみ
- SSR ハイドレーション: スケルトン → useEffect で localStorage 読み込み → 実 UI 表示
- 日付は ISO 8601 文字列で保存、表示時に `Intl.DateTimeFormat` でフォーマット
- ID 生成は `crypto.randomUUID()`
- Always use context7 when I need code generation, setup or configuration steps, or library/API documentation. This means you should automatically use the Context7 MCP tools to resolve library id and get library docs without me having to explicitly ask.

## 開発コマンド

```bash
npm run dev    # 開発サーバー起動
npm run build  # 本番ビルド
npm run lint   # ESLint 実行
```
