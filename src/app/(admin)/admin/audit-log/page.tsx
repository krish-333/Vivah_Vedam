import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createDbSession } from "@/lib/server/auth";

export default async function AdminAuditLogPage() {
  const session = await createDbSession();
  const {
    data: { user },
  } = await session.auth.getUser();

  if (!user) {
    redirect("/login?redirect=/admin/audit-log");
  }

  const { data: profile } = await session
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    redirect("/dashboard");
  }

  const { data: logs } = await session
    .from("admin_audit_log")
    .select("id,action,target_type,target_id,created_at")
    .order("created_at", { ascending: false })
    .limit(200);

  return (
    <div className="space-y-4">
      <h1 className="font-heading text-3xl font-bold">Audit Log</h1>
      <p className="text-muted-foreground">
        Search and inspect recorded administrative actions.
      </p>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Admin Activity</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {(logs ?? []).map((log) => (
            <div key={log.id} className="rounded-md border p-3 text-sm">
              <p className="font-medium">{log.action}</p>
              <p className="text-muted-foreground">
                {log.target_type} - {log.target_id}
              </p>
              <p className="text-xs text-muted-foreground">{log.created_at}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
