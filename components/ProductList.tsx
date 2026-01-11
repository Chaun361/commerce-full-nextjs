"use client";

import ProductCard from './ProductCard';
import useProducts from '@/hooks/useProducts';


const ProductList = () => {
    const {products} = useProducts();

    let content;
    if (!products) {
        content = <p>Failed to load products</p>
    }
    else {
        content = products.map(product => <ProductCard product={product} key={product.slug}></ProductCard>);
    }

  const categories = ["All", "Apple", "Headphone", "Laptop"];

  return (
    <section className='flex flex-col max-w-7xl  mx-auto py-8 justify-between px-4 sm:px-6 lg:px-8 mb-50'>
      <h1 className='font-bold text-xl mb-6'>Available Products</h1>
      <div className='flex flex-wrap gap-3 mb-8'>
        {categories.map((category) => (
          <button key={category} className='px-4 py-2 rounded-full border border-gray-300 text-sm font-medium hover:bg-gray-100 transition-colors'>
            {category}
          </button>
        ))}
      </div>
      <div className='grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-6'>
        {content}
      </div>
    </section>
  )
}

export default ProductList