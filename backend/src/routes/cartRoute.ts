import express,{ Request, Response, RequestHandler } from "express";
const router = express.Router();

const addCartHandler: RequestHandler = async (req, res) => {
  const db = req.db;
  const userId = req.user?.id;
  const { productId, quantity, variation, shop } = req.body;
  if (!userId) {
    res.status(401).json({ success: false, error: "Unauthorized" });
    return;
  }
  if (!productId || !quantity) {
    res.status(400).json({ success: false, error: "productId/quantity required" });
    return;
  }

  try {
    const existing = await db.get(
      `SELECT * FROM cart WHERE user_id = ? AND product_id = ? AND variation IS ? AND shop IS ?`,
      [userId, productId, variation ?? null, shop ?? null]
    );
    let cartItem;
    if (existing) {
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
      const now = new Date().toISOString();
      const result = await db.run(
        `INSERT INTO cart (user_id, product_id, quantity, variation, shop, created_at) VALUES (?, ?, ?, ?, ?, ?)`,
        [userId, productId, quantity, variation ?? null, shop ?? null, now]
      );
      const inserted = await db.get(`SELECT * FROM cart WHERE id = ?`, [result.lastID]);
      cartItem = inserted;
    }
    res.json({ success: true, cartItem });
  } catch (err) {
    res.status(500).json({ success: false, error: "DB error", detail: String(err) });
  }
};

router.post("/add", addCartHandler);

export default router;