import jwt from "jsonwebtoken";

const secret = process.env.JWT_SECRET;
if (!secret) throw new Error("JWT_SECRET is not defined");

export function generateJWT(payload: object): string {
  return jwt.sign(payload, secret as string, { expiresIn: "7d" });
}