import { logger } from '../utils/logger';

export function handleLoginError(error: Error): { retry: boolean, message?: string } {
    logger.logError(`Login Error: ${error.message}`);
    if (error.message.includes('CAPTCHA')) {
        return { retry: false, message: 'Manual CAPTCHA required' };
    }
    return { retry: true };
}