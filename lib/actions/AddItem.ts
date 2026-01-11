'use server'

import { prisma } from "@/prisma/prismaClient";

export async function addItem({userId, product_id, quantity}: 
    {userId: number, product_id: number, quantity: number}) {
        try {
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
                        increment: quantity
                    }
                }
            })
    
            return {updated_item: updatedItem};
        }
        catch (error: any) {
            console.error(error);
            throw new Error("Failed add item");
        }
    
}