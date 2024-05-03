import { ProductCardSkeleton } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import db from "@/db/db";
import { cache } from "@/lib/cache";
import { Product } from "@prisma/client";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { ProductSuspense } from "./_components/ProductSuspense";

const getPopularProducts = cache(
  () => {
    return db.product.findMany({
      where: { isAvailableForPurchase: true },
      orderBy: { orders: { _count: "desc" } },
      take: 6,
    });
  },
  ["/", "getMostPopularProducts"],
  { revalidate: 60 * 60 * 24 }
);

const getNewestProducts = cache(() => {
  return db.product.findMany({
    where: { isAvailableForPurchase: true },
    orderBy: { createdAt: "desc" },
    take: 6,
  });
}, ["/", "getNewestProducts"]);

export default async function HomePage() {
  return (
    <main className=" space-y-12">
      <ProductGridSection
        title="Most Popular"
        productsFetchers={getNewestProducts}
      />
      <ProductGridSection
        title="Newest"
        productsFetchers={getPopularProducts}
      />
    </main>
  );
}

type ProductGridSectionProps = {
  title: string;
  productsFetchers: () => Promise<Product[]>;
};

async function ProductGridSection({
  title,
  productsFetchers,
}: ProductGridSectionProps) {
  return (
    <div className=" space-y-4">
      <div className=" flex gap-4">
        <h2 className=" text-3xl font-bold">{title}</h2>
        <Button asChild variant="outline">
          <Link href="/products" className=" space-x-2">
            <span>View all</span>
            <ArrowRight className=" size-4" />
          </Link>
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Suspense
          fallback={
            <>
              <ProductCardSkeleton />
              <ProductCardSkeleton />
              <ProductCardSkeleton />
            </>
          }
        >
          <ProductSuspense productsFetchers={productsFetchers} />
        </Suspense>
      </div>
    </div>
  );
}
