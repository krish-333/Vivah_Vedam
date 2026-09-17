import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createDbSession } from "@/lib/server/auth";

type PageProps = {
  searchParams: Promise<{ profile?: string }>;
};

const verificationBadge: Record<string, { label: string; className: string }> = {
  pending: { label: "Pending review", className: "bg-amber-100 text-amber-800 border-amber-300" },
  verified: { label: "Verified", className: "bg-emerald-100 text-emerald-800 border-emerald-300" },
  rejected: { label: "Rejected", className: "bg-red-100 text-red-800 border-red-300" },
};

export default async function VendorBusinessProfilePage({ searchParams }: PageProps) {
  const query = await searchParams;
  const session = await createDbSession();
  const {
    data: { user },
  } = await session.auth.getUser();

  if (!user) redirect("/login?redirect=/vendor/business-profile");

  const { data: bp } = await session.from("vendor_profiles").select("*").eq("vendor_id", user.id).maybeSingle();

  const status = bp?.verification_status ?? "pending";
  const badge = verificationBadge[status];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-3xl font-bold">Business Profile</h1>
          <p className="text-muted-foreground">
            These details are shown to couples on your listings, and reviewed by our team.
          </p>
        </div>
        <Badge variant="outline" className={badge.className}>
          {badge.label}
        </Badge>
      </div>

      {status === "rejected" && bp?.verification_notes ? (
        <p className="rounded-md border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">
          Our team requested changes: {bp.verification_notes}
        </p>
      ) : null}

      {query.profile === "saved" ? (
        <p className="rounded-md border border-emerald-300 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
          Business profile updated. It will be re-reviewed if it was already verified.
        </p>
      ) : null}
      {query.profile === "invalid" ? (
        <p className="rounded-md border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">
          Please check the form and try again.
        </p>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Business details</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            action="/api/vendor/business-profile"
            method="POST"
            encType="multipart/form-data"
            className="space-y-3"
          >
            <input type="hidden" name="returnTo" value="/vendor/business-profile" />

            <label className="block space-y-1 text-sm">
              <span className="text-muted-foreground">Business name</span>
              <input
                name="businessName"
                defaultValue={bp?.business_name ?? ""}
                className="h-10 w-full rounded-md border px-3"
              />
            </label>

            <label className="block space-y-1 text-sm">
              <span className="text-muted-foreground">Description (shown to couples)</span>
              <textarea
                name="description"
                defaultValue={bp?.description ?? ""}
                rows={4}
                className="w-full rounded-md border px-3 py-2"
              />
            </label>

            <div className="grid grid-cols-2 gap-3">
              <label className="block space-y-1 text-sm">
                <span className="text-muted-foreground">City</span>
                <input name="city" defaultValue={bp?.city ?? ""} className="h-10 w-full rounded-md border px-3" />
              </label>
              <label className="block space-y-1 text-sm">
                <span className="text-muted-foreground">Service radius (km)</span>
                <input
                  type="number"
                  name="serviceRadiusKm"
                  defaultValue={bp?.service_radius_km ?? 50}
                  className="h-10 w-full rounded-md border px-3"
                />
              </label>
            </div>

            <label className="block space-y-1 text-sm">
              <span className="text-muted-foreground">Address</span>
              <input name="address" defaultValue={bp?.address ?? ""} className="h-10 w-full rounded-md border px-3" />
            </label>

            <div className="grid grid-cols-2 gap-3">
              <label className="block space-y-1 text-sm">
                <span className="text-muted-foreground">Website</span>
                <input
                  name="websiteUrl"
                  defaultValue={bp?.website_url ?? ""}
                  className="h-10 w-full rounded-md border px-3"
                />
              </label>
              <label className="block space-y-1 text-sm">
                <span className="text-muted-foreground">Instagram</span>
                <input
                  name="instagramUrl"
                  defaultValue={bp?.instagram_url ?? ""}
                  className="h-10 w-full rounded-md border px-3"
                />
              </label>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <label className="block space-y-1 text-sm">
                <span className="text-muted-foreground">Logo</span>
                <input type="file" name="logo" accept="image/*" className="w-full text-sm" />
              </label>
              <label className="block space-y-1 text-sm">
                <span className="text-muted-foreground">Cover photo</span>
                <input type="file" name="cover" accept="image/*" className="w-full text-sm" />
              </label>
            </div>

            <Button type="submit">Save Business Profile</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Payout &amp; tax details</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-3 text-sm text-muted-foreground">
            Used by our team to process your payouts. Only the last 4 digits of your account number are kept on file.
          </p>
          <form action="/api/vendor/business-profile" method="POST" className="space-y-3">
            <input type="hidden" name="returnTo" value="/vendor/business-profile" />
            {/* Carry the fields above forward so this form doesn't blank them out */}
            <input type="hidden" name="businessName" value={bp?.business_name ?? ""} />
            <input type="hidden" name="description" value={bp?.description ?? ""} />
            <input type="hidden" name="city" value={bp?.city ?? ""} />
            <input type="hidden" name="address" value={bp?.address ?? ""} />
            <input type="hidden" name="serviceRadiusKm" value={bp?.service_radius_km ?? 50} />
            <input type="hidden" name="websiteUrl" value={bp?.website_url ?? ""} />
            <input type="hidden" name="instagramUrl" value={bp?.instagram_url ?? ""} />

            <div className="grid grid-cols-2 gap-3">
              <label className="block space-y-1 text-sm">
                <span className="text-muted-foreground">GSTIN</span>
                <input name="gstin" defaultValue={bp?.gstin ?? ""} className="h-10 w-full rounded-md border px-3" />
              </label>
              <label className="block space-y-1 text-sm">
                <span className="text-muted-foreground">UPI ID</span>
                <input name="upiId" defaultValue={bp?.upi_id ?? ""} className="h-10 w-full rounded-md border px-3" />
              </label>
            </div>
            <label className="block space-y-1 text-sm">
              <span className="text-muted-foreground">Bank account holder name</span>
              <input
                name="bankAccountName"
                defaultValue={bp?.bank_account_name ?? ""}
                className="h-10 w-full rounded-md border px-3"
              />
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className="block space-y-1 text-sm">
                <span className="text-muted-foreground">
                  Bank account number
                  {bp?.bank_account_number_last4 ? ` (on file: ···${bp.bank_account_number_last4})` : ""}
                </span>
                <input
                  name="bankAccountNumber"
                  placeholder="Enter to update"
                  className="h-10 w-full rounded-md border px-3"
                />
              </label>
              <label className="block space-y-1 text-sm">
                <span className="text-muted-foreground">IFSC</span>
                <input
                  name="bankIfsc"
                  defaultValue={bp?.bank_ifsc ?? ""}
                  className="h-10 w-full rounded-md border px-3"
                />
              </label>
            </div>
            <Button type="submit" variant="outline">
              Save Payout Details
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
