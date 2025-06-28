// scripts/dev.mjs
import { register } from 'node:module';
import { pathToFileURL } from 'node:url';

// @ts-ignore
await register('ts-node/esm', pathToFileURL('./'));
try {
  await import('./dev-multi.mts');
} catch (err) {
  console.error('Error importing dev-multi.mts:', err);
}