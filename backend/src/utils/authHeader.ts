import * as express from 'express';
export const addAuthHeader = (token: string) =>{
  return (req: express.Request, res: express.Response, next: express.NextFunction) => {
    req.headers['authorization'] = `Bearer ${token}`;
    next();
  };
}