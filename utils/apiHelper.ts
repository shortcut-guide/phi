import fetch from "node-fetch";

const MICROCMS_API_URL = "https://your-microcms-endpoint";
const MICROCMS_API_KEY = "your-microcms-api-key";

const request = async (method: string, endpoint: string, data?: any) => {
    const response = await fetch(`${MICROCMS_API_URL}${endpoint}`, {
        method,
        headers: {
            "Content-Type": "application/json",
            "X-MICROCMS-API-KEY": MICROCMS_API_KEY,
        },
        body: data ? JSON.stringify(data) : undefined,
    });

    if (!response.ok) throw new Error(`APIエラー: ${response.statusText}`);
    return response.json();
};

export default {
    get: (endpoint: string) => request("GET", endpoint),
    post: (endpoint: string, data: any) => request("POST", endpoint, data),
    put: (endpoint: string, data: any) => request("PUT", endpoint, data),
    delete: (endpoint: string) => request("DELETE", endpoint),
};