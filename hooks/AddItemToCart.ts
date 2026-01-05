import useAxiosPrivate from "./useAxiosPrivate";

const AddItemToCart = () => {
    const axiosPrivate = useAxiosPrivate();

    const add = async (product_id: number, quantity: number) => {
        try {
            const response = await axiosPrivate.put('http://localhost:3000/api/cart/items',
                {
                    product_id: product_id,
                    quantity: quantity
                }
            )

            return response.data.updated_item;
        }
        catch (error: any) {
            if (error.response && error.response.data && error.response.data.message) {
                return error.response.data.message;
            }
            return error.message;
        }
    }
    return add;
}

export default AddItemToCart;
