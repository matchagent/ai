/// <reference types="@cloudflare/workers-types" />

export interface Env {
  ANTHROPIC_API_KEY: string;
  SUPABASE_URL: string;
  SUPABASE_ANON_KEY: string;
  PUBLIC_SITE_URL: string;
  ALLOWED_ORIGIN: string;
}

interface LeadRequest {
  industry: string;
  problem_description: string;
  budget: number;
  company_size: string;
}

interface Partner {
  id: string;
  company_name: string;
  specialty_industries: string[];
  specialty_description: string;
  min_budget: number;
  max_budget: number;
  capacity: number;
  is_active: boolean;
  rating: number;
  completed_count: number;
}

interface MatchResult {
  partner_id: string;
  score: number;
  reason: string;
}

// レートリミット（IPアドレスベース）
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT = 10; // 1分あたり10リクエスト
const RATE_WINDOW = 60 * 1000; // 1分

function cleanupRateLimit(): void {
  const now = Date.now();
  for (const [ip, entry] of rateLimitMap.entries()) {
    if (now > entry.resetTime) {
      rateLimitMap.delete(ip);
    }
  }
}

function checkRateLimit(ip: string): boolean {
  cleanupRateLimit();
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_WINDOW });
    return true;
  }

  if (entry.count >= RATE_LIMIT) {
    return false;
  }

  entry.count++;
  return true;
}

function getCorsHeaders(request: Request, allowedOrigin: string): Record<string, string> {
  const origin = request.headers.get('Origin') || '';
  const allowed = origin === allowedOrigin ? origin : allowedOrigin;
  return {
    'Access-Control-Allow-Origin': allowed,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Vary': 'Origin',
  };
}

const FETCH_TIMEOUT_MS = 15_000;
const SUPABASE_TIMEOUT_MS = 10_000;

async function fetchWithTimeout(url: string, options: RequestInit, timeoutMs: number): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, { ...options, signal: controller.signal });
    return response;
  } finally {
    clearTimeout(timeoutId);
  }
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { request, env } = context;
  const allowedOrigin = env.ALLOWED_ORIGIN || 'https://aimatchagent.jp';
  const corsHeaders = getCorsHeaders(request, allowedOrigin);

  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // レートリミット
  const clientIP = request.headers.get('CF-Connecting-IP') || 'unknown';
  if (!checkRateLimit(clientIP)) {
    return new Response(
      JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
      { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  try {
    const body = await request.json() as LeadRequest;
    const { industry, problem_description, budget, company_size } = body;

    // 必須項目チェック
    if (!industry || !problem_description || !budget || !company_size) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 予算バリデーション（1〜100,000万円）
    const budgetNum = Number(budget);
    if (!Number.isFinite(budgetNum) || budgetNum <= 0 || budgetNum > 100_000 || !Number.isInteger(budgetNum)) {
      return new Response(
        JSON.stringify({ error: 'Budget must be a positive integer up to 100,000 (万円)' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 文字列長チェック
    if (industry.length > 100 || problem_description.length > 2000 || company_size.length > 100) {
      return new Response(
        JSON.stringify({ error: 'Input exceeds maximum length' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // パートナー一覧を取得（ビルド時に生成されたJSONを想定）
    const siteUrl = env.PUBLIC_SITE_URL || 'https://aimatchagent.jp';
    const partnersResponse = await fetchWithTimeout(
      `${siteUrl}/data/partners.json`,
      {},
      FETCH_TIMEOUT_MS
    );
    let partners: Partner[] = [];

    if (partnersResponse.ok) {
      partners = await partnersResponse.json();
    } else {
      // フォールバック: 静的データを使用
      partners = [
        {
          id: 'partner-001',
          company_name: 'テックエージェント株式会社',
          specialty_industries: ['manufacturing', 'logistics', 'retail'],
          specialty_description: '製造業・物流業向けのAIオーケストレーション開発が専門。',
          min_budget: 100,
          max_budget: 1000,
          capacity: 3,
          is_active: true,
          rating: 4.8,
          completed_count: 12,
        },
        {
          id: 'partner-002',
          company_name: 'AIソリューションズ株式会社',
          specialty_industries: ['retail', 'food', 'hotel'],
          specialty_description: '小売業・飲食業向けのAI導入支援が専門。',
          min_budget: 50,
          max_budget: 500,
          capacity: 5,
          is_active: true,
          rating: 4.5,
          completed_count: 8,
        },
      ];
    }

    // ハードフィルタリング
    const eligiblePartners = partners.filter(p =>
      p.is_active &&
      p.specialty_industries.includes(industry) &&
      p.min_budget <= budgetNum &&
      p.max_budget >= budgetNum &&
      p.capacity > 0
    );

    if (eligiblePartners.length === 0) {
      return new Response(
        JSON.stringify({ error: 'No eligible partners found for your requirements' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Anthropic Claude APIでマッチング
    const prompt = `あなたはAI開発パートナーのマッチング専門家です。
以下の発注企業の要件に最も適したパートナーを上位3社選び、
各社について推薦スコア（0-100）と推薦理由（2文）を日本語で出力してください。

## 発注企業の要件
- 業種: ${industry}
- 課題: ${problem_description}
- 予算: ${budgetNum}万円
- 企業規模: ${company_size}

## パートナー一覧
${JSON.stringify(eligiblePartners.map(p => ({
  partner_id: p.id,
  company_name: p.company_name,
  specialty_description: p.specialty_description,
  rating: p.rating,
  completed_count: p.completed_count,
})), null, 2)}

## 出力形式（JSONのみ、前後に説明文不要）
[{"partner_id":"...","score":85,"reason":"..."}]`;

    const claudeResponse = await fetchWithTimeout(
      'https://api.anthropic.com/v1/messages',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': env.ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          messages: [{ role: 'user', content: prompt }],
        }),
      },
      FETCH_TIMEOUT_MS
    );

    if (!claudeResponse.ok) {
      throw new Error(`Claude API error: ${claudeResponse.status}`);
    }

    const claudeData = await claudeResponse.json() as { content?: Array<{ text?: string }> };
    const content = claudeData.content?.[0]?.text || '';

    // JSONを抽出し、候補パートナーIDのみに限定
    const eligibleIds = new Set(eligiblePartners.map(p => p.id));
    let matchResults: MatchResult[] = [];
    try {
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const parsed: MatchResult[] = JSON.parse(jsonMatch[0]);
        matchResults = parsed.filter(r =>
          typeof r.partner_id === 'string' &&
          typeof r.score === 'number' &&
          typeof r.reason === 'string' &&
          eligibleIds.has(r.partner_id)
        );
      }
    } catch (parseError) {
      console.error('Claude response parse error:', parseError);
    }

    // パース失敗またはClaudeが有効なIDを返さなかった場合のフォールバック
    if (matchResults.length === 0) {
      matchResults = eligiblePartners.slice(0, 3).map((p, i) => ({
        partner_id: p.id,
        score: 90 - i * 10,
        reason: `${p.company_name}は${industry}業界での実績が豊富です。`,
      }));
    }

    // Supabaseに保存（オプション）
    if (env.SUPABASE_URL && env.SUPABASE_ANON_KEY) {
      try {
        await fetchWithTimeout(
          `${env.SUPABASE_URL}/rest/v1/matches`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'apikey': env.SUPABASE_ANON_KEY,
              'Authorization': `Bearer ${env.SUPABASE_ANON_KEY}`,
            },
            body: JSON.stringify({
              industry,
              problem_description,
              budget: budgetNum,
              company_size,
              results: matchResults,
              created_at: new Date().toISOString(),
            }),
          },
          SUPABASE_TIMEOUT_MS
        );
      } catch (e) {
        console.error('Supabase save error:', e);
        // Supabase保存失敗は無視して続行
      }
    }

    return new Response(
      JSON.stringify({ results: matchResults }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Match API error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
};

export const onRequest: PagesFunction<Env> = async (context) => {
  if (context.request.method === 'POST') {
    return onRequestPost(context);
  }

  const allowedOrigin = context.env.ALLOWED_ORIGIN || 'https://aimatchagent.jp';
  const corsHeaders = getCorsHeaders(context.request, allowedOrigin);

  return new Response(
    JSON.stringify({ error: 'Method not allowed' }),
    {
      status: 405,
      headers: {
        'Content-Type': 'application/json',
        ...corsHeaders,
      }
    }
  );
};
