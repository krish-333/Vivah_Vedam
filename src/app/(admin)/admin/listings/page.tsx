import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createDbSession } from "@/lib/server/auth";

type AdminListingsPageProps = {
  searchParams: Promise<{ admin?: string }>;
};

export default async function AdminListingsPage({
  searchParams,
}: AdminListingsPageProps) {
  const query = await searchParams;
  const session = await createDbSession();
  const {
    data: { user },
  } = await session.auth.getUser();

  if (!user) {
    redirect("/login?redirect=/admin/listings");
  }

  const { data: profile } = await session
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    redirect("/dashboard");
  }

  const [venuesRes, servicesRes] = await Promise.all([
    session
      .from("venues")
      .select("id,name,city,is_approved")
      .order("created_at", { ascending: false })
      .limit(100),
    session
      .from("services")
      .select("id,title,city,is_approved")
      .order("created_at", { ascending: false })
      .limit(100),
  ]);

  const venues = venuesRes.data ?? [];
  const services = servicesRes.data ?? [];

  return (
    <div className="space-y-4">
      <h1 className="font-heading text-3xl font-bold">Listings</h1>
      <p className="text-muted-foreground">
        Approve, reject, and moderate venue and service listings.
      </p>

      {query.admin === "ok" ? (
        <p className="rounded-md border border-emerald-300 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
          Listing moderation action completed.
        </p>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Venue Moderation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {venues.map((venue) => (
              <div key={venue.id} className="rounded-md border p-3 text-sm">
                <p className="font-medium">{venue.name}</p>
                <p className="text-muted-foreground">{venue.city}</p>
                <p className="mb-2 text-xs text-muted-foreground">
                  {venue.is_approved ? "Approved" : "Pending"}
                </p>
                <div className="flex flex-wrap gap-2">
                  <form action="/api/admin/moderate" method="POST">
                    <input type="hidden" name="action" value="approve_venue" />
                    <input type="hidden" name="targetId" value={venue.id} />
                    <input type="hidden" name="returnTo" value="/admin/listings" />
                    <Button type="submit" size="sm" variant="outline">Approve</Button>
                  </form>
                  <form action="/api/admin/moderate" method="POST">
                    <input type="hidden" name="action" value="reject_venue" />
                    <input type="hidden" name="targetId" value={venue.id} />
                    <input type="hidden" name="returnTo" value="/admin/listings" />
                    <Button type="submit" size="sm" variant="outline">Reject</Button>
                  </form>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Service Moderation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {services.map((service) => (
              <div key={service.id} className="rounded-md border p-3 text-sm">
                <p className="font-medium">{service.title}</p>
                <p className="text-muted-foreground">{service.city}</p>
                <p className="mb-2 text-xs text-muted-foreground">
                  {service.is_approved ? "Approved" : "Pending"}
                </p>
                <div className="flex flex-wrap gap-2">
                  <form action="/api/admin/moderate" method="POST">
                    <input type="hidden" name="action" value="approve_service" />
                    <input type="hidden" name="targetId" value={service.id} />
                    <input type="hidden" name="returnTo" value="/admin/listings" />
                    <Button type="submit" size="sm" variant="outline">Approve</Button>
                  </form>
                  <form action="/api/admin/moderate" method="POST">
                    <input type="hidden" name="action" value="reject_service" />
                    <input type="hidden" name="targetId" value={service.id} />
                    <input type="hidden" name="returnTo" value="/admin/listings" />
                    <Button type="submit" size="sm" variant="outline">Reject</Button>
                  </form>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
