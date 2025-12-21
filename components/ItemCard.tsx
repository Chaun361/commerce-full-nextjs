"use client";

import { selectProductById } from "@/lib/features/products/productsSlicer";
import { useSelector } from "react-redux";

type CartItem = {
    id: number,
    cart_id: number,
    product_id: number,
    quantity: number,
    product: {slug: string}
}

const ItemCart = ({item}: {item: CartItem}) => {

  const product = useSelector((state: any) => selectProductById(state, item.product.slug))
  const IMG_URL = product.imageUrl ?? `/${product.slug}.jpg`;

  const totalEach = (Number(product.price) * item.quantity).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return (
    <div className="flex justify-between m-5 h-40 bg-white rounded-lg p-3 shadow-sm">
        <div className="self-center"> 
          <img src={IMG_URL} alt={product.name} className="w-17 h-20 object-cover "></img>
        </div>
        <div className="flex flex-col justify-between w-45">
          <h3 className="text-sm">{product.name}</h3>
          <div className="flex items-center border border-gray-200 rounded-lg w-fit shadow-sm">
            <button className="px-3 py-1 text-gray-600 hover:bg-gray-50 hover:text-indigo-600 hover:cursor-pointer transition-colors rounded-l-lg font-medium border-r border-gray-200">-</button>
            <span className="px-3 text-sm font-semibold text-gray-900 min-w-[2rem] text-center">{item.quantity}</span>
            <button className="px-3 py-1 text-gray-600 bg-indigo-200 hover:bg-indigo-500 hover:text-gray-50 hover:cursor-pointer transition-colors rounded-r-lg font-medium border-l border-gray-200">+</button>
          </div>
        </div>
        <div>
          <p className="text-fuchsia-500 font-semibold">฿{totalEach}</p>
        </div>
    </div>
  )
}

export default ItemCart