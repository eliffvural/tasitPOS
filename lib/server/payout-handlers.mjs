import { authenticateBearer } from "./auth.mjs";
import { getPayoutSummary, getPayoutTransactions } from "./payout-report.mjs";

function unauthorized() {
  return Response.json({ success: false, error_code: "ERR_UNAUTHORIZED", message: "Geçerli bir Bearer token gereklidir." }, { status: 401 });
}

export async function payoutSummaryHandler(request) {
  const principal = authenticateBearer(request.headers.get("authorization") || "");
  if (!principal) return unauthorized();
  return Response.json({ success: true, data: await getPayoutSummary(principal.galleryId) });
}

export async function payoutTransactionsHandler(request) {
  const principal = authenticateBearer(request.headers.get("authorization") || "");
  if (!principal) return unauthorized();
  const url = new URL(request.url);
  const report = await getPayoutTransactions(principal.galleryId, url.searchParams.get("page"), url.searchParams.get("limit"));
  return Response.json({ success: true, ...report });
}
