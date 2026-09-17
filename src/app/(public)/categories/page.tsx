import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCategories } from "@/lib/marketplace";

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <section className="container mx-auto space-y-8 px-4 py-12">
      <div>
        <h1 className="font-heading text-3xl font-bold">Service Categories</h1>
        <p className="mt-2 text-muted-foreground">
          Explore approved marketplace categories and jump into matching listings.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {categories.map((category) => (
          <Card key={category.id}>
            <CardHeader>
              <CardTitle className="text-2xl">{category.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">{category.description}</p>
              <Button asChild variant="outline" className="w-full">
                <Link href={`/services?category=${category.slug}`}>
                  Browse {category.name}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
