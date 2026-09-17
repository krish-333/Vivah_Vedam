import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createDbSession } from "@/lib/server/auth";

type AdminReviewsPageProps = {
  searchParams: Promise<{ admin?: string }>;
};

export default async function AdminReviewsPage({
  searchParams,
}: AdminReviewsPageProps) {
  const query = await searchParams;
  const session = await createDbSession();
  const {
    data: { user },
  } = await session.auth.getUser();

  if (!user) {
    redirect("/login?redirect=/admin/reviews");
  }

  const { data: profile } = await session
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    redirect("/dashboard");
  }

  const { data: reviews } = await session
    .from("reviews")
    .select("id,title,body,rating,is_verified,created_at")
    .order("created_at", { ascending: false })
    .limit(100);

  return (
    <div className="space-y-4">
      <h1 className="font-heading text-3xl font-bold">Reviews</h1>
      <p className="text-muted-foreground">
        Moderate flagged reviews and enforce content policies.
      </p>

      {query.admin === "ok" ? (
        <p className="rounded-md border border-emerald-300 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
          Review moderation action completed.
        </p>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Review Moderation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {(reviews ?? []).map((review) => (
            <div key={review.id} className="rounded-md border p-3 text-sm">
              <p className="font-medium">
                {review.title} - {review.rating}/5
              </p>
              <p className="text-muted-foreground">{review.body}</p>
              <p className="mb-2 text-xs text-muted-foreground">
                {review.is_verified ? "Verified" : "Unverified"}
              </p>
              <form action="/api/admin/moderate" method="POST">
                <input type="hidden" name="action" value="remove_review" />
                <input type="hidden" name="targetId" value={review.id} />
                <input type="hidden" name="returnTo" value="/admin/reviews" />
                <Button type="submit" size="sm" variant="outline">
                  Remove Review
                </Button>
              </form>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
