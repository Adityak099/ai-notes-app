import { NextResponse } from 'next/server';
import { verifyToken } from './lib/auth';

// Protected routes
const protectedRoutes = ['/dashboard', '/api/notes'];
const publicRoutes = ['/login', '/signup', '/'];

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  
  // Get token from cookies
  const token = request.cookies.get('token')?.value;
  
  // Check if route is protected
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  );
  
  const isPublicRoute = publicRoutes.some(route => 
    pathname === route || pathname.startsWith('/api/auth')
  );
  
  // Redirect to login if accessing protected route without token
  if (isProtectedRoute && !token) {
    const url = new URL('/login', request.url);
    return NextResponse.redirect(url);
  }
  
  // Redirect to dashboard if accessing login/signup with valid token
  if (isPublicRoute && token && pathname !== '/') {
    const isValid = await verifyToken(token);
    if (isValid) {
      const url = new URL('/dashboard', request.url);
      return NextResponse.redirect(url);
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/login', '/signup', '/api/notes/:path*'],
}