import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createDbSession } from "@/lib/server/auth";

type PageProps = {
  searchParams: Promise<{ availability?: string }>;
};

const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export default async function VendorAvailabilityPage({ searchParams }: PageProps) {
  const query = await searchParams;
  const session = await createDbSession();
  const {
    data: { user },
  } = await session.auth.getUser();

  if (!user) redirect("/login?redirect=/vendor/availability");

  const [weeklyRes, overridesRes] = await Promise.all([
    session.from("vendor_availability_weekly").select("weekday,is_available").eq("vendor_id", user.id),
    session
      .from("vendor_availability_overrides")
      .select("id,date,is_available,reason")
      .eq("vendor_id", user.id)
      .order("date", { ascending: true })
      .limit(100),
  ]);

  const weeklyMap = new Map((weeklyRes.data ?? []).map((w) => [w.weekday, w.is_available]));
  const overrides = overridesRes.data ?? [];
  const today = new Date().toISOString().slice(0, 10);
  const upcomingOverrides = overrides.filter((o) => o.date >= today);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="font-heading text-3xl font-bold">Availability</h1>
        <p className="text-muted-foreground">
          Set your default weekly schedule, then block or unblock specific dates as needed.
        </p>
      </div>

      {query.availability === "saved" ? (
        <p className="rounded-md border border-emerald-300 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
          Availability updated.
        </p>
      ) : null}
      {(query.availability === "invalid" || query.availability === "error") ? (
        <p className="rounded-md border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">
          Something went wrong. Please try again.
        </p>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Weekly default schedule</CardTitle>
        </CardHeader>
        <CardContent>
          <form action="/api/vendor/availability/weekly" method="POST" className="space-y-3">
            <input type="hidden" name="returnTo" value="/vendor/availability" />
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {WEEKDAYS.map((label, weekday) => {
                const isAvailable = weeklyMap.has(weekday) ? weeklyMap.get(weekday) : true;
                return (
                  <label
                    key={weekday}
                    className="flex items-center gap-2 rounded-md border px-3 py-2 text-sm"
                  >
                    <input
                      type="checkbox"
                      name={`weekday${weekday}`}
                      defaultChecked={Boolean(isAvailable)}
                      className="h-4 w-4"
                    />
                    {label}
                  </label>
                );
              })}
            </div>
            <Button type="submit">Save Weekly Schedule</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Date-specific overrides</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Use this to block a date you&apos;re normally available on (e.g. a holiday), or open up a date you&apos;d
            normally be closed on.
          </p>

          <form
            action="/api/vendor/availability/overrides"
            method="POST"
            className="flex flex-wrap items-end gap-3 rounded-md border p-3"
          >
            <input type="hidden" name="returnTo" value="/vendor/availability" />
            <label className="space-y-1 text-sm">
              <span className="block text-muted-foreground">Date</span>
              <input type="date" name="date" required className="h-10 rounded-md border px-3" />
            </label>
            <label className="space-y-1 text-sm">
              <span className="block text-muted-foreground">Status</span>
              <select name="isAvailable" className="h-10 rounded-md border px-3">
                <option value="false">Blocked (unavailable)</option>
                <option value="true">Available</option>
              </select>
            </label>
            <label className="min-w-[200px] flex-1 space-y-1 text-sm">
              <span className="block text-muted-foreground">Reason (optional)</span>
              <input name="reason" className="h-10 w-full rounded-md border px-3" placeholder="e.g. Diwali" />
            </label>
            <Button type="submit">Add Override</Button>
          </form>

          {upcomingOverrides.length === 0 ? (
            <p className="text-sm text-muted-foreground">No upcoming overrides.</p>
          ) : (
            <div className="space-y-2">
              {upcomingOverrides.map((o) => (
                <div key={o.id} className="flex items-center justify-between rounded-md border px-3 py-2 text-sm">
                  <div className="flex items-center gap-3">
                    <span className="font-medium">{o.date}</span>
                    <Badge
                      variant="outline"
                      className={
                        o.is_available
                          ? "border-emerald-300 bg-emerald-100 text-emerald-800"
                          : "border-red-300 bg-red-100 text-red-800"
                      }
                    >
                      {o.is_available ? "Available" : "Blocked"}
                    </Badge>
                    {o.reason ? <span className="text-muted-foreground">{o.reason}</span> : null}
                  </div>
                  <form action="/api/vendor/availability/overrides/delete" method="POST">
                    <input type="hidden" name="returnTo" value="/vendor/availability" />
                    <input type="hidden" name="overrideId" value={o.id} />
                    <Button type="submit" variant="ghost" size="sm">
                      Remove
                    </Button>
                  </form>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
