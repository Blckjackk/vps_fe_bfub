import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Get session data from cookies
  const sessionToken = request.cookies.get('session_token')?.value;
  const userRole = request.cookies.get('user_role')?.value;
  
  // Routes that require authentication
  const protectedRoutes = ['/dashboard-admin', '/dashboard-peserta', '/cbt'];
  const adminOnlyRoutes = ['/dashboard-admin'];
  const pesertaOnlyRoutes = ['/dashboard-peserta', '/cbt'];
  
  // Check if the current path is protected
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  const isAdminRoute = adminOnlyRoutes.some(route => pathname.startsWith(route));
  const isPesertaRoute = pesertaOnlyRoutes.some(route => pathname.startsWith(route));
  
  // Redirect to home if accessing protected route without session
  if (isProtectedRoute && (!sessionToken || !userRole)) {
    return NextResponse.redirect(new URL('/', request.url));
  }
  
  // Role-based access control - only if user is authenticated
  if (sessionToken && userRole) {
    // Admin trying to access peserta routes
    if (userRole === 'admin' && isPesertaRoute && !isAdminRoute) {
      return NextResponse.redirect(new URL('/dashboard-admin', request.url));
    }
    
    // Peserta trying to access admin routes
    if (userRole === 'peserta' && isAdminRoute) {
      return NextResponse.redirect(new URL('/dashboard-peserta', request.url));
    }
    
    // Redirect logged-in users away from auth pages
    if (pathname === '/login' || pathname === '/register') {
      const dashboardUrl = userRole === 'admin' ? '/dashboard-admin' : '/dashboard-peserta';
      return NextResponse.redirect(new URL(dashboardUrl, request.url));
    }
  }
  
  return NextResponse.next();
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images (public images)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|images).*)',
  ],
};
