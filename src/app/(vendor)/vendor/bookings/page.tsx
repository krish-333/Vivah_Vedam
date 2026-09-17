import { redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, getBookingsForVendor } from "@/lib/marketplace";
import { createDbSession } from "@/lib/server/auth";

type VendorBookingsPageProps = {
  searchParams: Promise<{ update?: string }>;
};

export default async function VendorBookingsPage({
  searchParams,
}: VendorBookingsPageProps) {
  const query = await searchParams;
  const session = await createDbSession();
  const {
    data: { user },
  } = await session.auth.getUser();

  if (!user) {
    redirect("/login?redirect=/vendor/bookings");
  }

  const bookings = await getBookingsForVendor(user.id);

  return (
    <div className="space-y-4">
      <h1 className="font-heading text-3xl font-bold">Bookings</h1>
      <p className="text-muted-foreground">
        Review incoming requests and manage confirmed bookings.
      </p>

      {query.update === "ok" ? (
        <p className="rounded-md border border-emerald-300 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
          Booking status updated.
        </p>
      ) : null}

      {bookings.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-sm text-muted-foreground">
            No booking requests yet.
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
                  <p>Date: {booking.bookingDate}</p>
                  <p>Total: {formatCurrency(booking.totalAmount)}</p>
                  <p>Vendor payout: {formatCurrency(booking.vendorPayout)}</p>
                  <p>
                    Payment: {booking.paymentReference ? "Paid (Mock)" : "Awaiting payment"}
                  </p>
                  {booking.paymentReference ? (
                    <p>Ref: {booking.paymentReference}</p>
                  ) : (
                    <p>Ref: -</p>
                  )}
                  {booking.notes ? <p className="md:col-span-2">Notes: {booking.notes}</p> : null}
                </div>

                <div className="flex flex-wrap gap-2">
                  <form action="/api/messages/conversation" method="POST">
                    <input type="hidden" name="targetUserId" value={booking.coupleId} />
                    <input type="hidden" name="asRole" value="vendor" />
                    <input type="hidden" name="returnTo" value="/vendor/messages" />
                    <Button type="submit" size="sm" variant="secondary">
                      Message couple
                    </Button>
                  </form>

                  {booking.status === "pending" ? (
                    <>
                      <form action="/api/bookings/status" method="POST">
                        <input type="hidden" name="bookingId" value={booking.id} />
                        <input type="hidden" name="action" value="confirm" />
                        <input type="hidden" name="returnTo" value="/vendor/bookings" />
                        <Button type="submit" size="sm">
                          Confirm
                        </Button>
                      </form>
                      <form action="/api/bookings/status" method="POST">
                        <input type="hidden" name="bookingId" value={booking.id} />
                        <input type="hidden" name="action" value="decline" />
                        <input type="hidden" name="returnTo" value="/vendor/bookings" />
                        <Button type="submit" size="sm" variant="outline">
                          Decline
                        </Button>
                      </form>
                    </>
                  ) : null}

                  {booking.status === "in_progress" ? (
                    <form action="/api/bookings/status" method="POST">
                      <input type="hidden" name="bookingId" value={booking.id} />
                      <input type="hidden" name="action" value="complete" />
                      <input type="hidden" name="returnTo" value="/vendor/bookings" />
                      <Button type="submit" size="sm" variant="secondary">
                        Mark Completed
                      </Button>
                    </form>
                  ) : null}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
