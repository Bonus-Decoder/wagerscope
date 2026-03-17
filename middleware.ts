import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const PROTECTED_PATHS = ["/wallet", "/referral", "/admin"];

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "dev-secret-change-me"
);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only protect specific routes
  const isProtected = PROTECTED_PATHS.some((path) =>
    pathname.startsWith(path)
  );

  if (!isProtected) return NextResponse.next();

  const token = request.cookies.get("token")?.value;

  if (!token) {
    const url = new URL("/", request.url);
    url.searchParams.set("login", "true");
    return NextResponse.redirect(url);
  }

  try {
    await jwtVerify(token, JWT_SECRET);
    return NextResponse.next();
  } catch {
    const url = new URL("/", request.url);
    url.searchParams.set("login", "true");
    return NextResponse.redirect(url);
  }
}

export const config = {
  matcher: ["/wallet/:path*", "/referral/:path*", "/admin/:path*"],
};
