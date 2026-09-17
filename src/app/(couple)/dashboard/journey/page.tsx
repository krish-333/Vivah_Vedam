import Link from "next/link";
import { redirect } from "next/navigation";
import { CheckCircle2, Clock, Sparkles, ArrowRight, Circle, SkipForward } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { createDbSession } from "@/lib/server/auth";

type CoupleJourneyPageProps = {
  searchParams: Promise<{ journey?: string }>;
};

const stepIcons: Record<string, string> = {
  venue: "🏛️", photography: "📸", catering: "🍽️", decor: "💐",
  makeup: "💄", music: "🎵", mehndi: "✋", finalization: "✅",
};

export default async function CoupleJourneyPage({ searchParams }: CoupleJourneyPageProps) {
  const query = await searchParams;
  const session = await createDbSession();
  const { data: { user } } = await session.auth.getUser();

  if (!user) redirect("/login?redirect=/dashboard/journey");

  const { data: wedding } = await session
    .from("weddings")
    .select("id,wedding_date")
    .eq("couple_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const steps = wedding
    ? (await session
        .from("journey_steps")
        .select("id,title,description,status,recommended_deadline,order_index,step_type")
        .eq("wedding_id", wedding.id)
        .order("order_index", { ascending: true })
      ).data ?? []
    : [];

  const completed = steps.filter((s) => s.status === "completed").length;
  const total = steps.length;
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <p className="text-xs font-semibold tracking-widest text-terracotta-500 uppercase">Planning</p>
        <h1 className="mt-1 font-heading text-2xl font-light text-foreground">Your Journey</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Complete each milestone to ensure a seamless wedding day.
        </p>
      </div>

      {query.journey === "updated" && (
        <div className="flex items-center gap-3 rounded-xl border border-sage-200 bg-sage-50 px-4 py-3 text-sm text-sage-700">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-sage-500" />
          Journey step updated.
        </div>
      )}

      {steps.length === 0 ? (
        <Card className="shadow-warm">
          <CardContent className="py-12 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-terracotta-50 text-terracotta-500">
              <Sparkles className="h-6 w-6" />
            </div>
            <h2 className="font-heading text-lg font-semibold">No journey steps yet</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Generate your personalised planning milestones from the dashboard.
            </p>
            <Button asChild className="mt-5 rounded-full bg-terracotta-500 text-white hover:bg-terracotta-600">
              <Link href="/dashboard">Go to Dashboard</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Progress */}
          <div className="rounded-2xl border border-border/30 bg-card p-5 shadow-warm-sm">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold tracking-wider text-muted-foreground/70 uppercase">Overall Progress</div>
                <div className="mt-1 font-heading text-2xl font-semibold text-foreground">{completed}/{total} milestones</div>
              </div>
              <div className="font-heading text-3xl font-light text-terracotta-400">{pct}%</div>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-sage-500 transition-all duration-500"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>

          {/* Steps */}
          <div className="space-y-3">
            {steps.map((step, i) => (
              <div
                key={step.id}
                className={`group rounded-2xl border p-5 transition-all ${
                  step.status === "completed"
                    ? "border-sage-200 bg-sage-50/50"
                    : step.status === "active"
                    ? "border-terracotta-200 bg-terracotta-50/50 shadow-warm-sm"
                    : step.status === "skipped"
                    ? "border-border/20 bg-muted/20 opacity-60"
                    : "border-border/40 bg-card"
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Step number / icon */}
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-lg ${
                    step.status === "completed" ? "bg-sage-100" :
                    step.status === "active" ? "bg-terracotta-100" :
                    "bg-muted"
                  }`}>
                    {step.status === "completed"
                      ? <CheckCircle2 className="h-5 w-5 text-sage-600" />
                      : stepIcons[step.step_type] ?? (
                          <span className="text-sm font-semibold text-muted-foreground">{i + 1}</span>
                        )
                    }
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className={`text-sm font-semibold ${step.status === "completed" ? "text-muted-foreground line-through decoration-sage-400" : "text-foreground"}`}>
                        {step.title}
                      </h3>
                      <Badge
                        variant="outline"
                        className={`text-[10px] font-medium capitalize ${
                          step.status === "completed" ? "border-sage-200 bg-sage-50 text-sage-700" :
                          step.status === "active" ? "border-terracotta-200 bg-terracotta-50 text-terracotta-700" :
                          step.status === "skipped" ? "border-border/40 text-muted-foreground" :
                          "border-border/40 text-muted-foreground"
                        }`}
                      >
                        {step.status}
                      </Badge>
                    </div>

                    {step.description && (
                      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{step.description}</p>
                    )}

                    {step.recommended_deadline && (
                      <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3 text-terracotta-400" />
                        Recommended by {new Date(step.recommended_deadline).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                      </div>
                    )}

                    {/* Actions */}
                    {step.status !== "completed" && step.status !== "skipped" && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        <form action="/api/journey/status" method="POST">
                          <input type="hidden" name="stepId" value={step.id} />
                          <input type="hidden" name="action" value="complete" />
                          <input type="hidden" name="returnTo" value="/dashboard/journey?journey=updated" />
                          <Button type="submit" size="sm" className="h-7 rounded-full bg-sage-500 px-3 text-xs text-white hover:bg-sage-600">
                            <CheckCircle2 className="mr-1 h-3 w-3" />
                            Mark done
                          </Button>
                        </form>

                        {step.status !== "active" && (
                          <form action="/api/journey/status" method="POST">
                            <input type="hidden" name="stepId" value={step.id} />
                            <input type="hidden" name="action" value="activate" />
                            <input type="hidden" name="returnTo" value="/dashboard/journey?journey=updated" />
                            <Button type="submit" size="sm" variant="outline" className="h-7 rounded-full px-3 text-xs">
                              <Circle className="mr-1 h-3 w-3" />
                              Set active
                            </Button>
                          </form>
                        )}

                        <form action="/api/journey/status" method="POST">
                          <input type="hidden" name="stepId" value={step.id} />
                          <input type="hidden" name="action" value="skip" />
                          <input type="hidden" name="returnTo" value="/dashboard/journey?journey=updated" />
                          <Button type="submit" size="sm" variant="ghost" className="h-7 rounded-full px-3 text-xs text-muted-foreground hover:text-foreground">
                            <SkipForward className="mr-1 h-3 w-3" />
                            Skip
                          </Button>
                        </form>
                      </div>
                    )}

                    {step.status === "completed" && (
                      <div className="mt-2 flex items-center gap-1 text-xs text-sage-600">
                        <CheckCircle2 className="h-3 w-3" />
                        Completed
                      </div>
                    )}
                  </div>

                  {/* Arrow link for "find vendors" */}
                  {(step.status === "active" || step.status === "upcoming") && step.step_type !== "finalization" && (
                    <Link
                      href={`/services?category=${step.step_type}`}
                      className="mt-1 shrink-0 flex h-8 w-8 items-center justify-center rounded-full border border-terracotta-200 bg-terracotta-50 text-terracotta-500 transition-all hover:bg-terracotta-500 hover:text-white"
                      title={`Find ${step.step_type} vendors`}
                    >
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
