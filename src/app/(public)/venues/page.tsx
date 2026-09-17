import Image from "next/image";
import Link from "next/link";
import { MapPin, Star, Users, ArrowRight, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { getVenueResults, formatCurrency } from "@/lib/marketplace";

type VenuesPageProps = {
  searchParams: Promise<{
    city?: string;
    capacity?: string;
    maxPrice?: string;
    date?: string;
  }>;
};

const amenityColors: Record<string, string> = {
  "lakeside": "bg-blue-50 text-blue-700",
  "heritage": "bg-amber-50 text-amber-700",
  "beachfront": "bg-cyan-50 text-cyan-700",
  "garden": "bg-sage-50 text-sage-600",
  "5-star hotel": "bg-purple-50 text-purple-700",
  "farmhouse": "bg-green-50 text-green-700",
  "rooftop": "bg-orange-50 text-orange-700",
};

function getAmenityClass(amenity: string) {
  return amenityColors[amenity.toLowerCase()] ?? "bg-muted text-muted-foreground";
}

function getDaysUntil(dateStr: string): number | null {
  if (!dateStr) return null;
  const target = new Date(dateStr);
  const today = new Date();
  const diff = Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  return diff > 0 ? diff : null;
}

export default async function VenuesPage({ searchParams }: VenuesPageProps) {
  const params = await searchParams;
  const city = params.city?.trim() ?? "";
  const minCapacity = params.capacity ? Number(params.capacity) : undefined;
  const maxPrice = params.maxPrice ? Number(params.maxPrice) : undefined;
  const date = params.date?.trim() ?? "";

  const venues = await getVenueResults({ city: city || undefined, minCapacity, maxPrice });
  const daysUntil = date ? getDaysUntil(date) : null;

  return (
    <div className="min-h-screen bg-[#faf6f1]">
      {/* Header */}
      <div className="grain relative overflow-hidden bg-gradient-to-b from-[#faf6f1] to-[#f5ebe0] py-14">
        <div className="container mx-auto px-4">
          <p className="text-xs font-semibold tracking-widest text-terracotta-500 uppercase">
            Venue Discovery
          </p>
          <h1 className="mt-2 font-heading text-3xl font-light tracking-tight lg:text-4xl">
            Find your perfect wedding venue
          </h1>
          {date && daysUntil && (
            <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-terracotta-200 bg-terracotta-50 px-4 py-2 text-sm">
              <span className="font-semibold text-terracotta-600">{daysUntil} days</span>
              <span className="text-terracotta-500">to your wedding — venues in {city || "India"} book fast</span>
            </div>
          )}

          {/* Filter Form */}
          <div className="shadow-warm mt-8 overflow-hidden rounded-2xl border border-border/40 bg-card">
            <form method="GET" className="flex flex-wrap items-end gap-3 p-4 lg:flex-nowrap">
              <div className="flex flex-1 min-w-36 flex-col gap-1">
                <label className="text-[10px] font-semibold tracking-wider text-muted-foreground/70 uppercase">Wedding Date</label>
                <Input name="date" type="date" defaultValue={date} min={new Date().toISOString().slice(0,10)} className="border-border/60 bg-muted/30 text-sm" />
              </div>
              <div className="flex flex-1 min-w-36 flex-col gap-1">
                <label className="text-[10px] font-semibold tracking-wider text-muted-foreground/70 uppercase">City</label>
                <Input name="city" defaultValue={city} placeholder="Mumbai, Delhi, Goa…" className="border-border/60 bg-muted/30 text-sm" />
              </div>
              <div className="flex flex-1 min-w-36 flex-col gap-1">
                <label className="text-[10px] font-semibold tracking-wider text-muted-foreground/70 uppercase">Min Guests</label>
                <Input name="capacity" type="number" min={1} defaultValue={params.capacity ?? ""} placeholder="e.g. 200" className="border-border/60 bg-muted/30 text-sm" />
              </div>
              <div className="flex flex-1 min-w-36 flex-col gap-1">
                <label className="text-[10px] font-semibold tracking-wider text-muted-foreground/70 uppercase">Max Budget (₹)</label>
                <Input name="maxPrice" type="number" min={1} defaultValue={params.maxPrice ?? ""} placeholder="e.g. 1000000" className="border-border/60 bg-muted/30 text-sm" />
              </div>
              <Button type="submit" className="rounded-xl bg-terracotta-500 px-6 text-white hover:bg-terracotta-600">
                <Search className="mr-2 h-4 w-4" />
                Search
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="container mx-auto px-4 py-12">
        <div className="mb-6 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">{venues.length}</span> venues found
            {city ? ` in ${city}` : " across India"}
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {venues.map((venue, i) => (
            <ScrollReveal key={venue.id} delay={i * 0.06}>
              <Link href={`/venues/${venue.id}${date ? `?date=${date}` : ""}`} className="shadow-warm group block overflow-hidden rounded-2xl border border-border/30 bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-warm-xl">
                {/* Image */}
                <div className="relative h-48 overflow-hidden bg-gradient-to-br from-amber-100 to-amber-200">
                  {venue.coverImage ? (
                    <Image
                      src={venue.coverImage}
                      alt={venue.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="h-full w-full bg-gradient-to-br from-terracotta-100 via-amber-50 to-sage-100" />
                  )}
                  {/* Rating badge */}
                  <div className="absolute bottom-3 left-3 flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-xs font-semibold text-foreground shadow-sm backdrop-blur-sm">
                    <Star className="h-3 w-3 fill-gold-400 text-gold-400" />
                    {venue.ratingAvg.toFixed(1)}
                    <span className="text-muted-foreground">({venue.reviewCount})</span>
                  </div>
                  {/* Available badge */}
                  {date && (
                    <div className="absolute right-3 top-3 rounded-full bg-sage-500 px-2.5 py-1 text-[10px] font-semibold text-white">
                      ✓ Available {new Date(date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                    </div>
                  )}
                </div>

                <div className="p-5">
                  <h3 className="font-heading text-lg font-semibold text-foreground line-clamp-1">{venue.name}</h3>
                  <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    {venue.city}
                    <span className="mx-1">·</span>
                    <Users className="h-3 w-3" />
                    {venue.capacityMin}–{venue.capacityMax} guests
                  </div>
                  <p className="mt-2.5 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                    {venue.description}
                  </p>

                  {/* Amenity tags */}
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {venue.amenities.slice(0, 3).map((a) => (
                      <span key={a} className={`rounded-full px-2.5 py-0.5 text-[10px] font-medium capitalize ${getAmenityClass(a)}`}>
                        {a}
                      </span>
                    ))}
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t border-border/40 pt-4">
                    <div>
                      <div className="text-[10px] text-muted-foreground">Starting at</div>
                      <div className="text-base font-semibold text-foreground">{formatCurrency(venue.pricePerDay)}</div>
                    </div>
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-terracotta-50 text-terracotta-500 transition-all group-hover:bg-terracotta-500 group-hover:text-white">
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  </div>
                </div>
              </Link>
            </ScrollReveal>
          ))}
        </div>

        {venues.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-muted-foreground">No venues found. Try adjusting your filters.</p>
            <Button variant="outline" className="mt-4 rounded-full" asChild>
              <Link href="/venues">Clear filters</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
