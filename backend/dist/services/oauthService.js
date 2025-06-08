import '@/b/config/env';
const CLIENT_ID = process.env.PAYPAL_CLIENT_ID || '';
const CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET || '';
export async function getAccessTokenFromCode(code) {
    const credentials = `${CLIENT_ID}:${CLIENT_SECRET}`;
    const encodedCredentials = btoa(credentials);
    const res = await fetch("https://api.paypal.com/v1/oauth2/token", {
        method: "POST",
        headers: {
            Authorization: `Basic ${encodedCredentials}`,
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: `grant_type=authorization_code&code=${code}`
    });
    const data = await res.json();
    return data.access_token;
}
export async function getUserInfoFromToken(token) {
    const res = await fetch("https://api.paypal.com/v1/identity/openidconnect/userinfo/?schema=openid", {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
    return await res.json();
}
