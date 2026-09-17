import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createDbSession } from "@/lib/server/auth";
import { getSignedDownloadUrl, isS3Configured } from "@/lib/s3";
import { formatCurrency } from "@/lib/marketplace";

type PageProps = {
  params: Promise<{ vendorId: string }>;
  searchParams: Promise<{ admin?: string }>;
};

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default async function AdminVendorDetailPage({ params, searchParams }: PageProps) {
  const { vendorId } = await params;
  const query = await searchParams;
  const session = await createDbSession();
  const {
    data: { user },
  } = await session.auth.getUser();

  if (!user) redirect(`/login?redirect=/admin/vendors/${vendorId}`);

  const { data: adminProfile } = await session.from("users").select("role").eq("id", user.id).single();
  if (adminProfile?.role !== "admin") redirect("/dashboard");

  const { data: vendor } = await session
    .from("users")
    .select("id,email,full_name,phone,created_at,role")
    .eq("id", vendorId)
    .maybeSingle();

  if (!vendor || vendor.role !== "vendor") notFound();

  const [
    { data: bp },
    { data: contract },
    { data: weekly },
    { data: overrides },
    { data: venues },
    { data: services },
    { data: bookings },
  ] = await Promise.all([
    session.from("vendor_profiles").select("*").eq("vendor_id", vendorId).maybeSingle(),
    session
      .from("vendor_contracts")
      .select("*")
      .eq("vendor_id", vendorId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
    session.from("vendor_availability_weekly").select("weekday,is_available").eq("vendor_id", vendorId),
    session
      .from("vendor_availability_overrides")
      .select("date,is_available,reason")
      .eq("vendor_id", vendorId)
      .gte("date", new Date().toISOString().slice(0, 10))
      .order("date", { ascending: true })
      .limit(20),
    session.from("venues").select("id,name,is_approved,is_active").eq("vendor_id", vendorId),
    session.from("services").select("id,title,is_approved,is_active").eq("vendor_id", vendorId),
    session
      .from("bookings")
      .select("id,status,total_amount,booking_date")
      .eq("vendor_id", vendorId)
      .order("booking_date", { ascending: false })
      .limit(10),
  ]);

  const weeklyMap = new Map((weekly ?? []).map((w) => [w.weekday, w.is_available]));

  let contractPdfUrl: string | null = null;
  if (contract?.pdf_url && isS3Configured()) {
    contractPdfUrl = await getSignedDownloadUrl(contract.pdf_url);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <Link href="/admin/vendors" className="text-sm text-muted-foreground hover:underline">
            ← All vendors
          </Link>
          <h1 className="font-heading text-3xl font-bold">{bp?.business_name || vendor.full_name}</h1>
          <p className="text-muted-foreground">
            {vendor.email} {vendor.phone ? `· ${vendor.phone}` : ""} · Joined{" "}
            {new Date(vendor.created_at).toLocaleDateString()}
          </p>
        </div>
        <Badge
          variant="outline"
          className={
            bp?.verification_status === "verified"
              ? "border-emerald-300 bg-emerald-100 text-emerald-800"
              : bp?.verification_status === "rejected"
                ? "border-red-300 bg-red-100 text-red-800"
                : "border-amber-300 bg-amber-100 text-amber-800"
          }
        >
          {bp?.verification_status ?? "pending"}
        </Badge>
      </div>

      {query.admin === "ok" ? (
        <p className="rounded-md border border-emerald-300 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
          Saved.
        </p>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Business profile + verification */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Business profile</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <p>
              <span className="text-muted-foreground">City:</span> {bp?.city || "—"}
            </p>
            <p>
              <span className="text-muted-foreground">Address:</span> {bp?.address || "—"}
            </p>
            <p>
              <span className="text-muted-foreground">Description:</span>{" "}
              {bp?.description || "Not provided yet."}
            </p>
            <p>
              <span className="text-muted-foreground">GSTIN:</span> {bp?.gstin || "—"}
            </p>
            <p>
              <span className="text-muted-foreground">Bank:</span>{" "}
              {bp?.bank_account_name
                ? `${bp.bank_account_name} · ···${bp.bank_account_number_last4 ?? "----"} · ${bp.bank_ifsc ?? ""}`
                : "Not provided yet."}
            </p>
            <p>
              <span className="text-muted-foreground">UPI:</span> {bp?.upi_id || "—"}
            </p>

            <form
              action="/api/admin/vendors/verify"
              method="POST"
              className="space-y-2 rounded-md border p-3"
            >
              <input type="hidden" name="returnTo" value={`/admin/vendors/${vendorId}`} />
              <input type="hidden" name="vendorId" value={vendorId} />
              <label className="block space-y-1 text-sm">
                <span className="text-muted-foreground">Review notes (shown to vendor if rejected)</span>
                <textarea
                  name="notes"
                  defaultValue={bp?.verification_notes ?? ""}
                  rows={2}
                  className="w-full rounded-md border px-3 py-2"
                />
              </label>
              <div className="flex gap-2">
                <Button type="submit" name="action" value="verify">
                  Approve / Verify
                </Button>
                <Button type="submit" name="action" value="reject" variant="destructive">
                  Reject
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Contract */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Contract</CardTitle>
          </CardHeader>
          <CardContent>
            <form
              action="/api/admin/vendors/contract"
              method="POST"
              encType="multipart/form-data"
              className="space-y-3"
            >
              <input type="hidden" name="returnTo" value={`/admin/vendors/${vendorId}`} />
              <input type="hidden" name="vendorId" value={vendorId} />

              <div className="grid grid-cols-2 gap-3">
                <label className="block space-y-1 text-sm">
                  <span className="text-muted-foreground">Status</span>
                  <select name="status" defaultValue={contract?.status ?? "draft"} className="h-10 w-full rounded-md border px-3">
                    <option value="draft">Draft</option>
                    <option value="active">Active</option>
                    <option value="expired">Expired</option>
                    <option value="terminated">Terminated</option>
                  </select>
                </label>
                <label className="block space-y-1 text-sm">
                  <span className="text-muted-foreground">Commission rate (%)</span>
                  <input
                    type="number"
                    step="0.01"
                    name="commissionRate"
                    defaultValue={contract?.commission_rate ?? 10}
                    className="h-10 w-full rounded-md border px-3"
                  />
                </label>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <label className="block space-y-1 text-sm">
                  <span className="text-muted-foreground">Start date</span>
                  <input type="date" name="startDate" defaultValue={contract?.start_date ?? ""} className="h-10 w-full rounded-md border px-3" />
                </label>
                <label className="block space-y-1 text-sm">
                  <span className="text-muted-foreground">End date</span>
                  <input type="date" name="endDate" defaultValue={contract?.end_date ?? ""} className="h-10 w-full rounded-md border px-3" />
                </label>
              </div>

              <label className="block space-y-1 text-sm">
                <span className="text-muted-foreground">Payout terms</span>
                <textarea
                  name="payoutTerms"
                  defaultValue={contract?.payout_terms ?? ""}
                  rows={2}
                  placeholder="e.g. Payouts processed within 7 days of a completed booking"
                  className="w-full rounded-md border px-3 py-2"
                />
              </label>

              <label className="block space-y-1 text-sm">
                <span className="text-muted-foreground">Custom clauses / notes</span>
                <textarea
                  name="notes"
                  defaultValue={contract?.notes ?? ""}
                  rows={3}
                  className="w-full rounded-md border px-3 py-2"
                />
              </label>

              <label className="block space-y-1 text-sm">
                <span className="text-muted-foreground">
                  Signed contract PDF{contract?.pdf_url ? " (replace)" : ""}
                </span>
                <input type="file" name="pdf" accept="application/pdf" className="w-full text-sm" />
              </label>

              {contractPdfUrl ? (
                <a href={contractPdfUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-primary underline">
                  View current PDF
                </a>
              ) : null}

              <Button type="submit">{contract ? "Update Contract" : "Create Contract"}</Button>
            </form>
          </CardContent>
        </Card>

        {/* Availability overview (read-only for ops) */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Availability</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex flex-wrap gap-2">
              {WEEKDAYS.map((label, weekday) => {
                const available = weeklyMap.has(weekday) ? weeklyMap.get(weekday) : true;
                return (
                  <Badge
                    key={weekday}
                    variant="outline"
                    className={available ? "border-emerald-300 bg-emerald-100 text-emerald-800" : "border-red-300 bg-red-100 text-red-800"}
                  >
                    {label}
                  </Badge>
                );
              })}
            </div>
            <div>
              <p className="mb-1 text-muted-foreground">Upcoming overrides</p>
              {(overrides ?? []).length === 0 ? (
                <p className="text-muted-foreground">None.</p>
              ) : (
                <ul className="space-y-1">
                  {(overrides ?? []).map((o) => (
                    <li key={o.date}>
                      {o.date} — {o.is_available ? "Available" : "Blocked"} {o.reason ? `(${o.reason})` : ""}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Listings + recent bookings */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Listings &amp; bookings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div>
              <p className="mb-1 text-muted-foreground">Listings</p>
              {[...(venues ?? []).map((v) => ({ ...v, kind: "Venue" as const, name: v.name })), ...(services ?? []).map((s) => ({ ...s, kind: "Service" as const, name: s.title }))].map((l) => (
                <p key={`${l.kind}-${l.id}`}>
                  {l.name}{" "}
                  <span className="text-muted-foreground">
                    ({l.kind}, {l.is_approved ? "approved" : "pending"}, {l.is_active ? "active" : "inactive"})
                  </span>
                </p>
              ))}
              {(venues ?? []).length === 0 && (services ?? []).length === 0 ? (
                <p className="text-muted-foreground">No listings yet.</p>
              ) : null}
            </div>
            <div>
              <p className="mb-1 text-muted-foreground">Recent bookings</p>
              {(bookings ?? []).length === 0 ? (
                <p className="text-muted-foreground">No bookings yet.</p>
              ) : (
                (bookings ?? []).map((b) => (
                  <p key={b.id}>
                    {b.booking_date} — {formatCurrency(b.total_amount)}{" "}
                    <span className="text-muted-foreground">({b.status})</span>
                  </p>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
