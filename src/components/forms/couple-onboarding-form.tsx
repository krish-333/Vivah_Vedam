"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Calendar, MapPin, Users, IndianRupee, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function getDaysUntil(dateStr: string): number | null {
  if (!dateStr) return null;
  const target = new Date(dateStr);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diff = Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  return diff > 0 ? diff : null;
}

function getDateMessage(days: number | null): { emoji: string; message: string; sub: string } | null {
  if (!days) return null;
  if (days <= 90) return { emoji: "🔴", message: `${days} days to go`, sub: "Book your remaining vendors today — many are already fully booked." };
  if (days <= 180) return { emoji: "🟠", message: `${days} days to go`, sub: "Great time to lock in venues, photographers, and decor." };
  if (days <= 365) return { emoji: "🟢", message: `${days} days to go`, sub: "Perfect timing! Start with venue and photography — they book first." };
  return { emoji: "🔵", message: `${days} days to go`, sub: "You have great runway — start shortlisting and save your favourites." };
}

export function CoupleOnboardingForm() {
  const router = useRouter();
  const [step, setStep] = useState(1);

  const [weddingDate, setWeddingDate] = useState("");
  const [city, setCity] = useState("");
  const [guestCount, setGuestCount] = useState("");
  const [budgetTotal, setBudgetTotal] = useState("");
  const [partner1Name, setPartner1Name] = useState("");
  const [partner2Name, setPartner2Name] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const days = getDaysUntil(weddingDate);
  const dateMessage = getDateMessage(days);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await fetch("/api/onboarding/couple", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        partner_1_name: partner1Name || "Partner 1",
        partner_2_name: partner2Name || "Partner 2",
        wedding_date: weddingDate,
        city,
        guest_count: parseInt(guestCount, 10),
        budget_total: budgetTotal ? parseFloat(budgetTotal) : 0,
      }),
    });
    const json = await res.json();

    if (!res.ok) {
      setError(json.error?.message ?? "Something went wrong. Please try again.");
      setLoading(false);
      return;
    }

    router.push("/dashboard");
  }

  return (
    <div className="w-full max-w-lg">
      {/* Step 1: Date first */}
      {step === 1 && (
        <div className="space-y-6">
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-terracotta-50 text-3xl">
              💍
            </div>
            <h1 className="font-heading text-2xl font-light">
              When&apos;s the big day?
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Your wedding date is the heart of your planning journey. We&apos;ll build your entire timeline around it.
            </p>
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-sm font-medium">
              <Calendar className="h-4 w-4 text-terracotta-500" />
              Wedding Date
            </Label>
            <Input
              type="date"
              value={weddingDate}
              onChange={(e) => setWeddingDate(e.target.value)}
              min={new Date().toISOString().slice(0, 10)}
              required
              className="h-14 rounded-xl border-border/60 text-center text-lg font-medium"
            />
          </div>

          {/* Smart date feedback */}
          {dateMessage && (
            <div className="rounded-xl border border-border/40 bg-card p-4 shadow-warm-sm">
              <div className="flex items-center gap-2">
                <span className="text-xl">{dateMessage.emoji}</span>
                <span className="font-heading font-semibold text-foreground">{dateMessage.message}</span>
              </div>
              <p className="mt-1 pl-8 text-xs leading-relaxed text-muted-foreground">{dateMessage.sub}</p>
            </div>
          )}

          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-sm font-medium">
              <MapPin className="h-4 w-4 text-terracotta-500" />
              Wedding City
            </Label>
            <Input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Mumbai, Delhi, Jaipur, Goa…"
              required
              className="h-12 rounded-xl border-border/60"
            />
          </div>

          <Button
            type="button"
            onClick={() => setStep(2)}
            disabled={!weddingDate || !city}
            className="w-full rounded-full bg-terracotta-500 py-6 text-base font-medium text-white hover:bg-terracotta-600 disabled:opacity-50"
          >
            Continue
            <span className="ml-2">→</span>
          </Button>
        </div>
      )}

      {/* Step 2: Details */}
      {step === 2 && (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-sage-50 text-2xl">
              ✨
            </div>
            <h1 className="font-heading text-2xl font-light">Tell us a bit more</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {city} · {weddingDate ? new Date(weddingDate).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }) : ""}
              {days ? ` · ${days} days away` : ""}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-sm">Your Name</Label>
              <Input
                type="text"
                placeholder="Priya"
                value={partner1Name}
                onChange={(e) => setPartner1Name(e.target.value)}
                className="rounded-xl border-border/60"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-sm">Partner&apos;s Name</Label>
              <Input
                type="text"
                placeholder="Arjun"
                value={partner2Name}
                onChange={(e) => setPartner2Name(e.target.value)}
                className="rounded-xl border-border/60"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="flex items-center gap-2 text-sm font-medium">
              <Users className="h-4 w-4 text-terracotta-500" />
              Expected Guests
            </Label>
            <Input
              type="number"
              min={1}
              placeholder="e.g. 300"
              value={guestCount}
              onChange={(e) => setGuestCount(e.target.value)}
              required
              className="rounded-xl border-border/60"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="flex items-center gap-2 text-sm font-medium">
              <IndianRupee className="h-4 w-4 text-terracotta-500" />
              Total Budget (₹)
            </Label>
            <Input
              type="number"
              min={0}
              step={100000}
              placeholder="e.g. 3500000 (35 Lakhs)"
              value={budgetTotal}
              onChange={(e) => setBudgetTotal(e.target.value)}
              className="rounded-xl border-border/60"
            />
            <p className="text-xs text-muted-foreground">Average Indian wedding budget: ₹25–50 Lakhs</p>
          </div>

          {error && (
            <p className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
              {error}
            </p>
          )}

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setStep(1)}
              className="flex-1 rounded-full"
            >
              Back
            </Button>
            <Button
              type="submit"
              disabled={loading || !guestCount}
              className="flex-1 rounded-full bg-terracotta-500 text-white hover:bg-terracotta-600"
            >
              <Sparkles className="mr-2 h-4 w-4" />
              {loading ? "Setting up…" : "Start my journey"}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
