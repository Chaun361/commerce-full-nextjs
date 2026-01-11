'use server'

import { prisma } from "@/prisma/prismaClient"

export async function decreaseItem({userId, product_id, quantity}: 
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
                return {updated_item: updatedItem};
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
                return {removed_item: {product_id: product_id}};
            }
    
        }
        catch (error: any) {
            console.error(error);
            throw Error('Failed decrease item')
        }
}