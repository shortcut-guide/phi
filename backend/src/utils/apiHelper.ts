import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const MICROCMS_API_URL = process.env.MICROCMS_API_URL_PUP_SITES;
const MICROCMS_API_KEY = process.env.MICROCMS_API_KEY_PUP;

if (!MICROCMS_API_URL || !MICROCMS_API_KEY) {
    throw new Error("環境変数 MICROCMS_API_URL または MICROCMS_API_KEY が設定されていません。");
}

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