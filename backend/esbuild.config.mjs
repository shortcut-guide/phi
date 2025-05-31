import esbuild from 'esbuild';
import alias from 'esbuild-plugin-alias';
import pkg from './package.json' assert { type: "json" };

const dependencies = Object.keys(pkg.dependencies || {});

// ✅ 依存を外部化（bundle対象から除外）する
const externals = Object.keys(dependencies || {});

esbuild.build({
  entryPoints: ['src/d1Server.ts'],
  bundle: true,
  platform: 'node',
  target: 'node20',
  format: 'esm',
  outdir: 'public/src',
  sourcemap: true,
  external: ['@hono/node-server'],
  plugins: [
    alias({
      '@': './src'
    })
  ]
}).catch(() => process.exit(1));