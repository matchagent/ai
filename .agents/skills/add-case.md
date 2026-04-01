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
problem_tags: ["在庫管理", "自動化"]
company_size: "mid"               # small / mid / large
metric_value: 30                  # 効果の数値
metric_unit: "%向上"              # 効果の単位
metric_verified: true             # 検証済みか（下記「検証基準」参照）
source_url: "https://example.com/press-release"  # metric_verified: true の場合は必須
date: "2025-01-15"
excerpt: "事例の概要（1〜2文）"
---
```

> `id` フィールドは不要。Astro Content Collections がファイル名から自動設定する。

## 業種コード
`manufacturing` / `retail` / `logistics` / `construction` / `legal` / `food` / `hotel` / `realestate` / `entertainment` / `repair`

## ドメインコード
`sales` / `marketing` / `production` / `hr` / `accounting` / `customer_support` / `logistics`

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

## 検証基準 (metric_verified)

| 値 | 条件 |
|----|------|
| `true` | 出典（プレスリリース・公式発表・IR資料など）に **該当の数値が明記されている** |
| `false` | 出典に数値の記載がない、または出典自体が確認できない |

**ハルシネーション防止チェックリスト** (`metric_verified: true` にする前に確認):
1. `source_url` のページを実際に参照した
2. `metric_value` + `metric_unit` の組み合わせが出典内に明記されている
3. 数値を推測・要約・計算で導いていない

上記3条件をすべて満たす場合のみ `true`。満たさない場合は `false`。

## 確認コマンド

```bash
npm run check   # 型チェック
npm run build   # ビルド確認
```
