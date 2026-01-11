import { CartContext, UseCartContextType } from "@/app/context/CartProvider";
import { useContext } from "react";

const UseCart = (): UseCartContextType => {
    return useContext(CartContext);
}

export default UseCart;