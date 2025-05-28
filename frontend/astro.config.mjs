// @ts-check
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import preact from '@astrojs/preact';
import icon from "astro-icon";
import path from 'path';

// 相対パスに変換するプラグイン
import relativeLinks from "astro-relative-links";

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind(), preact(),icon(),relativeLinks()],
  vite: {
    resolve: {
      alias: {
        '@/assets': path.resolve(__dirname, './src/assets'),
        '@/f': path.resolve(__dirname, './src'),
        '@/b': path.resolve(__dirname, '../backend/src')
      }
    },
  },
});
