import { AxiosError } from 'axios';
import { logger } from '../utils/logger';

export function handleApiError(error: AxiosError): { retry: boolean, waitTime?: number } {
    if (error.response) {
        logger.logError(`API Error ${error.response.status}: ${error.message}`);
        if (error.response.status === 429) {
            return { retry: true, waitTime: 3000 };
        }
    } else if (error.request) {
        logger.logError(`API Request Error: ${error.message}`);
    } else {
        logger.logError(`Unknown API Error: ${error.message}`);
    }
    return { retry: false };
}