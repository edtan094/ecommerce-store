import db from "@/db/db";
import { notFound } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";
import path from "path";

export async function GET(
  req: NextRequest,
  { params: { id } }: { params: { id: string } }
) {
  const product = await db.product.findUnique({
    where: { id },
    select: { imagePath: true, name: true },
  });

  if (!product) return notFound();

  const response = await fetch(product.imagePath);
  if (!response.ok) {
    throw new Error(`Failed to fetch image from ${product.imagePath}`);
  }

  const extension = path.extname(product.imagePath);
  const filename = `${product.name}${extension}`;
  const contentType = response.headers.get("Content-Type");
  const contentLength = response.headers.get("Content-Length");

  const headers: Record<string, string> = {
    "Content-Disposition": `attachment; filename="${filename}"`,
  };

  if (contentType) {
    headers["Content-Type"] = contentType;
  }

  if (contentLength) {
    headers["Content-Length"] = contentLength;
  }

  return new NextResponse(response.body, {
    headers,
  });
}
