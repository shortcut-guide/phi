import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import langPages from '@/f/config/langPages.json'; // tsconfigでpath調整

import { messages } from "@/f/config/messageConfig";

function getSupportedLangs(): string[] {
  return Object.keys(messages.index || {});
}

function detectLang(header: string | null, fallback: string = 'ja'): string {
  if (!header) return fallback;
  const langs = header.split(',').map(l => l.split(';')[0].trim().toLowerCase());
  const supported = getSupportedLangs();
  const found = langs.find(l => supported.includes(l));
  if (found) return found;
  if (supported.includes('en')) return 'en';
  return fallback;
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // /なら言語トップにリダイレクト
  if (pathname === '/') {
    const lang = detectLang(req.headers.get('accept-language'), 'ja');
    const url = req.nextUrl.clone();
    url.pathname = `/${lang}`;
    return NextResponse.redirect(url);
  }

  // /{page} 形式ならリスト参照して自動判定
  if (/^\/[\w-]+$/.test(pathname)) {
    const page = pathname.slice(1);
    if (langPages.includes(page)) {
      const lang = detectLang(req.headers.get('accept-language'), 'ja');
      const url = req.nextUrl.clone();
      url.pathname = `/${lang}${pathname}`;
      return NextResponse.redirect(url);
    }
  }

  // /{lang} または /{lang}/{page} の場合はそのまま
  const lang = pathname.split('/')[1];
  if (getSupportedLangs().includes(lang)) {
    return NextResponse.next();
  }

  return NextResponse.next();
}