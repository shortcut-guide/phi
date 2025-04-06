import { convertToMarkdown } from "../generateTree.js";

describe("convertToMarkdown", () => {
  it("should wrap tree output in markdown fenced block", () => {
    const treeOutput = `
.
├── a.js
└── folder
    └── b.js
    `.trim();

    const result = convertToMarkdown(treeOutput);

    expect(result).toMatch(/^# 📁 プロジェクト構成/);
    expect(result).toContain("```");
    expect(result).toContain("├── a.js");
    expect(result).toContain("└── folder");
  });
});