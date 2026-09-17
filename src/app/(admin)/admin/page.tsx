import Link from "next/link";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { createDbSession } from "@/lib/server/auth";
import { formatCurrency } from "@/lib/marketplace";
import { Users, Building2, CalendarCheck, TrendingUp, AlertCircle, ArrowRight, ShieldCheck, ReceiptText, FileText, Settings } from "lucide-react";

export default async function AdminDashboardPage() {
  const session = await createDbSession();
  const { data: { user } } = await session.auth.getUser();

  if (!user) redirect("/login?redirect=/admin");

  const { data: profile } = await session
    .from("users")
    .select("role,full_name")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") redirect("/dashboard");

  const [usersRes, venuesRes, servicesRes, bookingsRes, vendorProfilesRes] = await Promise.all([
    session.from("users").select("id,role,created_at", { count: "exact" }),
    session.from("venues").select("id,is_approved"),
    session.from("services").select("id,is_approved"),
    session.from("bookings").select("id,total_amount,platform_fee,status,created_at"),
    session.from("vendor_profiles").select("vendor_id,verification_status"),
  ]);

  const venues = venuesRes.data ?? [];
  const services = servicesRes.data ?? [];
  const bookings = bookingsRes.data ?? [];
  const allUsers = usersRes.data ?? [];
  const vendorProfiles = vendorProfilesRes.data ?? [];

  const pendingVenues = venues.filter((v) => !v.is_approved).length;
  const pendingServices = services.filter((s) => !s.is_approved).length;
  const pendingApprovals = pendingVenues + pendingServices;

  const vendorCount = allUsers.filter((u) => u.role === "vendor").length;
  const verifiedVendorIds = new Set(
    vendorProfiles.filter((p) => p.verification_status === "verified").map((p) => p.vendor_id)
  );
  const pendingVendorVerifications = vendorCount - verifiedVendorIds.size;

  const now = new Date();
  const monthlyBookings = bookings.filter((b) => {
    const c = new Date(b.created_at);
    return c.getUTCFullYear() === now.getUTCFullYear() && c.getUTCMonth() === now.getUTCMonth();
  });

  const grossVolume = bookings.reduce((sum, b) => sum + b.total_amount, 0);
  const platformRevenue = bookings
    .filter((b) => b.status === "completed")
    .reduce((sum, b) => sum + b.platform_fee, 0);

  const newUsersThisMonth = allUsers.filter((u) => {
    const c = new Date(u.created_at);
    return c.getUTCFullYear() === now.getUTCFullYear() && c.getUTCMonth() === now.getUTCMonth();
  }).length;

  const couples = allUsers.filter((u) => u.role === "couple").length;
  const vendors = allUsers.filter((u) => u.role === "vendor").length;

  return (
    <div className="space-y-6">
      {/* Hero */}
      <div className="grain relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#2c2825] to-[#3d3532] p-6 text-white shadow-warm-lg">
        <p className="text-xs font-semibold tracking-widest text-terracotta-400 uppercase">Admin Portal</p>
        <h1 className="mt-1 font-heading text-2xl font-light text-[#f5ebe0]">Platform Overview</h1>
        <p className="mt-1 text-sm text-[#a09080]">
          {allUsers.length} users · {venues.length + services.length} listings · {bookings.length} total bookings
        </p>
        {pendingApprovals > 0 && (
          <div className="mt-4 flex items-center gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-2.5 text-sm text-amber-300">
            <AlertCircle className="h-4 w-4 shrink-0" />
            {pendingApprovals} listing{pendingApprovals !== 1 ? "s" : ""} pending approval
            <Link href="/admin/listings" className="ml-auto flex items-center gap-1 text-amber-200 hover:text-white">
              Review <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        )}
        {pendingVendorVerifications > 0 && (
          <div className="mt-3 flex items-center gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-2.5 text-sm text-amber-300">
            <ShieldCheck className="h-4 w-4 shrink-0" />
            {pendingVendorVerifications} vendor{pendingVendorVerifications !== 1 ? "s" : ""} awaiting verification
            <Link href="/admin/vendors" className="ml-auto flex items-center gap-1 text-amber-200 hover:text-white">
              Review <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        )}
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Card className="shadow-warm-sm">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div className="text-[10px] font-semibold tracking-wider text-muted-foreground/60 uppercase">Total Users</div>
              <Users className="h-4 w-4 text-muted-foreground/30" />
            </div>
            <div className="mt-2 font-heading text-3xl font-semibold text-foreground">{allUsers.length}</div>
            <div className="mt-1 text-[10px] text-muted-foreground">
              {couples} couples · {vendors} vendors
            </div>
            <div className="mt-1 text-[10px] text-sage-600">+{newUsersThisMonth} this month</div>
          </CardContent>
        </Card>

        <Card className="shadow-warm-sm">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div className="text-[10px] font-semibold tracking-wider text-muted-foreground/60 uppercase">Listings</div>
              <Building2 className="h-4 w-4 text-muted-foreground/30" />
            </div>
            <div className="mt-2 font-heading text-3xl font-semibold text-foreground">{venues.length + services.length}</div>
            <div className="mt-1 text-[10px] text-muted-foreground">{venues.length} venues · {services.length} services</div>
            {pendingApprovals > 0 && (
              <div className="mt-1 text-[10px] text-amber-600">{pendingApprovals} pending review</div>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-warm-sm">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div className="text-[10px] font-semibold tracking-wider text-muted-foreground/60 uppercase">Bookings</div>
              <CalendarCheck className="h-4 w-4 text-muted-foreground/30" />
            </div>
            <div className="mt-2 font-heading text-3xl font-semibold text-foreground">{bookings.length}</div>
            <div className="mt-1 text-[10px] text-muted-foreground">{monthlyBookings.length} this month</div>
          </CardContent>
        </Card>

        <Card className="shadow-warm-sm">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div className="text-[10px] font-semibold tracking-wider text-muted-foreground/60 uppercase">GMV</div>
              <TrendingUp className="h-4 w-4 text-terracotta-300" />
            </div>
            <div className="mt-2 font-heading text-xl font-semibold text-foreground">{formatCurrency(grossVolume)}</div>
            <div className="mt-1 text-[10px] text-muted-foreground">{formatCurrency(platformRevenue)} platform revenue</div>
          </CardContent>
        </Card>
      </div>

      {/* Quick access */}
      <Card className="shadow-warm">
        <CardContent className="p-5">
          <h2 className="mb-4 font-heading text-base font-semibold text-foreground">Admin Tools</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            <Button asChild variant="outline" className="h-auto flex-col gap-2 rounded-xl border-border/40 py-4 hover:border-terracotta-200 hover:bg-terracotta-50">
              <Link href="/admin/listings">
                <ShieldCheck className="h-5 w-5 text-terracotta-500" />
                <span className="text-xs font-medium">
                  Listings
                  {pendingApprovals > 0 && <span className="ml-1 text-terracotta-500">({pendingApprovals})</span>}
                </span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-auto flex-col gap-2 rounded-xl border-border/40 py-4 hover:border-terracotta-200 hover:bg-terracotta-50">
              <Link href="/admin/bookings">
                <CalendarCheck className="h-5 w-5 text-sage-500" />
                <span className="text-xs font-medium">Bookings</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-auto flex-col gap-2 rounded-xl border-border/40 py-4 hover:border-terracotta-200 hover:bg-terracotta-50">
              <Link href="/admin/payments">
                <ReceiptText className="h-5 w-5 text-gold-500" />
                <span className="text-xs font-medium">Payments</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-auto flex-col gap-2 rounded-xl border-border/40 py-4 hover:border-terracotta-200 hover:bg-terracotta-50">
              <Link href="/admin/users">
                <Users className="h-5 w-5 text-blue-500" />
                <span className="text-xs font-medium">Users</span>
              </Link>
            </Button>
            <Button asChild variant="outline" className="h-auto flex-col gap-2 rounded-xl border-border/40 py-4 hover:border-terracotta-200 hover:bg-terracotta-50">
              <Link href="/admin/audit-log">
                <FileText className="h-5 w-5 text-muted-foreground" />
                <span className="text-xs font-medium">Audit Log</span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
