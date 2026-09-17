import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createDbSession } from "@/lib/server/auth";

export default async function VendorReviewsPage() {
  const session = await createDbSession();
  const {
    data: { user },
  } = await session.auth.getUser();

  if (!user) {
    redirect("/login?redirect=/vendor/reviews");
  }

  const { data: reviews } = await session
    .from("reviews")
    .select("id,title,body,rating,is_verified,created_at,vendor_id")
    .eq("vendor_id", user.id)
    .order("created_at", { ascending: false })
    .limit(100);

  const rows = reviews ?? [];
  const averageRating = rows.length
    ? rows.reduce((sum, row) => sum + row.rating, 0) / rows.length
    : 0;

  return (
    <div className="space-y-4">
      <h1 className="font-heading text-3xl font-bold">Reviews</h1>
      <p className="text-muted-foreground">
        See reviews from couples across all your listings.
      </p>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Overall Rating</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-semibold">
            {rows.length ? averageRating.toFixed(1) : "0.0"} / 5
          </p>
          <p className="text-sm text-muted-foreground">{rows.length} total reviews</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Recent Reviews</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {rows.length === 0 ? (
            <p className="text-sm text-muted-foreground">No reviews yet.</p>
          ) : (
            rows.map((row) => (
              <div key={row.id} className="rounded-md border p-3 text-sm">
                <p className="font-medium">
                  {row.title} - {row.rating}/5
                </p>
                <p className="text-muted-foreground">{row.body}</p>
                <p className="text-xs text-muted-foreground">
                  {row.is_verified ? "Verified booking" : "Unverified"}
                </p>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
