import crypto from "crypto";

const TOKEN_NAME = "csrf_token";

export function generateCSRFToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

export function setCSRFCookie(response: Response, token: string): Response {
  response.headers.append("Set-Cookie", `${TOKEN_NAME}=${token}; Path=/; HttpOnly; Secure; SameSite=Strict`);
  return response;
}

export function validateCSRF(request: Request): boolean {
  const cookies = Object.fromEntries(request.headers.get("cookie")?.split(";").map(c => c.trim().split("=")) ?? []);
  const csrfToken = cookies[TOKEN_NAME];
  const requestToken = request.headers.get("X-CSRF-Token");

  return csrfToken && requestToken && csrfToken === requestToken;
}