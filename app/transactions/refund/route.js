import { POST as handlePost } from "../../api/transactions/refund/route.js";

export const runtime = "nodejs";

export async function POST(request) {
  return handlePost(request);
}
