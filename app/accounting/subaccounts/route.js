import { DELETE as deleteSubaccount, GET as getSubaccounts, POST as postSubaccount } from "../../api/accounting/subaccounts/route.js";

export const runtime = "nodejs";
export const GET = getSubaccounts;
export const POST = postSubaccount;
export const DELETE = deleteSubaccount;
