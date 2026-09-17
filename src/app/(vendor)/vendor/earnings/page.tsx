import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createDbSession } from "@/lib/server/auth";
import { formatCurrency } from "@/lib/marketplace";

export default async function VendorEarningsPage() {
  const session = await createDbSession();
  const {
    data: { user },
  } = await session.auth.getUser();

  if (!user) {
    redirect("/login?redirect=/vendor/earnings");
  }

  const { data: bookings } = await session
    .from("bookings")
    .select("id,status,total_amount,platform_fee,vendor_payout,created_at")
    .eq("vendor_id", user.id)
    .order("created_at", { ascending: false })
    .limit(200);

  const rows = bookings ?? [];
  const paidOut = rows
    .filter((row) => row.status === "completed")
    .reduce((sum, row) => sum + row.vendor_payout, 0);
  const pending = rows
    .filter((row) => ["confirmed", "in_progress"].includes(row.status))
    .reduce((sum, row) => sum + row.vendor_payout, 0);

  return (
    <div className="space-y-4">
      <h1 className="font-heading text-3xl font-bold">Earnings</h1>
      <p className="text-muted-foreground">
        Track payout history, pending payouts, and fee breakdowns.
      </p>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Paid Out</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">{formatCurrency(paidOut)}</CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Pending Payouts</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">{formatCurrency(pending)}</CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Payout Breakdown</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {rows.map((row) => (
            <div key={row.id} className="rounded-md border p-3 text-sm">
              <p className="font-medium">Booking {row.id.slice(0, 8)}</p>
              <p className="text-muted-foreground">
                Status: {row.status} | Gross: {formatCurrency(row.total_amount)} | Fee: {formatCurrency(row.platform_fee)}
              </p>
              <p className="text-xs text-muted-foreground">
                Vendor payout: {formatCurrency(row.vendor_payout)}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
