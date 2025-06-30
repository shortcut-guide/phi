import jwt from "jsonwebtoken";

const secret = process.env.JWT_SECRET;

export function generateJWT(payload: object): string {
  return jwt.sign(payload, secret, { expiresIn: "7d" });
}