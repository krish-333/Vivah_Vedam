import { NextResponse } from "next/server";
import { createDbSession } from "@/lib/server/auth";
import { buildJourneySteps } from "@/lib/journey";
import { safeReturnTo } from "@/lib/http";
import { journeyInitSchema } from "@/lib/validation";

export async function POST(request: Request) {
  const session = await createDbSession();
  const formData = await request.formData();
  const parsed = journeyInitSchema.safeParse(Object.fromEntries(formData.entries()));
  const returnTo = safeReturnTo(formData.get("returnTo"), "/dashboard");
  const redirectUrl = new URL(returnTo, request.url);

  if (!parsed.success) {
    redirectUrl.searchParams.set("journey", "invalid");
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

  const { data: profile } = await session
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "couple") {
    redirectUrl.searchParams.set("journey", "forbidden");
    return NextResponse.redirect(redirectUrl);
  }

  const { data: wedding } = await session
    .from("weddings")
    .select("id,wedding_date")
    .eq("couple_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!wedding) {
    redirectUrl.searchParams.set("journey", "missing-wedding");
    return NextResponse.redirect(redirectUrl);
  }

  const { count } = await session
    .from("journey_steps")
    .select("id", { count: "exact", head: true })
    .eq("wedding_id", wedding.id);

  if ((count ?? 0) > 0) {
    redirectUrl.searchParams.set("journey", "exists");
    return NextResponse.redirect(redirectUrl);
  }

  const steps = buildJourneySteps(wedding.id, wedding.wedding_date);
  const { error } = await session.from("journey_steps").insert(steps);

  redirectUrl.searchParams.set("journey", error ? "error" : "created");
  return NextResponse.redirect(redirectUrl);
}
