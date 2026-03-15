import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://www.lucrar.link',
  integrations: [
    sitemap() // <-- ESSA LINHA FALTAVA!
  ],
  build: {
    format: 'directory' 
  }
});

