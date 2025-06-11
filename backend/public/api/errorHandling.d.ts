import { AxiosError } from 'axios';
export declare function handleApiError(error: AxiosError): {
    retry: boolean;
    waitTime?: number;
};
