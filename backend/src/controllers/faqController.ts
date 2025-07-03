// backend/controllers/faqController.ts
import path from "path";
import fs from "fs";

export const getFaqList = () => {
  const filePath = path.resolve(__dirname, "@/b/data/faq.json");
  const jsonData = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(jsonData);
};
