import Link from "next/link";
import { redirect } from "next/navigation";
import { IndianRupee, TrendingUp, Wallet, PiggyBank, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { createDbSession } from "@/lib/server/auth";
import { formatCurrency } from "@/lib/marketplace";

export default async function CoupleBudgetPage() {
  const session = await createDbSession();
  const { data: { user } } = await session.auth.getUser();

  if (!user) redirect("/login?redirect=/dashboard/budget");

  const { data: wedding } = await session
    .from("weddings")
    .select("id,budget_total")
    .eq("couple_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const bookings = wedding
    ? (await session
        .from("bookings")
        .select("status,total_amount,venue_id,service_id,booking_date")
        .eq("couple_id", user.id)
      ).data ?? []
    : [];

  const confirmedSpend = bookings
    .filter((b) => ["confirmed", "in_progress", "completed"].includes(b.status))
    .reduce((sum, b) => sum + b.total_amount, 0);

  const plannedSpend = bookings.reduce((sum, b) => sum + b.total_amount, 0);
  const budgetTotal = wedding?.budget_total ?? 0;
  const remaining = Math.max(0, budgetTotal - confirmedSpend);
  const pct = budgetTotal > 0 ? Math.round((confirmedSpend / budgetTotal) * 100) : 0;

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold tracking-widest text-terracotta-500 uppercase">Planning</p>
        <h1 className="mt-1 font-heading text-2xl font-light text-foreground">Budget Tracker</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Monitor your wedding spend and stay on track.
        </p>
      </div>

      {!wedding ? (
        <Card className="shadow-warm">
          <CardContent className="py-10 text-center">
            <PiggyBank className="mx-auto h-10 w-10 text-muted-foreground/30" />
            <p className="mt-3 text-sm text-muted-foreground">Set up your wedding profile to track budget.</p>
            <Link href="/onboarding/couple" className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-terracotta-500 hover:text-terracotta-700">
              Complete profile <ArrowRight className="h-4 w-4" />
            </Link>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Progress bar card */}
          <div className="rounded-2xl border border-border/30 bg-card p-6 shadow-warm">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-xs font-semibold tracking-wider text-muted-foreground/60 uppercase">Committed of Total</div>
                <div className="mt-1 font-heading text-3xl font-semibold text-foreground">
                  {formatCurrency(confirmedSpend)}
                  <span className="ml-2 font-heading text-lg font-light text-muted-foreground">
                    of {formatCurrency(budgetTotal)}
                  </span>
                </div>
              </div>
              <div className="font-heading text-4xl font-light text-terracotta-400">{pct}%</div>
            </div>
            <div className="mt-4 h-3 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-terracotta-400 transition-all duration-700"
                style={{ width: `${Math.min(pct, 100)}%` }}
              />
            </div>
            <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
              <span>₹0</span>
              <span>{formatCurrency(budgetTotal)}</span>
            </div>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <Card className="shadow-warm-sm">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div className="text-[10px] font-semibold tracking-wider text-muted-foreground/60 uppercase">Total Budget</div>
                  <Wallet className="h-4 w-4 text-muted-foreground/30" />
                </div>
                <div className="mt-2 font-heading text-xl font-semibold text-foreground">{formatCurrency(budgetTotal)}</div>
              </CardContent>
            </Card>

            <Card className="shadow-warm-sm">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div className="text-[10px] font-semibold tracking-wider text-muted-foreground/60 uppercase">Committed</div>
                  <TrendingUp className="h-4 w-4 text-terracotta-300" />
                </div>
                <div className="mt-2 font-heading text-xl font-semibold text-foreground">{formatCurrency(confirmedSpend)}</div>
                <div className="mt-0.5 text-[10px] text-muted-foreground">Confirmed bookings</div>
              </CardContent>
            </Card>

            <Card className="shadow-warm-sm">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div className="text-[10px] font-semibold tracking-wider text-muted-foreground/60 uppercase">Planned</div>
                  <IndianRupee className="h-4 w-4 text-muted-foreground/30" />
                </div>
                <div className="mt-2 font-heading text-xl font-semibold text-foreground">{formatCurrency(plannedSpend)}</div>
                <div className="mt-0.5 text-[10px] text-muted-foreground">Incl. pending requests</div>
              </CardContent>
            </Card>

            <Card className="shadow-warm-sm">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div className="text-[10px] font-semibold tracking-wider text-muted-foreground/60 uppercase">Remaining</div>
                  <PiggyBank className="h-4 w-4 text-sage-400" />
                </div>
                <div className="mt-2 font-heading text-xl font-semibold text-sage-600">{formatCurrency(remaining)}</div>
                <div className="mt-0.5 text-[10px] text-muted-foreground">Still available</div>
              </CardContent>
            </Card>
          </div>

          {/* Bookings breakdown */}
          {bookings.length > 0 && (
            <div>
              <h2 className="mb-3 font-heading text-base font-semibold text-foreground">Spend Breakdown</h2>
              <div className="space-y-2">
                {bookings.map((booking, i) => (
                  <div key={i} className="flex items-center justify-between rounded-xl border border-border/30 bg-card px-4 py-3 shadow-warm-sm">
                    <div>
                      <div className="text-sm font-medium text-foreground">
                        {booking.venue_id ? "Venue booking" : "Service booking"}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(booking.booking_date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                        {" · "}
                        <span className="capitalize">{booking.status.replace("_", " ")}</span>
                      </div>
                    </div>
                    <div className={`text-sm font-semibold ${
                      ["confirmed", "in_progress", "completed"].includes(booking.status)
                        ? "text-terracotta-600"
                        : "text-muted-foreground"
                    }`}>
                      {formatCurrency(booking.total_amount)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {bookings.length === 0 && (
            <div className="rounded-xl border border-dashed border-border/50 bg-muted/20 py-10 text-center">
              <p className="text-sm text-muted-foreground">No bookings yet — your budget is fully available.</p>
              <Link href="/venues" className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-terracotta-500 hover:text-terracotta-700">
                Browse venues <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          )}
        </>
      )}
    </div>
  );
}
