'use server'

import { prisma } from "@/prisma/prismaClient"

export async function fetchProducts() {
    const products = await prisma.product.findMany();
    return products.map((product) => ({
        ...product,
        price: product.price.toNumber()
    }));
}

export type Product = Awaited<ReturnType<typeof fetchProducts>>[number];
