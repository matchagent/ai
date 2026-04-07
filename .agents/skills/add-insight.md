# Insight（実践提案）の追加・編集

## 概要

`src/data/insights.ts` に、特定の業種×規模×ドメインの組み合わせに対する実践提案コンテンツを管理する。

該当する組み合わせの一覧ページ（`/cases/{industry}/{company_size}/{domain}`）と事例詳細ページ（`/cases/{slug}`）の下部に青いボックスとして表示される。

## データ構造

```ts
interface InsightItem {
  title: string;  // 提案タイトル（例: "1. SNS投稿をAIに任せる"）
  body: string;   // 提案の詳細説明
}

interface Insight {
  heading: string;      // ボックスの見出し
  items: InsightItem[]; // 提案リスト
  footer?: string;      // ボックス下部の補足文（任意）
}
```

## キーの命名規則

```
'{industry}-{company_size}-{domain}'
```

- `industry`: `mfg` / `rtl` / `log` / `const` / `leg` / `food` / `htl` / `re` / `ent` / `rep`
- `company_size`: `small` / `mid` / `large`
- `domain`: `sales` / `marketing` / `production` / `hr` / `accounting` / `customer_support` / `logistics`

## 追加手順

1. `src/data/insights.ts` を開く
2. `insights` オブジェクトに新しいキーと内容を追加する

```ts
'retail-small-sales': {
  heading: '小規模小売店オーナーが今すぐできること',
  items: [
    {
      title: '1. ...',
      body: '...',
    },
  ],
  footer: '...',
},
```

3. `npm run check` で型エラーがないことを確認する

## 注意事項

- 対象読者は日本人事業者。ツール名は日本で普及しているものを使う（LINE、Instagram、Googleマップ等）
- `items` は3〜5件が読みやすい
- `footer` には「まず何から始めるか」を端的に書く
- insightがないキーのページには何も表示されない（fallbackなし）
