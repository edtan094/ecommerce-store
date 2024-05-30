import db from "@/db/db";
import { NextRequest, NextResponse } from "next/server";
import path from "path";

export async function GET(
  req: NextRequest,
  {
    params: { downloadVerificationId },
  }: { params: { downloadVerificationId: string } }
) {
  const data = await db.downloadVerification.findUnique({
    where: { id: downloadVerificationId, expiresAt: { gt: new Date() } },
    select: { product: { select: { imagePath: true, name: true } } },
  });

  if (!data) {
    return NextResponse.redirect(
      new URL("/products/download/expired", req.url)
    );
  }

  const response = await fetch(data.product.imagePath);
  if (!response.ok) {
    throw new Error(`Failed to fetch image from ${data.product.imagePath}`);
  }

  const extension = path.extname(data.product.imagePath);
  const filename = `${data.product.name}${extension}`;
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
