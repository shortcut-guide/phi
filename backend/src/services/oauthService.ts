export async function getAccessTokenFromCode(code: string) {
  const res = await fetch("https://api.paypal.com/v1/oauth2/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${btoa(`${CLIENT_ID}:${CLIENT_SECRET}`)}`,
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: `grant_type=authorization_code&code=${code}`
  });

  const data = await res.json();
  return data.access_token;
}

export async function getUserInfoFromToken(token: string) {
  const res = await fetch("https://api.paypal.com/v1/identity/openidconnect/userinfo/?schema=openid", {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  return await res.json();
}
