// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const url = new URL(request.url);
  const slug = url.pathname.replace('/', '');

  const idRegexp = /^[0-9a-zA-Z]{22}/gi;

  if (idRegexp.test(slug)) {
    const baseUrl = getBaseUrl();

    const res = await fetch(baseUrl + '/api/artists' + url.pathname);

    const json = await res.json();

    return NextResponse.redirect(baseUrl + '/' + json.slug);
  }

  return NextResponse.next();
}

function getBaseUrl() {
  if (process.env.NODE_ENV !== 'development') return process.env.CANONICAL_URL;

  return `http://localhost:${process.env.PORT ?? 3000}`;
}

export const config = {
  matcher: ['/:slug*', '/((?!discover).*)'],
  runtime: 'experimental-edge',
};
