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
│   │   ├── case/          # 事例カード・メトリクス・業種バッジ
│   │   ├── islands/       # インタラクティブ React コンポーネント
│   │   │   ├── CaseFilter.tsx     # 業種/ドメイン/指標でフィルタリング
│   │   │   └── SearchBox.tsx      # 事例検索
│   │   └── layout/        # BaseLayout / Header / Footer
│   ├── content/
│   │   └── cases/         # 導入事例 (Markdown)
│   ├── pages/
│   │   ├── index.astro
│   │   ├── cases/[slug].astro
│   │   └── data/          # JSON API エンドポイント
│   └── content.config.ts  # Zod スキーマ定義
├── .agents/skills/        # 全エージェント共通スキルドキュメント
│   ├── add-case.md
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
npm run preview      # ビルド結果のプレビュー
npm run deploy       # Cloudflare Pages へデプロイ
npm run check        # TypeScript 型チェック
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

### metric_verified の定義

`metric_verified` は効果測定値（数値）の出典信頼性を示すフラグ。

| 値 | 条件 |
|----|------|
| `true` | 企業のプレスリリース・公式発表・IR資料など、公開された一次情報に数値の出典がある |
| `false` | 口コミ・インタビュー・自己申告のみで、公式な出典が確認できない |

`metric_verified: true` の場合、可能な限り `source_url` に出典URLを設定すること。

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

## 業種コード一覧

`manufacturing` / `retail` / `logistics` / `construction` / `legal` / `food` / `hotel` / `real_estate` / `entertainment`

## ドメインコード一覧

`sales` / `production` / `hr` / `accounting` / `customer_support` / `logistics`
