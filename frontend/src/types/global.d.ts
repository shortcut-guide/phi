// src/types/global.d.ts
export {};

declare global {
  interface Window {
    CSRF_TOKEN: string;
  }
}