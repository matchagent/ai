import { getCollection } from 'astro:content';
import type { CollectionEntry } from 'astro:content';

export async function getSortedCases() {
  const allCases = await getCollection('cases');
  return allCases
    .sort((a, b) => b.data.date.getTime() - a.data.date.getTime())
    .map(mapCaseEntry);
}

export function mapCaseEntry(c: CollectionEntry<'cases'>) {
  return {
    slug: c.id,
    title: c.data.title,
    industry: c.data.industry,
    domain: c.data.domain,
    company_size: c.data.company_size,
    metric_value: c.data.metric_value ?? 0,
    metric_unit: c.data.metric_unit ?? '',
    excerpt: c.data.excerpt,
    date: c.data.date.toISOString(),
    problem_tags: c.data.problem_tags ?? [],
    metric_verified: c.data.metric_verified,
  };
}
