# デプロイガイド

## 公開URL

**https://yuta-tkd.github.io/claudecode_todoapp1/**

GitHub Pages で静的ホスティングされています。

## リポジトリ

- **GitHub**: https://github.com/yuta-tkd/claudecode_todoapp1
- **Actions**: https://github.com/yuta-tkd/claudecode_todoapp1/actions

## デプロイ設定

### Next.js 設定（`next.config.ts`）

```typescript
const nextConfig: NextConfig = {
  output: "export",                    // 静的HTMLエクスポート
  basePath: "/claudecode_todoapp1",    // GitHub Pages サブパス対応
  images: { unoptimized: true },       // 画像最適化を無効化（静的ホスト用）
};
```

### 静的エクスポート対応

- **output: "export"**: Next.js を静的サイトとしてエクスポート
- **basePath**: `https://yuta-tkd.github.io/claudecode_todoapp1/` のサブパスに対応
- **images.unoptimized**: 静的ホストでは Next.js Image Optimization API が使えないため無効化

### Jekyll 無効化

`public/.nojekyll` ファイルを配置することで、GitHub Pages が Jekyll 処理をスキップし、`_next/` ディレクトリを正しく配信できるようにしています。

## 自動デプロイ

### GitHub Actions ワークフロー

`.github/workflows/deploy.yml` で自動デプロイを設定しています。

**トリガー**: main ブランチへの push

**実行内容**:
1. **build ジョブ**: 依存関係インストール → `npm run build` → 成果物アップロード
2. **deploy ジョブ**: GitHub Pages へデプロイ

**権限**:
```yaml
permissions:
  contents: read
  pages: write
  id-token: write
```

**並行制御**:
```yaml
concurrency:
  group: "pages"
  cancel-in-progress: false
```

### デプロイ手順

1. コードを変更
2. コミット & プッシュ

```bash
git add .
git commit -m "Update: 変更内容"
git push
```

3. GitHub Actions が自動実行（約 40秒）
4. https://yuta-tkd.github.io/claudecode_todoapp1/ に反映

### デプロイ状況の確認

```bash
# ワークフロー実行一覧
gh run list --limit 5

# 特定実行の詳細
gh run view <run-id>

# ブラウザで確認
gh run view <run-id> --web
```

## ローカルビルド & プレビュー

### 本番ビルド実行

```bash
npm run build
```

成功すると `out/` ディレクトリに静的ファイルが生成されます。

### ローカルプレビュー

```bash
# 簡易HTTPサーバーで確認（basePath対応）
npx serve out -p 3000

# アクセス: http://localhost:3000/claudecode_todoapp1/
```

または、`basePath` を一時的にコメントアウトして：

```bash
npm run build
npx serve out -p 3000
# アクセス: http://localhost:3000/
```

## トラブルシューティング

### ビルドエラー

```bash
# 依存関係を再インストール
rm -rf node_modules package-lock.json
npm install

# ビルド実行
npm run build
```

### GitHub Actions 失敗

1. Actions タブでエラーログを確認
2. ローカルで `npm run build` が成功するか確認
3. `next.config.ts` の設定を確認

### Pages が 404 を返す

- `public/.nojekyll` が存在するか確認
- GitHub リポジトリ設定 → Pages → Source が "GitHub Actions" になっているか確認
- `basePath` が正しいか確認（リポジトリ名と一致）

### アセットが読み込めない

- ブラウザ開発者ツールで URL を確認
- `basePath` が正しく設定されているか確認
- `_next/` ディレクトリへのアクセスが正常か確認

## 技術スタック

| カテゴリ | 技術 |
|---------|------|
| フレームワーク | Next.js 15 (App Router) |
| 出力形式 | 静的HTML（Static Export） |
| ホスティング | GitHub Pages |
| CI/CD | GitHub Actions |
| ビルド環境 | Node.js 20, ubuntu-latest |

## 初回デプロイ履歴（2026-02-11）

### 実装内容

1. ✅ GitHub リポジトリ作成（`gh repo create`）
2. ✅ `next.config.ts` を静的エクスポート用に更新
3. ✅ `public/.nojekyll` を作成
4. ✅ GitHub Actions ワークフロー作成（`.github/workflows/deploy.yml`）
5. ✅ 初回コミット & プッシュ
6. ✅ GitHub Pages 設定を有効化（`gh api`）
7. ✅ デプロイ成功確認

### ビルド時間

- **ビルドジョブ**: 28秒
- **デプロイジョブ**: 10秒
- **合計**: 約 38秒

### 初回デプロイログ

- **Run ID**: 21870621023
- **Commit**: d72a503 "Initial commit: TODO app with GitHub Pages deployment"
- **Status**: ✓ 成功
