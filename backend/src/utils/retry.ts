import { logger } from './logger';

export async function retry<T>(fn: () => Promise<T>, maxAttempts = 3, delay = 1000): Promise<T> {
    for (let i = 0; i < maxAttempts; i++) {
        try {
            return await fn();
        } catch (error) {
            logger.logError(`Retry attempt ${i + 1}: ${(error as Error).message}`);
            if (i < maxAttempts - 1) {
                await new Promise(res => setTimeout(res, (2 ** i) * delay));
            } else {
                throw error;
            }
        }
    }
    throw new Error('Max retry attempts reached');
}