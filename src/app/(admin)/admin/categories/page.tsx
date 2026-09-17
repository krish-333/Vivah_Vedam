import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createDbSession } from "@/lib/server/auth";

type AdminCategoriesPageProps = {
  searchParams: Promise<{ admin?: string }>;
};

export default async function AdminCategoriesPage({
  searchParams,
}: AdminCategoriesPageProps) {
  const query = await searchParams;
  const session = await createDbSession();
  const {
    data: { user },
  } = await session.auth.getUser();

  if (!user) {
    redirect("/login?redirect=/admin/categories");
  }

  const { data: profile } = await session
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    redirect("/dashboard");
  }

  const { data: categories } = await session
    .from("categories")
    .select("id,name,slug,is_approved,is_system")
    .order("created_at", { ascending: false })
    .limit(100);

  return (
    <div className="space-y-4">
      <h1 className="font-heading text-3xl font-bold">Categories</h1>
      <p className="text-muted-foreground">
        Manage system categories and approve vendor proposals.
      </p>

      {query.admin === "ok" ? (
        <p className="rounded-md border border-emerald-300 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
          Category moderation action completed.
        </p>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Category Queue</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {(categories ?? []).map((category) => (
            <div key={category.id} className="rounded-md border p-3 text-sm">
              <p className="font-medium">{category.name}</p>
              <p className="text-muted-foreground">/{category.slug}</p>
              <p className="mb-2 text-xs text-muted-foreground">
                {category.is_system ? "System" : "Vendor proposed"} - {category.is_approved ? "Approved" : "Pending"}
              </p>
              <div className="flex flex-wrap gap-2">
                <form action="/api/admin/moderate" method="POST">
                  <input type="hidden" name="action" value="approve_category" />
                  <input type="hidden" name="targetId" value={category.id} />
                  <input type="hidden" name="returnTo" value="/admin/categories" />
                  <Button type="submit" size="sm" variant="outline">Approve</Button>
                </form>
                <form action="/api/admin/moderate" method="POST">
                  <input type="hidden" name="action" value="reject_category" />
                  <input type="hidden" name="targetId" value={category.id} />
                  <input type="hidden" name="returnTo" value="/admin/categories" />
                  <Button type="submit" size="sm" variant="outline">Reject</Button>
                </form>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
