/// <reference types="vitest" />
import preact from '@preact/preset-vite';
import { getViteConfig } from 'astro/config';
import * as path from "path";

export default getViteConfig({
  plugins: [preact()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    include: ['src/**/*.test.{ts,tsx,js,jsx,astro}'],
    exclude: ['**/sys/**', '**/node_modules/**', '**/dist/**'],
  },
  esbuild: {
    jsxImportSource: 'preact',
    jsx: 'automatic',
  },
  resolve:{
    alias: {
      "@": path.resolve(__dirname, "./src"),
      'astro/container': 'astro/dist/container/index.js'
    },
  }
});