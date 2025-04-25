// @ts-check
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import preact from '@astrojs/preact';
import icon from "astro-icon";

// 相対パスに変換するプラグイン
import relativeLinks from "astro-relative-links";

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind(), preact(),icon(),relativeLinks()],
  vite: {
    resolve: {
      alias: {
        '@': '/src'
      },
    },
  },
});
