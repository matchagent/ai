新しいパートナーを追加してください。

以下の手順で進めてください:

1. ユーザーから以下の情報を収集する（不足している場合は確認する）:
   - 会社名
   - 専門業種 (industry コード配列)
   - 専門領域の説明 (2〜3文)
   - 最小予算・最大予算 (万円)
   - 受注可能件数 (capacity)
   - 稼働中かどうか (is_active)
   - 評価 (0.0〜5.0)
   - 完了案件数

2. `src/content/partners/` 内の既存ファイルを確認して連番を特定する

3. `src/content/partners/partner-{連番3桁}.json` を作成する:
   ```json
   {
     "id": "partner-XXX",
     "company_name": "",
     "specialty_industries": [],
     "specialty_description": "",
     "min_budget": 0,
     "max_budget": 0,
     "capacity": 0,
     "is_active": true,
     "rating": 0.0,
     "completed_count": 0
   }
   ```

4. `npm run check` で型エラーがないか確認する
5. `npm run build` でビルドが通ること、および `/data/partners.json` に反映されることを確認する
