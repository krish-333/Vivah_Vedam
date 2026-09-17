import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createDbSession } from "@/lib/server/auth";

type VendorProfileSettingsPageProps = {
  searchParams: Promise<{ profile?: string }>;
};

export default async function VendorProfileSettingsPage({
  searchParams,
}: VendorProfileSettingsPageProps) {
  const query = await searchParams;
  const session = await createDbSession();
  const {
    data: { user },
  } = await session.auth.getUser();

  if (!user) {
    redirect("/login?redirect=/vendor/profile");
  }

  const { data: profile } = await session
    .from("users")
    .select("full_name,phone,avatar_url,email")
    .eq("id", user.id)
    .single();

  return (
    <div className="space-y-4">
      <h1 className="font-heading text-3xl font-bold">Public Profile</h1>
      <p className="text-muted-foreground">
        Update business details, portfolio, and contact information.
      </p>

      {query.profile === "saved" ? (
        <p className="rounded-md border border-emerald-300 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
          Profile updated.
        </p>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Vendor Public Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <form action="/api/account/profile" method="POST" className="space-y-3">
            <input type="hidden" name="returnTo" value="/vendor/profile" />
            <label className="block space-y-1 text-sm">
              <span className="text-muted-foreground">Business name</span>
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
    </div>
  );
}
