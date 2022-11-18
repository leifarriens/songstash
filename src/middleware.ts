// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const url = new URL(request.url);

  // TODO: better spotifyId validator
  if (url.pathname.length === 23) {
    const baseUrl = getBaseUrl();

    console.log(baseUrl);
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
  matcher: '/:slug*',
  runtime: 'experimental-edge',
};
