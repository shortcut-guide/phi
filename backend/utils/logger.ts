import fs from 'fs';
import path from 'path';

const logFilePath = path.join(__dirname, '../logs/error.log');

export const logger = {
    logError: (message: string) => {
        const timestamp = new Date().toISOString();
        const logMessage = `[ERROR] ${timestamp} - ${message}\n`;
        console.error(logMessage);
        fs.appendFileSync(logFilePath, logMessage);
    },
    logInfo: (message: string) => {
        const timestamp = new Date().toISOString();
        const logMessage = `[INFO] ${timestamp} - ${message}\n`;
        console.log(logMessage);
        fs.appendFileSync(path.join(__dirname, '../logs/access.log'), logMessage);
    }
};