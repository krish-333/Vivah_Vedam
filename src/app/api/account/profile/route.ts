import { NextResponse } from "next/server";
import { createDbSession } from "@/lib/server/auth";
import { safeReturnTo } from "@/lib/http";
import { accountProfileSchema } from "@/lib/validation";

export async function POST(request: Request) {
  const session = await createDbSession();
  const formData = await request.formData();

  const parsed = accountProfileSchema.safeParse(Object.fromEntries(formData.entries()));
  const returnTo = safeReturnTo(formData.get("returnTo"), "/dashboard/settings");

  const redirectUrl = new URL(returnTo, request.url);

  if (!parsed.success) {
    redirectUrl.searchParams.set("profile", "invalid");
    return NextResponse.redirect(redirectUrl);
  }

  const { fullName, phone, avatarUrl } = parsed.data;

  const {
    data: { user },
  } = await session.auth.getUser();

  if (!user) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", returnTo);
    return NextResponse.redirect(loginUrl);
  }

  const { error } = await session
    .from("users")
    .update({
      full_name: fullName,
      phone: phone || null,
      avatar_url: avatarUrl || null,
    })
    .eq("id", user.id);

  redirectUrl.searchParams.set("profile", error ? "error" : "saved");
  return NextResponse.redirect(redirectUrl);
}
