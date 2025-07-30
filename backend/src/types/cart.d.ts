import "express";

declare module "express" {
  interface Request {
    db?: any;    // D1 DBオブジェクト型を適宜指定
    user?: {
      id: string;
      // 他のユーザー情報もあればここに追加
    }
  }
}