import esbuild from 'esbuild';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const pkg = require('./package.json'); // CommonJS スタイルで JSON を読み込む

// 依存関係を外部化
const dependencies = Object.keys(pkg.dependencies || {});

esbuild.build({
  entryPoints: ['src/server.ts'],
  bundle: true,
  platform: 'node',
  target: 'node20',
  format: 'esm',
  outdir: 'public',
  sourcemap: true,
  external: dependencies,
  loader: {
    '.ts': 'ts',
  },
}).catch(() => process.exit(1));