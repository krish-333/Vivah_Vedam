import Link from "next/link";
import { redirect } from "next/navigation";
import { Plus, MapPin, CheckCircle2, Clock, Building2, Briefcase, ArrowRight, IndianRupee } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createDbSession } from "@/lib/server/auth";
import { formatCurrency } from "@/lib/marketplace";

export default async function VendorListingsPage() {
  const session = await createDbSession();
  const {
    data: { user },
  } = await session.auth.getUser();

  if (!user) {
    redirect("/login?redirect=/vendor/listings");
  }

  const [venuesRes, servicesRes] = await Promise.all([
    session
      .from("venues")
      .select("id,name,city,price_per_day,is_approved,is_active,rating_avg,review_count")
      .eq("vendor_id", user.id)
      .order("created_at", { ascending: false }),
    session
      .from("services")
      .select("id,title,city,category,price_min,price_max,is_approved,is_active,rating_avg,review_count")
      .eq("vendor_id", user.id)
      .order("created_at", { ascending: false }),
  ]);

  const venues = venuesRes.data ?? [];
  const services = servicesRes.data ?? [];
  const total = venues.length + services.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[10px] font-semibold tracking-widest text-terracotta-500 uppercase">
            Your Portfolio
          </p>
          <h1 className="mt-1 font-heading text-2xl font-light text-foreground">Listings</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {total} listing{total !== 1 ? "s" : ""} — manage your venues and services from one place.
          </p>
        </div>
        <Button
          asChild
          className="shrink-0 rounded-full bg-terracotta-500 text-white hover:bg-terracotta-600"
        >
          <Link href="/vendor/listings/new">
            <Plus className="mr-2 h-4 w-4" />
            New listing
          </Link>
        </Button>
      </div>

      {/* Venues */}
      <section>
        <div className="mb-3 flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-terracotta-50">
            <Building2 className="h-3.5 w-3.5 text-terracotta-600" />
          </div>
          <h2 className="font-heading text-sm font-semibold text-foreground uppercase tracking-wider">
            Venues
          </h2>
          <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
            {venues.length}
          </span>
        </div>

        {venues.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border/60 bg-muted/20 py-10 text-center">
            <Building2 className="mx-auto h-8 w-8 text-muted-foreground/40" />
            <p className="mt-3 text-sm font-medium text-muted-foreground">No venue listings yet</p>
            <p className="mt-1 text-xs text-muted-foreground/70">Add a venue to start receiving booking requests.</p>
            <Button asChild size="sm" variant="outline" className="mt-4 rounded-full">
              <Link href="/vendor/listings/new">Add venue</Link>
            </Button>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {venues.map((venue) => (
              <div
                key={venue.id}
                className="group relative rounded-2xl border border-border/40 bg-card p-5 shadow-warm-sm transition-all hover:shadow-warm"
              >
                {/* Status dot */}
                <div className="absolute right-4 top-4 flex items-center gap-1.5">
                  {venue.is_approved ? (
                    <span className="flex items-center gap-1 rounded-full bg-sage-50 px-2 py-0.5 text-[10px] font-semibold text-sage-700">
                      <CheckCircle2 className="h-2.5 w-2.5" />
                      Live
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-700">
                      <Clock className="h-2.5 w-2.5" />
                      Pending
                    </span>
                  )}
                </div>

                <h3 className="pr-16 text-sm font-semibold text-foreground">{venue.name}</h3>
                <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                  {venue.city}
                </div>

                <div className="mt-4 flex items-end justify-between border-t border-border/40 pt-4">
                  <div>
                    <div className="text-[10px] font-semibold tracking-wider text-muted-foreground/70 uppercase">
                      Per day
                    </div>
                    <div className="flex items-center text-base font-semibold text-foreground">
                      {formatCurrency(venue.price_per_day)}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] font-semibold tracking-wider text-muted-foreground/70 uppercase">
                      Rating
                    </div>
                    <div className="text-sm font-semibold text-foreground">
                      {venue.rating_avg > 0 ? `${Number(venue.rating_avg).toFixed(1)} ★` : "—"}
                    </div>
                    <div className="text-[10px] text-muted-foreground">
                      {venue.review_count} review{venue.review_count !== 1 ? "s" : ""}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Services */}
      <section>
        <div className="mb-3 flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-sage-50">
            <Briefcase className="h-3.5 w-3.5 text-sage-600" />
          </div>
          <h2 className="font-heading text-sm font-semibold text-foreground uppercase tracking-wider">
            Services
          </h2>
          <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
            {services.length}
          </span>
        </div>

        {services.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border/60 bg-muted/20 py-10 text-center">
            <Briefcase className="mx-auto h-8 w-8 text-muted-foreground/40" />
            <p className="mt-3 text-sm font-medium text-muted-foreground">No service listings yet</p>
            <p className="mt-1 text-xs text-muted-foreground/70">List your services to get discovered by couples.</p>
            <Button asChild size="sm" variant="outline" className="mt-4 rounded-full">
              <Link href="/vendor/listings/new">Add service</Link>
            </Button>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <div
                key={service.id}
                className="group relative rounded-2xl border border-border/40 bg-card p-5 shadow-warm-sm transition-all hover:shadow-warm"
              >
                {/* Status dot */}
                <div className="absolute right-4 top-4 flex items-center gap-1.5">
                  {service.is_approved ? (
                    <span className="flex items-center gap-1 rounded-full bg-sage-50 px-2 py-0.5 text-[10px] font-semibold text-sage-700">
                      <CheckCircle2 className="h-2.5 w-2.5" />
                      Live
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-700">
                      <Clock className="h-2.5 w-2.5" />
                      Pending
                    </span>
                  )}
                </div>

                <span className="inline-block rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium capitalize text-muted-foreground">
                  {service.category.replace("-", " ")}
                </span>
                <h3 className="mt-2 pr-16 text-sm font-semibold text-foreground">{service.title}</h3>
                <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="h-3 w-3" />
                  {service.city}
                </div>

                <div className="mt-4 flex items-end justify-between border-t border-border/40 pt-4">
                  <div>
                    <div className="text-[10px] font-semibold tracking-wider text-muted-foreground/70 uppercase">
                      Range
                    </div>
                    <div className="text-sm font-semibold text-foreground">
                      {formatCurrency(service.price_min)}–{formatCurrency(service.price_max)}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] font-semibold tracking-wider text-muted-foreground/70 uppercase">
                      Rating
                    </div>
                    <div className="text-sm font-semibold text-foreground">
                      {service.rating_avg > 0 ? `${Number(service.rating_avg).toFixed(1)} ★` : "—"}
                    </div>
                    <div className="text-[10px] text-muted-foreground">
                      {service.review_count} review{service.review_count !== 1 ? "s" : ""}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
