import { redirect } from "next/navigation";
import { CheckCircle2, Clock, Calendar, IndianRupee, MessageCircle, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { createDbSession } from "@/lib/server/auth";
import { formatCurrency, getBookingsForCouple } from "@/lib/marketplace";

type CoupleBookingsPageProps = {
  searchParams: Promise<{ update?: string }>;
};

const statusConfig: Record<string, { color: string; label: string; dot: string }> = {
  pending:    { color: "border-amber-200 bg-amber-50 text-amber-700", label: "Pending", dot: "bg-amber-400" },
  confirmed:  { color: "border-sage-200 bg-sage-50 text-sage-700", label: "Confirmed", dot: "bg-sage-500" },
  in_progress:{ color: "border-blue-200 bg-blue-50 text-blue-700", label: "In Progress", dot: "bg-blue-400" },
  completed:  { color: "border-border/40 bg-muted/30 text-muted-foreground", label: "Completed", dot: "bg-muted-foreground/40" },
  cancelled:  { color: "border-red-200 bg-red-50 text-red-600", label: "Cancelled", dot: "bg-red-400" },
};

export default async function CoupleBookingsPage({ searchParams }: CoupleBookingsPageProps) {
  const query = await searchParams;
  const session = await createDbSession();
  const { data: { user } } = await session.auth.getUser();

  if (!user) redirect("/login?redirect=/dashboard/bookings");

  const bookings = await getBookingsForCouple(user.id);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold tracking-widest text-terracotta-500 uppercase">Planning</p>
        <h1 className="mt-1 font-heading text-2xl font-light text-foreground">My Bookings</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Venue and service requests, confirmations, and history.
        </p>
      </div>

      {query.update === "ok" && (
        <div className="flex items-center gap-3 rounded-xl border border-sage-200 bg-sage-50 px-4 py-3 text-sm text-sage-700">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-sage-500" />
          Booking updated successfully.
        </div>
      )}
      {query.update === "paid" && (
        <div className="flex items-center gap-3 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-700">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-blue-500" />
          Payment confirmed. Booking is now in progress!
        </div>
      )}

      {bookings.length === 0 ? (
        <Card className="shadow-warm">
          <CardContent className="py-12 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted text-muted-foreground/40">
              <Calendar className="h-6 w-6" />
            </div>
            <p className="text-sm text-muted-foreground">No bookings yet.</p>
            <p className="mt-1 text-xs text-muted-foreground">Start by browsing venues or services.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => {
            const sc = statusConfig[booking.status] ?? statusConfig.pending;
            return (
              <Card key={booking.id} className="shadow-warm-sm overflow-hidden">
                <CardContent className="p-0">
                  {/* Header row */}
                  <div className="flex items-start justify-between gap-3 border-b border-border/40 p-5">
                    <div>
                      <h3 className="font-heading text-base font-semibold text-foreground">
                        {booking.venueName ?? booking.serviceTitle ?? "Booking"}
                      </h3>
                      <p className="mt-0.5 text-xs text-muted-foreground">Vendor: {booking.vendorName}</p>
                    </div>
                    <span className={`shrink-0 flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-semibold ${sc.color}`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${sc.dot}`} />
                      {sc.label}
                    </span>
                  </div>

                  {/* Details */}
                  <div className="grid grid-cols-2 gap-x-4 gap-y-3 p-5 sm:grid-cols-3">
                    <div>
                      <div className="flex items-center gap-1 text-[10px] font-semibold tracking-wider text-muted-foreground/60 uppercase">
                        <Calendar className="h-3 w-3" /> Date
                      </div>
                      <div className="mt-1 text-sm font-medium text-foreground">
                        {new Date(booking.bookingDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center gap-1 text-[10px] font-semibold tracking-wider text-muted-foreground/60 uppercase">
                        <IndianRupee className="h-3 w-3" /> Total
                      </div>
                      <div className="mt-1 text-sm font-medium text-foreground">{formatCurrency(booking.totalAmount)}</div>
                    </div>
                    <div>
                      <div className="text-[10px] font-semibold tracking-wider text-muted-foreground/60 uppercase">Payment</div>
                      <div className="mt-1 text-sm font-medium text-foreground">
                        {booking.paymentReference ? "Paid" : "Pending"}
                      </div>
                    </div>
                    {booking.notes && (
                      <div className="col-span-2 sm:col-span-3">
                        <div className="text-[10px] font-semibold tracking-wider text-muted-foreground/60 uppercase">Notes</div>
                        <div className="mt-1 text-xs text-muted-foreground">{booking.notes}</div>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  {(booking.status === "pending" || booking.status === "confirmed" || booking.status === "in_progress" || booking.status === "completed") && (
                    <div className="flex flex-wrap gap-2 border-t border-border/30 px-5 py-3">
                      {booking.status === "confirmed" && !booking.paymentReference && (
                        <form action="/api/bookings/status" method="POST">
                          <input type="hidden" name="bookingId" value={booking.id} />
                          <input type="hidden" name="action" value="pay" />
                          <input type="hidden" name="returnTo" value="/dashboard/bookings?update=paid" />
                          <Button type="submit" size="sm" className="h-7 rounded-full bg-terracotta-500 px-3 text-xs text-white hover:bg-terracotta-600">
                            Pay Deposit
                          </Button>
                        </form>
                      )}

                      {(booking.status === "pending" || booking.status === "confirmed" || booking.status === "in_progress" || booking.status === "completed") && (
                        <form action="/api/messages/conversation" method="POST">
                          <input type="hidden" name="targetUserId" value={booking.vendorId} />
                          <input type="hidden" name="asRole" value="couple" />
                          <input type="hidden" name="returnTo" value="/dashboard/messages" />
                          <Button type="submit" size="sm" variant="outline" className="h-7 rounded-full px-3 text-xs">
                            <MessageCircle className="mr-1.5 h-3 w-3" />
                            Message vendor
                          </Button>
                        </form>
                      )}

                      {(booking.status === "pending" || booking.status === "confirmed") && (
                        <form action="/api/bookings/status" method="POST">
                          <input type="hidden" name="bookingId" value={booking.id} />
                          <input type="hidden" name="action" value="cancel" />
                          <input type="hidden" name="returnTo" value="/dashboard/bookings?update=ok" />
                          <Button type="submit" size="sm" variant="ghost" className="h-7 rounded-full px-3 text-xs text-muted-foreground hover:text-destructive">
                            <X className="mr-1 h-3 w-3" />
                            Cancel
                          </Button>
                        </form>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
