import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

function handleRootRedirect(request: NextRequest) {
  if (request.nextUrl.pathname === '/') {
    return NextResponse.redirect(new URL('/todos', request.url))
  }
}

function handleAuth(request: NextRequest) {
  const isAuthenticated = request.cookies.get('auth-token')?.value

  if (!isAuthenticated) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('from', request.nextUrl.pathname)

    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export function proxy(request: NextRequest) {
  return (
    handleRootRedirect(request) || handleAuth(request) || NextResponse.next()
  )
}

export const config = {
  matcher: ['/', '/todos/:path*'],
}
