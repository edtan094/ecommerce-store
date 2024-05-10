import { userOrderExists } from "@/app/actions/orders";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { productIds, email }: { productIds: string[]; email: string } =
    await req.json();
  const productPromises = productIds.map(async (id) => {
    const boolean = await userOrderExists(email, id);

    return { status: boolean, id };
  });
  const listOfItemsThatHaveBeenBoughtAlready = await Promise.all(
    productPromises
  );
  return NextResponse.json(listOfItemsThatHaveBeenBoughtAlready, {
    status: 200,
  });
}
