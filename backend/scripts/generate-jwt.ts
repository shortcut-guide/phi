import jwt from "jsonwebtoken";

// シークレットキー（本番は環境変数などで管理）
const SECRET = "83c7416d702fecf8596a6a4f906f0607048257e5d2ac398e70ad480cdfaf9d4a";

// 発行するアカウントID
const accountId = process.argv[2] ?? "668ea9059163f3fd8df3b6f512d3ab3f";

// JWT生成
const token = jwt.sign(
  { sub: accountId },
  SECRET,
  { expiresIn: "12h" }
);

console.log("JWT:", token);