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
src/
├── components/       # 事例カード・フィルター・レイアウト
├── content/cases/    # 導入事例 (Markdown)
├── pages/            # トップページ・事例詳細・カテゴリ別一覧
├── utils/            # 定数・データ変換
├── data/insights.ts  # 業種×規模×ドメイン別の実践提案
└── content.config.ts # Zod スキーマ

.agents/skills/       # 全エージェント共通スキル
├── add-case.md
├── add-insight.md
├── astro-content.md
└── cloudflare-worker.md
```

## 開発エージェント構成

このプロジェクトはAIエージェントのみがコーディングを担当する。
使用エージェント: Claude Code / Gemini CLI / Kimi Code

共通ファイル（スキル・無視パターン・MCP設定）は `.agents/skills/` などに配置し、各エージェント設定からシンボリックリンクで参照している。

## 開発コマンド

```bash
npm install          # 依存関係インストール
npm run dev          # 開発サーバー起動 (localhost:4321)
npm run build        # プロダクションビルド（型チェック + sitemap生成）
npm run preview      # ビルド結果のプレビュー (localhost:4325)
npm run deploy       # Cloudflare Pages へデプロイ
npm run check        # TypeScript 型チェック
npm run test         # テスト実行
npm run test:sitemap # sitemap内URLのHTTP 200検証（preview必須）
```

> `astro dev` では `@astrojs/sitemap` などのビルド時インテグレーションは動作しない。sitemap などの確認には `npm run build && npm run preview` を使用すること。

## 環境変数

`.env` ファイルを作成し以下を設定（`.env.example` 参照）:

```
SUPABASE_URL=         # Supabase プロジェクト URL
SUPABASE_ANON_KEY=    # Supabase 匿名キー
PUBLIC_SITE_URL=      # 本番サイト URL
ALLOWED_ORIGIN=       # CORS 許可オリジン
```

Cloudflare Pages の環境変数にも同様に設定すること。

## コンテンツ管理

### 事例を追加する
`src/content/cases/` に Markdown ファイルを追加する。詳細は `.agents/skills/add-case.md` を参照。

### 実践提案（insight）を追加・編集する
`src/data/insights.ts` の `insights` オブジェクトに `{industry}-{company_size}-{domain}` をキーとして追加する。詳細は `.agents/skills/add-insight.md` を参照。

### date の定義
`date` は `source_url` ページの公開日を設定する。
- `source_url_verified: true` の場合: WebFetch で確認した公開日
- `source_url_verified: false` の場合: 推定される公開日

### source_url_verified の定義
`source_url` が実際に存在するかを示すフラグ。架空URLのハルシネーションを防ぐ目的。
- `true`: WebFetch でアクセスし、ページの存在を確認済み
- `false`: 未設定、アクセス不可、または架空の可能性がある

`source_url_verified: true` にするのは実際にアクセスして確認した場合のみ。URLを推測・補完・生成した場合は `false` にすること。

## コーディング規約

- **型チェック**: コード変更後は必ず `npm run check` を実行してから完了とする
- **言語**: TypeScript 必須。`any` 型は使用禁止
- **コンポーネント**: 静的コンテンツは `.astro`、インタラクティブな要素は `.tsx`
- **スタイル**: Tailwind CSS のユーティリティクラスを使用。カスタム CSS は最小限に
- **APIレスポンス**: 全エラーレスポンスは `{ error: string }` 形式
- **入力バリデーション**: API境界では必ず Zod または手動バリデーションを実施
- **fetch**: 外部API呼び出しは必ず `AbortController` でタイムアウトを設定
- **CORS**: `ALLOWED_ORIGIN` 環境変数で制御。`*` は使用禁止
- **パスエイリアス**: `@/*` = `src/*`。相対パスではなく `@/` を使用すること

## コード一覧

業種コード・ドメインコード・技術タグの詳細は `.agents/skills/add-case.md` を参照。

- **業種コード**: `mfg` / `rtl` / `log` / `const` / `leg` / `food` / `htl` / `re` / `ent` / `rep`
- **ドメインコード**: `sales` / `marketing` / `production` / `hr` / `accounting` / `customer_support` / `logistics`
- **技術タグ**: `画像AI` / `予測AI` / `言語AI` / `AIエージェント` / `RAG` / `音声AI`
