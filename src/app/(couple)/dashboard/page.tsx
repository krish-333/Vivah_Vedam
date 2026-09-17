import Link from "next/link";
import { redirect } from "next/navigation";
import {
  CheckCircle2,
  Clock,
  Sparkles,
  Calendar,
  MapPin,
  Users,
  IndianRupee,
  ArrowRight,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { createDbSession } from "@/lib/server/auth";
import { formatCurrency } from "@/lib/marketplace";

function getDaysUntilWedding(dateStr: string): number {
  const wedding = new Date(dateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.ceil((wedding.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
}

function getUrgencyLevel(days: number): "critical" | "soon" | "on-track" | "early" {
  if (days <= 60) return "critical";
  if (days <= 120) return "soon";
  if (days <= 270) return "on-track";
  return "early";
}

function formatWeddingDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

type CoupleDashboardPageProps = {
  searchParams: Promise<{ journey?: string }>;
};

export default async function CoupleDashboardPage({
  searchParams,
}: CoupleDashboardPageProps) {
  const query = await searchParams;
  const session = await createDbSession();
  const {
    data: { user },
  } = await session.auth.getUser();

  if (!user) redirect("/login?redirect=/dashboard");

  const { data: wedding } = await session
    .from("weddings")
    .select(
      "id,partner_1_name,partner_2_name,wedding_date,city,budget_total,budget_spent,guest_count,status"
    )
    .eq("couple_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const journeySteps = wedding
    ? (
        await session
          .from("journey_steps")
          .select("id,title,status,recommended_deadline,order_index,step_type")
          .eq("wedding_id", wedding.id)
          .order("order_index", { ascending: true })
      ).data ?? []
    : [];

  const completedSteps = journeySteps.filter((s) => s.status === "completed").length;
  const totalSteps = journeySteps.length;
  const activeStep = journeySteps.find((s) => s.status === "active");
  const upcomingUrgent = journeySteps
    .filter((s) => s.status === "upcoming" && s.recommended_deadline)
    .slice(0, 3);

  const daysUntil = wedding ? getDaysUntilWedding(wedding.wedding_date) : null;
  const urgency = daysUntil !== null ? getUrgencyLevel(daysUntil) : null;
  const budgetSpent = wedding?.budget_spent ?? 0;
  const budgetTotal = wedding?.budget_total ?? 0;
  const budgetPct = budgetTotal > 0 ? Math.round((budgetSpent / budgetTotal) * 100) : 0;

  const urgencyConfig = {
    critical: { color: "bg-red-50 border-red-200 text-red-700", icon: "🔴", label: "Urgent — many vendors fully booked at this timeline" },
    soon: { color: "bg-amber-50 border-amber-200 text-amber-700", icon: "🟠", label: "Book your remaining vendors soon" },
    "on-track": { color: "bg-sage-50 border-sage-200 text-sage-700", icon: "🟢", label: "You're on track — keep the momentum going" },
    early: { color: "bg-blue-50 border-blue-200 text-blue-700", icon: "🔵", label: "Great start — begin with venue and photography" },
  };

  const stepIcons: Record<string, string> = {
    venue: "🏛️", photography: "📸", catering: "🍽️", decor: "💐",
    makeup: "💄", music: "🎵", mehndi: "✋", finalization: "✅",
  };

  return (
    <div className="space-y-6">
      {/* Success flash */}
      {query.journey === "created" && (
        <div className="rounded-xl border border-sage-200 bg-sage-50 px-4 py-3 text-sm text-sage-700">
          ✓ Your wedding journey plan has been created! Scroll down to see your milestones.
        </div>
      )}

      {!wedding ? (
        <Card className="shadow-warm">
          <CardContent className="py-12 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-terracotta-50 text-terracotta-500">
              <Sparkles className="h-6 w-6" />
            </div>
            <h2 className="font-heading text-xl font-semibold">Welcome to VivahVedam</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Complete your wedding profile to start your personalized planning journey.
            </p>
            <Button
              className="mt-6 rounded-full bg-terracotta-500 text-white hover:bg-terracotta-600"
              asChild
            >
              <Link href="/onboarding/couple">Set up my wedding profile</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Hero — Countdown */}
          <div className="grain relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#2c2825] to-[#3d3532] p-6 text-white shadow-warm-lg">
            <div className="flex flex-col gap-1 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="text-xs font-semibold tracking-widest text-terracotta-400 uppercase">
                  Your Wedding
                </p>
                <h1 className="mt-1 font-heading text-2xl font-light text-[#f5ebe0] lg:text-3xl">
                  {wedding.partner_1_name} & {wedding.partner_2_name}
                </h1>
                <div className="mt-3 flex flex-wrap gap-4 text-sm text-[#a09080]">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5" />
                    {formatWeddingDate(wedding.wedding_date)}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5" />
                    {wedding.city}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Users className="h-3.5 w-3.5" />
                    {wedding.guest_count} guests
                  </span>
                </div>
              </div>

              {daysUntil !== null && daysUntil > 0 && (
                <div className="mt-4 shrink-0 text-center md:mt-0 md:text-right">
                  <div className="font-heading text-4xl font-semibold text-terracotta-400 lg:text-5xl">
                    {daysUntil}
                  </div>
                  <div className="text-xs font-medium tracking-wider text-[#a09080] uppercase">
                    Days to go
                  </div>
                </div>
              )}
              {daysUntil !== null && daysUntil <= 0 && (
                <div className="mt-4 shrink-0 text-center md:mt-0">
                  <div className="font-heading text-2xl font-semibold text-gold-400">🎉 Today!</div>
                </div>
              )}
            </div>

            {/* Urgency bar */}
            {urgency && (
              <div className={`mt-5 rounded-xl border px-4 py-2.5 text-sm ${urgencyConfig[urgency].color}`}>
                {urgencyConfig[urgency].icon} {urgencyConfig[urgency].label}
              </div>
            )}
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <Card className="shadow-warm-sm">
              <CardContent className="p-5">
                <div className="text-xs font-semibold tracking-wider text-muted-foreground/70 uppercase">Progress</div>
                <div className="mt-2 font-heading text-2xl font-semibold text-foreground">{completedSteps}/{totalSteps}</div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-sage-500 transition-all"
                    style={{ width: totalSteps > 0 ? `${(completedSteps / totalSteps) * 100}%` : "0%" }}
                  />
                </div>
                <div className="mt-1 text-xs text-muted-foreground">milestones done</div>
              </CardContent>
            </Card>

            <Card className="shadow-warm-sm">
              <CardContent className="p-5">
                <div className="text-xs font-semibold tracking-wider text-muted-foreground/70 uppercase">Budget Used</div>
                <div className="mt-2 font-heading text-2xl font-semibold text-foreground">{budgetPct}%</div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-terracotta-400 transition-all"
                    style={{ width: `${Math.min(budgetPct, 100)}%` }}
                  />
                </div>
                <div className="mt-1 text-xs text-muted-foreground">{formatCurrency(budgetSpent)} of {formatCurrency(budgetTotal)}</div>
              </CardContent>
            </Card>

            <Card className="shadow-warm-sm">
              <CardContent className="p-5">
                <div className="text-xs font-semibold tracking-wider text-muted-foreground/70 uppercase">Next Step</div>
                {activeStep ? (
                  <>
                    <div className="mt-2 text-xl">{stepIcons[activeStep.step_type] ?? "📋"}</div>
                    <div className="mt-1 text-sm font-medium text-foreground line-clamp-1">{activeStep.title}</div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      Due {activeStep.recommended_deadline ? new Date(activeStep.recommended_deadline).toLocaleDateString("en-IN", { day: "numeric", month: "short" }) : "—"}
                    </div>
                  </>
                ) : (
                  <div className="mt-2 text-sm text-muted-foreground">All caught up!</div>
                )}
              </CardContent>
            </Card>

            <Card className="shadow-warm-sm">
              <CardContent className="p-5">
                <div className="text-xs font-semibold tracking-wider text-muted-foreground/70 uppercase">Remaining</div>
                <div className="mt-2 font-heading text-2xl font-semibold text-sage-600">{formatCurrency(budgetTotal - budgetSpent)}</div>
                <div className="mt-1 text-xs text-muted-foreground">budget available</div>
                <Link href="/dashboard/budget" className="mt-2 flex items-center gap-1 text-xs font-medium text-terracotta-500 hover:text-terracotta-700">
                  View tracker <ArrowRight className="h-3 w-3" />
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Journey + Actions */}
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Upcoming milestones */}
            <div className="lg:col-span-2">
              <Card className="shadow-warm h-full">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="font-heading text-lg font-semibold">Upcoming Milestones</CardTitle>
                    <Link href="/dashboard/journey" className="flex items-center gap-1 text-xs font-medium text-terracotta-500 hover:text-terracotta-700">
                      View all <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {journeySteps.length === 0 ? (
                    <div className="py-6 text-center">
                      <p className="text-sm text-muted-foreground">No journey steps yet.</p>
                      <form action="/api/journey/initialize" method="POST" className="mt-3">
                        <input type="hidden" name="returnTo" value="/dashboard?journey=created" />
                        <Button type="submit" size="sm" className="rounded-full bg-terracotta-500 text-white hover:bg-terracotta-600">
                          <Sparkles className="mr-2 h-3.5 w-3.5" />
                          Generate my journey plan
                        </Button>
                      </form>
                    </div>
                  ) : (
                    journeySteps.slice(0, 5).map((step) => (
                      <div key={step.id} className="flex items-center gap-3 rounded-xl border border-border/30 bg-muted/20 px-4 py-3">
                        <span className="text-lg">{stepIcons[step.step_type] ?? "📋"}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-foreground truncate">{step.title}</span>
                            <Badge
                              variant="outline"
                              className={`shrink-0 text-[10px] font-medium ${
                                step.status === "completed"
                                  ? "border-sage-200 bg-sage-50 text-sage-700"
                                  : step.status === "active"
                                  ? "border-terracotta-200 bg-terracotta-50 text-terracotta-700"
                                  : "border-border/40 text-muted-foreground"
                              }`}
                            >
                              {step.status}
                            </Badge>
                          </div>
                          {step.recommended_deadline && (
                            <div className="mt-0.5 flex items-center gap-1 text-xs text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              by {new Date(step.recommended_deadline).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                            </div>
                          )}
                        </div>
                        {step.status === "completed" && (
                          <CheckCircle2 className="h-4 w-4 shrink-0 text-sage-500" />
                        )}
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Quick actions */}
            <div className="space-y-4">
              <Card className="shadow-warm">
                <CardHeader className="pb-3">
                  <CardTitle className="font-heading text-lg font-semibold">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button asChild className="w-full justify-start rounded-xl bg-terracotta-50 text-terracotta-700 hover:bg-terracotta-100" variant="ghost">
                    <Link href={`/venues?date=${wedding.wedding_date}&city=${wedding.city}`}>
                      🏛️ Browse venues in {wedding.city}
                    </Link>
                  </Button>
                  <Button asChild className="w-full justify-start rounded-xl" variant="ghost">
                    <Link href={`/services?date=${wedding.wedding_date}&city=${wedding.city}`}>
                      📸 Find photographers
                    </Link>
                  </Button>
                  <Button asChild className="w-full justify-start rounded-xl" variant="ghost">
                    <Link href="/dashboard/bookings">
                      📋 My bookings
                    </Link>
                  </Button>
                  <Button asChild className="w-full justify-start rounded-xl" variant="ghost">
                    <Link href="/dashboard/messages">
                      💬 Messages
                    </Link>
                  </Button>
                  <Button asChild className="w-full justify-start rounded-xl" variant="ghost">
                    <Link href="/dashboard/budget">
                      💰 Budget tracker
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Urgency nudge */}
              {urgency === "critical" || urgency === "soon" ? (
                <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
                    <div>
                      <div className="font-semibold text-amber-800">Act soon</div>
                      <p className="mt-1 text-xs text-amber-700">
                        With {daysUntil} days to go, vendors in {wedding.city} are booking fast. Prioritize your open milestones.
                      </p>
                      <Link href="/dashboard/journey" className="mt-2 flex items-center gap-1 text-xs font-semibold text-amber-700 underline">
                        See what&apos;s pending <ArrowRight className="h-3 w-3" />
                      </Link>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
