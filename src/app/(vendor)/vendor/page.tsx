import Link from "next/link";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createDbSession } from "@/lib/server/auth";
import { formatCurrency } from "@/lib/marketplace";
import { LayoutGrid, CalendarCheck, IndianRupee, MessageSquare, Plus, ArrowRight, TrendingUp, Clock } from "lucide-react";

export default async function VendorDashboardPage() {
  const session = await createDbSession();
  const {
    data: { user },
  } = await session.auth.getUser();

  if (!user) redirect("/login?redirect=/vendor");

  const { data: profile } = await session
    .from("users")
    .select("full_name")
    .eq("id", user.id)
    .single();

  const [bookingsRes, conversationsRes, messagesRes, venuesRes, servicesRes] = await Promise.all([
    session.from("bookings").select("id,status,vendor_payout,booking_date").eq("vendor_id", user.id),
    session.from("conversations").select("id").eq("vendor_id", user.id),
    session.from("messages").select("id,conversation_id,sender_id,read_at"),
    session.from("venues").select("id,name,is_active").eq("vendor_id", user.id),
    session.from("services").select("id,title,is_active").eq("vendor_id", user.id),
  ]);

  const bookings = bookingsRes.data ?? [];
  const totalEarnings = bookings
    .filter((b) => b.status === "completed")
    .reduce((sum, b) => sum + b.vendor_payout, 0);
  const pendingEarnings = bookings
    .filter((b) => ["confirmed", "in_progress"].includes(b.status))
    .reduce((sum, b) => sum + b.vendor_payout, 0);
  const activeBookings = bookings.filter((b) => ["pending", "confirmed", "in_progress"].includes(b.status));

  const conversationIds = new Set((conversationsRes.data ?? []).map((c) => c.id));
  const unreadMessages = (messagesRes.data ?? []).filter(
    (m) => conversationIds.has(m.conversation_id) && m.sender_id !== user.id && !m.read_at
  );

  const totalListings = (venuesRes.data?.length ?? 0) + (servicesRes.data?.length ?? 0);
  const firstName = profile?.full_name?.split(" ")[0] ?? "there";

  // Upcoming bookings in the next 60 days
  const today = new Date();
  const upcoming = activeBookings
    .filter((b) => {
      const d = new Date(b.booking_date);
      const diff = (d.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);
      return diff >= 0 && diff <= 60;
    })
    .sort((a, b) => new Date(a.booking_date).getTime() - new Date(b.booking_date).getTime())
    .slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="grain relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#2c2825] to-[#3d3532] p-6 text-white shadow-warm-lg">
        <div className="flex flex-col gap-1 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-xs font-semibold tracking-widest text-terracotta-400 uppercase">Vendor Hub</p>
            <h1 className="mt-1 font-heading text-2xl font-light text-[#f5ebe0]">
              Welcome back, {firstName}
            </h1>
            <p className="mt-1 text-sm text-[#a09080]">
              {totalListings} active listing{totalListings !== 1 ? "s" : ""} ·{" "}
              {activeBookings.length} pending booking{activeBookings.length !== 1 ? "s" : ""}
            </p>
          </div>
          <Button asChild className="mt-4 shrink-0 rounded-full bg-terracotta-500 text-white hover:bg-terracotta-600 md:mt-0">
            <Link href="/vendor/listings/new">
              <Plus className="mr-2 h-4 w-4" />
              New listing
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Card className="shadow-warm-sm">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div className="text-xs font-semibold tracking-wider text-muted-foreground/70 uppercase">Listings</div>
              <LayoutGrid className="h-4 w-4 text-muted-foreground/40" />
            </div>
            <div className="mt-2 font-heading text-3xl font-semibold text-foreground">{totalListings}</div>
            <Link href="/vendor/listings" className="mt-2 flex items-center gap-1 text-xs font-medium text-terracotta-500 hover:text-terracotta-700">
              Manage <ArrowRight className="h-3 w-3" />
            </Link>
          </CardContent>
        </Card>

        <Card className="shadow-warm-sm">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div className="text-xs font-semibold tracking-wider text-muted-foreground/70 uppercase">Active Bookings</div>
              <CalendarCheck className="h-4 w-4 text-muted-foreground/40" />
            </div>
            <div className="mt-2 font-heading text-3xl font-semibold text-foreground">{activeBookings.length}</div>
            <Link href="/vendor/bookings" className="mt-2 flex items-center gap-1 text-xs font-medium text-terracotta-500 hover:text-terracotta-700">
              Review <ArrowRight className="h-3 w-3" />
            </Link>
          </CardContent>
        </Card>

        <Card className="shadow-warm-sm">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div className="text-xs font-semibold tracking-wider text-muted-foreground/70 uppercase">Earned</div>
              <IndianRupee className="h-4 w-4 text-muted-foreground/40" />
            </div>
            <div className="mt-2 font-heading text-2xl font-semibold text-foreground">{formatCurrency(totalEarnings)}</div>
            <div className="mt-1 text-xs text-muted-foreground">{formatCurrency(pendingEarnings)} pending</div>
          </CardContent>
        </Card>

        <Card className="shadow-warm-sm">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div className="text-xs font-semibold tracking-wider text-muted-foreground/70 uppercase">Messages</div>
              <MessageSquare className="h-4 w-4 text-muted-foreground/40" />
            </div>
            <div className="mt-2 font-heading text-3xl font-semibold text-foreground">{unreadMessages.length}</div>
            <Link href="/vendor/messages" className="mt-2 flex items-center gap-1 text-xs font-medium text-terracotta-500 hover:text-terracotta-700">
              Open inbox <ArrowRight className="h-3 w-3" />
            </Link>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Upcoming bookings */}
        <div className="lg:col-span-2">
          <Card className="shadow-warm h-full">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="font-heading text-lg font-semibold">Upcoming Bookings</CardTitle>
                <Link href="/vendor/bookings" className="flex items-center gap-1 text-xs font-medium text-terracotta-500 hover:text-terracotta-700">
                  All bookings <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {upcoming.length === 0 ? (
                <div className="py-8 text-center">
                  <Clock className="mx-auto h-8 w-8 text-muted-foreground/30" />
                  <p className="mt-3 text-sm text-muted-foreground">No bookings in the next 60 days.</p>
                  <Button asChild size="sm" className="mt-4 rounded-full bg-terracotta-500 text-white hover:bg-terracotta-600">
                    <Link href="/vendor/listings/new">
                      <Plus className="mr-2 h-3.5 w-3.5" />
                      Create a listing
                    </Link>
                  </Button>
                </div>
              ) : (
                upcoming.map((booking) => (
                  <div key={booking.id} className="flex items-center gap-3 rounded-xl border border-border/30 bg-muted/20 px-4 py-3">
                    <div className="flex h-10 w-10 shrink-0 flex-col items-center justify-center rounded-lg bg-terracotta-50 text-center">
                      <div className="text-xs font-semibold leading-none text-terracotta-600">
                        {new Date(booking.booking_date).toLocaleDateString("en-IN", { day: "numeric" })}
                      </div>
                      <div className="mt-0.5 text-[9px] font-medium uppercase tracking-wider text-terracotta-400">
                        {new Date(booking.booking_date).toLocaleDateString("en-IN", { month: "short" })}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-foreground capitalize">{booking.status}</div>
                      <div className="text-xs text-muted-foreground">{formatCurrency(booking.vendor_payout)} payout</div>
                    </div>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize ${
                      booking.status === "confirmed" ? "bg-sage-50 text-sage-700" :
                      booking.status === "pending" ? "bg-amber-50 text-amber-700" :
                      "bg-blue-50 text-blue-700"
                    }`}>
                      {booking.status}
                    </span>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick actions */}
        <div>
          <Card className="shadow-warm">
            <CardHeader className="pb-3">
              <CardTitle className="font-heading text-lg font-semibold">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button asChild className="w-full justify-start rounded-xl bg-terracotta-50 text-terracotta-700 hover:bg-terracotta-100" variant="ghost">
                <Link href="/vendor/listings/new">
                  <Plus className="mr-2 h-4 w-4" /> Create listing
                </Link>
              </Button>
              <Button asChild className="w-full justify-start rounded-xl" variant="ghost">
                <Link href="/vendor/bookings">
                  <CalendarCheck className="mr-2 h-4 w-4" /> Review bookings
                </Link>
              </Button>
              <Button asChild className="w-full justify-start rounded-xl" variant="ghost">
                <Link href="/vendor/messages">
                  <MessageSquare className="mr-2 h-4 w-4" /> Open messages
                </Link>
              </Button>
              <Button asChild className="w-full justify-start rounded-xl" variant="ghost">
                <Link href="/vendor/earnings">
                  <TrendingUp className="mr-2 h-4 w-4" /> View earnings
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Pending payout nudge */}
          {pendingEarnings > 0 && (
            <div className="mt-4 rounded-xl border border-sage-200 bg-sage-50 p-4">
              <div className="flex items-center gap-2">
                <IndianRupee className="h-4 w-4 text-sage-600" />
                <div className="text-sm font-semibold text-sage-800">Pending payout</div>
              </div>
              <div className="mt-1 font-heading text-xl font-semibold text-sage-700">
                {formatCurrency(pendingEarnings)}
              </div>
              <p className="mt-1 text-xs text-sage-600">
                Released after service delivery confirmation.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
