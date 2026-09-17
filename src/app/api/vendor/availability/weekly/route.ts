import { NextResponse } from "next/server";
import { pool } from "@/lib/db";
import { getCurrentUser } from "@/lib/server/auth";
import { safeReturnTo } from "@/lib/http";
import { vendorAvailabilityWeeklySchema } from "@/lib/validation";

const WEEKDAY_FIELDS = ["weekday0", "weekday1", "weekday2", "weekday3", "weekday4", "weekday5", "weekday6"] as const;

export async function POST(request: Request) {
  const formData = await request.formData();
  const parsed = vendorAvailabilityWeeklySchema.safeParse(Object.fromEntries(formData.entries()));
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

  try {
    // Checkboxes only appear in form data when checked, so an absent field means "off".
    for (let weekday = 0; weekday < 7; weekday++) {
      const isAvailable = Boolean(parsed.data[WEEKDAY_FIELDS[weekday]]);
      await pool.query(
        `INSERT INTO "vendor_availability_weekly" (vendor_id, weekday, is_available)
         VALUES ($1, $2, $3)
         ON CONFLICT (vendor_id, weekday) DO UPDATE SET is_available = EXCLUDED.is_available`,
        [user.id, weekday, isAvailable]
      );
    }
    redirectUrl.searchParams.set("availability", "saved");
  } catch {
    redirectUrl.searchParams.set("availability", "error");
  }

  return NextResponse.redirect(redirectUrl);
}
