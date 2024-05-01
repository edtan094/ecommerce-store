"use client";

import { formatCurrency } from "@/lib/formatters";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import Link from "next/link";
import Image from "next/image";

type ProductCardProps = {
  name: string;
  priceInCents: number;
  description: string;
  id: string;
  imagePath: string;
};

export default function ProductCard({
  name,
  priceInCents,
  description,
  id,
  imagePath,
}: ProductCardProps) {
  function handleAddToCart(product: {
    name: string;
    priceInCents: number;
    description: string;
    id: string;
    imagePath: string;
  }) {
    if (
      localStorage.getItem("ecommerce-cart") &&
      Array.isArray(
        JSON.parse(localStorage.getItem("ecommerce-cart") as string)
      )
    ) {
      localStorage.setItem(
        "ecommerce-cart",
        JSON.stringify([
          product,
          ...JSON.parse(localStorage.getItem("ecommerce-cart") as string),
        ])
      );
    } else {
      localStorage.setItem("ecommerce-cart", JSON.stringify([product]));
    }
  }

  return (
    <Card className="flex overflow-hidden flex-col">
      <div className=" relative w-full h-auto aspect-video">
        <Image src={imagePath} fill alt={name} />
      </div>
      <CardHeader>
        <CardTitle>{name}</CardTitle>
        <CardDescription>{formatCurrency(priceInCents / 100)}</CardDescription>
      </CardHeader>
      <CardContent className=" flex-grow">
        <p className=" line-clamp-4">{description}</p>
      </CardContent>
      <CardFooter className="flex justify-around">
        <Button asChild size="lg" className="w-1/3">
          <Link href={`/products/${id}/purchase`}>Purchase</Link>
        </Button>
        <Button
          className="w-1/3"
          size="lg"
          onClick={() => {
            handleAddToCart({ id, name, description, priceInCents, imagePath });
          }}
        >
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
}

export function ProductCardSkeleton() {
  return (
    <Card className="overflow-hidden flex flex-col animate-pulse">
      <div className="w-full aspect-video bg-gray-300" />
      <CardHeader>
        <CardTitle>
          <div className="w-3/4 h-6 rounded-full bg-gray-300" />
        </CardTitle>
        <CardDescription>
          <div className="w-1/2 h-4 rounded-full bg-gray-300" />
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="w-full h-4 rounded-full bg-gray-300" />
        <div className="w-full h-4 rounded-full bg-gray-300" />
        <div className="w-3/4 h-4 rounded-full bg-gray-300" />
      </CardContent>
      <CardFooter>
        <Button className="w-full" disabled size="lg"></Button>
      </CardFooter>
    </Card>
  );
}
