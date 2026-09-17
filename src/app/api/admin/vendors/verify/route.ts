import { NextResponse } from "next/server";
import { createDbSession } from "@/lib/server/auth";
import { safeReturnTo } from "@/lib/http";
import { adminVendorVerifySchema } from "@/lib/validation";

export async function POST(request: Request) {
  const session = await createDbSession();
  const formData = await request.formData();

  const parsed = adminVendorVerifySchema.safeParse(Object.fromEntries(formData.entries()));
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

  const { vendorId, action, notes } = parsed.data;

  const { data: existing } = await session
    .from("vendor_profiles")
    .select("vendor_id")
    .eq("vendor_id", vendorId)
    .maybeSingle();

  const patch = {
    verification_status: action === "verify" ? ("verified" as const) : ("rejected" as const),
    verification_notes: notes || null,
    verified_at: new Date().toISOString(),
    verified_by: user.id,
  };

  const { error } = existing
    ? await session.from("vendor_profiles").update(patch).eq("vendor_id", vendorId)
    : await session.from("vendor_profiles").insert({ vendor_id: vendorId, ...patch });

  if (!error) {
    await session.from("admin_audit_log").insert({
      admin_id: user.id,
      action: `vendor_${action}`,
      target_type: "vendor",
      target_id: vendorId,
      details: { notes },
    });
  }

  redirectUrl.searchParams.set("admin", error ? "error" : "ok");
  return NextResponse.redirect(redirectUrl);
}
