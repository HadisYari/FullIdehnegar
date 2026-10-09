import { NextRequest, NextResponse } from "next/server";

const PUBLIC_FILE = /\.[^/]+$/;

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // The MVC admin is mounted at /Admin on the backend. Normalize old lowercase
  // links once, then allow the Next rewrite to proxy them to the same host.
  if (pathname === "/admin/login") {
    return NextResponse.redirect(new URL("/Admin/Authentication/Login", request.url), 308);
  }
  if (pathname === "/admin/messages") {
    return NextResponse.redirect(new URL("/Admin/Contacts", request.url), 308);
  }
  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    const normalizedUrl = request.nextUrl.clone();
    normalizedUrl.pathname = `/Admin${pathname.slice("/admin".length)}`;
    return NextResponse.redirect(normalizedUrl, 308);
  }

  // Skip backend-mounted admin pages, Panel assets, uploaded media, Next files,
  // and API routes from locale rewriting. next.config proxies backend paths.
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/Admin") ||
    pathname.startsWith("/Panel") ||
    pathname.startsWith("/images") ||
    pathname.startsWith("/uploads") ||
    pathname === "/favicon.ico" ||
    pathname === "/robots.txt" ||
    pathname === "/sitemap.xml" ||
    PUBLIC_FILE.test(pathname)
  ) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/en")) return NextResponse.next();

  // Persian remains the default locale without a visible URL prefix.
  const url = request.nextUrl.clone();
  url.pathname = `/fa${pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image).*)"],
};
