import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const secret = process.env.NEXTAUTH_SECRET;

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret });
  const { pathname } = req.nextUrl;

  // Protect root ("/") and any other protected routes here
  if (pathname === '/' && !token) {
    const loginUrl = req.nextUrl.clone();
    loginUrl.pathname = '/login';  // redirect to login
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

// Define which paths the middleware should run on
export const config = {
  matcher: ['/', '/dashboard/:path*'], // protect "/" and "/dashboard" (add others as needed)
};
