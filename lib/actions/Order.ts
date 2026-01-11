'use server'

import { prisma } from "@/prisma/prismaClient";

export async function order(userId: number) {
    try {
        const newOrder = await prisma.$transaction(async (tx) => {
            const cart = await tx.cart.findFirst({
                where: {
                    user_id: userId,
                    is_active: true
                },
                include: {
                    cart_Items: {
                        include: {
                            product: true
                        }
                    }
                }
            })

            if (!cart || cart.cart_Items.length === 0) {
                throw Error("Cart is empty");
            }

            const totalAmount = cart.cart_Items.reduce((total, item) => {
                return total += (Number(item.product.price) * item.quantity); 
            }, 0)

            for (const item of cart.cart_Items) {
                if (item.quantity > item.product.inStock) {
                    throw Error(`Only (${item.product.inStock}) ${item.product.name}(s) Available in stock`);
                }
            }
        
            const order = await tx.order.create({
                data: {
                    user_id: userId,
                    totalAmount: totalAmount,
                    status: 'PENDING',
                    orderItems: {
                        create: cart.cart_Items.map(item => ({
                            product_id: item.product_id,
                            name: item.product.name,
                            quantity: item.quantity,
                            price: item.product.price
                        }))
                    }
                }
            });

            //decrese each product in stock based on cartItems
            for (const item of cart.cart_Items) {
                const { count } = await tx.product.updateMany({
                    where: { 
                        id: item.product_id,
                        inStock: { gte: item.quantity }
                    },
                    data: { inStock: { decrement: item.quantity } }
                });

                if (count === 0) {
                    throw Error(`Stock no longer Available for ${item.product.name}`);
                }
            }

            await tx.cartItem.deleteMany({
                where: {
                    cart_id: cart.id
                }
            })

            return order
        })


        return {success: true};
    }
    catch (error: any) {
        if (error.message === "Cart is empty") {
            throw Error("Cart is empty");
        }
        if (error.message.includes("Available")) {
            throw Error(error.message);
        }
        console.error(error);
        throw Error("Failed ordering items");
    }
}