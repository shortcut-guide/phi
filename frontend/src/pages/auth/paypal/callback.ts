import { parse } from 'querystring';

const url = new URL(window.location.href);
const params = new URLSearchParams(url.search);
const orderId = params.get("token");

(async() => {
  try {
    // /auth/paypal/callback?token=ORDER12345
    if (!orderId) throw new Error("orderId is missing");

    const res = await fetch(`${process.env.PUBLIC_API_BASE_URL}/paypal/capture-order`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ orderId }),
    });

    if (!res.ok) throw new Error(`Capture failed: ${res.statusText}`);

    const data = await res.json();
    console.log("Capture success", data);
  } catch (error) {
    console.error("Error during capture:", error);
  }
});