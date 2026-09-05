import { monthlyReportGetHandler, monthlyReportPostHandler } from "../../../../lib/server/accounting-handlers.mjs";

export const runtime = "nodejs";
export const GET = monthlyReportGetHandler;
export const POST = monthlyReportPostHandler;
