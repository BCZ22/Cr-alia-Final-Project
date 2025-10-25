import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  // `withAuth` augments your `Request` with the user's token.
  function middleware(req) {
    // console.log("token: ", req.nextauth.token)
    // You can add logic here to perform role-based access control
    // For example, redirect admins to a specific dashboard
    if (req.nextUrl.pathname.startsWith("/admin") && req.nextauth.token?.role !== "ADMIN") {
        return new NextResponse("You are not authorized!");
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: "/auth/signin",
    },
  }
)


// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    /*
     * Match all routes that require authentication.
     * This includes all dashboard pages, studio pages,
     * and protected API routes.
     */
    '/dashboard/:path*',
    '/studio/:path*',
    '/account/:path*',
    
    // API routes to protect
    '/api/studio/:path*',
    '/api/analytics/:path*',
    '/api/account/:path*',
    '/api/checkout/:path*', // Protect checkout creation
    '/api/ai/history',
  ],
};

