import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  formatCurrency,
  getVendorById,
  getVendorServices,
  getVendorVenues,
} from "@/lib/marketplace";

type VendorProfilePageProps = {
  params: Promise<{ id: string }>;
};

export default async function VendorProfilePage({ params }: VendorProfilePageProps) {
  const { id } = await params;
  const vendor = await getVendorById(id);

  if (!vendor) {
    notFound();
  }

  const [services, venues] = await Promise.all([
    getVendorServices(vendor.id),
    getVendorVenues(vendor.id),
  ]);

  return (
    <section className="container mx-auto space-y-8 px-4 py-12">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl">{vendor.fullName}</CardTitle>
          <p className="text-sm text-muted-foreground">
            Contact: {vendor.phone ?? "Not shared"}
          </p>
        </CardHeader>
      </Card>

      <div className="space-y-4">
        <h2 className="font-heading text-2xl font-bold">Listed Services</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {services.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-sm text-muted-foreground">
                No services listed yet.
              </CardContent>
            </Card>
          ) : (
            services.map((service) => (
              <Card key={service.id}>
                <CardHeader className="space-y-2">
                  <CardTitle className="text-xl">{service.title}</CardTitle>
                  <Badge variant="outline" className="w-fit capitalize">
                    {service.category}
                  </Badge>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-muted-foreground">
                  <p className="line-clamp-2">{service.description}</p>
                  <p>
                    {formatCurrency(service.priceMin)} - {formatCurrency(service.priceMax)}
                  </p>
                  <Button asChild variant="outline" className="w-full">
                    <Link href={`/services/${service.id}`}>View Service</Link>
                  </Button>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="font-heading text-2xl font-bold">Listed Venues</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {venues.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-sm text-muted-foreground">
                No venues listed yet.
              </CardContent>
            </Card>
          ) : (
            venues.map((venue) => (
              <Card key={venue.id}>
                <CardHeader>
                  <CardTitle className="text-xl">{venue.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-muted-foreground">
                  <p className="line-clamp-2">{venue.description}</p>
                  <p>{formatCurrency(venue.pricePerDay)} / day</p>
                  <Button asChild variant="outline" className="w-full">
                    <Link href={`/venues/${venue.id}`}>View Venue</Link>
                  </Button>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
