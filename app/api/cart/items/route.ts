import { prisma } from "@/prisma/prismaClient";

export async function PUT(req: Request) {
    try {
        const userId = req.headers.get('userid');
        const { product_id, quantity } = await req.json();
        
        let foundCart = await prisma.cart.findFirst({
            where: {
                user_id: Number(userId),
                is_active: true
            }
        })

        if (!foundCart) {
            foundCart = await prisma.cart.create({
                data: {
                    user_id: Number(userId)
                }
            })
        }

        const updatedItem = await prisma.cartItem.upsert({
            where: {
                cart_id_product_id: {
                    cart_id: foundCart.id,
                    product_id: product_id
                }
            },
            create: {
                cart_id: foundCart.id,
                product_id: product_id,
                quantity: 1
            },
            update: {
                quantity: {
                    increment: 1
                }
            }
        })

        return Response.json({updated_item: updatedItem}, {status: 200});
    }
    catch (error: any) {
        console.error(error);
        return Response.json({error: "Failed add item"}, {status: 500});
    }
}

export async function DELETE(req: Request) {
    try {
        const userId = req.headers.get('userid');
        const { product_id, quantity } = await req.json();

        let foundCart = await prisma.cart.findFirst({
            where: {
                user_id: Number(userId),
                is_active: true
            }
        })

        if (!foundCart) {
            foundCart = await prisma.cart.create({
                data: {
                    user_id: Number(userId)
                }
            })
        }

        // Atomic update: Try to decrement only if quantity > 1
        const updateBatch = await prisma.cartItem.updateMany({
            where: {
                cart_id: foundCart.id,
                product_id: product_id,
                quantity: { gt: 1 }
            },
            data: {
                quantity: { decrement: 1 }
            }
        })

        if (updateBatch.count > 0) {
            const updatedItem = await prisma.cartItem.findUnique({
                where: {
                    cart_id_product_id: {
                        cart_id: foundCart.id,
                        product_id: product_id
                    }
                }
            })
            return Response.json({updated_item: updatedItem}, {status: 200});
        }

        // Atomic delete: Try to delete only if quantity is exactly 1
        const deleteBatch = await prisma.cartItem.deleteMany({
            where: {
                cart_id: foundCart.id,
                product_id: product_id,
                quantity: 1
            }
        })

        if (deleteBatch.count > 0) {
            return Response.json({removed_item: {product_id: product_id}}, {status: 200});
        }

        return Response.json({error: "Item not found or modified"}, {status: 404});
    }
    catch (error: any) {
        console.error(error);
        return Response.json({error: "Failed decrease item"}, {status: 500});
    }
}

export async function GET(req: Request) {
    try {
        const userIdHeader = req.headers.get('userid');
        if (!userIdHeader) return Response.json({ error: "Unauthorized"} ,{ status: 401 });
        const userId = Number(userIdHeader);

        const foundCart = await prisma.cart.findFirst({
            where: {
                user_id: userId,
                is_active: true
            },
            include: {
                cart_Items: {
                    include: {
                        product: {
                            select: {
                                slug: true
                            }
                        }
                    }
                }
            }
        });

        if (!foundCart) {
            return Response.json({message: "Cart is empty"}, {status: 204});
        } 
            
        return Response.json({cart_items: foundCart.cart_Items}, {status: 200});
    }
    catch (error: any) {
        console.error(error);
        return Response.json({error: "Failed get cart items"}, {status: 500});
    }
}