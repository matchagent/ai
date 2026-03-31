# システムアーキテクチャ

## 全体構成

```
ブラウザ
  │
  ├─ 静的アセット (HTML/CSS/JS)
  │    └─ Cloudflare Pages (CDN)
  │         └─ Astro ビルド成果物 (./dist/)
  │
  └─ API リクエスト
       └─ Cloudflare Pages Functions
            └─ POST /api/contact → Supabase
```

## フロントエンド (Astro Islands アーキテクチャ)

```
src/pages/
  index.astro          → トップページ = 事例一覧 (CaseFilter を Islands として埋め込み)
  about.astro          → サービス説明
  terms.astro          → 利用規約
  cases/
    [slug].astro                              → 事例詳細 (静的、ビルド時生成)
    [industry]/
      index.astro                             → 業種別一覧
      [company_size]/
        index.astro                           → 業種×規模別一覧
        [domain]/index.astro                  → 業種×規模×ドメイン別一覧
      domain/[domain]/index.astro             → 業種×ドメイン別一覧
    size/[company_size]/
      index.astro                             → 規模別一覧
      [domain]/index.astro                    → 規模×ドメイン別一覧
    domain/[domain]/index.astro               → ドメイン別一覧

public/
  _redirects           → /cases → / 301リダイレクト (Cloudflare Pages)

src/components/
  layout/
    BaseLayout.astro   → HTML骨格・メタタグ・JSON-LD
    Header.astro       → ナビゲーション
    Footer.astro
  case/
    CaseCard.astro     → 事例カード (Astro ラッパー)
    IndustryBadge.astro → 業種バッジ
  islands/             → client:only="react" で hydrate される React コンポーネント
    CaseCard.tsx       → 事例カード (React)
    CaseFilter.tsx     → 業種/ドメイン/企業規模フィルタ

src/utils/
  caseConstants.ts     → ラベル・色・静的パス生成用定数・getMetricColor
  getCasesData.ts      → mapCaseEntry() コレクションエントリのデータ変換

src/data/
  insights.ts          → 業種×規模×ドメイン別の実践提案コンテンツ
                         キー形式: '{industry}-{company_size}-{domain}'
                         getInsight() で取得し、一覧ページ・詳細ページ下部に表示
```

> **パスエイリアス**: `tsconfig.json` で `@/*` → `src/*` を設定済み。import は必ず `@/` を使用する。

## バックエンド (Cloudflare Pages Functions)

```
functions/api/
  contact.ts
    1. IP ベースのレートリミット (5req/分、メモリ Map)
    2. リクエストバリデーション (必須項目・メール形式・文字列長)
    3. Supabase contacts テーブルに保存
    4. JSON レスポンス
```

## コンテンツ管理 (Astro Content Collections)

```
src/content/
  cases/          ← Markdown (.md)
    {industry}-{seq}.md
      frontmatter: title, industry, domain, problem_tags[],
                   company_size, metric_value, metric_unit,
                   metric_verified,
                   date, excerpt
      body: 事例詳細本文
```

## 外部サービス依存関係

| サービス | 用途 | 障害時の挙動 |
|----------|------|-------------|
| Supabase | お問い合わせデータ永続化 | 保存失敗を無視してレスポンスを返す |
| Cloudflare Pages | ホスティング・Functions | インフラ依存 |

## セキュリティ設計

| 項目 | 実装 |
|------|------|
| CORS | `ALLOWED_ORIGIN` env で特定ドメインのみ許可 |
| レートリミット | IP ベース (メモリ Map、期限切れエントリは自動削除) |
| 入力バリデーション | API境界で全フィールドを検証 |
| タイムアウト | Supabase: 10秒 |
| APIキー | Cloudflare 環境変数で管理、コード非埋め込み |

## ビルド & デプロイフロー

```
コード修正
  └─ npm run check  → 型チェック（必須。エラーがあれば修正してから続行）
       └─ (手動) npm run deploy
            ├─ npm run build  → Astro が ./dist/ を生成
            └─ wrangler pages deploy ./dist/
                 └─ Cloudflare Pages へアップロード
```

## マルチエージェント開発構成

このプロジェクトはAIエージェントのみがコーディングを担当する。

```
開発エージェント
  ├─ Claude Code   (.claude/settings.json)
  ├─ Gemini CLI    (.gemini/settings.json)
  └─ Kimi Code     (.kimi/)
       │
       ├─ 共通コンテキスト: README.md
       │    CLAUDE.md ──┐
       │    AGENTS.md ──┼── symlink → README.md
       │    GEMINI.md ──┘
       │
       ├─ 共通スキル: .agents/skills/
       │    .claude/skills/ ──┐
       │    .kimi/skills/   ──┴── symlink → .agents/skills/
       │
       ├─ 共通MCP設定: .mcp.json
       │    .kimi/mcp.json ── symlink → .mcp.json
       │
       └─ 共通除外パターン: .claudeignore
            .geminiignore ──┐
            .kimiignore   ──┴── symlink → .claudeignore
```

### Claude Code 固有のスラッシュコマンド

`.claude/commands/` のファイルは Claude Code の `/` コマンドとして呼び出せる:

| コマンド | 説明 |
|---------|------|
| `/add-case` | 導入事例を対話形式で追加 |
| `/deploy` | 型チェック・ビルド・デプロイを順次実行 |
| `/review` | 直近の変更をコードレビュー |
