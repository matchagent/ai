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
metric_unit: "%削減"              # 効果の単位
metric_verified: true             # 検証済みか
is_sponsored: false               # スポンサード記事か
date: "2025-01-15"
excerpt: "事例の概要（1〜2文）"
---
```

## 業種コード
`manufacturing` / `retail` / `logistics` / `construction` / `legal` / `food` / `hotel` / `real_estate` / `entertainment`

## ドメインコード
`sales` / `production` / `hr` / `accounting` / `customer_support` / `logistics`

## 本文構成例

```markdown
## 背景・課題

（企業の状況と課題を記述）

## 導入したAIソリューション

（具体的な解決策を記述）

## 導入効果

（定量的・定性的な効果を記述）

## まとめ

（学びと今後の展開）
```

## 確認コマンド

```bash
npm run check   # 型チェック
npm run build   # ビルド確認
```
