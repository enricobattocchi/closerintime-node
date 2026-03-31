import { timingSafeEqual } from "crypto";
import type { NextRequest } from "next/server";

export function isAuthorized(request: NextRequest): boolean {
  const auth = request.headers.get("authorization");
  if (!auth?.startsWith("Bearer ")) return false;
  const token = auth.slice(7);
  const expected = process.env.ADMIN_TOKEN;
  if (!expected || token.length !== expected.length) return false;
  return timingSafeEqual(Buffer.from(token), Buffer.from(expected));
}
