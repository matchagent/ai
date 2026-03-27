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
            ├─ POST /api/match  → Claude API → Supabase
            └─ POST /api/contact          → Supabase
```

## フロントエンド (Astro Islands アーキテクチャ)

```
src/pages/
  index.astro          → トップページ (静的)
  matching.astro       → マッチングページ (MatchingForm を Islands として埋め込み)
  cases/
    index.astro        → 事例一覧 (CaseFilter を Islands として埋め込み)
    [slug].astro       → 事例詳細 (静的、ビルド時生成)
    [industry]/
      index.astro      → 業種別事例一覧 (静的)
  partners/index.astro → パートナー一覧 (静的)
  data/
    cases.json.ts      → JSON API (ビルド時生成)
    partners.json.ts   → JSON API (ビルド時生成)
  about.astro
  contact.astro

src/components/
  layout/
    BaseLayout.astro   → HTML骨格・メタタグ・JSON-LD
    Header.astro       → ナビゲーション
    Footer.astro
  case/
    CaseCard.astro     → 事例カード (一覧表示用)
    CaseMetric.astro   → 指標バッジ (効果値の表示)
    IndustryBadge.astro → 業種バッジ
  islands/             → client:load で hydrate される React コンポーネント
    CaseFilter.tsx     → 業種/ドメイン/指標フィルタ + 検索
    SearchBox.tsx      → テキスト検索
    MatchingForm.tsx   → マッチングフォーム (/api/match を呼び出す)
```

## バックエンド (Cloudflare Pages Functions)

```
functions/api/
  match.ts
    1. IP ベースのレートリミット (10req/分、メモリ Map)
    2. リクエストバリデーション (必須項目・予算範囲・文字列長)
    3. /data/partners.json を fetch して候補パートナー取得
    4. ハードフィルタリング (is_active / 業種 / 予算範囲 / capacity)
    5. Claude API で上位3社をスコアリング
    6. Claude レスポンスの partner_id を候補リストで検証
    7. Supabase matches テーブルに保存 (失敗しても続行)
    8. JSON レスポンス

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
    {id}-{seq}.md
      frontmatter: title, industry, domain, problem_tags[],
                   company_size, metric_value, metric_unit,
                   metric_verified, partner_id, is_sponsored,
                   date, excerpt
      body: 事例詳細本文

  partners/       ← JSON (.json)
    partner-{id}.json
      fields: id, company_name, specialty_industries[],
              specialty_description, min_budget, max_budget,
              capacity, is_active, rating, completed_count

src/content.config.ts  ← Zod スキーマ定義
```

## データフロー: マッチング

```
ユーザー入力
  { industry, problem_description, budget, company_size }
      │
      ▼
/api/match (Cloudflare Function)
      │
      ├─ GET /data/partners.json (同一オリジン)
      │       └─ Astro ビルド時生成の静的 JSON
      │
      ├─ ハードフィルタ (is_active && 業種 && 予算範囲 && capacity > 0)
      │
      ├─ POST https://api.anthropic.com/v1/messages
      │       model: claude-sonnet-4-20250514
      │       → partner_id / score / reason を JSON で返す
      │
      ├─ 検証 (partner_id が候補リストに存在するか確認)
      │
      └─ POST {SUPABASE_URL}/rest/v1/matches
              (失敗しても続行)
      │
      ▼
{ results: [{ partner_id, score, reason }] }
```

## 外部サービス依存関係

| サービス | 用途 | 障害時の挙動 |
|----------|------|-------------|
| Anthropic Claude API | パートナースコアリング | フォールバック: 順位スコアを固定値で返す |
| Supabase | データ永続化 | 保存失敗を無視してレスポンスを返す |
| Cloudflare Pages | ホスティング・Functions | インフラ依存 |

## セキュリティ設計

| 項目 | 実装 |
|------|------|
| CORS | `ALLOWED_ORIGIN` env で特定ドメインのみ許可 |
| レートリミット | IP ベース (メモリ Map、期限切れエントリは自動削除) |
| 入力バリデーション | API境界で全フィールドを検証 |
| タイムアウト | Claude API: 15秒 / Supabase: 10秒 / パートナーJSON取得: 15秒 |
| APIキー | Cloudflare 環境変数で管理、コード非埋め込み |

## ビルド & デプロイフロー

```
git push
  └─ (手動) npm run deploy
       ├─ npm run build  → Astro が ./dist/ を生成
       └─ wrangler pages deploy ./dist/
            └─ Cloudflare Pages へアップロード
```
