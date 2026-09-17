import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createDbSession } from "@/lib/server/auth";

type CoupleSettingsPageProps = {
  searchParams: Promise<{ profile?: string }>;
};

export default async function CoupleSettingsPage({
  searchParams,
}: CoupleSettingsPageProps) {
  const query = await searchParams;
  const session = await createDbSession();
  const {
    data: { user },
  } = await session.auth.getUser();

  if (!user) {
    redirect("/login?redirect=/dashboard/settings");
  }

  const [{ data: profile }, { data: wedding }] = await Promise.all([
    session
      .from("users")
      .select("full_name,email,phone,avatar_url")
      .eq("id", user.id)
      .single(),
    session
      .from("weddings")
      .select("partner_1_name,partner_2_name,wedding_date,city,guest_count,budget_total")
      .eq("couple_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
  ]);

  return (
    <div className="space-y-4">
      <h1 className="font-heading text-3xl font-bold">Account Settings</h1>
      <p className="text-muted-foreground">
        Manage your profile, preferences, and account options.
      </p>

      {query.profile === "saved" ? (
        <p className="rounded-md border border-emerald-300 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
          Profile updated.
        </p>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <form action="/api/account/profile" method="POST" className="space-y-3">
            <input type="hidden" name="returnTo" value="/dashboard/settings" />
            <label className="block space-y-1 text-sm">
              <span className="text-muted-foreground">Name</span>
              <input
                name="fullName"
                defaultValue={profile?.full_name ?? ""}
                className="h-10 w-full rounded-md border px-3"
              />
            </label>
            <label className="block space-y-1 text-sm">
              <span className="text-muted-foreground">Phone</span>
              <input
                name="phone"
                defaultValue={profile?.phone ?? ""}
                className="h-10 w-full rounded-md border px-3"
              />
            </label>
            <label className="block space-y-1 text-sm">
              <span className="text-muted-foreground">Avatar URL</span>
              <input
                name="avatarUrl"
                defaultValue={profile?.avatar_url ?? ""}
                className="h-10 w-full rounded-md border px-3"
              />
            </label>
            <p className="text-xs text-muted-foreground">Email: {profile?.email}</p>
            <Button type="submit">Save Profile</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Wedding Snapshot</CardTitle>
        </CardHeader>
        <CardContent className="space-y-1 text-sm text-muted-foreground">
          {wedding ? (
            <>
              <p>
                Couple: {wedding.partner_1_name} & {wedding.partner_2_name}
              </p>
              <p>Date: {wedding.wedding_date}</p>
              <p>City: {wedding.city}</p>
              <p>Guests: {wedding.guest_count}</p>
              <p>Budget: ₹{Number(wedding.budget_total).toLocaleString("en-IN")}</p>
            </>
          ) : (
            <p>No wedding profile found yet.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
