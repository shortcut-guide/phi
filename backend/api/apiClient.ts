import axios from 'axios';
import { retry } from '../utils/retry';
import { logger } from '../utils/logger';

export async function fetchData(url: string): Promise<any> {
    return await retry(async () => {
        const response = await axios.get(url);
        return response.data;
    }, 3);
}