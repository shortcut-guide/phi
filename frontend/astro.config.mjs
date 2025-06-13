// @ts-check
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import preact from '@astrojs/preact';
import icon from "astro-icon";
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

// 相対パスに変換するプラグイン
import relativeLinks from "astro-relative-links";

// __dirname の代用（ESM用）
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind(), preact(),icon(),relativeLinks()],
  output: "static",
  outDir: "./public",
  publicDir: "./static",
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
