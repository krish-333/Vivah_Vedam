import { NextResponse } from "next/server";
import { createDbSession } from "@/lib/server/auth";
import { safeReturnTo } from "@/lib/http";
import { adminVendorContractSchema } from "@/lib/validation";
import { uploadObject, isS3Configured } from "@/lib/s3";

export async function POST(request: Request) {
  const session = await createDbSession();
  const formData = await request.formData();

  const parsed = adminVendorContractSchema.safeParse(Object.fromEntries(formData.entries()));
  const returnTo = safeReturnTo(formData.get("returnTo"), "/admin/vendors");
  const redirectUrl = new URL(returnTo, request.url);

  if (!parsed.success) {
    redirectUrl.searchParams.set("admin", "invalid");
    return NextResponse.redirect(redirectUrl);
  }

  const {
    data: { user },
  } = await session.auth.getUser();
  if (!user) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", returnTo);
    return NextResponse.redirect(loginUrl);
  }

  const { data: profile } = await session.from("users").select("id,role").eq("id", user.id).single();
  if (!profile || profile.role !== "admin") {
    redirectUrl.searchParams.set("admin", "forbidden");
    return NextResponse.redirect(redirectUrl);
  }

  const { vendorId, status, commissionRate, payoutTerms, startDate, endDate, notes } = parsed.data;

  let pdfPatch: { pdf_url: string; pdf_uploaded_at: string } | Record<string, never> = {};
  if (isS3Configured()) {
    const pdfFile = formData.get("pdf");
    if (pdfFile instanceof File && pdfFile.size > 0) {
      if (pdfFile.type !== "application/pdf") {
        redirectUrl.searchParams.set("admin", "invalid");
        return NextResponse.redirect(redirectUrl);
      }
      const buffer = Buffer.from(await pdfFile.arrayBuffer());
      const key = await uploadObject({ buffer, contentType: "application/pdf", keyPrefix: `contracts/${vendorId}` });
      pdfPatch = { pdf_url: key, pdf_uploaded_at: new Date().toISOString() };
    }
  }

  const patch = {
    status,
    commission_rate: commissionRate,
    payout_terms: payoutTerms || null,
    start_date: startDate || null,
    end_date: endDate || null,
    notes: notes || null,
    ...pdfPatch,
  };

  const { data: existing } = await session
    .from("vendor_contracts")
    .select("id")
    .eq("vendor_id", vendorId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const { error } = existing
    ? await session.from("vendor_contracts").update(patch).eq("id", existing.id)
    : await session.from("vendor_contracts").insert({ vendor_id: vendorId, created_by: user.id, ...patch });

  if (!error) {
    await session.from("admin_audit_log").insert({
      admin_id: user.id,
      action: existing ? "contract_updated" : "contract_created",
      target_type: "vendor_contract",
      target_id: vendorId,
      details: { status, commissionRate },
    });
  }

  redirectUrl.searchParams.set("admin", error ? "error" : "ok");
  return NextResponse.redirect(redirectUrl);
}
