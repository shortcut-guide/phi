export declare function generateCSRFToken(): string;
export declare function setCSRFCookie(response: Response, token: string): Response;
export declare function validateCSRF(request: Request): boolean;
