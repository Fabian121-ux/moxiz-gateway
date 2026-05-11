import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import crypto from 'node:crypto';

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  // 1. Handle API Key Authentication for /api/v1 routes
  if (request.nextUrl.pathname.startsWith('/api/v1')) {
    const authHeader = request.headers.get('Authorization');
    if (authHeader?.startsWith('Bearer sk_')) {
      const apiKey = authHeader.split(' ')[1];
      const hashedKey = crypto.createHash('sha256').update(apiKey).digest('hex');

      // Note: We use a service role/admin client in the route handler usually, 
      // but here we just check if it's a valid key structure and potentially verify if we had a lightweight way.
      // For now, we'll let the route handlers do the heavy lifting of DB verification to keep middleware fast,
      // OR we can do a quick check here.
      
      // Let's keep it simple: Route handlers already handle verification.
      // But we can add a check for the header format.
    }
  }

  const { data: { user } } = await supabase.auth.getUser()

  // Protect dashboard routes
  if (request.nextUrl.pathname.startsWith('/dashboard') && !user) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Redirect to dashboard if logged in and trying to access login
  if (request.nextUrl.pathname === '/login' && user) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}

