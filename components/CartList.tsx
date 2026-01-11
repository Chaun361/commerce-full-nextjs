"use client";

import ItemCard from './ItemCard';

import useProducts from '@/hooks/useProducts';
import UseCart from '@/hooks/UseCart';
import { memo, useEffect, useState } from 'react';
import { order } from '@/lib/actions/Order';
import UseAuth from '@/hooks/UseAuth';

const CartList = () => {
    const { cartItems, setItems } = UseCart();
    const {products} = useProducts();
    const { refreshCart } = UseCart();
    const { auth } = UseAuth();

    useEffect(() => {
        const refresh = async () => {
            try {
                await refreshCart();
            }
            catch (error:any) {
                console.error(error);
            }
        }
        
        refresh();
    }, [])

    const totalPrice = cartItems.reduce((sum, item) => {
        const product = products?.find((p: any) => p.slug === item.product.slug);
        return sum + (product ? Number(product.price) * item.quantity : 0);
    }, 0);

    const formatTotalPrice = totalPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });


    const onCheckOutClick = async () => {
        try {
            if (auth)
            await order(auth?.userId);
            setItems([]);
        }
        catch (error: any) {
            alert(error);
        }
        
    };

    let content;
    
    const cards = cartItems.length === 0
        ? <h2>Empty Cart.</h2>
        :
        cartItems.map(item => (
            <ItemCard item={item} key={item.id}></ItemCard>
        ));

    const summaryBar = (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 pb-15 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-10 border-t-4 border-indigo-400">
            <div className="max-w-7xl mx-auto flex justify-between items-center px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col">
                    <span className="text-gray-500 text-sm font-medium">Total</span>
                    <span className="text-2xl font-bold text-gray-900">฿{formatTotalPrice}</span>
                </div>
                <button 
                    className="bg-indigo-600 text-white px-8 py-3 rounded-xl hover:bg-indigo-700 transition-colors font-semibold shadow-md shadow-indigo-200 hover:cursor-pointer disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed disabled:shadow-none"
                    onClick={onCheckOutClick}
                    disabled={cartItems.length === 0}
                >
                    Checkout
                </button>
            </div>
        </div>
    )

    content = (
        <>
            {cards}
            {summaryBar}
        </>
    )

    

  return (
    <section className='min-h-200 max-w-7xl mx-auto my-4 px-4 lg:px-8 lg:my-20'>
        <h2 className='text-xl font-bold mb-10'>Your Cart</h2>
        <div className='flex flex-col gap-4'>
            {content}
        </div>
    </section>
  )
}

export default CartList;
