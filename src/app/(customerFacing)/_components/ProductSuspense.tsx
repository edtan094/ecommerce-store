import ProductCard from "@/components/ProductCard";
import { Product } from "@prisma/client";

type ProductSuspenseProps = {
  productsFetchers: () => Promise<Product[]>;
};

export async function ProductSuspense({
  productsFetchers,
}: ProductSuspenseProps) {
  return (await productsFetchers()).map((product) => (
    <ProductCard key={product.id} {...product} />
  ));
}
