import { redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, getBookingsForAdmin } from "@/lib/marketplace";
import { createDbSession } from "@/lib/server/auth";

type AdminBookingsPageProps = {
  searchParams: Promise<{ update?: string }>;
};

export default async function AdminBookingsPage({ searchParams }: AdminBookingsPageProps) {
  const query = await searchParams;
  const session = await createDbSession();
  const {
    data: { user },
  } = await session.auth.getUser();

  if (!user) {
    redirect("/login?redirect=/admin/bookings");
  }

  const { data: profile } = await session
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    redirect("/dashboard");
  }

  const bookings = await getBookingsForAdmin();

  return (
    <div className="space-y-4">
      <h1 className="font-heading text-3xl font-bold">Bookings</h1>
      <p className="text-muted-foreground">
        Review platform bookings and handle disputes when needed.
      </p>

      {query.update === "ok" ? (
        <p className="rounded-md border border-emerald-300 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
          Admin booking update applied.
        </p>
      ) : null}

      {bookings.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-sm text-muted-foreground">
            No bookings found.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {bookings.map((booking) => (
            <Card key={booking.id}>
              <CardHeader className="pb-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <CardTitle className="text-xl">
                    {booking.venueName ?? booking.serviceTitle ?? "Booking"}
                  </CardTitle>
                  <Badge variant="outline" className="capitalize">
                    {booking.status.replace("_", " ")}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-2 text-sm text-muted-foreground md:grid-cols-2">
                  <p>Couple: {booking.coupleName}</p>
                  <p>Vendor: {booking.vendorName}</p>
                  <p>Date: {booking.bookingDate}</p>
                  <p>Total: {formatCurrency(booking.totalAmount)}</p>
                  <p>Vendor payout: {formatCurrency(booking.vendorPayout)}</p>
                  <p>
                    Payment: {booking.paymentReference ? "Paid (Mock)" : "Awaiting payment"}
                  </p>
                  {booking.paymentReference ? (
                    <p className="md:col-span-2">Ref: {booking.paymentReference}</p>
                  ) : null}
                </div>

                <div className="flex flex-wrap gap-2">
                  <form action="/api/bookings/status" method="POST">
                    <input type="hidden" name="bookingId" value={booking.id} />
                    <input type="hidden" name="action" value="admin_confirm" />
                    <input type="hidden" name="returnTo" value="/admin/bookings" />
                    <Button type="submit" size="sm" variant="outline">
                      Force Confirm
                    </Button>
                  </form>
                  <form action="/api/bookings/status" method="POST">
                    <input type="hidden" name="bookingId" value={booking.id} />
                    <input type="hidden" name="action" value="admin_cancel" />
                    <input type="hidden" name="returnTo" value="/admin/bookings" />
                    <Button type="submit" size="sm" variant="outline">
                      Force Cancel
                    </Button>
                  </form>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
