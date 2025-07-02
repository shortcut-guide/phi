// scripts/imageConvert.ts
import sharp from "sharp";
import fs from "fs/promises";
import path from "path";

const outputDir = path.resolve("./output");

async function convertImage(inputPath: string) {
  const fullInputPath = path.resolve(inputPath);
  const ext = path.extname(fullInputPath).toLowerCase();
  const baseName = path.basename(fullInputPath, ext);

  await fs.mkdir(outputDir, { recursive: true });

  const pngOutput = path.join(outputDir, `${baseName}.png`);
  const webpOutput = path.join(outputDir, `${baseName}.webp`);
  const svgOutput = path.join(outputDir, `${baseName}.svg`);

  // SVGの場合 → PNG / WebP / コピー
  if (ext === ".svg") {
    await sharp(fullInputPath).png({ quality: 100 }).toFile(pngOutput);
    await sharp(fullInputPath).webp({ quality: 85 }).toFile(webpOutput);
    await fs.copyFile(fullInputPath, svgOutput);
    console.log(`✔ ${baseName} - SVG → PNG/WebP 変換完了`);
  }

  // PNG or JPG → WebPのみ
  else if (ext === ".png" || ext === ".jpg" || ext === ".jpeg") {
    await sharp(fullInputPath).webp({ quality: 85 }).toFile(webpOutput);
    await fs.copyFile(fullInputPath, path.join(outputDir, path.basename(fullInputPath)));
    console.log(`✔ ${baseName} - PNG/JPG → WebP 変換完了`);
  }

  else {
    console.warn(`⚠ 未対応フォーマット: ${inputPath}`);
  }
}

async function main() {
  const args = process.argv.slice(2);
  if (args.length === 0) {
    console.error("❌ 画像ファイルのパスを指定してください");
    process.exit(1);
  }

  for (const inputPath of args) {
    await convertImage(inputPath);
  }
}

main().catch(console.error);