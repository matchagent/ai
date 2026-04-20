import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import cloudflare from '@astrojs/cloudflare';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';
import { sitemapLastmod } from './src/integrations/sitemap-lastmod';

export default defineConfig({
  site: 'https://ai.matchagent.workers.dev',
  output: 'static',
  redirects: {
    '/cases': '/',
  },
  adapter: cloudflare(),
  integrations: [
    react(),
    sitemap({
      filter: (page) => !page.includes('/admin/'),
    }),
    sitemapLastmod(),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
