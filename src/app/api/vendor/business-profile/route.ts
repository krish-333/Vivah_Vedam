import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { createDbSession } from "@/lib/server/auth";
import { safeReturnTo } from "@/lib/http";
import { vendorBusinessProfileSchema } from "@/lib/validation";
import { uploadObject, isS3Configured } from "@/lib/s3";

export async function POST(request: Request) {
  const session = await createDbSession();
  const formData = await request.formData();

  const parsed = vendorBusinessProfileSchema.safeParse(Object.fromEntries(formData.entries()));
  const returnTo = safeReturnTo(formData.get("returnTo"), "/vendor/business-profile");
  const redirectUrl = new URL(returnTo, request.url);

  if (!parsed.success) {
    redirectUrl.searchParams.set("profile", "invalid");
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

  const v = parsed.data;
  const { from } = db();

  let logoUrl: string | undefined;
  let coverImageUrl: string | undefined;

  if (isS3Configured()) {
    const logoFile = formData.get("logo");
    if (logoFile instanceof File && logoFile.size > 0) {
      const buffer = Buffer.from(await logoFile.arrayBuffer());
      const key = await uploadObject({ buffer, contentType: logoFile.type, keyPrefix: `vendor-logos/${user.id}` });
      logoUrl = key;
    }
    const coverFile = formData.get("cover");
    if (coverFile instanceof File && coverFile.size > 0) {
      const buffer = Buffer.from(await coverFile.arrayBuffer());
      const key = await uploadObject({ buffer, contentType: coverFile.type, keyPrefix: `vendor-covers/${user.id}` });
      coverImageUrl = key;
    }
  }

  const { data: existing } = await from("vendor_profiles").select("vendor_id").eq("vendor_id", user.id).maybeSingle();

  const bankLast4 = v.bankAccountNumber ? v.bankAccountNumber.slice(-4) : undefined;

  const patch = {
    business_name: v.businessName || null,
    description: v.description || null,
    city: v.city || null,
    address: v.address || null,
    service_radius_km: v.serviceRadiusKm ?? null,
    website_url: v.websiteUrl || null,
    instagram_url: v.instagramUrl || null,
    gstin: v.gstin || null,
    bank_account_name: v.bankAccountName || null,
    bank_ifsc: v.bankIfsc || null,
    upi_id: v.upiId || null,
    ...(bankLast4 ? { bank_account_number_last4: bankLast4 } : {}),
    ...(logoUrl ? { logo_url: logoUrl } : {}),
    ...(coverImageUrl ? { cover_image_url: coverImageUrl } : {}),
  };

  const { error } = existing
    ? await from("vendor_profiles").update(patch).eq("vendor_id", user.id)
    : await from("vendor_profiles").insert({ vendor_id: user.id, ...patch, verification_status: "pending" });

  // Keep the business name in sync with the display name used elsewhere in the app
  if (!error && v.businessName) {
    await from("users").update({ full_name: v.businessName }).eq("id", user.id);
  }

  redirectUrl.searchParams.set("profile", error ? "error" : "saved");
  return NextResponse.redirect(redirectUrl);
}
