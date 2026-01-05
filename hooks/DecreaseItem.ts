import useAxiosPrivate from "./useAxiosPrivate";

const DecreaseItem = () => {
    const axiosPrivate = useAxiosPrivate();

    const decrease = async (product_id: number, quantity: number) => {
        try {
            const response = await axiosPrivate.delete('http://localhost:3000/api/cart/items',
                {
                    data: {
                        product_id: product_id,
                        quantity: quantity
                    }
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
    return decrease;
}

export default DecreaseItem;