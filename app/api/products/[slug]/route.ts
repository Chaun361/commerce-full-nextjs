import { prisma } from "@/prisma/prismaClient";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
    const { slug } = await params;
    return Response.json(await prisma.product.findUnique({
        where: {slug: slug}
    }))
}