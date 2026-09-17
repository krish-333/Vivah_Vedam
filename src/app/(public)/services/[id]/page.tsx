import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MapPin, Star, ArrowLeft, CheckCircle2, Shield, Clock, Calendar, IndianRupee } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatCurrency, getServiceById, getVendorById } from "@/lib/marketplace";

type ServiceDetailPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ booking?: string; date?: string }>;
};

const categoryConfig: Record<string, { emoji: string; label: string; color: string }> = {
  photography: { emoji: "📸", label: "Photography", color: "bg-blue-50 text-blue-700" },
  decor: { emoji: "💐", label: "Decor", color: "bg-pink-50 text-pink-700" },
  catering: { emoji: "🍽️", label: "Catering", color: "bg-orange-50 text-orange-700" },
  makeup: { emoji: "💄", label: "Makeup", color: "bg-rose-50 text-rose-700" },
  "music-dj": { emoji: "🎵", label: "Music & DJ", color: "bg-purple-50 text-purple-700" },
  mehndi: { emoji: "✋", label: "Mehndi", color: "bg-amber-50 text-amber-700" },
  planning: { emoji: "✨", label: "Wedding Planning", color: "bg-sage-50 text-sage-700" },
  "bridal-wear": { emoji: "👗", label: "Bridal Wear", color: "bg-terracotta-50 text-terracotta-700" },
};

export default async function ServiceDetailPage({ params, searchParams }: ServiceDetailPageProps) {
  const { id } = await params;
  const query = await searchParams;
  const service = await getServiceById(id);

  if (!service) notFound();

  const vendor = await getVendorById(service.vendorId);
  const dateParam = query.date ?? "";

  const formattedDate = dateParam
    ? new Date(dateParam).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })
    : null;

  const cat = categoryConfig[service.category];

  return (
    <div className="min-h-screen bg-[#faf6f1]">
      {/* Hero image */}
      <div className="relative h-[40vh] min-h-[280px] w-full overflow-hidden bg-gradient-to-br from-sage-100 via-terracotta-50 to-gold-100">
        {service.coverImage ? (
          <Image
            src={service.coverImage}
            alt={service.title}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-t from-[#2c2825]/60 to-transparent" />

        {/* Back button */}
        <Link
          href={`/services${dateParam ? `?date=${dateParam}` : ""}${service.category ? `${dateParam ? "&" : "?"}category=${service.category}` : ""}`}
          className="absolute left-4 top-4 flex items-center gap-2 rounded-full border border-white/30 bg-white/20 px-3 py-1.5 text-sm font-medium text-white backdrop-blur-sm hover:bg-white/30 transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          All services
        </Link>

        {/* Available badge */}
        {formattedDate && (
          <div className="absolute right-4 top-4 flex items-center gap-1.5 rounded-full border border-sage-300 bg-sage-500/90 px-3 py-1.5 text-sm font-semibold text-white backdrop-blur-sm">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Available {formattedDate}
          </div>
        )}

        {/* Title overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          {cat && (
            <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${cat.color} mb-2`}>
              {cat.emoji} {cat.label}
            </span>
          )}
          <h1 className="font-heading text-3xl font-light text-white lg:text-4xl">{service.title}</h1>
        </div>
      </div>

      {/* Date context banner */}
      {formattedDate && (
        <div className="border-b border-sage-200 bg-sage-50">
          <div className="container mx-auto flex items-center gap-2 px-4 py-2.5 text-sm text-sage-700">
            <Calendar className="h-4 w-4 shrink-0 text-sage-500" />
            You&apos;re browsing for your wedding on <span className="font-semibold">{formattedDate}</span>.
            Your hire request will be sent for this date.
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-10">
        {/* Success banner */}
        {query.booking === "requested" && (
          <div className="mb-6 flex items-center gap-3 rounded-xl border border-sage-200 bg-sage-50 px-4 py-3 text-sm text-sage-700">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-sage-500" />
            <span>Hire request sent! The vendor will respond within 24 hours.</span>
          </div>
        )}

        <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
          {/* Left column */}
          <div className="space-y-8">
            {/* Stats row */}
            <div className="grid grid-cols-3 gap-4">
              <div className="rounded-xl border border-border/40 bg-card p-4 text-center shadow-warm-sm">
                <IndianRupee className="mx-auto mb-1 h-5 w-5 text-terracotta-400" />
                <div className="font-heading text-sm font-semibold text-foreground leading-tight">
                  {formatCurrency(service.priceMin)}
                </div>
                <div className="text-[10px] text-muted-foreground">Starting from</div>
              </div>
              <div className="rounded-xl border border-border/40 bg-card p-4 text-center shadow-warm-sm">
                <Star className="mx-auto mb-1 h-5 w-5 fill-gold-400 text-gold-400" />
                <div className="font-heading text-lg font-semibold text-foreground">
                  {service.ratingAvg.toFixed(1)}
                </div>
                <div className="text-xs text-muted-foreground">{service.reviewCount} reviews</div>
              </div>
              <div className="rounded-xl border border-border/40 bg-card p-4 text-center shadow-warm-sm">
                <MapPin className="mx-auto mb-1 h-5 w-5 text-terracotta-400" />
                <div className="font-heading text-sm font-semibold text-foreground">{service.city}</div>
                <div className="text-xs text-muted-foreground">Based in</div>
              </div>
            </div>

            {/* Description */}
            <div>
              <h2 className="font-heading text-xl font-semibold text-foreground">What&apos;s included</h2>
              <p className="mt-3 leading-relaxed text-muted-foreground">{service.description}</p>
            </div>

            {/* Pricing range */}
            <div className="rounded-2xl border border-border/30 bg-card p-5 shadow-warm-sm">
              <h2 className="font-heading text-base font-semibold text-foreground">Package pricing</h2>
              <div className="mt-3 flex items-center gap-3">
                <div className="flex-1 rounded-xl border border-border/40 bg-muted/30 p-3 text-center">
                  <div className="text-xs text-muted-foreground">Starting at</div>
                  <div className="mt-1 font-heading text-xl font-semibold text-foreground">
                    {formatCurrency(service.priceMin)}
                  </div>
                </div>
                <div className="text-muted-foreground">—</div>
                <div className="flex-1 rounded-xl border border-border/40 bg-muted/30 p-3 text-center">
                  <div className="text-xs text-muted-foreground">Premium up to</div>
                  <div className="mt-1 font-heading text-xl font-semibold text-foreground">
                    {formatCurrency(service.priceMax)}
                  </div>
                </div>
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                Final price depends on your event date, requirements, and package selected. The vendor will share a detailed quote after you send a request.
              </p>
            </div>

            {/* Trust signals */}
            <div className="grid grid-cols-3 gap-4 rounded-2xl border border-border/30 bg-muted/20 p-5">
              <div className="text-center">
                <Shield className="mx-auto mb-1.5 h-5 w-5 text-sage-500" />
                <div className="text-xs font-medium text-foreground">Verified vendor</div>
                <div className="mt-0.5 text-[10px] text-muted-foreground">Approved by VivahVedam</div>
              </div>
              <div className="text-center">
                <Clock className="mx-auto mb-1.5 h-5 w-5 text-terracotta-400" />
                <div className="text-xs font-medium text-foreground">Quick response</div>
                <div className="mt-0.5 text-[10px] text-muted-foreground">Avg. reply in 6 hours</div>
              </div>
              <div className="text-center">
                <CheckCircle2 className="mx-auto mb-1.5 h-5 w-5 text-sage-500" />
                <div className="text-xs font-medium text-foreground">Secure payment</div>
                <div className="mt-0.5 text-[10px] text-muted-foreground">Escrow-protected</div>
              </div>
            </div>
          </div>

          {/* Right column — Hire request card */}
          <div className="space-y-4">
            <Card className="shadow-warm sticky top-20">
              <CardHeader className="border-b border-border/40 pb-4">
                <div className="flex items-baseline justify-between">
                  <CardTitle className="font-heading text-2xl font-semibold text-foreground">
                    {formatCurrency(service.priceMin)}
                  </CardTitle>
                  <span className="text-sm text-muted-foreground">onwards</span>
                </div>
                <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                  <Star className="h-3 w-3 fill-gold-400 text-gold-400" />
                  {service.ratingAvg.toFixed(1)} · {service.reviewCount} reviews · {service.city}
                </div>
              </CardHeader>

              <CardContent className="pt-4">
                <form action="/api/bookings" method="POST" className="space-y-4">
                  <input type="hidden" name="bookingType" value="service" />
                  <input type="hidden" name="listingId" value={service.id} />
                  <input type="hidden" name="returnTo" value={`/services/${service.id}`} />

                  <div className="space-y-1.5">
                    <Label htmlFor="bookingDate" className="flex items-center gap-1.5 text-sm font-medium">
                      <Calendar className="h-3.5 w-3.5 text-terracotta-500" />
                      Event date
                    </Label>
                    <Input
                      id="bookingDate"
                      type="date"
                      name="bookingDate"
                      defaultValue={dateParam}
                      required
                      min={new Date().toISOString().slice(0, 10)}
                      className="rounded-xl border-border/60"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="notes" className="text-sm font-medium">
                      Requirements
                    </Label>
                    <textarea
                      id="notes"
                      name="notes"
                      rows={4}
                      placeholder="Event timeline, style preferences, guest count, special notes…"
                      className="w-full rounded-xl border border-border/60 bg-background px-3 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-terracotta-300 resize-none"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full rounded-full bg-terracotta-500 py-5 text-white hover:bg-terracotta-600"
                  >
                    Send Hire Request
                  </Button>
                  <p className="text-center text-[10px] text-muted-foreground">
                    No payment now. Vendor quotes your specific requirements.
                  </p>
                </form>
              </CardContent>
            </Card>

            {/* Vendor card */}
            {vendor && (
              <Card className="shadow-warm-sm">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-terracotta-50 text-terracotta-600 font-semibold text-sm">
                      {vendor.fullName.charAt(0)}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-foreground">{vendor.fullName}</div>
                      <div className="text-xs text-muted-foreground">Verified vendor</div>
                    </div>
                  </div>
                  <Button variant="outline" className="mt-3 w-full rounded-full text-sm" asChild>
                    <Link href={`/vendors/${vendor.id}`}>View profile</Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
