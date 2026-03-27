import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

export const GET: APIRoute = async () => {
  const partners = await getCollection('partners');
  
  // API用に必要なデータを抽出
  const partnersData = partners.map(partner => ({
    id: partner.id,
    company_name: partner.data.company_name,
    specialty_industries: partner.data.specialty_industries,
    specialty_description: partner.data.specialty_description,
    min_budget: partner.data.min_budget,
    max_budget: partner.data.max_budget,
    capacity: partner.data.capacity,
    is_active: partner.data.is_active,
    rating: partner.data.rating,
    completed_count: partner.data.completed_count,
  }));
  
  return new Response(
    JSON.stringify(partnersData, null, 2),
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
