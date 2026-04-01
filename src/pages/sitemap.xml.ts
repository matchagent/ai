import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { INDUSTRY_KEYS, COMPANY_SIZE_KEYS, DOMAIN_KEYS } from '@/utils/caseConstants';

const BASE = 'https://ai.matchagent.workers.dev';

function url(
  path: string,
  priority: string,
  changefreq: string,
  lastmod: string,
): string {
  return `  <url>
    <loc>${BASE}${path}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

export const GET: APIRoute = async () => {
  const cases = await getCollection('cases');
  const buildDate = new Date().toISOString().split('T')[0];

  // 各ディメンションの実在セットを集計
  const industriesWithContent = new Set(cases.map((c) => c.data.industry));
  const sizesWithContent = new Set(cases.map((c) => c.data.company_size));
  const domainsWithContent = new Set(cases.map((c) => c.data.domain));

  const industrySize = new Set(
    cases.map((c) => `${c.data.industry}|${c.data.company_size}`),
  );
  const industryDomain = new Set(
    cases.map((c) => `${c.data.industry}|${c.data.domain}`),
  );
  const sizeDomain = new Set(
    cases.map((c) => `${c.data.company_size}|${c.data.domain}`),
  );
  const industrySizeDomain = new Set(
    cases.map((c) => `${c.data.industry}|${c.data.company_size}|${c.data.domain}`),
  );

  const entries: string[] = [];

  // 静的ページ
  entries.push(url('/', '1.0', 'weekly', buildDate));
  entries.push(url('/about', '0.7', 'monthly', buildDate));
  entries.push(url('/terms', '0.3', 'yearly', buildDate));

  // 事例詳細ページ（lastmod = frontmatter の date）
  for (const c of cases) {
    const lastmod = c.data.date.toISOString().split('T')[0];
    entries.push(url(`/cases/${c.id}`, '0.8', 'monthly', lastmod));
  }

  // 業種別一覧
  for (const industry of INDUSTRY_KEYS) {
    if (!industriesWithContent.has(industry)) continue;
    entries.push(url(`/cases/${industry}`, '0.7', 'weekly', buildDate));
  }

  // 規模別一覧
  for (const size of COMPANY_SIZE_KEYS) {
    if (!sizesWithContent.has(size)) continue;
    entries.push(url(`/cases/size/${size}`, '0.6', 'weekly', buildDate));
  }

  // ドメイン別一覧
  for (const domain of DOMAIN_KEYS) {
    if (!domainsWithContent.has(domain)) continue;
    entries.push(url(`/cases/domain/${domain}`, '0.6', 'weekly', buildDate));
  }

  // 業種×規模
  for (const industry of INDUSTRY_KEYS) {
    for (const size of COMPANY_SIZE_KEYS) {
      if (!industrySize.has(`${industry}|${size}`)) continue;
      entries.push(url(`/cases/${industry}/${size}`, '0.5', 'weekly', buildDate));
    }
  }

  // 業種×ドメイン
  for (const industry of INDUSTRY_KEYS) {
    for (const domain of DOMAIN_KEYS) {
      if (!industryDomain.has(`${industry}|${domain}`)) continue;
      entries.push(url(`/cases/${industry}/domain/${domain}`, '0.5', 'weekly', buildDate));
    }
  }

  // 規模×ドメイン
  for (const size of COMPANY_SIZE_KEYS) {
    for (const domain of DOMAIN_KEYS) {
      if (!sizeDomain.has(`${size}|${domain}`)) continue;
      entries.push(url(`/cases/size/${size}/${domain}`, '0.5', 'weekly', buildDate));
    }
  }

  // 業種×規模×ドメイン
  for (const industry of INDUSTRY_KEYS) {
    for (const size of COMPANY_SIZE_KEYS) {
      for (const domain of DOMAIN_KEYS) {
        if (!industrySizeDomain.has(`${industry}|${size}|${domain}`)) continue;
        entries.push(url(`/cases/${industry}/${size}/${domain}`, '0.4', 'monthly', buildDate));
      }
    }
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.join('\n')}
</urlset>`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
};
