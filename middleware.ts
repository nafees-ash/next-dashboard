import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import { isAuthenticated } from './lib/auth';

import type { NextRequest } from 'next/server';

const protectedRoutes = ['/dashboard'];

export default async function middleware(req: NextRequest) {
  const isAuth = await isAuthenticated();
  // const res = NextResponse.next();
  // const supabase = createMiddlewareClient({ req, res });

  //   const {
  //     data: { user },
  //   } = await supabase?.auth?.getUser();

  //   if (user && req.nextUrl.pathname === '/') {
  //     return NextResponse.redirect(new URL('/dashboard', req.url));
  //   }

  //   if (!user && req.nextUrl.pathname !== '/') {
  //     return NextResponse.redirect(new URL('/', req.url));
  //   }

  //   return res;
  if (!isAuth && protectedRoutes.includes(req.nextUrl.pathname)) {
    const absoluteURL = new URL('/', req.nextUrl.origin);
    return NextResponse.redirect(absoluteURL.toString());
  }

  if (isAuth && req.nextUrl.pathname === '/') {
    const absoluteURL = new URL('/dashboard', req.nextUrl.origin);
    return NextResponse.redirect(absoluteURL.toString());
  }
}

export const config = {
  matcher: ['/', '/dashboard/:path*'],
};
