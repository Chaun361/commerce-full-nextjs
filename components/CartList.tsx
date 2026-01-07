"use client";

import { useAppDispatch } from '@/lib/store';
import { useSelector } from 'react-redux'
import { fetchProducts, getProductsStatus, getProductsError, selectAllProducts } from '../lib/features/products/productsSlicer';
import { fetchCart, getCartStatus, getCartError, selectAllCartItems } from '@/lib/features/cart/cartSlice';
import { useEffect } from 'react';

import ItemCard from './ItemCard';
import useAxiosPrivate from '@/hooks/useAxiosPrivate';
import OrderItems from '@/hooks/OrderItems';

const CartList = () => {
    const axiosPrivate = useAxiosPrivate()

    const order = OrderItems();

    const productsStatus = useSelector(getProductsStatus);
    const productError = useSelector(getProductsError);

    const cartStatus = useSelector(getCartStatus);
    const cartError = useSelector(getCartError);

    const cartItems = useSelector(selectAllCartItems);
    const products = useSelector(selectAllProducts);

    const dispatch = useAppDispatch();

    useEffect(() => {
        if (productsStatus === 'idle') {
            dispatch(fetchProducts());
        }
         dispatch(fetchCart(axiosPrivate));
    }, [dispatch, productsStatus]);

    const totalPrice = cartItems.reduce((sum, item) => {
        const product = products?.find((p: any) => p.slug === item.product.slug);
        return sum + (product ? Number(product.price) * item.quantity : 0);
    }, 0);

    const formatTotalPrice = totalPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    const onCheckOutClick = async () => {
        await order();
    };

    let content;
    if (cartStatus === 'loading') {
    content = <p>loading...</p>
    }
    else if (cartStatus === 'succeeded') {
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
                    className="bg-indigo-600 text-white px-8 py-3 rounded-xl hover:bg-indigo-700 transition-colors font-semibold shadow-md shadow-indigo-200 hover:cursor-pointer"
                    onClick={onCheckOutClick}
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

    }
    else if (cartStatus === 'failed') {
        content = <p>{cartError}</p>
    }

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
