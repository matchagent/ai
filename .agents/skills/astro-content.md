# スキル: Astro コンテンツ集の操作

## 概要
`src/content/` のコンテンツ集 (Content Collections) の読み書き方法。

## コレクション定義

スキーマは `src/content.config.ts` で Zod を使って定義されている。
新しいフィールドを追加する場合はここを編集する。

## ページでのデータ取得

```astro
---
import { getCollection, getEntry } from 'astro:content';

// 全件取得
const allCases = await getCollection('cases');

// フィルタリング
const mfgCases = await getCollection('cases', ({ data }) =>
  data.industry === 'mfg'
);

// 単件取得
const case1 = await getEntry('cases', 'mfg-001');
---
```

## 静的ルートの生成

```astro
---
// src/pages/cases/[slug].astro
import { getCollection } from 'astro:content';

export async function getStaticPaths() {
  const cases = await getCollection('cases');
  return cases.map(c => ({
    params: { slug: c.id },
    props: { entry: c },
  }));
}

const { entry } = Astro.props;
const { Content } = await entry.render();
---
<Content />
```

## JSON API エンドポイント

```typescript
// src/pages/data/cases.json.ts
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

export const GET: APIRoute = async () => {
  const cases = await getCollection('cases');
  return new Response(JSON.stringify(cases.map(c => c.data)), {
    headers: { 'Content-Type': 'application/json' },
  });
};
```

## Islands (インタラクティブコンポーネント)

React コンポーネントを Astro ページに埋め込む:

```astro
---
import MyComponent from '../components/islands/MyComponent.tsx';
import { getCollection } from 'astro:content';
const data = await getCollection('cases');
---

<!-- ビルド時にデータを渡す。クライアントサイドでは fetch しない -->
<MyComponent cases={data.map(c => c.data)} client:load />
```

## 注意事項

- コンテンツの型は `src/content.config.ts` のスキーマに厳密に従う
- `npm run check` で型エラーを確認してから `npm run build` を実行する
- `getCollection` はビルド時にのみ呼び出せる (API ルートや Cloudflare Functions では使用不可)
- Cloudflare Functions からコンテンツを参照するには `/data/*.json` を fetch する
