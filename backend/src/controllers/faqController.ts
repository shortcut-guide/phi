// backend/controllers/faqController.ts
import path from "path";
import fs from "fs";

export const getFaqList = (lang?: string) => {
  const filePath = path.resolve(__dirname, "@/b/data/faq.json");
  const jsonData = fs.readFileSync(filePath, "utf-8");
  const allFaqs = JSON.parse(jsonData);
  if (lang && allFaqs[lang]) {
    return allFaqs[lang];
  }
  return allFaqs;
};