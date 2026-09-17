import Link from "next/link";
import {
  Building2,
  Camera,
  Music,
  UtensilsCrossed,
  Palette,
  Sparkles,
  CalendarDays,
  MapPin,
  ArrowRight,
  CheckCircle2,
  Star,
  Quote,
  IndianRupee,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { Navbar } from "@/components/layouts/navbar";
import { Footer } from "@/components/layouts/footer";
import { HeroSearchBar } from "@/components/forms/hero-search-bar";

const categories = [
  {
    icon: Building2,
    label: "Venues",
    count: "340+",
    slug: "venues",
    color: "bg-terracotta-50 text-terracotta-600",
  },
  {
    icon: Camera,
    label: "Photography",
    count: "520+",
    slug: "photography",
    color: "bg-sage-50 text-sage-600",
  },
  {
    icon: UtensilsCrossed,
    label: "Catering",
    count: "280+",
    slug: "catering",
    color: "bg-gold-50 text-gold-700",
  },
  {
    icon: Palette,
    label: "Decor",
    count: "190+",
    slug: "decor",
    color: "bg-terracotta-50 text-terracotta-600",
  },
  {
    icon: Music,
    label: "Music & DJ",
    count: "150+",
    slug: "music-dj",
    color: "bg-sage-50 text-sage-600",
  },
  {
    icon: Sparkles,
    label: "Makeup",
    count: "410+",
    slug: "makeup",
    color: "bg-gold-50 text-gold-700",
  },
];

const featuredVenues = [
  {
    name: "The Grand Pavilion",
    city: "Mumbai",
    capacity: "500 guests",
    price: "₹8,00,000",
    rating: 4.9,
    gradient: "from-amber-800/60 via-amber-700/40 to-yellow-900/60",
  },
  {
    name: "Garden of Dreams",
    city: "Jaipur",
    capacity: "300 guests",
    price: "₹5,20,000",
    rating: 4.8,
    gradient: "from-emerald-800/60 via-emerald-700/40 to-green-900/60",
  },
  {
    name: "Royal Heritage Palace",
    city: "Udaipur",
    capacity: "800 guests",
    price: "₹15,00,000",
    rating: 5.0,
    gradient: "from-rose-800/60 via-rose-700/40 to-red-900/60",
  },
];

const steps = [
  {
    num: "01",
    icon: CalendarDays,
    title: "Tell us your vision",
    description:
      "Share your wedding date, city, and budget. We instantly surface venues and vendors that match your dream day.",
  },
  {
    num: "02",
    icon: Building2,
    title: "Discover & book",
    description:
      "Browse curated venues, compare professionals, read real reviews, and secure bookings with secure escrow payments.",
  },
  {
    num: "03",
    icon: CheckCircle2,
    title: "Plan with confidence",
    description:
      "Your personalized dashboard guides every step — from first booking to final detail. Message vendors, track budget, stay on schedule.",
  },
];

const testimonials = [
  {
    quote:
      "VivahVedam made planning our destination wedding in Udaipur feel effortless. We found our dream venue, photographer, and caterer all in one place.",
    name: "Priya & Arjun",
    role: "Married Dec 2025",
    rating: 5,
  },
  {
    quote:
      "As a vendor, the platform has transformed my business. I've booked 40% more weddings this season and the escrow payments give both sides peace of mind.",
    name: "Kavita Sharma",
    role: "Wedding Photographer",
    rating: 5,
  },
  {
    quote:
      "The journey planner kept us on track when we were overwhelmed. Every milestone, every deadline — beautifully organized. Worth every rupee.",
    name: "Meera & Rohan",
    role: "Married Mar 2026",
    rating: 5,
  },
];

const stats = [
  { value: "2,500+", label: "Verified Vendors" },
  { value: "10,000+", label: "Happy Couples" },
  { value: "₹50Cr+", label: "Weddings Booked" },
  { value: "4.9★", label: "Average Rating" },
];

export default function HomePage() {
  return (
    <>
      <Navbar />

      <main>
        {/* ═══ Hero ═══ */}
        <section className="grain relative overflow-hidden bg-gradient-to-b from-[#faf6f1] via-[#f5ebe0] to-[#ede7df]">
          <div className="container mx-auto px-4 pb-16 pt-20 lg:pb-24 lg:pt-32">
            <div className="mx-auto max-w-3xl text-center">
              <p className="animate-reveal-up font-body text-sm font-medium tracking-widest text-terracotta-500 uppercase">
                The Modern Wedding Marketplace
              </p>

              <h1 className="animate-reveal-up delay-1 mt-6 font-heading text-5xl font-light leading-[1.1] tracking-tight text-foreground lg:text-7xl">
                Plan the wedding
                <br />
                you&apos;ve always{" "}
                <span className="font-normal italic text-terracotta-500">
                  imagined
                </span>
              </h1>

              <p className="animate-reveal-up delay-2 mx-auto mt-6 max-w-lg text-lg leading-relaxed text-muted-foreground">
                Discover venues, hire top professionals, and manage every detail
                of your special day — all in one beautiful place.
              </p>

              {/* ── Airbnb-style Search Bar ── */}
              <div className="animate-reveal-up delay-3 mx-auto mt-10 max-w-2xl">
                <HeroSearchBar />
              </div>

              {/* ── Trust Badges ── */}
              <div className="animate-reveal-up delay-4 mt-8 flex flex-wrap justify-center gap-x-8 gap-y-2 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-sage-500" />
                  2,500+ verified vendors
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-sage-500" />
                  Secure escrow payments
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-sage-500" />
                  Free to browse
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* ═══ Stats Strip ═══ */}
        <section className="border-y border-border/50 bg-card">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 divide-x divide-border/50 md:grid-cols-4">
              {stats.map((stat, i) => (
                <ScrollReveal key={stat.label} delay={i * 0.1}>
                  <div className="px-6 py-8 text-center">
                    <div className="font-heading text-2xl font-semibold text-foreground lg:text-3xl">
                      {stat.value}
                    </div>
                    <div className="mt-1 text-xs tracking-wider text-muted-foreground uppercase">
                      {stat.label}
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ Browse by Category ═══ */}
        <section className="py-20 lg:py-28">
          <div className="container mx-auto px-4">
            <ScrollReveal>
              <div className="text-center">
                <p className="text-xs font-semibold tracking-widest text-terracotta-500 uppercase">
                  Everything You Need
                </p>
                <h2 className="mt-3 font-heading text-3xl font-light tracking-tight lg:text-4xl">
                  Browse by category
                </h2>
              </div>
            </ScrollReveal>

            <div className="mx-auto mt-12 grid max-w-4xl grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
              {categories.map((cat, i) => {
                const Icon = cat.icon;
                return (
                  <ScrollReveal key={cat.slug} delay={i * 0.08}>
                    <Link
                      href={
                        cat.slug === "venues"
                          ? "/venues"
                          : `/services?category=${cat.slug}`
                      }
                      className="shadow-warm-sm group flex flex-col items-center rounded-2xl border border-border/40 bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-warm-lg"
                    >
                      <div
                        className={`flex h-14 w-14 items-center justify-center rounded-xl ${cat.color} transition-transform duration-300 group-hover:scale-110`}
                      >
                        <Icon className="h-6 w-6" />
                      </div>
                      <span className="mt-3 text-sm font-semibold text-foreground">
                        {cat.label}
                      </span>
                      <span className="mt-0.5 text-xs text-muted-foreground">
                        {cat.count} pros
                      </span>
                    </Link>
                  </ScrollReveal>
                );
              })}
            </div>
          </div>
        </section>

        {/* ═══ Featured Venues ═══ */}
        <section className="bg-[#f5ebe0] py-20 lg:py-28">
          <div className="container mx-auto px-4">
            <ScrollReveal>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-xs font-semibold tracking-widest text-terracotta-500 uppercase">
                    Hand-Picked
                  </p>
                  <h2 className="mt-3 font-heading text-3xl font-light tracking-tight lg:text-4xl">
                    Featured venues
                  </h2>
                </div>
                <Link
                  href="/venues"
                  className="hidden items-center gap-1 text-sm font-medium text-terracotta-500 transition-colors hover:text-terracotta-700 md:flex"
                >
                  View all venues
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </ScrollReveal>

            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {featuredVenues.map((venue, i) => (
                <ScrollReveal key={venue.name} delay={i * 0.12}>
                  <Link
                    href="/venues"
                    className="shadow-warm group block overflow-hidden rounded-2xl bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-warm-xl"
                  >
                    <div
                      className={`relative h-52 bg-gradient-to-br ${venue.gradient} overflow-hidden`}
                    >
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                      <div className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full bg-white/90 px-2.5 py-1 text-xs font-semibold text-foreground backdrop-blur-sm">
                        <Star className="h-3 w-3 fill-gold-500 text-gold-500" />
                        {venue.rating}
                      </div>
                    </div>
                    <div className="p-5">
                      <h3 className="font-heading text-lg font-semibold text-foreground">
                        {venue.name}
                      </h3>
                      <div className="mt-1.5 flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {venue.city}
                        </span>
                        <span>·</span>
                        <span>{venue.capacity}</span>
                      </div>
                      <div className="mt-4 flex items-center justify-between border-t border-border/50 pt-4">
                        <div>
                          <span className="text-xs text-muted-foreground">
                            Starting at
                          </span>
                          <div className="flex items-center text-lg font-semibold text-foreground">
                            {venue.price}
                          </div>
                        </div>
                        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-terracotta-50 text-terracotta-500 transition-colors group-hover:bg-terracotta-500 group-hover:text-white">
                          <ArrowRight className="h-4 w-4" />
                        </span>
                      </div>
                    </div>
                  </Link>
                </ScrollReveal>
              ))}
            </div>

            <div className="mt-8 text-center md:hidden">
              <Button variant="outline" asChild>
                <Link href="/venues">
                  View all venues
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* ═══ How It Works ═══ */}
        <section className="py-20 lg:py-28">
          <div className="container mx-auto px-4">
            <ScrollReveal>
              <div className="text-center">
                <p className="text-xs font-semibold tracking-widest text-terracotta-500 uppercase">
                  Simple Process
                </p>
                <h2 className="mt-3 font-heading text-3xl font-light tracking-tight lg:text-4xl">
                  How VivahVedam works
                </h2>
              </div>
            </ScrollReveal>

            <div className="mx-auto mt-16 grid max-w-5xl gap-12 md:grid-cols-3 md:gap-8">
              {steps.map((step, i) => {
                const Icon = step.icon;
                return (
                  <ScrollReveal key={step.num} delay={i * 0.15}>
                    <div className="relative text-center md:text-left">
                      <span className="font-heading text-6xl font-light text-terracotta-100">
                        {step.num}
                      </span>
                      <div className="-mt-4 mb-4 flex justify-center md:justify-start">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sage-50 text-sage-600">
                          <Icon className="h-6 w-6" />
                        </div>
                      </div>
                      <h3 className="font-heading text-xl font-semibold text-foreground">
                        {step.title}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                        {step.description}
                      </p>
                    </div>
                  </ScrollReveal>
                );
              })}
            </div>
          </div>
        </section>

        {/* ═══ Testimonials ═══ */}
        <section className="grain relative overflow-hidden bg-gradient-to-b from-[#f5ebe0] to-[#ede7df] py-20 lg:py-28">
          <div className="container mx-auto px-4">
            <ScrollReveal>
              <div className="text-center">
                <p className="text-xs font-semibold tracking-widest text-terracotta-500 uppercase">
                  Love Stories
                </p>
                <h2 className="mt-3 font-heading text-3xl font-light tracking-tight lg:text-4xl">
                  What our couples say
                </h2>
              </div>
            </ScrollReveal>

            <div className="mx-auto mt-12 grid max-w-5xl gap-6 md:grid-cols-3">
              {testimonials.map((t, i) => (
                <ScrollReveal key={t.name} delay={i * 0.12}>
                  <div className="shadow-warm flex h-full flex-col rounded-2xl border border-border/30 bg-card p-6">
                    <Quote className="mb-3 h-8 w-8 text-terracotta-200" />
                    <p className="flex-1 text-sm leading-relaxed text-foreground/80">
                      &ldquo;{t.quote}&rdquo;
                    </p>
                    <div className="mt-6 flex items-center gap-3 border-t border-border/50 pt-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-terracotta-50 font-heading text-sm font-semibold text-terracotta-600">
                        {t.name.charAt(0)}
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-foreground">
                          {t.name}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {t.role}
                        </div>
                      </div>
                      <div className="ml-auto flex gap-0.5">
                        {Array.from({ length: t.rating }).map((_, j) => (
                          <Star
                            key={j}
                            className="h-3 w-3 fill-gold-400 text-gold-400"
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ Vendor CTA ═══ */}
        <section className="bg-[#2c2825] py-20 lg:py-28">
          <div className="container mx-auto px-4">
            <ScrollReveal>
              <div className="mx-auto max-w-2xl text-center">
                <p className="text-xs font-semibold tracking-widest text-terracotta-400 uppercase">
                  For Professionals
                </p>
                <h2 className="mt-4 font-heading text-3xl font-light tracking-tight text-[#f5ebe0] lg:text-4xl">
                  Grow your wedding business
                </h2>
                <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-[#a09080]">
                  Join 2,500+ verified vendors on India&apos;s fastest-growing
                  wedding marketplace. Manage bookings, showcase your portfolio,
                  and reach couples actively planning their dream wedding.
                </p>

                <div className="mt-10 flex flex-wrap justify-center gap-8 text-center">
                  {[
                    { val: "40%", label: "More bookings" },
                    { val: "₹0", label: "To list" },
                    { val: "3 days", label: "Avg. first booking" },
                  ].map((s) => (
                    <div key={s.label}>
                      <div className="font-heading text-2xl font-semibold text-terracotta-400">
                        {s.val}
                      </div>
                      <div className="mt-1 text-xs text-[#a09080]">
                        {s.label}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-10">
                  <Button
                    size="lg"
                    className="rounded-full bg-terracotta-500 px-8 text-white hover:bg-terracotta-600"
                    asChild
                  >
                    <Link href="/signup">
                      List your business
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
