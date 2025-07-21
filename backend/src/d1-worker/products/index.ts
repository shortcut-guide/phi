
import { readdirSync, statSync } from 'fs';
import { extname, join, basename } from 'path';

const modules: Record<string, any> = {};

function importModules(dir: string) {
  readdirSync(dir).forEach((file) => {
    const fullPath = join(dir, file);
    if (statSync(fullPath).isDirectory()) {
      importModules(fullPath);
    } else if (['.ts', '.js'].includes(extname(fullPath)) && !file.startsWith('index.')) {
      const moduleName = basename(file, extname(file));
      // 動的import
      modules[moduleName] = require(fullPath);
    }
  });
}

// __dirnameをルートとしたい場合は下記のように変更
importModules(__dirname);

export default modules;

// 必要であれば個別exportも自動化可能
Object.keys(modules).forEach((key) => {
  // @ts-ignore
  exports[key] = modules[key];
});