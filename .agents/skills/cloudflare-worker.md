# スキル: Cloudflare Pages Functions の書き方

## 概要
`functions/api/` 配下のエンドポイントを追加・編集する際の規約。

## ファイル構成

```typescript
/// <reference types="@cloudflare/workers-types" />

export interface Env {
  // 環境変数を宣言する
  ANTHROPIC_API_KEY: string;
  SUPABASE_URL: string;
  SUPABASE_ANON_KEY: string;
  ALLOWED_ORIGIN: string;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { request, env } = context;
  // ...
};

export const onRequest: PagesFunction<Env> = async (context) => {
  if (context.request.method === 'POST') {
    return onRequestPost(context);
  }
  return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
};
```

## CORS ヘッダー

`*` は使用禁止。必ず `ALLOWED_ORIGIN` 環境変数で制御する:

```typescript
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
```

## fetch タイムアウト

全ての外部 fetch に `AbortController` でタイムアウトを設定する:

```typescript
async function fetchWithTimeout(url: string, options: RequestInit, timeoutMs: number): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timeoutId);
  }
}
```

推奨タイムアウト値:
- Claude API: 15,000ms
- Supabase: 10,000ms
- 同一オリジン fetch: 15,000ms

## レートリミット

```typescript
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function cleanupRateLimit(): void {
  const now = Date.now();
  for (const [ip, entry] of rateLimitMap.entries()) {
    if (now > entry.resetTime) rateLimitMap.delete(ip);
  }
}

function checkRateLimit(ip: string, limit: number, windowMs: number): boolean {
  cleanupRateLimit(); // 必ず呼び出してメモリリークを防ぐ
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs });
    return true;
  }
  if (entry.count >= limit) return false;
  entry.count++;
  return true;
}
```

IP の取得: `request.headers.get('CF-Connecting-IP') || 'unknown'`

## 入力バリデーション

- 必須項目の存在確認
- 文字列長の上限チェック
- 数値の範囲チェック (負の数・極端に大きな数)
- メールアドレスの形式チェック

## エラーレスポンス形式

```typescript
return new Response(
  JSON.stringify({ error: 'エラーメッセージ' }),
  { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
);
```

## 環境変数

新しい環境変数を追加した場合:
1. `Env` インターフェースに追加
2. `.env.example` に追加
3. Cloudflare Pages のダッシュボードに設定
