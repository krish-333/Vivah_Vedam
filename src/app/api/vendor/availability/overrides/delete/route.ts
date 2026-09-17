import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/server/auth";
import { safeReturnTo } from "@/lib/http";
import { vendorAvailabilityOverrideDeleteSchema } from "@/lib/validation";

export async function POST(request: Request) {
  const formData = await request.formData();
  const parsed = vendorAvailabilityOverrideDeleteSchema.safeParse(Object.fromEntries(formData.entries()));
  const returnTo = safeReturnTo(formData.get("returnTo"), "/vendor/availability");
  const redirectUrl = new URL(returnTo, request.url);

  if (!parsed.success) {
    redirectUrl.searchParams.set("availability", "invalid");
    return NextResponse.redirect(redirectUrl);
  }

  const user = await getCurrentUser();
  if (!user) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", returnTo);
    return NextResponse.redirect(loginUrl);
  }

  const { from } = db();
  // Scoped to the current vendor so one vendor can't delete another's override by guessing an id.
  const { error } = await from("vendor_availability_overrides")
    .delete()
    .eq("id", parsed.data.overrideId)
    .eq("vendor_id", user.id);

  redirectUrl.searchParams.set("availability", error ? "error" : "saved");
  return NextResponse.redirect(redirectUrl);
}
