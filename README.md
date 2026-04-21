# AIMatchAgent

AI導入事例のキュレーションプラットフォーム。業種・ドメイン・導入効果でフィルタリングできる事例集。

サイト: https://ai.matchagent.workers.dev

## 技術スタック

| レイヤー | 技術 |
|----------|------|
| フロントエンド | Astro 6 (静的生成) + React 18 (Islands) + Tailwind CSS 4 |
| バックエンド | Cloudflare Pages Functions (TypeScript) |
| DB | Supabase (contacts テーブル) |
| ホスティング | Cloudflare Pages |

## プロジェクト構成

```
aimatchagent/
├── src/
│   ├── components/
│   │   ├── case/          # 事例カード・業種バッジ
│   │   ├── islands/       # インタラクティブ React コンポーネント
│   │   │   ├── CaseCard.tsx       # 事例カード
│   │   │   └── CaseFilter.tsx     # 業種/ドメイン/企業規模でフィルタリング
│   │   └── layout/        # BaseLayout / Header / Footer
│   ├── content/
│   │   └── cases/         # 導入事例 (Markdown)
│   ├── pages/
│   │   ├── index.astro            # トップページ = 事例一覧 (CaseFilter Islands)
│   │   ├── about.astro            # サービス説明
│   │   ├── terms.astro            # 利用規約
│   │   └── cases/
│   │       ├── [slug].astro                              # 事例詳細
│   │       ├── [industry]/index.astro                    # 業種別一覧
│   │       ├── [industry]/[company_size]/index.astro     # 業種×規模別一覧
│   │       ├── [industry]/[company_size]/[domain]/index.astro  # 業種×規模×ドメイン別一覧
│   │       ├── [industry]/domain/[domain]/index.astro    # 業種×ドメイン別一覧
│   │       ├── size/[company_size]/index.astro           # 規模別一覧
│   │       ├── size/[company_size]/[domain]/index.astro  # 規模×ドメイン別一覧
│   │       └── domain/[domain]/index.astro               # ドメイン別一覧
│   ├── utils/
│   │   ├── caseConstants.ts  # ラベル・色・静的パス用定数
│   │   └── getCasesData.ts   # コレクションエントリのデータ変換
│   ├── data/
│   │   └── insights.ts       # 業種×規模×ドメイン別の実践提案コンテンツ
│   └── content.config.ts  # Zod スキーマ定義
├── public/
│   └── _redirects         # /cases → / 301リダイレクト
├── .agents/skills/        # 全エージェント共通スキルドキュメント
│   ├── add-case.md
│   ├── add-insight.md
│   ├── astro-content.md
│   └── cloudflare-worker.md
├── .claude/
│   ├── commands/          # Claude Code スラッシュコマンド
│   │   ├── add-case.md
│   │   ├── deploy.md
│   │   └── review.md
│   ├── skills/            # → .agents/skills/ (symlink)
│   └── settings.json
├── .gemini/
│   └── settings.json
├── .kimi/
│   ├── mcp.json           # → .mcp.json (symlink)
│   └── skills/            # → .agents/skills/ (symlink)
├── README.md              # このファイル (プロジェクト説明 + 全AIエージェント指示)
├── AGENTS.md              # → README.md (symlink)
├── CLAUDE.md              # → README.md (symlink)
├── GEMINI.md              # → README.md (symlink)
├── .mcp.json              # MCP サーバー設定 (全エージェント共通)
├── .claudeignore          # AI が無視するファイル定義
├── .geminiignore          # → .claudeignore (symlink)
├── .kimiignore            # → .claudeignore (symlink)
├── architecture.md        # システムアーキテクチャ詳細
└── wrangler.jsonc         # Cloudflare 設定
```

## 開発エージェント構成

このプロジェクトはAIエージェントのみがコーディングを担当する。人間は直接コードを書かない。

### 使用エージェント

| エージェント | 設定ファイル |
|------------|------------|
| Claude Code | `.claude/settings.json` |
| Gemini CLI | `.gemini/settings.json` |
| Kimi Code | `.kimi/` |

### ファイル共有の仕組み (シンボリックリンク)

エージェント設定ファイルの管理工数を削減するため、共通ファイルはシンボリックリンクで一元管理する:

| シンボリックリンク | 実体 | 目的 |
|-----------------|------|------|
| `AGENTS.md` | `README.md` | 全エージェントが同一のプロジェクト指示を参照 |
| `CLAUDE.md` | `README.md` | Claude Code 用コンテキストファイル |
| `GEMINI.md` | `README.md` | Gemini CLI 用コンテキストファイル |
| `.kimi/mcp.json` | `.mcp.json` | MCP サーバー設定を一元管理 |
| `.claude/skills/` | `.agents/skills/` | スキルドキュメントを全エージェントで共有 |
| `.kimi/skills/` | `.agents/skills/` | スキルドキュメントを全エージェントで共有 |
| `.geminiignore` | `.claudeignore` | 無視パターンを一元管理 |
| `.kimiignore` | `.claudeignore` | 無視パターンを一元管理 |

### スキルドキュメント

`.agents/skills/` に全エージェント共通のリファレンスドキュメントを配置する。

| ファイル | 内容 |
|---------|------|
| `add-case.md` | 導入事例の追加手順 |
| `astro-content.md` | Astro Content Collections の操作方法 |
| `cloudflare-worker.md` | Cloudflare Pages Functions の書き方 |

## 開発コマンド

```bash
npm install          # 依存関係インストール
npm run dev          # 開発サーバー起動 (localhost:4321)
npm run build        # プロダクションビルド
npm run preview      # ビルド結果のプレビュー (localhost:4325)
npm run deploy       # Cloudflare Pages へデプロイ
npm run check        # TypeScript 型チェック
```

### コマンドの詳細

| コマンド | 内容 |
|---------|------|
| `npm run dev` | 開発サーバーを起動します。ファイル変更を検知して即座にブラウザを更新（HMR）します。**`@astrojs/sitemap` などのビルド時専用インテグレーションは動作しないため、`/sitemap-0.xml` などにはアクセスできません。** |
| `npm run build` | プロダクション用の静的ファイルを `dist/` に出力します。TypeScript の型チェック（`astro check`）も同時に実行されます。`@astrojs/sitemap` による `sitemap-index.xml` / `sitemap-0.xml` の生成もこのタイミングで行われます。 |
| `npm run preview` | `npm run build` で生成された `dist/` の内容を本番同様のサーバーで配信します。sitemap や `_redirects` など、ビルド時に生成されたファイルが正しく動作するか確認する際に使用します。 |

### 主要ファイルの生成方法

| ファイル | 生成元 | 生成方法 |
|---------|--------|---------|
| `admin/latest/` | `src/pages/admin/latest.astro` | `npm run build` で静的ページとして `dist/admin/latest/index.html` に出力されます。 |
| `sitemap-0.xml` | `@astrojs/sitemap` | `npm run build` 時に Astro のインテグレーションが自動生成し、`dist/sitemap-0.xml` に出力されます。`astro dev` では生成されないため、確認には `npm run build && npm run preview` が必要です。 |

### テスト

| コマンド | 内容 |
|---------|------|
| `npm run test` | すべてのテストを実行します。 |
| `npm run test:sitemap` | `sitemap-0.xml` に含まれるすべての URL を `localhost:4325` に対してフェッチし、HTTP 200 が返るかを検証します。実行前に `npm run preview` などでサーバーを起動しておく必要があります。 |

`test:sitemap` の対象 URL は環境変数 `TEST_BASE_URL` で変更できます。

```bash
# デフォルト（localhost:4325）
npm run test:sitemap

# 別ポートで preview している場合
TEST_BASE_URL=http://localhost:4321 npm run test:sitemap
```

## 環境変数

`.env` ファイルを作成し以下を設定（`.env.example` 参照）:

```
SUPABASE_URL=         # Supabase プロジェクト URL
SUPABASE_ANON_KEY=    # Supabase 匿名キー
PUBLIC_SITE_URL=      # 本番サイト URL (https://ai.matchagent.workers.dev)
ALLOWED_ORIGIN=       # CORS 許可オリジン (https://ai.matchagent.workers.dev)
```

Cloudflare Pages の環境変数にも同様に設定すること。

## コンテンツ管理

### 事例を追加する
`src/content/cases/` に Markdown ファイルを追加する。
スキルファイル `.agents/skills/add-case.md` を参照。

### 実践提案（insight）を追加・編集する
`src/data/insights.ts` の `insights` オブジェクトに `{industry}-{company_size}-{domain}` をキーとして追加する。
スキルファイル `.agents/skills/add-insight.md` を参照。

### date の定義

`date` は `source_url` に設定したページが公開された日付を設定する。

| 値 | 条件 |
|----|------|
| `source_url_verified: true` の場合 | `source_url` ページの公開日を WebFetch で確認して設定 |
| `source_url_verified: false` の場合 | 事例が公開されたと推定される日付を設定 |

事例を追加・編集する際は `source_url` のページから公開日を確認し、`date` に設定すること。

### source_url_verified の定義

`source_url_verified` は `source_url` に設定したURLが実際に存在するかを示すフラグ。架空URLによるハルシネーションを防ぐ目的で使用する。

| 値 | 条件 |
|----|------|
| `true` | `source_url` に WebFetch でアクセスし、ページが実際に存在することを確認済み |
| `false` | `source_url` が未設定、アクセス不可、または架空の可能性がある |

**ハルシネーション防止**: `source_url_verified: true` にするのは、`source_url` に WebFetch で実際にアクセスしてページの存在を確認した場合のみ。URLを推測・補完・生成した場合は `false` にすること。

`source_url_verified: true` の場合、`source_url` に出典URLを必ず設定すること。

事例を追加・編集する際は必ずこの基準に従って設定すること。

## コーディング規約

- **型チェック**: コードを変更したら必ず `npm run check` を実行してから完了とする。`astro dev` はTypeScriptエラーを検出しないため、CIと同じチェックをローカルで行う必要がある
- **言語**: TypeScript 必須。`any` 型は使用禁止
- **コンポーネント**: 静的コンテンツは `.astro`、インタラクティブな要素は `.tsx`
- **スタイル**: Tailwind CSS のユーティリティクラスを使用。カスタム CSS は最小限に
- **APIレスポンス**: 全エラーレスポンスは `{ error: string }` 形式
- **入力バリデーション**: API境界では必ず Zod または手動バリデーションを実施
- **fetch**: 外部API呼び出しは必ず `AbortController` でタイムアウトを設定
- **CORS**: `ALLOWED_ORIGIN` 環境変数で制御。`*` は使用禁止
- **パスエイリアス**: `@/*` = `src/*`。相対パスではなく `@/` を使用すること（例: `@/components/layout/BaseLayout.astro`）

## 業種コード一覧

`mfg` / `rtl` / `log` / `const` / `leg` / `food` / `htl` / `re` / `ent` / `rep`

## ドメインコード一覧

`sales` / `marketing` / `production` / `hr` / `accounting` / `customer_support` / `logistics`

## 技術タグ一覧

`画像AI` / `予測AI` / `言語AI` / `AIエージェント` / `RAG` / `音声AI`

### 技術タグの詳細

| カテゴリ | タグ値 |
|----------|--------|
| 画像AI | `画像AI` / `Stable Diffusion背景生成` / `GAN画像変換` / `外観検査` / `画像診断` |
| 予測AI | `予測AI` / `需要予測` / `ダイナミックプライシング` / `レコメンド` / `異常検知` |
| 言語AI | `言語AI` / `ChatGPT顧客対応` / `LLM文章生成` / `翻訳` / `チャットボット` |
| AIエージェント | `AIエージェント` / `n8n自動化` / `ワークフローエージェント` |
| RAG | `RAG` |
| 音声AI | `音声AI` / `電話予約AI` / `音声合成` / `ポケトーク翻訳` |
