import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatCurrency } from "@/lib/formatters";
import Image from "next/image";

type CartItemProps = {
  id: string;
  name: string;
  priceInCents: number;
  description: string;
  imagePath: string;
  handleRemoveCartItem: (id: string) => void;
};

export function CartItem({
  id,
  name,
  priceInCents,
  handleRemoveCartItem,
  imagePath,
  description,
}: CartItemProps) {
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
      <CardFooter className="flex justify-center">
        <Button variant="destructive" onClick={() => handleRemoveCartItem(id)}>
          Remove Item
        </Button>
      </CardFooter>
    </Card>
  );
}
