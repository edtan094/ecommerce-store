"use server";

import db from "@/db/db";
import { z } from "zod";
import { notFound, redirect } from "next/navigation";
import { File } from "buffer";
import { revalidatePath } from "next/cache";
import { put, del } from "@vercel/blob";

const fileSchema = z.instanceof(File, { message: "Required" });

const imageSchema = fileSchema.refine(
  (file) => file.size === 0 || file.type.startsWith("image/")
);

const addSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  priceInCents: z.coerce.number().int().min(1),
  image: imageSchema.refine((file) => file.size > 0, "Required"),
});

export async function addProduct(prevState: unknown, formData: FormData) {
  const result = addSchema.safeParse(Object.fromEntries(formData.entries()));
  if (result.success === false) {
    return result.error.formErrors.fieldErrors;
  }

  const data = result.data;

  const blob = await put(data.image.name, await data.image.arrayBuffer(), {
    access: "public",
  });

  await db.product.create({
    data: {
      isAvailableForPurchase: false,
      name: data.name,
      description: data.description,
      priceInCents: data.priceInCents,
      imagePath: blob.url,
    },
  });

  revalidatePath("/");
  revalidatePath("/products");

  redirect("/admin/products");
}

const editSchema = addSchema.extend({
  file: fileSchema.optional(),
  image: imageSchema.optional(),
});

export async function updateProduct(
  id: string,
  prevState: unknown,
  formData: FormData
) {
  const result = editSchema.safeParse(Object.fromEntries(formData.entries()));
  if (result.success === false) {
    return result.error.formErrors.fieldErrors;
  }

  const data = result.data;
  const product = await db.product.findUnique({ where: { id } });

  if (!product) return notFound();

  let imagePath = product.imagePath;
  if (data.image && data.image.size > 0) {
    const blob = await put(data.image.name, await data.image.arrayBuffer(), {
      access: "public",
    });
    imagePath = blob.url;
    await del(product.imagePath);
  }

  await db.product.update({
    where: { id },
    data: {
      name: data.name,
      description: data.description,
      priceInCents: data.priceInCents,
      imagePath,
    },
  });
  revalidatePath("/");
  revalidatePath("/products");

  redirect("/admin/products");
}

export async function toggleProductAvailability(
  id: string,
  isAvailableForPurchase: boolean
) {
  await db.product.update({
    where: { id },
    data: { isAvailableForPurchase },
  });

  revalidatePath("/");
  revalidatePath("/products");
}

export async function deleteProduct(id: string) {
  const product = await db.product.delete({ where: { id } });
  if (!product) return notFound();

  await del(product.imagePath);

  revalidatePath("/");
  revalidatePath("/products");
}
