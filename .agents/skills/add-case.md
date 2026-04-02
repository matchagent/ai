# スキル: 導入事例の追加

## 概要
`src/content/cases/` に新しい事例 Markdown ファイルを追加する手順。

## ファイル命名規則
`{industry}-{連番3桁}.md`

例: `retail-002.md`, `manufacturing-003.md`

連番は既存ファイルを確認してインクリメントする。

## フロントマタースキーマ

```yaml
---
title: "事例タイトル"
industry: "manufacturing"         # 業種コード (下記参照)
domain: "production"              # ドメインコード (下記参照)
tech_tags: []                         # 下記「tech_tags 一覧」から該当するものを列挙。なければ空配列
company_size: "mid"               # small / mid / large
metric_value: 30                  # 効果の数値
metric_unit: "%向上"              # 効果の単位
source_url_verified: true         # source_url のページが実際に存在することを確認済みか（下記「検証基準」参照）
source_url: "https://example.com/press-release"  # source_url_verified: true の場合は必須
date: "2025-01-15"
excerpt: "事例の概要（1〜2文）"
---
```

> `id` フィールドは不要。Astro Content Collections がファイル名から自動設定する。

## 業種コード
`manufacturing` / `retail` / `logistics` / `construction` / `legal` / `food` / `hotel` / `realestate` / `entertainment` / `repair`

### 業種コードの定義

| コード | ラベル | 対象業態 |
|--------|--------|----------|
| `manufacturing` | 製造業 | 工場・メーカー・部品製造・産業機械・電子機器製造など |
| `retail` | 小売(EC)業 | 実店舗小売・ECサイト・通販・コンビニ・ドラッグストアなど |
| `logistics` | 物流(運輸)業 | 倉庫・配送・宅配・トラック運送・海運・航空貨物など |
| `construction` | 建設業 | 建設・土木・設計・施工管理・建築資材など |
| `legal` | 士業 | 弁護士・税理士・公認会計士・社会保険労務士・司法書士など |
| `food` | 飲食業 | レストラン・カフェ・居酒屋・フードデリバリー・給食など |
| `hotel` | 宿泊業 | ホテル・旅館・民泊・リゾート施設など |
| `realestate` | 不動産業 | 不動産売買・賃貸・管理・仲介・不動産テックなど |
| `entertainment` | 娯楽業 | ゲーム・アニメ・音楽・映像制作・テーマパーク・スポーツ・動画配信など |
| `repair` | 修理(メンテナンス)業 | 機器修理・設備保守・点検・メンテナンスサービスなど |

### 業種コード判定の注意点

- **IT・AI企業はエンタメ向けサービスを提供していても `entertainment` にしない**。事例の主体が娯楽コンテンツを制作・提供する企業かどうかで判断する（例: Preferred Networks → IT企業、東映アニメーション → `entertainment`）
- **食品メーカー（工場での製造）は `manufacturing`**。飲食店・デリバリーが主体の場合は `food`
- **物流子会社・配送部門を持つ小売企業**は事例の主体業務で判断する（物流改善 → `logistics`、店舗・EC改善 → `retail`）
- **複数事業を持つ大企業**は事例で取り上げるAI導入が行われた部門・業務の業種を選ぶ

## ドメインコード
`sales` / `marketing` / `production` / `hr` / `accounting` / `customer_support` / `logistics`

### ドメインコードの定義

| コード | ラベル | 対象業務 |
|--------|--------|----------|
| `sales` | 営業 | 商談・見積・CRM・受注管理・営業予測など |
| `marketing` | マーケティング | 広告・SNS・コンテンツ生成・顧客分析・需要予測など |
| `production` | 生産・製造 | 製造ライン・品質管理・検品・設備異常検知・在庫管理など |
| `hr` | 人事 | 採用・面接・評価・勤怠管理・研修・離職予測など |
| `accounting` | 会計 | 経理・請求・仕訳・財務分析・経費精算など |
| `customer_support` | カスタマーサポート | 問い合わせ対応・チャットボット・FAQ・クレーム対応など |
| `logistics` | 物流 | 配送ルート最適化・在庫・倉庫管理・入出荷など |

### ドメインコード判定の注意点

- **需要予測・ダイナミックプライシング**は販売目的なら `marketing`、在庫・配送目的なら `logistics`
- **チャットボット**は顧客向けなら `customer_support`、社内ヘルプデスク向けなら `hr` または `accounting`
- **品質検査・異常検知**は製造ラインなら `production`、納品後のメンテナンスなら `repair` 業種と合わせて `production` または `customer_support`

## 本文構成

```markdown
## Before

（AI導入前の業務課題・状況を記述。定量的な問題規模があれば数値を含める）

## AI導入内容

（導入したAIソリューションの全体像と仕組みを記述。必要に応じてサブセクション `###` で構成を分ける）

## After

（導入後の定量的・定性的な成果を記述。metric_value/metric_unit に対応する数値変化を必ず含める）
```

### 文体・品質基準

- 1セクションあたり3〜5段落以上の詳細な記述
- `metric_value` に対応する数値は `## After` に明記する（例: `2.7% → 12%`）
- 業界固有の背景・構造的課題から書き起こし、読者がAI導入の必然性を理解できるようにする
- `## AI導入内容` は技術スタック・データフロー・フィードバックループまで掘り下げる

## 検証基準 (source_url_verified)

| 値 | 条件 |
|----|------|
| `true` | `source_url` に WebFetch でアクセスし、ページが実際に存在することを確認済み |
| `false` | `source_url` が未設定、アクセス不可、または架空の可能性がある |

**ハルシネーション防止チェックリスト** (`source_url_verified: true` にする前に確認):
1. `source_url` に WebFetch で実際にアクセスしてページが存在することを確認した
2. `source_url` が架空・推測・補完したURLではない

上記2条件をすべて満たす場合のみ `true`。満たさない場合は `false`。

## tech_tags 一覧

| カテゴリ | タグ値 |
|----------|--------|
| 画像AI | `Stable Diffusion背景生成` / `GAN画像変換` / `外観検査` / `画像診断` |
| 予測AI | `需要予測` / `ダイナミックプライシング` / `レコメンド` / `異常検知` |
| 言語AI | `ChatGPT顧客対応` / `LLM文章生成` / `翻訳` / `チャットボット` |
| AIエージェント | `n8n自動化` / `ワークフローエージェント` |
| 音声AI | `電話予約AI` / `音声合成` / `ポケトーク翻訳` |
| RAG | `RAG` |

カテゴリ名自体（`画像AI` など）も使用可能。

## 確認コマンド

```bash
npm run check   # 型チェック
npm run build   # ビルド確認
```
