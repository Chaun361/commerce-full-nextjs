"use client";

import { useRouter } from "next/navigation";

type Product = {
    id: number,
    name: string,
    slug: string,
    details: string | null,
    price: string,
    inStock: number,
    imageUrl: string | null,
    isActive: boolean,
    createdAt: string,
    updatedAt: string
}

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
    <div className='flex flex-col rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow h-80 bg-white'>
        <div>
          <img src={IMG_URL} alt={product.slug} className="w-48 h-40 object-cover rounded-md mb-4" />
          <h3 className="text-md font-normal">{productNameSub}</h3>
        </div>
        <p className="text-fuchsia-500 mb-0 my-auto font-semibold">฿{formatPrice}</p>
        
    </div>
  )
}

export default ProductCard