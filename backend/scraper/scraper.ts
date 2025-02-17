import puppeteer from 'puppeteer';
import { safeScrape } from './errorHandling';
import { logger } from '../utils/logger';

export async function scrapeProduct(url: string) {
    let browser;
    try {
        browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto(url, { waitUntil: 'domcontentloaded' });

        const productName = await safeScrape(page, '.product-title');
        if (productName) {
            logger.logInfo(`Scraped product: ${productName}`);
            return { success: true, productName };
        }
        throw new Error('Product name not found');
    } catch (error) {
        logger.logError(`Scraping failed: ${(error as Error).message}`);
        return { success: false, error: (error as Error).message };
    } finally {
        if (browser) await browser.close();
    }
}