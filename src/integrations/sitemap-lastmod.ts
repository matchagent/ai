import type { AstroIntegration } from 'astro';
import { readFile, writeFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';
import matter from 'gray-matter';

export function sitemapLastmod(): AstroIntegration {
  return {
    name: 'sitemap-lastmod',
    hooks: {
      'astro:build:done': async ({ dir }) => {
        // 全事例のMarkdownファイルを読み込んで slug→date のMapを作成
        const dateMap = new Map<string, string>();
        
        try {
          const casesDir = './src/content/cases';
          const files = await readdir(casesDir);
          
          for (const file of files) {
            if (file.endsWith('.md')) {
              const filePath = join(casesDir, file);
              const content = await readFile(filePath, 'utf-8');
              const { data } = matter(content);
              
              if (data.date) {
                const slug = file.replace('.md', '');
                // ISO形式またはDateオブジェクトをYYYY-MM-DD形式に変換
                const dateObj = data.date instanceof Date ? data.date : new Date(data.date);
                const dateStr = dateObj.toISOString().split('T')[0];
                dateMap.set(`/cases/${slug}/`, dateStr);
              }
            }
          }
        } catch (error) {
          console.error('[sitemap-lastmod] Failed to read case files:', error);
          return;
        }

        // sitemap-0.xmlを読み込み
        const sitemapPath = new URL('sitemap-0.xml', dir);
        
        try {
          let sitemapContent = await readFile(sitemapPath, 'utf-8');
          
          // 各URLエントリにlastmodを追加（個別事例ページのみ）
          const urlRegex = /<url>\s*<loc>(https:\/\/[^<]+)<\/loc>\s*(?:(?!lastmod)[\s\S])*?<\/url>/g;
          
          sitemapContent = sitemapContent.replace(urlRegex, (match, loc: string) => {
            // URLからパス部分を抽出
            const url = new URL(loc);
            const pathname = url.pathname;
            
            // 個別事例ページかチェック: /cases/{slug}/ の形式（slugにスラッシュを含まない）
            const caseMatch = pathname.match(/^\/cases\/([^\/]+)\/$/);
            
            if (caseMatch) {
              const lastmod = dateMap.get(pathname);
              if (lastmod) {
                // lastmodを追加して返す
                return match.replace(/<\/loc>/, `</loc>\n    <lastmod>${lastmod}</lastmod>`);
              }
            }
            
            // 該当しない場合は元のまま
            return match;
          });

          // 更新したsitemapを書き込み
          await writeFile(sitemapPath, sitemapContent, 'utf-8');
          console.log('[sitemap-lastmod] Added lastmod to case pages in sitemap-0.xml');
        } catch (error) {
          console.error('[sitemap-lastmod] Failed to update sitemap:', error);
        }
      },
    },
  };
}
