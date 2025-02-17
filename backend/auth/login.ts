import puppeteer from 'puppeteer';
import { handleLoginError } from './errorHandling';
import { logger } from '../utils/logger';

export async function login(username: string, password: string) {
    let browser;
    try {
        browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto('https://example.com/login');

        await page.type('#username', username);
        await page.type('#password', password);
        await page.click('#loginButton');
        await page.waitForNavigation();

        if (await page.$('.error-message')) {
            throw new Error('Login failed');
        }

        logger.logInfo("Login successful");
        return { success: true };
    } catch (error) {
        handleLoginError(error as Error);
        return { success: false, error: (error as Error).message };
    } finally {
        if (browser) await browser.close();
    }
}