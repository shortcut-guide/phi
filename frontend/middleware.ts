import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  if (req.nextUrl.pathname.startsWith('/.well-known/')) {
    return new NextResponse(null, { status: 204 });
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/.well-known/:path*'],
};