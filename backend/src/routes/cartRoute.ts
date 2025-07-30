import express,{ Request, Response } from "express";
const router = express.Router();

// D1 DBカート保存API
router.post("/add", async (req, res) => {
  const db = req.db;
  const userId = req.user?.id;
  const { productId, quantity, variation, shop } = req.body;
  if (!userId) {
    return res.status(401).json({ success: false, error: "Unauthorized" });
  }
  if (!productId || !quantity) {
    return res.status(400).json({ success: false, error: "productId/quantity required" });
  }

  try {
    // 既存レコード確認
    const existing = await db.get(
      `SELECT * FROM cart WHERE user_id = ? AND product_id = ? AND variation IS ? AND shop IS ?`,
      [userId, productId, variation ?? null, shop ?? null]
    );
    let cartItem;
    if (existing) {
      // quantity加算
      const newQuantity = Number(existing.quantity) + Number(quantity);
      await db.run(
        `UPDATE cart SET quantity = ? WHERE id = ?`,
        [newQuantity, existing.id]
      );
      cartItem = {
        ...existing,
        quantity: newQuantity,
      };
    } else {
      // 新規挿入
      const now = new Date().toISOString();
      const result = await db.run(
        `INSERT INTO cart (user_id, product_id, quantity, variation, shop, created_at) VALUES (?, ?, ?, ?, ?, ?)`,
        [userId, productId, quantity, variation ?? null, shop ?? null, now]
      );
      // SQLiteのlastInsertRowidはresult.lastID
      const inserted = await db.get(`SELECT * FROM cart WHERE id = ?`, [result.lastID]);
      cartItem = inserted;
    }
    res.json({ success: true, cartItem });
  } catch (err) {
    res.status(500).json({ success: false, error: "DB error", detail: String(err) });
  }
});

export default router;