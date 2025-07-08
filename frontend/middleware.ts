import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// 除外パス
const EXCLUDE_PATHS = ['/.well-known', '/_next', '/api', '/favicon.ico', '/static'];

// 言語パスかどうか判定（/ja, /en, /zh-CN, /pt-brなど対応）
function isLangPath(pathname: string) {
  return /^\/[a-zA-Z-]{2,8}(\/|$)/.test(pathname);
}

// Accept-Languageから言語判定（なければ"en"）
function getLangFromAcceptLanguage(acceptLanguage: string | null): string {
  if (!acceptLanguage) return 'en';
  const first = acceptLanguage.split(',')[0].split(';')[0].trim();
  return first.split('-')[0] || 'en';
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 除外パス
  if (EXCLUDE_PATHS.some(p => pathname.startsWith(p))) return NextResponse.next();

  // すでに言語パスなら何もしない
  if (isLangPath(pathname)) return NextResponse.next();

  // 言語を取得
  const lang = getLangFromAcceptLanguage(req.headers.get('accept-language'));

  // ルートなら /{lang} へ
  if (pathname === '/') {
    const url = req.nextUrl.clone();
    url.pathname = `/${lang}`;
    return NextResponse.redirect(url);
  }

  // それ以外は /{lang}/:slug* へ
  const url = req.nextUrl.clone();
  url.pathname = `/${lang}${pathname}`;
  return NextResponse.redirect(url);
}

// すでに言語パス始まりの場合はmiddlewareが発動しない
export const config = {
  matcher: [
    '/((?!_next|api|static|favicon\\.ico|.well-known)(?![a-zA-Z-]{2,8}($|/)).*)',
  ],
};
