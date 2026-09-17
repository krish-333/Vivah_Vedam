import Link from "next/link";
import { redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createDbSession } from "@/lib/server/auth";

type PageProps = {
  searchParams: Promise<{ admin?: string }>;
};

const verificationBadge: Record<string, string> = {
  pending: "border-amber-300 bg-amber-100 text-amber-800",
  verified: "border-emerald-300 bg-emerald-100 text-emerald-800",
  rejected: "border-red-300 bg-red-100 text-red-800",
};

const contractBadge: Record<string, string> = {
  draft: "border-slate-300 bg-slate-100 text-slate-700",
  active: "border-emerald-300 bg-emerald-100 text-emerald-800",
  expired: "border-amber-300 bg-amber-100 text-amber-800",
  terminated: "border-red-300 bg-red-100 text-red-800",
};

export default async function AdminVendorsPage({ searchParams }: PageProps) {
  const query = await searchParams;
  const session = await createDbSession();
  const {
    data: { user },
  } = await session.auth.getUser();

  if (!user) redirect("/login?redirect=/admin/vendors");

  const { data: profile } = await session.from("users").select("role").eq("id", user.id).single();
  if (profile?.role !== "admin") redirect("/dashboard");

  const [{ data: vendors }, { data: vendorProfiles }, { data: contracts }, { data: venues }, { data: services }] =
    await Promise.all([
      session.from("users").select("id,email,full_name,created_at").eq("role", "vendor").order("created_at", { ascending: false }).limit(200),
      session.from("vendor_profiles").select("vendor_id,business_name,verification_status,city").limit(200),
      session.from("vendor_contracts").select("vendor_id,status,commission_rate").order("created_at", { ascending: false }).limit(400),
      session.from("venues").select("id,vendor_id").limit(500),
      session.from("services").select("id,vendor_id").limit(500),
    ]);

  const profileByVendor = new Map((vendorProfiles ?? []).map((p) => [p.vendor_id, p]));
  const contractByVendor = new Map<string, { status: string; commission_rate: number }>();
  for (const c of contracts ?? []) {
    if (!contractByVendor.has(c.vendor_id)) contractByVendor.set(c.vendor_id, c); // first = most recent, already ordered
  }
  const listingCountByVendor = new Map<string, number>();
  for (const v of [...(venues ?? []), ...(services ?? [])]) {
    listingCountByVendor.set(v.vendor_id, (listingCountByVendor.get(v.vendor_id) ?? 0) + 1);
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="font-heading text-3xl font-bold">Vendors</h1>
        <p className="text-muted-foreground">Verification, contracts, and listings for every vendor account.</p>
      </div>

      {query.admin === "ok" ? (
        <p className="rounded-md border border-emerald-300 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
          Action completed.
        </p>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">All vendors ({vendors?.length ?? 0})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y">
            {(vendors ?? []).map((v) => {
              const bp = profileByVendor.get(v.id);
              const contract = contractByVendor.get(v.id);
              return (
                <Link
                  key={v.id}
                  href={`/admin/vendors/${v.id}`}
                  className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 hover:bg-muted/50"
                >
                  <div>
                    <p className="font-medium">{bp?.business_name || v.full_name}</p>
                    <p className="text-sm text-muted-foreground">
                      {v.email} {bp?.city ? `· ${bp.city}` : ""}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={verificationBadge[bp?.verification_status ?? "pending"]}>
                      {bp?.verification_status ?? "pending"}
                    </Badge>
                    <Badge variant="outline" className={contract ? contractBadge[contract.status] : "border-slate-300 bg-slate-100 text-slate-700"}>
                      {contract ? `${contract.status} · ${contract.commission_rate}%` : "no contract"}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {listingCountByVendor.get(v.id) ?? 0} listing{(listingCountByVendor.get(v.id) ?? 0) === 1 ? "" : "s"}
                    </span>
                  </div>
                </Link>
              );
            })}
            {(vendors ?? []).length === 0 ? (
              <p className="px-4 py-8 text-center text-sm text-muted-foreground">No vendors yet.</p>
            ) : null}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
