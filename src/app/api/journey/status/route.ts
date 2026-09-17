import { NextResponse } from "next/server";
import { createDbSession } from "@/lib/server/auth";
import { safeReturnTo } from "@/lib/http";
import { journeyStatusSchema } from "@/lib/validation";

export async function POST(request: Request) {
  const session = await createDbSession();
  const formData = await request.formData();

  const parsed = journeyStatusSchema.safeParse(Object.fromEntries(formData.entries()));
  const returnTo = safeReturnTo(formData.get("returnTo"), "/dashboard/journey");
  const redirectUrl = new URL(returnTo, request.url);

  if (!parsed.success) {
    redirectUrl.searchParams.set("journey", "invalid");
    return NextResponse.redirect(redirectUrl);
  }

  const { stepId, action } = parsed.data;

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

  const status = action === "complete" ? "completed" : action === "skip" ? "skipped" : "active";

  const { error } = await session
    .from("journey_steps")
    .update({
      status,
      completed_at: action === "complete" ? new Date().toISOString() : null,
    })
    .eq("id", stepId);

  redirectUrl.searchParams.set("journey", error ? "error" : "updated");
  return NextResponse.redirect(redirectUrl);
}
