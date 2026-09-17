import { NextResponse } from "next/server";
import { createDbSession } from "@/lib/server/auth";
import { safeReturnTo } from "@/lib/http";
import { adminModerateSchema } from "@/lib/validation";

export async function POST(request: Request) {
  const session = await createDbSession();
  const formData = await request.formData();

  const parsed = adminModerateSchema.safeParse(Object.fromEntries(formData.entries()));
  const returnTo = safeReturnTo(formData.get("returnTo"), "/admin");
  const redirectUrl = new URL(returnTo, request.url);

  if (!parsed.success) {
    redirectUrl.searchParams.set("admin", "invalid");
    return NextResponse.redirect(redirectUrl);
  }

  const { action, targetId } = parsed.data;

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
    .select("id,role")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "admin") {
    redirectUrl.searchParams.set("admin", "forbidden");
    return NextResponse.redirect(redirectUrl);
  }

  let targetType = "";
  let error: { message?: string } | null = null;

  if (action === "approve_venue" || action === "reject_venue") {
    targetType = "venue";
    const { error: updateError } = await session
      .from("venues")
      .update({ is_approved: action === "approve_venue" })
      .eq("id", targetId);
    error = updateError;
  } else if (action === "approve_service" || action === "reject_service") {
    targetType = "service";
    const { error: updateError } = await session
      .from("services")
      .update({ is_approved: action === "approve_service" })
      .eq("id", targetId);
    error = updateError;
  } else if (action === "approve_category" || action === "reject_category") {
    targetType = "category";
    const { error: updateError } = await session
      .from("categories")
      .update({ is_approved: action === "approve_category" })
      .eq("id", targetId);
    error = updateError;
  } else if (action === "remove_review") {
    targetType = "review";
    const { error: deleteError } = await session.from("reviews").delete().eq("id", targetId);
    error = deleteError;
  } else {
    redirectUrl.searchParams.set("admin", "invalid");
    return NextResponse.redirect(redirectUrl);
  }

  if (!error) {
    await session.from("admin_audit_log").insert({
      admin_id: user.id,
      action,
      target_type: targetType,
      target_id: targetId,
      details: {},
    });
  }

  redirectUrl.searchParams.set("admin", error ? "error" : "ok");
  return NextResponse.redirect(redirectUrl);
}
