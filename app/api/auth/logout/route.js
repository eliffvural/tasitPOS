import { expiredSessionCookie } from "../../../../lib/server/session.mjs";

export const runtime = "nodejs";

export async function POST() {
  return Response.json({ success: true }, { headers: { "Set-Cookie": expiredSessionCookie(), "Cache-Control": "no-store" } });
}
