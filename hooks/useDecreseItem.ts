import { decreaseItem } from "@/lib/actions/DecreseItem";
import UseCart from "./UseCart";

const useDecreaseItem = () => {
    const { refreshCart } = UseCart();

    const decrease = async ({ userId, product_id, quantity }: 
        { userId: number, product_id: number, quantity: number }) => {
            try {
                await decreaseItem({ userId, product_id, quantity });
                await refreshCart();
            }
            catch (error: any) {
                console.error(error);
            }
    }

    return decrease
}

export default useDecreaseItem;