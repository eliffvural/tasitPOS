export function GET() {
  const epkRate = Number(process.env.EPK_COMMISSION_RATE || 0.249);
  const platformRate = Number(process.env.PLATFORM_COMMISSION_RATE || 0.012);
  return Response.json({
    success: true,
    data: {
      epk_rate: epkRate,
      platform_rate: platformRate,
      total_rate: epkRate + platformRate,
      calculation_mode: process.env.GROSS_CALCULATION_MODE || "DIRECT_MARKUP",
    },
  });
}

