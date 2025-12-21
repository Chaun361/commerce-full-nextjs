import { prisma } from "@/prisma/prismaClient";

export async function GET() {
    return Response.json(await prisma.product.findMany())
}