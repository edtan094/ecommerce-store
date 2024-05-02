"use client";
import ProductCard from "@/components/ProductCard";
import { Product } from "@prisma/client";

type ProductSuspenseProps = {
  products: Product[];
};

export function ProductSuspense({ products }: ProductSuspenseProps) {
  return products.map((product) => (
    <ProductCard key={product.id} {...product} />
  ));
}
