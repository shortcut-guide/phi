import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const EXCLUDE_PATHS = ['/.well-known', '/_next', '/api', '/favicon.ico', '/static'];

function isLangPath(pathname: string) {
  // Check if pathname starts with / followed by 2 to 8 letters or hyphens (case insensitive)
  // e.g. /ja, /en, /fr, /zh-CN, /pt-br
  const match = pathname.match(/^\/([a-zA-Z-]{2,8})(\/|$)/);
  return !!match;
}

function getLangFromAcceptLanguage(acceptLanguage: string | null): string {
  if (!acceptLanguage) return 'en';
  const langs = acceptLanguage.split(',');
  if (langs.length === 0) return 'en';
  const firstLang = langs[0].split(';')[0].trim();
  const primaryLang = firstLang.split('-')[0];
  return primaryLang || 'en';
}

export function middleware(req: NextRequest) {
  console.log("middleware fire", req.nextUrl.pathname);
  const { pathname } = req.nextUrl;
  const lang = getLangFromAcceptLanguage(req.headers.get('accept-language'));
  // Exclude specific paths
  if (EXCLUDE_PATHS.some(p => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  // If path starts with a language code, do not redirect
  if (isLangPath(pathname)) {
    return NextResponse.next();
  }

  // If root path, redirect to language path based on accept-language header
  if (pathname === '/') {
    const url = req.nextUrl.clone();
    url.pathname = `/${lang}`;
    return NextResponse.redirect(url);
  }

  // Otherwise, add language prefix to path and redirect
  const url = req.nextUrl.clone();
  url.pathname = `/${lang}${pathname}`;

  return NextResponse.redirect(url);
}

// すでに言語パス始まりの場合はmiddlewareが発動しない
export const config = {
  matcher: ['/((?!_next/|api/|static/|favicon.ico|.well-known/).*)'],
};
