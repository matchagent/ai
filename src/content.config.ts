import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'zod';

const INDUSTRIES = [
  'mfg', 'rtl', 'log', 'const',
  'leg', 'food', 'htl', 're', 'ent', 'rep'
] as const;

const DOMAINS = [
  'sales', 'marketing', 'production', 'hr', 'accounting', 'customer_support', 'logistics'
] as const;

const cases = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/cases' }),
  schema: z.object({
    title: z.string(),
    industry: z.enum(INDUSTRIES),
    domain: z.enum(DOMAINS),
    tech_tags: z.array(z.enum([
      // 画像AI
      '画像AI', 'Stable Diffusion背景生成', 'GAN画像変換', '外観検査', '画像診断',
      // 予測AI
      '予測AI', '需要予測', 'ダイナミックプライシング', 'レコメンド', '異常検知',
      // 言語AI
      '言語AI', 'ChatGPT顧客対応', 'LLM文章生成', '翻訳', 'チャットボット',
      // AIエージェント
      'AIエージェント', 'n8n自動化', 'ワークフローエージェント',
      // RAG
      'RAG',
      // 音声AI
      '音声AI', '電話予約AI', '音声合成', 'ポケトーク翻訳',
    ])),
    company_size: z.enum(['small', 'mid', 'large']),
    metric_value: z.number(),
    metric_unit: z.string(),
    source_url_verified: z.boolean(),
    source_url: z.string().optional().refine(
      (val) => !val || URL.canParse(val),
      { message: 'Invalid URL' }
    ),
    date: z.date(),
    excerpt: z.string().max(120),
  }),
});

export const collections = { cases };
