"use client";

import { MouseEventHandler, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectProductById, fetchProducts } from '../lib/features/products/productsSlicer';
import { RootState, useAppDispatch } from '../lib/store';
import AddItemToCart from '@/hooks/AddItemToCart';

const ProductDetails = ({slug}: {slug: string}) => {
    
    const dispatch = useAppDispatch();
    const product = useSelector((state: RootState) => selectProductById(state, slug));
    const addItemToCart = AddItemToCart();

    useEffect(() => {
        if (!product) {
            dispatch(fetchProducts());
        }
    }, [product, dispatch]);

    if (!product) return <p>Product not found</p>;

    const IMG_URL = product.imageUrl ?? `/${slug}.jpg`;
    const formatTotalPrice = Number(product.price).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    const onAddButton = async () => {
      try {
        await addItemToCart(product.id, 1);
      }
      catch(error: any) {
        console.error(error);
      }
    }

  return (
    <div 
      className='flex flex-col min-h-lvh m-4 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8
      lg:grid lg:grid-cols-2 lg:my-20 lg:gap-5'
      >
        <div>
          <img 
            src={IMG_URL} 
            alt={product.name}
            className='w-full h-50vh object-cover md:h-130 lg:mt-4 lg:h-140 lg:w-140'
          >
          </img>
        </div>
        <div className='flex flex-col gap-2 mt-4'>
          <h3 
            className='text-lg font-normal mt-2'
          >
            {product.name}
          </h3>
          <div className='flex gap-4'>
            <h4
              className='text-fuchsia-500 font-semibold text-lg'
            >
              ฿{formatTotalPrice}
            </h4>
            <h4 className='text-gray-500'>
              In stock: x{product.inStock}
            </h4>
          </div>
          <p>
            {product.details}
          </p>
          <button 
            className='bg-indigo-600 text-white px-8 py-3 rounded-xl hover:bg-indigo-700 transition-colors font-semibold shadow-md shadow-indigo-200 mt-30 w-full md:w-80 self-center hover:cursor-pointer'
            onClick={onAddButton}
          >
            Add to Cart
          </button>
        </div>
        
    </div>
  )
}

export default ProductDetails