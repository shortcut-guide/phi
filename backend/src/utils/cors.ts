export function setCORSHeaders(response: Response): Response {
  const allowedOrigin = "https://your-frontend-domain.com";

  response.headers.set("Access-Control-Allow-Origin", allowedOrigin);
  response.headers.set("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type, X-CSRF-Token");

  return response;
}