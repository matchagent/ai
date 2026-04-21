import { describe, it, expect } from 'vitest';

const PROD_ORIGIN = 'https://ai.matchagent.workers.dev';
const LOCAL_ORIGIN = process.env.TEST_BASE_URL ?? 'http://localhost:4325';
const SITEMAP_URL = `${LOCAL_ORIGIN}/sitemap-0.xml`;
const CONCURRENCY = 10;
const FETCH_TIMEOUT_MS = 15000;

interface FetchResult {
  url: string;
  status: number;
  ok: boolean;
  error?: string;
}

async function fetchSitemapUrls(): Promise<string[]> {
  const res = await fetch(SITEMAP_URL, { signal: AbortSignal.timeout(FETCH_TIMEOUT_MS) });
  if (!res.ok) {
    throw new Error(`Sitemap fetch failed: ${res.status} ${res.statusText}`);
  }
  const xml = await res.text();
  const urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
  return urls;
}

async function fetchWithTimeout(targetUrl: string): Promise<FetchResult> {
  try {
    const res = await fetch(targetUrl, {
      method: 'GET',
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
      redirect: 'follow',
    });
    return { url: targetUrl, status: res.status, ok: res.ok };
  } catch (e) {
    return {
      url: targetUrl,
      status: 0,
      ok: false,
      error: (e as Error).message,
    };
  }
}

async function runInBatches<T, U>(
  items: T[],
  batchSize: number,
  fn: (item: T) => Promise<U>
): Promise<U[]> {
  const results: U[] = [];
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    const batchResults = await Promise.all(batch.map(fn));
    results.push(...batchResults);
  }
  return results;
}

describe('sitemap URL accessibility', () => {
  it(
    'すべてのsitemap URLが localhost:4325 でアクセス可能である',
    async () => {
      const urls = await fetchSitemapUrls();
      expect(urls.length).toBeGreaterThan(0);

      const localUrls = urls.map((url) => url.replace(PROD_ORIGIN, LOCAL_ORIGIN));

      const results = await runInBatches(localUrls, CONCURRENCY, fetchWithTimeout);

      const failures = results.filter((r) => !r.ok);
      if (failures.length > 0) {
        console.error('Failed URLs:');
        failures.forEach((f) => {
          console.error(`  ${f.url} -> status: ${f.status}${f.error ? `, error: ${f.error}` : ''}`);
        });
      }

      expect(
        failures,
        `${failures.length} / ${results.length} URLs failed`
      ).toHaveLength(0);
    },
    300000
  );
});
