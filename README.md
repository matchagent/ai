# AIMatchAgent

AI開発パートナーのマッチングプラットフォーム。企業のAI導入課題・予算・業種をもとに、最適なAI開発パートナーをClaude AIで自動推薦する。

サイト: https://ai.matchagent.workers.dev

## 技術スタック

| レイヤー | 技術 |
|----------|------|
| フロントエンド | Astro 6 (静的生成) + React 18 (Islands) + Tailwind CSS 4 |
| バックエンド | Cloudflare Pages Functions (TypeScript) |
| AI | Anthropic Claude API (`claude-sonnet-4-20250514`) |
| DB | Supabase (contacts / matches テーブル) |
| ホスティング | Cloudflare Pages |

## プロジェクト構成

```
aimatchagent/
├── src/
│   ├── components/
│   │   ├── case/          # 事例カード・メトリクス・業種バッジ
│   │   ├── islands/       # インタラクティブ React コンポーネント
│   │   │   ├── CaseFilter.tsx     # 業種/ドメイン/指標でフィルタリング
│   │   │   ├── MatchingForm.tsx   # パートナーマッチングフォーム
│   │   │   └── SearchBox.tsx      # 事例検索
│   │   └── layout/        # BaseLayout / Header / Footer
│   ├── content/
│   │   ├── cases/         # 導入事例 (Markdown)
│   │   └── partners/      # パートナー情報 (JSON)
│   ├── pages/
│   │   ├── index.astro
│   │   ├── matching.astro
│   │   ├── cases/[slug].astro
│   │   └── data/          # JSON API エンドポイント
│   └── content.config.ts  # Zod スキーマ定義
├── functions/api/
│   ├── match.ts           # Claude API マッチングロジック
│   └── contact.ts         # お問い合わせフォーム
├── .agents/skills/        # 全エージェント共通スキル
├── .claude/
│   ├── commands/          # Claude Code カスタムコマンド
│   ├── skills/            # → .agents/skills/ のシンボリックリンク
│   └── settings.json
├── .gemini/settings.json
├── .kimi/
│   ├── mcp.json           # → .mcp.json のシンボリックリンク
│   └── skills/            # → .agents/skills/ のシンボリックリンク
├── .mcp.json              # MCP サーバー設定
├── .claudeignore          # AI が無視するファイル定義
├── architecture.md        # システムアーキテクチャ
└── wrangler.jsonc         # Cloudflare 設定
```

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
ANTHROPIC_API_KEY=    # Claude API キー
SUPABASE_URL=         # Supabase プロジェクト URL
SUPABASE_ANON_KEY=    # Supabase 匿名キー
PUBLIC_SITE_URL=      # 本番サイト URL (https://ai.matchagent.workers.dev)
ALLOWED_ORIGIN=       # CORS 許可オリジン (https://ai.matchagent.workers.dev)
```

Cloudflare Pages の環境変数にも同様に設定すること。

## APIエンドポイント

### POST /api/match
パートナーマッチングを実行する。

**リクエスト:**
```json
{
  "industry": "manufacturing",
  "problem_description": "在庫管理の自動化",
  "budget": 300,
  "company_size": "mid"
}
```

**レスポンス:**
```json
{
  "results": [
    { "partner_id": "partner-001", "score": 92, "reason": "..." }
  ]
}
```

### POST /api/contact
お問い合わせフォーム送信。

**リクエスト:**
```json
{
  "name": "田中太郎",
  "email": "tanaka@example.com",
  "company": "株式会社サンプル",
  "type": "inquiry",
  "message": "お問い合わせ内容"
}
```

## コンテンツ管理

### 事例を追加する
`src/content/cases/` に Markdown ファイルを追加する。
スキルファイル `.agents/skills/add-case.md` を参照。

### パートナーを追加する
`src/content/partners/` に JSON ファイルを追加する。
スキルファイル `.agents/skills/add-partner.md` を参照。

## コーディング規約

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
