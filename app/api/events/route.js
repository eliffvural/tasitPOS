import { authenticateBearer } from "../../../lib/server/auth.mjs";
import { subscribePaymentEvents } from "../../../lib/server/payment-events.mjs";

export const runtime = "nodejs";

export async function GET(request) {
  const principal = authenticateBearer(request.headers.get("authorization") || "");
  if (!principal) return Response.json({ success: false, error_code: "ERR_UNAUTHORIZED", message: "Geçerli Bearer erişim belirteci zorunludur." }, { status: 401 });

  const encoder = new TextEncoder();
  let unsubscribe = () => {};
  let heartbeat;
  const stream = new ReadableStream({
    start(controller) {
      controller.enqueue(encoder.encode(`event: connected\ndata: {"success":true}\n\n`));
      unsubscribe = subscribePaymentEvents(principal.galleryId, (event) => {
        controller.enqueue(encoder.encode(`event: payment\ndata: ${JSON.stringify(event)}\n\n`));
      });
      heartbeat = setInterval(() => controller.enqueue(encoder.encode(": heartbeat\n\n")), 20000);
    },
    cancel() { unsubscribe(); clearInterval(heartbeat); },
  });
  request.signal.addEventListener("abort", () => { unsubscribe(); clearInterval(heartbeat); }, { once: true });
  return new Response(stream, { headers: { "Content-Type": "text/event-stream", "Cache-Control": "no-cache, no-transform", Connection: "keep-alive" } });
}
