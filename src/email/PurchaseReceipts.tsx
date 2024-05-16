import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Tailwind,
} from "@react-email/components";
import { OrderInformation } from "./components/OrderInformation";
import crypto from "crypto";
import { MultiOrderInformation } from "./components/MultiOrderInformation";

type PurchaseReceiptsEmailProps = {
  products: {
    name: string;
    imagePath: string;
    description: string;
    downloadVerification: {
      id: string;
      productId: string;
    };
  }[];
  order: { id: string; createdAt: Date; pricePaidInCents: number };
};

PurchaseReceiptsEmail.PreviewProps = {
  products: [
    {
      name: "Product name",
      description: "Some description",
      imagePath:
        "/products/93dd68c7-b670-4d7c-8829-816f5f3756d5-Pepperidge Farm meme.jpg",
      downloadVerification: { id: "", productId: "" },
    },
  ],
  order: {
    id: crypto.randomUUID(),
    createdAt: new Date(),
    pricePaidInCents: 10000,
  },
} satisfies PurchaseReceiptsEmailProps;

export default function PurchaseReceiptsEmail({
  products,
  order,
}: PurchaseReceiptsEmailProps) {
  return (
    <Html>
      <Preview>Download your memes and view receipt</Preview>
      <Tailwind>
        <Head />
        <Body className="font-sans bg-white">
          <Container className="max-w-xl">
            <Heading>Purchase Receipt</Heading>
            <MultiOrderInformation order={order} products={products} />
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
