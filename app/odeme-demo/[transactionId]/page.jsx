import { DemoPaymentClient } from "./payment-client";

export default async function DemoPaymentPage({ params }) {
  const { transactionId } = await params;
  return <DemoPaymentClient transactionId={transactionId} />;
}
