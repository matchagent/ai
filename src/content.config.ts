import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'zod';

const INDUSTRIES = [
  'manufacturing', 'retail', 'logistics', 'construction',
  'legal', 'food', 'hotel', 'realestate', 'entertainment'
] as const;

const DOMAINS = [
  'sales', 'production', 'hr', 'accounting', 'customer_support', 'logistics'
] as const;

const cases = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/cases' }),
  schema: z.object({
    title: z.string(),
    industry: z.enum(INDUSTRIES),
    domain: z.enum(DOMAINS),
    problem_tags: z.array(z.string()),
    company_size: z.enum(['small', 'mid', 'large']),
    metric_value: z.number(),
    metric_unit: z.string(),
    metric_verified: z.boolean(),
    source_url: z.string().url().optional(),
    is_sponsored: z.boolean().default(false),
    date: z.date(),
    excerpt: z.string().max(120),
  }),
});

export const collections = { cases };
