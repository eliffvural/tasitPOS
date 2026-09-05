import { handleEpkWebhook } from "../../../lib/server/epk-webhook.mjs";

export const runtime = "nodejs";

export async function POST(request) {
  return handleEpkWebhook(request);
}
