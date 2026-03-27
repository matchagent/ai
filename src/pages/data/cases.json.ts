import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

export const GET: APIRoute = async () => {
  const cases = await getCollection('cases');
  
  // LLM用に必要なメタデータのみを抽出
  const casesData = cases.map(caseItem => ({
    id: caseItem.id,
    industry: caseItem.data.industry,
    problem_tags: caseItem.data.problem_tags,
    company_size: caseItem.data.company_size,
    metric_value: caseItem.data.metric_value,
    partner_id: caseItem.data.partner_id,
  }));
  
  return new Response(
    JSON.stringify(casesData, null, 2),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=3600',
      },
    }
  );
};

// 静的生成のためのパス指定
export async function getStaticPaths() {
  return [{ params: {} }];
}
