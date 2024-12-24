// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const isAuthPath = req.nextUrl.pathname.startsWith('/auth');


  if (
    req.nextUrl.pathname.startsWith('/_next/') ||
    req.nextUrl.pathname.startsWith('/api/') ||
    req.nextUrl.pathname.startsWith('/styles/') ||
    req.nextUrl.pathname.startsWith('/public/') ||
    req.nextUrl.pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  if (!token && !isAuthPath) {
    const signInUrl = new URL('/signin', req.url);
    return NextResponse.redirect(signInUrl);
  }

  if (token && isAuthPath) {
    return NextResponse.redirect(new URL('/', req.url));
  }
  if (req.nextUrl.pathname.startsWith('/orderhistory')|| 
  req.nextUrl.pathname.startsWith('/checkout')||req.nextUrl.pathname.startsWith('/settings')) {
    const userRole = token?.role;
  
    if (userRole !== 'SuperAdmin' && userRole !== 'Admin'&& userRole !== 'Consulter' && userRole !== 'Visiteur') {
      return NextResponse.redirect(new URL('/', req.url));
    }
  }

  if (req.nextUrl.pathname.startsWith('/admin')) {
    const userRole = token?.role;
  
    if (userRole !== 'SuperAdmin' && userRole !== 'Admin'&& userRole !== 'Consulter') {
      return NextResponse.redirect(new URL('/', req.url));
    }
  }
// If the path is /admin, check the user's role
if (req.nextUrl.pathname.startsWith('/admin/users')) {
  const userRole = token?.role;

  if (userRole !== 'SuperAdmin' && userRole !== 'Admin') {
    return NextResponse.redirect(new URL('/', req.url));
  }
}

if ( req.nextUrl.pathname.startsWith('/admin/category') || 
req.nextUrl.pathname.startsWith('/admin/product')||
req.nextUrl.pathname.startsWith('/admin/brand')||
req.nextUrl.pathname.startsWith('/admin/review')||
req.nextUrl.pathname.startsWith('/admin/order')
) {
  const userRole = token?.role;

  if (userRole !== 'SuperAdmin' && userRole !== 'Admin'&& userRole !== 'Consulter') {
    return NextResponse.redirect(new URL('/', req.url));
  }
}
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/orderhistory',
    '/checkout',
    '/settings'
  ],

};
