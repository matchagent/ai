# スキル: パートナーの追加

## 概要
`src/content/partners/` に新しいパートナー JSON ファイルを追加する手順。

## ファイル命名規則
`partner-{連番3桁}.json`

例: `partner-003.json`

連番は既存ファイルを確認してインクリメントする。

## JSONスキーマ

```json
{
  "id": "partner-003",
  "company_name": "会社名株式会社",
  "specialty_industries": ["manufacturing", "logistics"],
  "specialty_description": "専門領域の説明。2〜3文で記述する。",
  "min_budget": 100,
  "max_budget": 1000,
  "capacity": 3,
  "is_active": true,
  "rating": 4.5,
  "completed_count": 10
}
```

## フィールド説明

| フィールド | 型 | 説明 |
|-----------|-----|------|
| `id` | string | `partner-{連番}` 形式 |
| `company_name` | string | 正式会社名 |
| `specialty_industries` | string[] | 専門業種コードの配列 |
| `specialty_description` | string | 専門領域の説明 (2〜3文) |
| `min_budget` | number | 最小予算 (万円) |
| `max_budget` | number | 最大予算 (万円) |
| `capacity` | number | 現在受注可能な件数 |
| `is_active` | boolean | 現在稼働中か |
| `rating` | number | 評価スコア (0.0〜5.0) |
| `completed_count` | number | 完了案件数 |

## マッチングロジックへの影響

`/api/match` は以下の条件でパートナーをフィルタリングする:
- `is_active === true`
- `specialty_industries` にリクエストの `industry` が含まれる
- `min_budget <= budget <= max_budget`
- `capacity > 0`

capacity が 0 のパートナーはマッチング対象外となるため注意。

## 確認コマンド

```bash
npm run build   # /data/partners.json に反映されることを確認
```
