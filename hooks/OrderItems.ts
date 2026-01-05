import { clearCart } from "@/lib/features/cart/cartSlice";
import useAxiosPrivate from "./useAxiosPrivate";
import { useAppDispatch } from "@/lib/store";

const OrderItems = () => {
  const axiosPrivate = useAxiosPrivate();
  const dispatch = useAppDispatch();
  
  const order = async () => {
    try {
        const response = await axiosPrivate.post('http://localhost:3000/api/order')
        dispatch(clearCart());
        return response.data;
    }
    catch (error: any) {
        if (error.response && error.response.data && error.response.data.message) {
            return error.response.data.message;
        }
        return error.message;
    }
  }

  return order;
}

export default OrderItems