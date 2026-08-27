import { auth } from './auth';
import { NextResponse } from 'next/server';

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isLoggedIn = !!req.auth;
  const role = (req.auth?.user as any)?.role;

  // Protect all /dashboard routes
  if (pathname.startsWith('/dashboard')) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL('/login', req.url));
    }

    // Admin/Teacher only pages
    const adminTeacherPaths = ['/dashboard/apps', '/dashboard/students', '/dashboard/quiz/create'];
    if (adminTeacherPaths.some(p => pathname.startsWith(p))) {
      if (role !== 'ADMIN' && role !== 'TEACHER') {
        return NextResponse.redirect(new URL('/dashboard', req.url));
      }
    }
  }

  // Protect API routes (except auth)
  if (pathname.startsWith('/api') && !pathname.startsWith('/api/auth')) {
    if (!isLoggedIn) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/dashboard/:path*', '/api/:path*'],
};
