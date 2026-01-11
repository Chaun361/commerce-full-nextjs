import { addItem } from "@/lib/actions/AddItem";
import UseCart from "./UseCart";

const useAddItem = () => {
    const { refreshCart } = UseCart();

    const add = async ({ userId, product_id, quantity }: 
        { userId: number, product_id: number, quantity: number }) => {
        try {
            await addItem({ userId, product_id, quantity });
            await refreshCart();
        }
        catch (error: any) {
            console.error(error);
        }
    };

    return add
};

export default useAddItem;