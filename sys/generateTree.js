import { execSync } from "child_process";
import fs from "fs";
import path from "path";

const message_complete = "✅ Structure.md updated.";
const md_structure = "Structure.md";
const targetDir = ".";

const ignoreDirs = ["node_modules", ".git", ".history", ".vscode", ".wrangler", ".husky"];
const ignorePattern = ignoreDirs.join("|");
const ignoreOption = `-I '${ignorePattern}'`;

const treeCommand = `/opt/homebrew/bin/tree ${ignoreOption} -L 3 ${targetDir}`;

const rawTree = execSync(treeCommand, { encoding: "utf-8" });

// Markdown整形
export function convertToMarkdown(treeOutput) {
  return `# 📁 プロジェクト構成\n\n\`\`\`\n${treeOutput.trim()}\n\`\`\``;
}

const markdownTree = convertToMarkdown(rawTree);
fs.writeFileSync(path.resolve(md_structure), markdownTree);

console.log(message_complete);