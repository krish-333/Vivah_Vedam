import { NextResponse } from "next/server";
import { createDbSession } from "@/lib/server/auth";
import type { InsertTables } from "@/types";
import { safeReturnTo } from "@/lib/http";
import { vendorListingSchema } from "@/lib/validation";

export async function POST(request: Request) {
  const session = await createDbSession();
  const formData = await request.formData();

  const parsed = vendorListingSchema.safeParse(Object.fromEntries(formData.entries()));
  const returnTo = safeReturnTo(formData.get("returnTo"), "/vendor/listings");
  const redirectUrl = new URL(returnTo, request.url);

  if (!parsed.success) {
    redirectUrl.searchParams.set("vendor", "invalid");
    return NextResponse.redirect(redirectUrl);
  }

  const data = parsed.data;
  const listingType = data.listingType;

  const {
    data: { user },
  } = await session.auth.getUser();

  if (!user) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", returnTo);
    return NextResponse.redirect(loginUrl);
  }

  const { data: profile } = await session
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "vendor") {
    redirectUrl.searchParams.set("vendor", "forbidden");
    return NextResponse.redirect(redirectUrl);
  }

  if (listingType === "venue") {
    const name = data.name!;
    const city = data.city;
    const pricePerDay = data.pricePerDay!;
    const capacityMin = data.capacityMin!;
    const capacityMax = data.capacityMax!;

    const venueInsert: InsertTables<"venues"> = {
      vendor_id: user.id,
      name,
      description: data.description || "Venue listing",
      address: data.address || city,
      city,
      state: data.state || "NA",
      country: data.country || "India",
      capacity_min: capacityMin,
      capacity_max: capacityMax,
      price_per_day: pricePerDay,
      amenities: [],
      photos: [],
      cover_image: "",
      is_approved: false,
      is_active: true,
    };

    const { error } = await session.from("venues").insert(venueInsert);

    redirectUrl.searchParams.set("vendor", error ? "error" : "created");
    return NextResponse.redirect(redirectUrl);
  }

  if (listingType === "service") {
    const title = data.title!;
    const city = data.city;
    const priceMin = data.priceMin!;
    const priceMax = data.priceMax!;

    const serviceInsert: InsertTables<"services"> = {
      vendor_id: user.id,
      title,
      description: data.description || "Service listing",
      category: data.category || "general",
      price_type: "fixed",
      price_min: priceMin,
      price_max: priceMax,
      portfolio_images: [],
      city,
      service_radius_km: 50,
      cover_image: "",
      is_approved: false,
      is_active: true,
    };

    const { error } = await session.from("services").insert(serviceInsert);

    redirectUrl.searchParams.set("vendor", error ? "error" : "created");
    return NextResponse.redirect(redirectUrl);
  }

  redirectUrl.searchParams.set("vendor", "invalid");
  return NextResponse.redirect(redirectUrl);
}
