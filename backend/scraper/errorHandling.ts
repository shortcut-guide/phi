import { Page } from 'puppeteer';
import { logger } from '../utils/logger';

export async function safeScrape(page: Page, selector: string): Promise<string | null> {
    try {
        return await page.$eval(selector, el => el.textContent?.trim() || null);
    } catch (error) {
        logger.logError(`Scraping error at selector ${selector}: ${(error as Error).message}`);
        return null;
    }
}