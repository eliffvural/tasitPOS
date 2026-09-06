import { handleEpkPayoutWebhook } from "../../../../lib/server/epk-payout-webhook.mjs";

export const runtime = "nodejs";
export const POST = handleEpkPayoutWebhook;
