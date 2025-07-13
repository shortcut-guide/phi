import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import langPages from '@/f/config/langPages.json';
import pageFiles from '@/f/config/pageFiles.json';
import { messages } from "@/f/config/messageConfig";

// サポート言語一覧を取得
function getSupportedLangs(): string[] {
  return Object.keys(messages.index || {});
}

const STATIC_PATHS = [
  '/favicon.ico',
  '/robots.txt',
  '/sitemap.xml',
  '/404',
];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  console.log('middleware', pathname);
  // 1. Next.js内部APIや静的ファイル・/404は除外
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/assets') ||
    STATIC_PATHS.includes(pathname)
  ) {
    return NextResponse.next();
  }

  // 2. ルートページ（/）はサポート言語に自動リダイレクト
  if (pathname === '/') {
    const supported = getSupportedLangs();
    const header = req.headers.get('accept-language') || '';
    const lang = supported.find(l => header.includes(l)) || supported[0] || 'ja';
    const url = req.nextUrl.clone();
    url.pathname = `/${lang}`;
    return NextResponse.redirect(url);
  }

  // 3. /{page} が langPagesに登録されていれば言語付きへリダイレクト
  //    例: /privacy-policy → /ja/privacy-policy
  if (/^\/([\w-]+)$/.test(pathname)) {
    const page = pathname.slice(1);
    if (langPages.includes(page)) {
      const supported = getSupportedLangs();
      const header = req.headers.get('accept-language') || '';
      const lang = supported.find(l => header.includes(l)) || supported[0] || 'ja';
      const url = req.nextUrl.clone();
      url.pathname = `/${lang}/${page}`;
      return NextResponse.redirect(url);
    }
    // 4. pages直下のファイルならそのまま表示（リダイレクトなし）
    if (pageFiles.includes(page)) {
      return NextResponse.next();
    }
    // 5. それ以外は404
    return NextResponse.next();
  }

  // 6. /{lang}/{page}
  const pathMatch = pathname.match(/^\/([\w-]+)\/([\w-]+)$/);
  if (pathMatch) {
    const [, lang, page] = pathMatch;
    if (!getSupportedLangs().includes(lang) || !langPages.includes(page)) {
      return NextResponse.next();
    }
    return NextResponse.next();
  }

  // 7. /{lang}だけ（トップページ）は許可
  const langOnly = pathname.match(/^\/([\w-]+)\/?$/);
  if (langOnly && getSupportedLangs().includes(langOnly[1])) {
    return NextResponse.next();
  }

  // 8. それ以外は404
  return NextResponse.next();
}