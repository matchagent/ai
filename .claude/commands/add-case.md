新しい導入事例を追加してください。

以下の手順で進めてください:

1. ユーザーから以下の情報を収集する（不足している場合は確認する）:
   - タイトル
   - 業種 (manufacturing / retail / logistics / construction / legal / food / hotel / realestate / entertainment)
   - ドメイン (sales / marketing / production / hr / accounting / customer_support / logistics)
   - 課題タグ (配列)
   - 企業規模 (small / mid / large)
   - 効果指標の値・単位・検証済みかどうか
   - 事例詳細本文

2. `src/content/cases/` に新しい Markdown ファイルを作成する
   - ファイル名は `{industry}-{連番3桁}.md` 形式 (例: retail-002.md)
   - 既存ファイルの連番を確認してインクリメントする

3. フロントマターのスキーマは以下の通り (`src/content.config.ts` 参照):
   ```yaml
   ---
   title: ""
   industry: ""
   domain: ""
   problem_tags: []
   company_size: ""
   metric_value: 0
   metric_unit: ""
   metric_verified: false
   date: "YYYY-MM-DD"
   excerpt: ""
   ---
   ```

4. `npm run check` で型エラーがないか確認する
5. `npm run build` でビルドが通ることを確認する
