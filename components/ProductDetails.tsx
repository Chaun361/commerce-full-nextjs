"use client";

import UseAuth from '@/hooks/UseAuth';
import UseCart from '@/hooks/UseCart';
import useProducts from '@/hooks/useProducts';
import { addItem } from '@/lib/actions/AddItem';

const ProductDetails = ({slug}: {slug: string}) => {
    const { products } = useProducts();
    const product = products.find(p => p.slug === slug);

    const { auth } = UseAuth();
    const { refreshCart } = UseCart();

    if (!product) return <p>Product not found</p>;

    const IMG_URL = product.imageUrl ?? `/${slug}.jpg`;
    const formatTotalPrice = Number(product.price).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    const onAddButton = async () => {
      try {
        if (!auth) throw new Error("Must login before add an item to the cart.");
        await addItem({
          userId: auth.userId,
          product_id: product.id,
          quantity: 1
        });
        await refreshCart();
        alert(`Added 1 ${slug} to the cart`)
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
            className='bg-indigo-600 text-white px-8 py-3 rounded-xl hover:bg-indigo-700 transition-all font-semibold shadow-md shadow-indigo-200 mt-30 w-full md:w-80 self-center hover:cursor-pointer disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed disabled:shadow-none active:scale-95 outline-0'
            onClick={onAddButton}
            disabled={product.inStock === 0}
          >
            Add to Cart
          </button>
        </div>
        
    </div>
  )
}

export default ProductDetails