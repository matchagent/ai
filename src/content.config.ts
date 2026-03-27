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
    partner_id: z.string(),
    is_sponsored: z.boolean().default(false),
    date: z.date(),
    excerpt: z.string().max(120),
  }),
});

const partners = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/partners' }),
  schema: z.object({
    company_name: z.string(),
    specialty_industries: z.array(z.enum(INDUSTRIES)),
    specialty_description: z.string(),
    min_budget: z.number(),
    max_budget: z.number(),
    capacity: z.number(),
    is_active: z.boolean(),
    rating: z.number().min(0).max(5).default(0),
    completed_count: z.number().default(0),
  }),
});

export const collections = { cases, partners };
