import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://www.lucrar.link',
  build: {
    format: 'directory' // URLs limpas (ex: /blog em vez de /blog.html)
  }
});
