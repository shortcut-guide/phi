import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

// __dirnameをESM環境で再現
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const getShopList = (lang?: string) => {
  // パスを直接指定
  const filePath = path.resolve(__dirname, "../src/data/shopList.json");
  const jsonData = fs.readFileSync(filePath, "utf-8");
  const result = JSON.parse(jsonData);
  if (lang && result[lang]) {
    return result[lang];
  }
  return result;
};