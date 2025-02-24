import { scrapeProduct } from './scraper/scraper';
import { fetchData } from './api/apiClient';
import { login } from './auth/login';

async function main() {
    console.log("Starting Application...");

    // 認証処理
    const authResult = await login('testuser', 'password123');
    if (!authResult.success) {
        console.error('Authentication failed, exiting...');
        return;
    }

    // スクレイピング
    const product = await scrapeProduct('https://example.com/product');
    if (!product.success) {
        console.error('Failed to scrape product, exiting...');
        return;
    }

    // APIリクエスト
    try {
        const data = await fetchData('https://api.example.com/data');
        console.log('API Data:', data);
    } catch (error) {
        console.error('Failed to fetch API data:', (error as Error).message);
    }
}

main();