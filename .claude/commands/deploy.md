プロダクション環境へデプロイしてください。

以下の手順で進めてください:

1. 未コミットの変更があれば確認する (`git status`)
2. 型チェックを実行する: `npm run check`
3. ビルドを実行する: `npm run build`
   - エラーがあれば修正してから続行する
4. ユーザーにデプロイを実行してよいか確認を取る
5. デプロイを実行する: `npm run deploy`
6. デプロイ完了後、https://aimatchagent.jp で動作確認するよう伝える

注意:
- `.env` の環境変数は Cloudflare Pages のダッシュボードで管理する
- `ANTHROPIC_API_KEY` / `SUPABASE_URL` / `SUPABASE_ANON_KEY` / `PUBLIC_SITE_URL` / `ALLOWED_ORIGIN` が設定済みであることを確認すること
