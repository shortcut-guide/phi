import axios from 'axios';
import { retry } from '../utils/retry';
export async function fetchData(url) {
    return await retry(async () => {
        const response = await axios.get(url);
        return response.data;
    }, 3);
}
