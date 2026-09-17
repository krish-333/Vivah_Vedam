import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createDbSession } from "@/lib/server/auth";

export default async function AdminUsersPage() {
  const session = await createDbSession();
  const {
    data: { user },
  } = await session.auth.getUser();

  if (!user) {
    redirect("/login?redirect=/admin/users");
  }

  const { data: profile } = await session
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    redirect("/dashboard");
  }

  const { data: users } = await session
    .from("users")
    .select("id,email,full_name,role,onboarding_completed,created_at")
    .order("created_at", { ascending: false })
    .limit(200);

  return (
    <div className="space-y-4">
      <h1 className="font-heading text-3xl font-bold">Users</h1>
      <p className="text-muted-foreground">
        View, search, and manage platform user accounts.
      </p>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">All Users</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {(users ?? []).map((entry) => (
            <div key={entry.id} className="rounded-md border p-3 text-sm">
              <p className="font-medium">{entry.full_name || entry.email}</p>
              <p className="text-muted-foreground">{entry.email}</p>
              <p className="text-xs text-muted-foreground">
                Role: {entry.role} - Onboarding: {entry.onboarding_completed ? "Complete" : "Pending"}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
