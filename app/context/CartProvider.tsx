'use client'

import UseAuth from "@/hooks/UseAuth";
import { fetchCart } from "@/lib/actions/FetchCart";
import { createContext, Dispatch, ReactNode, SetStateAction, useCallback, useEffect, useState } from "react";

type ChildrenType = { children: ReactNode }

type CartItemType = {
    id: number,
    cart_id: number,
    product_id: number,
    quantity: number,
    product: {slug: string}
}

export type UseCartContextType = {
    cartItems: CartItemType[], 
    setItems: Dispatch<SetStateAction<CartItemType[]>>,
    refreshCart: () => Promise<void>
};

const initContextState: UseCartContextType = { 
    cartItems: [],
    setItems: (() => {}),
    refreshCart: async () => {}};

export const CartContext = createContext<UseCartContextType>(initContextState);

export const CartProvider = ({children}: ChildrenType) => {
    const [items, setItems] = useState<CartItemType[]>([]);
    const { auth } = UseAuth();

    const refreshCart = useCallback(async () => {
        if (auth?.userId) {
            const response = await fetchCart(auth.userId);
            const sortedItems = (response?.cart_items ?? []).sort((a: CartItemType, b: CartItemType) => a.id - b.id);
            setItems(sortedItems);
        } else {
            setItems([]);
        }
    }, [auth?.userId])

    useEffect(() => {
        refreshCart();
    }, [refreshCart]);

    return (
        <CartContext.Provider value={{ cartItems: items, setItems , refreshCart }}>
            {children}
        </CartContext.Provider>
    )
}