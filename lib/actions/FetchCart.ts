'use server'

import { prisma } from "@/prisma/prismaClient";

export async function fetchCart(userId: number) {
    try {
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
            return {message: 'empty'};
        } 

        console.log(foundCart.cart_Items)
            
        return {cart_items: foundCart.cart_Items}
    }
    catch (error: any) {
        console.error(error);
        throw new Error("Failed get cart items");
    }
}