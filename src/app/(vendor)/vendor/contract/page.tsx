import { redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createDbSession } from "@/lib/server/auth";
import { getSignedDownloadUrl, isS3Configured } from "@/lib/s3";

const statusBadge: Record<string, string> = {
  draft: "border-slate-300 bg-slate-100 text-slate-700",
  active: "border-emerald-300 bg-emerald-100 text-emerald-800",
  expired: "border-amber-300 bg-amber-100 text-amber-800",
  terminated: "border-red-300 bg-red-100 text-red-800",
};

export default async function VendorContractPage() {
  const session = await createDbSession();
  const {
    data: { user },
  } = await session.auth.getUser();

  if (!user) redirect("/login?redirect=/vendor/contract");

  const { data: contract } = await session
    .from("vendor_contracts")
    .select("*")
    .eq("vendor_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  let pdfDownloadUrl: string | null = null;
  if (contract?.pdf_url && isS3Configured()) {
    pdfDownloadUrl = await getSignedDownloadUrl(contract.pdf_url);
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="font-heading text-3xl font-bold">Your Contract</h1>
        <p className="text-muted-foreground">
          Managed by the VivahVedam team. Reach out to us via Messages if you have questions.
        </p>
      </div>

      {!contract ? (
        <Card>
          <CardContent className="py-8 text-center text-sm text-muted-foreground">
            No contract has been set up for your account yet. Our team will reach out once your business profile is
            reviewed.
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-xl">Agreement details</CardTitle>
            <Badge variant="outline" className={statusBadge[contract.status]}>
              {contract.status}
            </Badge>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Platform commission</p>
                <p className="font-medium">{contract.commission_rate}%</p>
              </div>
              <div>
                <p className="text-muted-foreground">Contract period</p>
                <p className="font-medium">
                  {contract.start_date ?? "—"} to {contract.end_date ?? "—"}
                </p>
              </div>
            </div>

            {contract.payout_terms ? (
              <div>
                <p className="mb-1 text-sm text-muted-foreground">Payout terms</p>
                <p className="whitespace-pre-wrap text-sm">{contract.payout_terms}</p>
              </div>
            ) : null}

            {contract.notes ? (
              <div>
                <p className="mb-1 text-sm text-muted-foreground">Additional terms</p>
                <p className="whitespace-pre-wrap text-sm">{contract.notes}</p>
              </div>
            ) : null}

            {pdfDownloadUrl ? (
              <Button asChild variant="outline">
                <a href={pdfDownloadUrl} target="_blank" rel="noopener noreferrer">
                  Download signed contract (PDF)
                </a>
              </Button>
            ) : null}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
