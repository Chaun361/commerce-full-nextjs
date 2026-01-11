"use client";

import { useRouter } from "next/navigation";

import { type Product } from '@/lib/actions/FetchProducts';

const ProductCard = ({product}: {product: Product}) => {
  const IMG_URL = product.imageUrl ?? `/${product.slug}.jpg`;

  let productNameSub = product.name.substring(0,30);
  if (product.name.length > 20) {
    productNameSub += "..."
  }

  const formatPrice = Number(product.price).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

  const router = useRouter();

  const onViewDetailsClick = () => {  
    router?.push(`/products/${product.slug}`);
  }
  return (
    <div className='flex flex-col rounded-lg p-4 shadow-sm hover:shadow-md hover:cursor-pointer transition-shadow mx-auto h-70 bg-white 
    w-40 md:w-50' onClick={onViewDetailsClick}>
        <div>
          <img src={IMG_URL} alt={product.slug} className="h-30 md:h-38 object-cover rounded-md mb-4 m-auto" />
          <h3 className="text-md font-normal">{productNameSub}</h3>
        </div>
        <p className="text-fuchsia-500 mb-0 my-auto font-semibold">฿{formatPrice}</p>
    </div>
  )
}

export default ProductCard