import "express-serve-static-core";

declare module "express-serve-static-core" {
  interface Request {
    csrfToken(): string;
  }
}

declare global {
  namespace Express {
    interface Request {
      db: Database;
      user?: {
        id: string;
      };
    }
  }
}