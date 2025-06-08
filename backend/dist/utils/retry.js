import { logger } from './logger';
export async function retry(fn, maxAttempts = 3, delay = 1000) {
    for (let i = 0; i < maxAttempts; i++) {
        try {
            return await fn();
        }
        catch (error) {
            logger.logError(`Retry attempt ${i + 1}: ${error.message}`);
            if (i < maxAttempts - 1) {
                await new Promise(res => setTimeout(res, (2 ** i) * delay));
            }
            else {
                throw error;
            }
        }
    }
    throw new Error('Max retry attempts reached');
}
