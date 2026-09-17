import { CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type VendorNewListingPageProps = {
  searchParams: Promise<{ vendor?: string }>;
};

const SERVICE_CATEGORIES = [
  { value: "photography", label: "📸 Photography" },
  { value: "decor", label: "💐 Decor" },
  { value: "catering", label: "🍽️ Catering" },
  { value: "makeup", label: "💄 Makeup" },
  { value: "music-dj", label: "🎵 Music & DJ" },
  { value: "mehndi", label: "✋ Mehndi" },
  { value: "planning", label: "✨ Wedding Planning" },
  { value: "bridal-wear", label: "👗 Bridal Wear" },
];

export default async function VendorNewListingPage({ searchParams }: VendorNewListingPageProps) {
  const query = await searchParams;

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold tracking-widest text-terracotta-500 uppercase">Vendor Hub</p>
        <h1 className="mt-1 font-heading text-2xl font-light text-foreground">Create a listing</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Add a venue or service — it will be reviewed and published within 24 hours.
        </p>
      </div>

      {query.vendor === "created" && (
        <div className="flex items-center gap-3 rounded-xl border border-sage-200 bg-sage-50 px-4 py-3 text-sm text-sage-700">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-sage-500" />
          Listing submitted for admin review. You&apos;ll be notified once approved.
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Venue listing */}
        <Card className="shadow-warm">
          <CardHeader className="border-b border-border/40 pb-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🏛️</span>
              <CardTitle className="font-heading text-lg font-semibold">New Venue Listing</CardTitle>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Banquet halls, gardens, palaces, resorts, farmhouses
            </p>
          </CardHeader>
          <CardContent className="pt-5">
            <form action="/api/vendor/listings" method="POST" className="space-y-4">
              <input type="hidden" name="listingType" value="venue" />
              <input type="hidden" name="returnTo" value="/vendor/listings/new?vendor=created" />

              <div className="space-y-1.5">
                <Label htmlFor="vname" className="text-sm font-medium">Venue name *</Label>
                <Input id="vname" name="name" required placeholder="e.g. The Royal Mahal Palace" className="rounded-xl border-border/60" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="vcity" className="text-sm font-medium">City *</Label>
                  <Input id="vcity" name="city" required placeholder="Mumbai" className="rounded-xl border-border/60" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="vstate" className="text-sm font-medium">State</Label>
                  <Input id="vstate" name="state" placeholder="Maharashtra" className="rounded-xl border-border/60" />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="vaddress" className="text-sm font-medium">Address</Label>
                <Input id="vaddress" name="address" placeholder="Full address" className="rounded-xl border-border/60" />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="vdesc" className="text-sm font-medium">Description *</Label>
                <textarea
                  id="vdesc"
                  name="description"
                  rows={3}
                  required
                  placeholder="Describe the venue — setting, style, standout features…"
                  className="w-full rounded-xl border border-border/60 bg-background px-3 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-terracotta-300 resize-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="vcapMin" className="text-sm font-medium">Min guests *</Label>
                  <Input id="vcapMin" name="capacityMin" type="number" min={1} required placeholder="100" className="rounded-xl border-border/60" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="vcapMax" className="text-sm font-medium">Max guests *</Label>
                  <Input id="vcapMax" name="capacityMax" type="number" min={1} required placeholder="500" className="rounded-xl border-border/60" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="vprice" className="text-sm font-medium">Price/day (₹) *</Label>
                  <Input id="vprice" name="pricePerDay" type="number" min={1} required placeholder="500000" className="rounded-xl border-border/60" />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="vcoverImage" className="text-sm font-medium">Cover image URL</Label>
                <Input id="vcoverImage" name="coverImage" type="url" placeholder="https://images.unsplash.com/…" className="rounded-xl border-border/60" />
                <p className="text-[10px] text-muted-foreground">Paste a public image URL (Unsplash recommended)</p>
              </div>

              <Button type="submit" className="w-full rounded-full bg-terracotta-500 text-white hover:bg-terracotta-600">
                Submit venue for review
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Service listing */}
        <Card className="shadow-warm">
          <CardHeader className="border-b border-border/40 pb-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl">✨</span>
              <CardTitle className="font-heading text-lg font-semibold">New Service Listing</CardTitle>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Photography, decor, catering, makeup, DJ, mehndi, planning
            </p>
          </CardHeader>
          <CardContent className="pt-5">
            <form action="/api/vendor/listings" method="POST" className="space-y-4">
              <input type="hidden" name="listingType" value="service" />
              <input type="hidden" name="returnTo" value="/vendor/listings/new?vendor=created" />

              <div className="space-y-1.5">
                <Label htmlFor="stitle" className="text-sm font-medium">Service title *</Label>
                <Input id="stitle" name="title" required placeholder="e.g. Candid Wedding Photography & Films" className="rounded-xl border-border/60" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="scategory" className="text-sm font-medium">Category *</Label>
                  <select
                    id="scategory"
                    name="category"
                    required
                    className="h-10 w-full rounded-xl border border-border/60 bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-terracotta-300"
                  >
                    <option value="">Select category</option>
                    {SERVICE_CATEGORIES.map((cat) => (
                      <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="scity" className="text-sm font-medium">City *</Label>
                  <Input id="scity" name="city" required placeholder="Mumbai" className="rounded-xl border-border/60" />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="sdesc" className="text-sm font-medium">Description *</Label>
                <textarea
                  id="sdesc"
                  name="description"
                  rows={3}
                  required
                  placeholder="What's included — coverage, deliverables, timeline, highlights…"
                  className="w-full rounded-xl border border-border/60 bg-background px-3 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-terracotta-300 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="spriceMin" className="text-sm font-medium">Starting price (₹) *</Label>
                  <Input id="spriceMin" name="priceMin" type="number" min={1} required placeholder="50000" className="rounded-xl border-border/60" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="spriceMax" className="text-sm font-medium">Max price (₹) *</Label>
                  <Input id="spriceMax" name="priceMax" type="number" min={1} required placeholder="300000" className="rounded-xl border-border/60" />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="scoverImage" className="text-sm font-medium">Cover image URL</Label>
                <Input id="scoverImage" name="coverImage" type="url" placeholder="https://images.unsplash.com/…" className="rounded-xl border-border/60" />
                <p className="text-[10px] text-muted-foreground">Paste a public image URL (Unsplash recommended)</p>
              </div>

              <Button type="submit" className="w-full rounded-full bg-terracotta-500 text-white hover:bg-terracotta-600">
                Submit service for review
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
