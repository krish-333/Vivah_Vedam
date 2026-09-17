import Image from "next/image";
import Link from "next/link";
import { MapPin, Star, ArrowRight, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollReveal } from "@/components/ui/scroll-reveal";
import { formatCurrency, getCategories, getServiceResults } from "@/lib/marketplace";

type ServicesPageProps = {
  searchParams: Promise<{
    city?: string;
    category?: string;
    maxPrice?: string;
    date?: string;
  }>;
};

const categoryLabels: Record<string, string> = {
  photography: "📸 Photography",
  decor: "💐 Decor",
  catering: "🍽️ Catering",
  makeup: "💄 Makeup",
  "music-dj": "🎵 Music & DJ",
  mehndi: "✋ Mehndi",
  planning: "✨ Planning",
  "bridal-wear": "👗 Bridal Wear",
};

export default async function ServicesPage({ searchParams }: ServicesPageProps) {
  const params = await searchParams;
  const city = params.city?.trim() ?? "";
  const category = params.category?.trim() ?? "";
  const maxPrice = params.maxPrice ? Number(params.maxPrice) : undefined;
  const date = params.date?.trim() ?? "";

  const [services, categories] = await Promise.all([
    getServiceResults({ city: city || undefined, category: category || undefined, maxPrice }),
    getCategories(),
  ]);

  return (
    <div className="min-h-screen bg-[#faf6f1]">
      {/* Header */}
      <div className="grain relative overflow-hidden bg-gradient-to-b from-[#faf6f1] to-[#f5ebe0] py-14">
        <div className="container mx-auto px-4">
          <p className="text-xs font-semibold tracking-widest text-terracotta-500 uppercase">
            Service Marketplace
          </p>
          <h1 className="mt-2 font-heading text-3xl font-light tracking-tight lg:text-4xl">
            {category
              ? `${categoryLabels[category] ?? category} professionals`
              : "Find your wedding professionals"}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Photographers, caterers, decorators, makeup artists, mehndi, DJ — all verified and reviewed.
          </p>

          {/* Filter Form */}
          <div className="shadow-warm mt-8 overflow-hidden rounded-2xl border border-border/40 bg-card">
            <form method="GET" className="flex flex-wrap items-end gap-3 p-4 lg:flex-nowrap">
              <div className="flex flex-1 min-w-36 flex-col gap-1">
                <label className="text-[10px] font-semibold tracking-wider text-muted-foreground/70 uppercase">Wedding Date</label>
                <Input name="date" type="date" defaultValue={date} min={new Date().toISOString().slice(0,10)} className="border-border/60 bg-muted/30 text-sm" />
              </div>
              <div className="flex flex-1 min-w-36 flex-col gap-1">
                <label className="text-[10px] font-semibold tracking-wider text-muted-foreground/70 uppercase">Category</label>
                <select name="category" defaultValue={category} className="h-10 rounded-xl border border-border/60 bg-muted/30 px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-terracotta-300">
                  <option value="">All categories</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.slug}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div className="flex flex-1 min-w-36 flex-col gap-1">
                <label className="text-[10px] font-semibold tracking-wider text-muted-foreground/70 uppercase">City</label>
                <Input name="city" defaultValue={city} placeholder="Mumbai, Delhi, Goa…" className="border-border/60 bg-muted/30 text-sm" />
              </div>
              <div className="flex flex-1 min-w-36 flex-col gap-1">
                <label className="text-[10px] font-semibold tracking-wider text-muted-foreground/70 uppercase">Max Budget (₹)</label>
                <Input name="maxPrice" type="number" min={1} defaultValue={params.maxPrice ?? ""} placeholder="e.g. 500000" className="border-border/60 bg-muted/30 text-sm" />
              </div>
              <Button type="submit" className="rounded-xl bg-terracotta-500 px-6 text-white hover:bg-terracotta-600">
                <Search className="mr-2 h-4 w-4" />
                Search
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Category Quick-Filters */}
      <div className="border-b border-border/40 bg-card">
        <div className="container mx-auto px-4">
          <div className="flex gap-2 overflow-x-auto py-3 scrollbar-hide">
            <Link
              href={`/services${date ? `?date=${date}` : ""}`}
              className={`shrink-0 rounded-full border px-4 py-1.5 text-xs font-medium transition-colors ${!category ? "border-terracotta-300 bg-terracotta-50 text-terracotta-700" : "border-border/40 text-muted-foreground hover:border-terracotta-200 hover:text-foreground"}`}
            >
              All
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/services?category=${cat.slug}${date ? `&date=${date}` : ""}${city ? `&city=${city}` : ""}`}
                className={`shrink-0 rounded-full border px-4 py-1.5 text-xs font-medium transition-colors ${category === cat.slug ? "border-terracotta-300 bg-terracotta-50 text-terracotta-700" : "border-border/40 text-muted-foreground hover:border-terracotta-200 hover:text-foreground"}`}
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="container mx-auto px-4 py-12">
        <div className="mb-6">
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">{services.length}</span> services found
            {category ? ` · ${category}` : ""}
            {city ? ` in ${city}` : ""}
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service, i) => (
            <ScrollReveal key={service.id} delay={i * 0.06}>
              <Link
                href={`/services/${service.id}${date ? `?date=${date}` : ""}`}
                className="shadow-warm group block overflow-hidden rounded-2xl border border-border/30 bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-warm-xl"
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  {service.coverImage ? (
                    <Image
                      src={service.coverImage}
                      alt={service.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="h-full w-full bg-gradient-to-br from-sage-100 via-terracotta-50 to-gold-100" />
                  )}
                  {/* Category badge */}
                  <div className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-foreground backdrop-blur-sm">
                    {service.category}
                  </div>
                  {/* Rating */}
                  <div className="absolute bottom-3 left-3 flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-xs font-semibold text-foreground backdrop-blur-sm">
                    <Star className="h-3 w-3 fill-gold-400 text-gold-400" />
                    {service.ratingAvg.toFixed(1)}
                    <span className="text-muted-foreground">({service.reviewCount})</span>
                  </div>
                  {/* Available badge */}
                  {date && (
                    <div className="absolute right-3 top-3 rounded-full bg-sage-500 px-2.5 py-1 text-[10px] font-semibold text-white">
                      ✓ Available
                    </div>
                  )}
                </div>

                <div className="p-5">
                  <h3 className="font-heading text-base font-semibold text-foreground line-clamp-1">{service.title}</h3>
                  <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    {service.city}
                  </div>
                  <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                    {service.description}
                  </p>

                  <div className="mt-4 flex items-center justify-between border-t border-border/40 pt-4">
                    <div>
                      <div className="text-[10px] text-muted-foreground">Package starting at</div>
                      <div className="text-base font-semibold text-foreground">
                        {formatCurrency(service.priceMin)}
                      </div>
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

        {services.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-muted-foreground">No services found. Try adjusting your filters.</p>
            <Button variant="outline" className="mt-4 rounded-full" asChild>
              <Link href="/services">Clear filters</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
