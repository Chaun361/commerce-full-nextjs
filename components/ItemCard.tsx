"use client";

import UseAuth from "@/hooks/UseAuth";
import useDecreaseItem from "@/hooks/useDecreseItem";
import useProducts from "@/hooks/useProducts";
import useAddItem from "@/hooks/ีuseAddItem";
import { useState, useEffect, memo } from "react";

type CartItem = {
    id: number,
    cart_id: number,
    product_id: number,
    quantity: number,
    product: {slug: string}
}

const ItemCart = ({item}: {item: CartItem}) => {
  const [quantity, setQuantity] = useState(item.quantity);
  const [display, setDisplay] = useState('');
  const { products } = useProducts();
  const { auth } = UseAuth();

  useEffect(() => {
    if (quantity === 0)
      setDisplay('hidden');
  }, [quantity]);

  //hook can't be call in async function
  const addItemHandler = useAddItem();
  const decreaseItemHandler = useDecreaseItem();
  
  const onAddButton = async () => {
    try {
      await addItemHandler({
        userId: auth?.userId as number,
        product_id: item.product_id,
        quantity: 1
      })
      setQuantity(q => q + 1);
    }
    catch (error: any) {
      console.error(error);
    }
  };

  const onDecreseButton = async () => {
    try {
      await decreaseItemHandler({
        userId: auth?.userId as number,
        product_id: item.product_id,
        quantity: 1
      });
      setQuantity(q => q - 1);
    }
    catch (error: any) {
      console.error(error);
    }
  };

  const product = products?.find(p => p.id === item.product_id);
  const IMG_URL = product?.imageUrl ?? `/${product?.slug}.jpg`;

  const totalEach = (Number(product?.price) * quantity).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return (
    <div className={`flex justify-between h-40 bg-white rounded-lg p-3 shadow-sm ${display}`}>
        <div className="flex md:gap-5">
          <div className="self-center"> 
            <img src={IMG_URL} alt={product?.name} className="w-18 md:w-25 h-18 md:h-25 object-cover "></img>
          </div>
          <div className="flex flex-col justify-around  w-45">
            <h3 className="text-sm">{product?.name}</h3>
            <div className="flex items-center border border-gray-200 rounded-lg w-fit shadow-sm">
              <button 
                className="px-3 py-1 text-gray-600 hover:bg-gray-50 hover:text-indigo-600 hover:cursor-pointer transition-colors rounded-l-lg font-medium border-r border-gray-200"
                onClick={onDecreseButton}
                >
                  -
              </button>
              <span className="px-3 text-sm font-semibold text-gray-900 min-w-[2rem] text-center">{quantity}</span>
              <button 
                className="px-3 py-1 text-gray-600 bg-indigo-200 hover:bg-indigo-500 hover:text-gray-50 hover:cursor-pointer transition-colors rounded-r-lg font-medium border-l border-gray-200"
                onClick={onAddButton}
              >
                  +
              </button>
            </div>
          </div>
        </div>
        <div>
          <p className="text-fuchsia-500 font-semibold mt-2">฿{totalEach}</p>
        </div>
    </div>
  )
}

export default ItemCart;