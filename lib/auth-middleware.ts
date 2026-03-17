import { NextRequest } from "next/server";
import { verifySession } from "@/lib/auth";

export async function getUser(request: NextRequest) {
  // Try cookie first, then Authorization header
  const cookieToken = request.cookies.get("token")?.value;
  const authHeader = request.headers.get("authorization");
  const headerToken = authHeader?.startsWith("Bearer ")
    ? authHeader.slice(7)
    : null;

  const token = cookieToken || headerToken;
  if (!token) return null;

  return verifySession(token);
}
