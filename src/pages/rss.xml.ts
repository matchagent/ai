import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET() {
  const cases = await getCollection('cases');
  
  // date降順でソートし、上位30件を取得
  const sortedCases = cases
    .sort((a, b) => b.data.date.getTime() - a.data.date.getTime())
    .slice(0, 30);

  return rss({
    title: 'AIケースラボ - AI導入事例',
    description: '業種別AI導入事例の最新情報',
    site: 'https://ai.matchagent.workers.dev',
    items: sortedCases.map((caseItem) => ({
      link: `/cases/${caseItem.id}/`,
      title: caseItem.data.title,
      pubDate: caseItem.data.date,
      description: caseItem.data.excerpt,
    })),
  });
}
