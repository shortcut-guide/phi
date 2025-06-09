export function renderIndex(): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Hono API</title>
  <meta http-equiv="Content-Security-Policy"
        content="default-src 'self'; font-src 'self' data:; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self';">
  <style>
    body { font-family: sans-serif; margin: 2rem; }
  </style>
</head>
<body>
  <h1>✅ Hono API is running</h1>
  <p>You can now access your API endpoints.</p>
</body>
</html>`;
}