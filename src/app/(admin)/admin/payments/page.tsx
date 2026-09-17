import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createDbSession } from "@/lib/server/auth";
import { formatCurrency } from "@/lib/marketplace";

export default async function AdminPaymentsPage() {
  const session = await createDbSession();
  const {
    data: { user },
  } = await session.auth.getUser();

  if (!user) {
    redirect("/login?redirect=/admin/payments");
  }

  const { data: profile } = await session
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    redirect("/dashboard");
  }

  const { data: bookings } = await session
    .from("bookings")
    .select("id,status,total_amount,platform_fee,vendor_payout,stripe_payment_intent_id,created_at")
    .order("created_at", { ascending: false })
    .limit(200);

  const rows = bookings ?? [];
  const totalVolume = rows.reduce((sum, row) => sum + row.total_amount, 0);
  const totalFees = rows.reduce((sum, row) => sum + row.platform_fee, 0);
  const totalPayout = rows.reduce((sum, row) => sum + row.vendor_payout, 0);

  return (
    <div className="space-y-4">
      <h1 className="font-heading text-3xl font-bold">Payments</h1>
      <p className="text-muted-foreground">
        Monitor commissions, payouts, and Stripe payment activity.
      </p>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Gross Volume</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">{formatCurrency(totalVolume)}</CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Platform Fees</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">{formatCurrency(totalFees)}</CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Vendor Payouts</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">{formatCurrency(totalPayout)}</CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Payment Events</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {rows.map((row) => (
            <div key={row.id} className="rounded-md border p-3 text-sm">
              <p className="font-medium">Booking {row.id.slice(0, 8)}</p>
              <p className="text-muted-foreground">
                Status: {row.status} | Total: {formatCurrency(row.total_amount)} | Fee: {formatCurrency(row.platform_fee)}
              </p>
              <p className="text-xs text-muted-foreground">
                Payment ref: {row.stripe_payment_intent_id ?? "-"}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
