import fetch from "node-fetch";
import type { EndPoints } from '../types/cms-types'
import { MicroCMS } from 'microcms-lib'
import { config } from "dotenv";

config();

const MICROCMS_SERVICE = process.env.SERVICE;
const MICROCMS_API_URL = process.env.MICROCMS_API_URL_PUP;
const MICROCMS_API_KEY = process.env.MICROCMS_API_KEY_PUP;

if (!MICROCMS_API_URL || !MICROCMS_API_KEY) {
    throw new Error("環境変数 MICROCMS_API_URL または MICROCMS_API_KEY が設定されていません。");
}

const request = new MicroCMS<EndPoints>({
    service: process.env.SERVICE,
    apiKey: process.env.APIKEY
});

const apiHelper = {
    // データを取得
    get: async (endpoint: string, queries?: object) => {
        try {
            return await request.get({ endpoint, queries });
        } catch (error) {
            console.error("GET エラー:", error);
            return null;
        }
    },

    // データを追加
    post: async (endpoint: string, content: object) => {
        try {
            return await request.create({ endpoint, content, apiKey: MICROCMS_API_WRITE_KEY });
        } catch (error) {
            console.error("POST エラー:", error);
            return null;
        }
    },

    // データを削除
    delete: async (endpoint: string, id: string) => {
        try {
            return await request.delete({ endpoint, contentId: id, apiKey: MICROCMS_API_GLOBAL_KEY });
        } catch (error) {
            console.error("DELETE エラー:", error);
            return null;
        }
    },
};

export default apiHelper;