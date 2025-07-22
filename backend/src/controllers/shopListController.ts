// backend/controllers/shopListController.ts
import path from "path";
import fs from "fs";

export const getShopList = (lang?: string) => {
  const filePath = path.resolve(__dirname, "@/b/data/shopList.json");
  const jsonData = fs.readFileSync(filePath, "utf-8");
  const result = JSON.parse(jsonData);
  if (lang && result[lang]) {
    return result[lang];
  }
  return result;
};