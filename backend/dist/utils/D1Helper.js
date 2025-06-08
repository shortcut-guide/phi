import dotenv from "dotenv";
dotenv.config();
const DATABASE_ID = process.env.CLOUDFLARE_D1_DATABASE_ID;
if (!DATABASE_ID) {
    throw new Error("環境変数 CLOUDFLARE_D1_DATABASE_ID が設定されていません。");
}
export class D1Helper {
    constructor(db) {
        this.db = db;
    }
    async getAllContents() {
        const { results } = await this.db.prepare("SELECT * FROM contents ORDER BY createdAt DESC").all();
        return results;
    }
    async insertContent(title, body, visible) {
        const { meta } = await this.db
            .prepare("INSERT INTO contents (title, body, visible, createdAt) VALUES (?, ?, ?, datetime('now')) RETURNING id")
            .bind(title, body, visible)
            .run();
        return meta.last_row_id;
    }
    async deleteContent(id) {
        const { meta } = await this.db.prepare("DELETE FROM contents WHERE id = ?").bind(id).run();
        return meta.changes > 0;
    }
}
