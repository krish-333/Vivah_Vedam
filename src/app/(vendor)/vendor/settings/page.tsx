import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createDbSession } from "@/lib/server/auth";

export default async function VendorSettingsPage() {
  const session = await createDbSession();
  const {
    data: { user },
  } = await session.auth.getUser();

  if (!user) {
    redirect("/login?redirect=/vendor/settings");
  }

  const { data: profile } = await session
    .from("users")
    .select("full_name,email,role,onboarding_completed,created_at")
    .eq("id", user.id)
    .single();

  return (
    <div className="space-y-4">
      <h1 className="font-heading text-3xl font-bold">Account Settings</h1>
      <p className="text-muted-foreground">
        Configure account preferences and authentication settings.
      </p>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Account Overview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-1 text-sm text-muted-foreground">
          <p>Name: {profile?.full_name}</p>
          <p>Email: {profile?.email}</p>
          <p>Role: {profile?.role}</p>
          <p>Onboarding: {profile?.onboarding_completed ? "Complete" : "Pending"}</p>
          <p>Created at: {profile?.created_at}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Security</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Password resets and multi-factor authentication are managed by our account security system.
        </CardContent>
      </Card>
    </div>
  );
}
