import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })
  const {
    data: { session },
  } = await supabase.auth.getSession()

  const { pathname } = req.nextUrl
  const isProtected = pathname.startsWith('/dashboard') || pathname.startsWith('/categories') || pathname.startsWith('/upload')
  const isAuthPath = pathname.startsWith('/auth')

  if (isProtected && !session) {
    const url = req.nextUrl.clone()
    url.pathname = '/auth/login'
    url.searchParams.set('redirectedFrom', pathname)
    return NextResponse.redirect(url)
  }

  if (isAuthPath && session) {
    const url = req.nextUrl.clone()
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  return res
}

export const config = {
  matcher: ['/((?!_next|api|static|images|favicon.ico).*)'],
}