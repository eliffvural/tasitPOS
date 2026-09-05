const allowedFields = new Set(["gallery_id", "transaction_id", "status", "provider_code", "operation_type", "refund_type", "document_provider"]);

export function writeSecurityAudit(event, context = {}) {
  const safe = Object.fromEntries(Object.entries(context).filter(([key]) => allowedFields.has(key)));
  console.info(JSON.stringify({ kind: "SECURITY_AUDIT", event, occurred_at: new Date().toISOString(), ...safe }));
}
