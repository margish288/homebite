import { withAuth } from "next-auth/middleware"

export default withAuth(
  function middleware(req) {
    // Add any additional middleware logic here
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl

        // Protect cook routes
        if (pathname.startsWith('/cook/dashboard') || 
            pathname.startsWith('/cook/profile') ||
            pathname.startsWith('/cook/orders') ||
            pathname.startsWith('/cook/menu') ||
            pathname.startsWith('/cook/analytics')) {
          return token?.role === 'cook'
        }

        // Protect user profile routes
        if (pathname.startsWith('/profile') || 
            pathname.startsWith('/orders')) {
          return token?.role === 'user'
        }

        // Allow access to auth pages and public routes
        return true
      },
    },
  }
)

export const config = {
  matcher: [
    '/cook/dashboard/:path*',
    '/cook/profile/:path*', 
    '/cook/orders/:path*',
    '/cook/menu/:path*',
    '/cook/analytics/:path*',
    '/profile/:path*',
    '/orders/:path*'
  ]
}
