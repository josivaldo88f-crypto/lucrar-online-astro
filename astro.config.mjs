import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import partytown from '@astrojs/partytown';

// https://astro.build/config
export default defineConfig({
  site: 'https://www.lucrar.link/',
  integrations: [
    sitemap({
      filter: (page) => page !== 'https://www.lucrar.link/buscar/'
    }),
    partytown()
  ],
  trailingSlash: 'always',
  build: {
    format: 'directory'
  }
});
