import { Heart, Users, Shield, Sparkles } from "lucide-react";
import { ScrollReveal } from "@/components/ui/scroll-reveal";

const values = [
  {
    icon: Heart,
    title: "Built with love",
    description:
      "We understand that a wedding is one of life's most important celebrations. Every feature we build is designed to reduce stress and amplify joy.",
  },
  {
    icon: Users,
    title: "Two-sided trust",
    description:
      "We serve both couples and vendors equally. Secure escrow payments, verified reviews, and transparent pricing protect everyone on the platform.",
  },
  {
    icon: Shield,
    title: "Quality first",
    description:
      "Every vendor on VivahVedam is manually verified. We check portfolios, reviews, and business credentials before approving any listing.",
  },
  {
    icon: Sparkles,
    title: "Modern planning",
    description:
      "From AI-powered vendor matching to real-time budget tracking and personalized journey timelines — we bring wedding planning into the modern era.",
  },
];

const stats = [
  { value: "2,500+", label: "Verified vendors" },
  { value: "200+", label: "Cities covered" },
  { value: "10,000+", label: "Happy couples" },
  { value: "₹50Cr+", label: "Weddings booked" },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="grain relative overflow-hidden bg-gradient-to-b from-[#faf6f1] to-[#f5ebe0] py-20 lg:py-28">
        <div className="container mx-auto max-w-3xl px-4 text-center">
          <p className="text-xs font-semibold tracking-widest text-terracotta-500 uppercase">
            Our Story
          </p>
          <h1 className="mt-4 font-heading text-4xl font-light leading-tight tracking-tight lg:text-5xl">
            Making wedding planning{" "}
            <span className="italic text-terracotta-500">joyful</span>, not
            stressful
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-muted-foreground">
            VivahVedam was born from a simple observation: planning an Indian
            wedding shouldn&apos;t require 50 phone calls, 30 spreadsheets, and
            months of uncertainty. We built the platform we wished existed when
            we were planning our own weddings.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-border/50 bg-card">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 divide-x divide-border/50 md:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="px-6 py-8 text-center">
                <div className="font-heading text-2xl font-semibold text-foreground lg:text-3xl">
                  {stat.value}
                </div>
                <div className="mt-1 text-xs tracking-wider text-muted-foreground uppercase">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto max-w-4xl px-4">
          <ScrollReveal>
            <div className="text-center">
              <p className="text-xs font-semibold tracking-widest text-terracotta-500 uppercase">
                Our Mission
              </p>
              <h2 className="mt-3 font-heading text-3xl font-light tracking-tight lg:text-4xl">
                One platform for your entire wedding
              </h2>
              <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground">
                Indian weddings are beautiful, complex, multi-day celebrations.
                They involve dozens of vendors, lakhs in budget, and months of
                planning. VivahVedam brings it all together — venue discovery,
                vendor hiring, budget tracking, and timeline management — so
                couples can focus on what matters: celebrating love with family
                and friends.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Values */}
      <section className="bg-[#f5ebe0] py-20 lg:py-28">
        <div className="container mx-auto max-w-4xl px-4">
          <ScrollReveal>
            <div className="text-center">
              <p className="text-xs font-semibold tracking-widest text-terracotta-500 uppercase">
                What We Stand For
              </p>
              <h2 className="mt-3 font-heading text-3xl font-light tracking-tight lg:text-4xl">
                Our values
              </h2>
            </div>
          </ScrollReveal>

          <div className="mt-12 grid gap-8 md:grid-cols-2">
            {values.map((value, i) => {
              const Icon = value.icon;
              return (
                <ScrollReveal key={value.title} delay={i * 0.1}>
                  <div className="shadow-warm rounded-2xl border border-border/30 bg-card p-6">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-terracotta-50 text-terracotta-500">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="mt-4 font-heading text-lg font-semibold">
                      {value.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {value.description}
                    </p>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* For Vendors */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto max-w-3xl px-4 text-center">
          <ScrollReveal>
            <p className="text-xs font-semibold tracking-widest text-terracotta-500 uppercase">
              For Vendors
            </p>
            <h2 className="mt-3 font-heading text-3xl font-light tracking-tight lg:text-4xl">
              Grow your wedding business
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-muted-foreground">
              VivahVedam connects you with couples who are actively planning and
              ready to book. No cold calls, no middlemen. List your services,
              showcase your portfolio, manage bookings, and get paid securely —
              all from one dashboard.
            </p>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
