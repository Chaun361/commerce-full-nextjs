import { createSlice, createAsyncThunk, createEntityAdapter } from "@reduxjs/toolkit";
import axios from "@/config/axios";

type CartItem = {
    id: number,
    cart_id: number,
    product_id: number,
    quantity: number,
    product: {slug: string}
}

type CartStatus = 'idle' | 'loading' | 'succeeded' | 'failed';

const cartAdapter = createEntityAdapter({
    selectId: (item: CartItem) => item.id,
});

const initialState = cartAdapter.getInitialState({
    status: 'idle' as CartStatus,
    error: null as any
})

export const fetchCart = createAsyncThunk('cart/fetchCart', async (_, {rejectWithValue}) => {
    try {
        const response = await axios.get('/api/cart/items');
        return response.data.cart_items;
    }
    catch (error: any) {
        return rejectWithValue(error.message);
    }
});

/*
export const addItem = createAsyncThunk('cart/addItem', async (payload, {rejectWithValue}) => {
    try {
        const response = await axios.post('/add', payload);
        return response.data.updatedCart;
    } catch (error: any) {
        return rejectWithValue(error.message);
    }
})

export const decreaseItem = createAsyncThunk('cart/decreaseItem', async (payload, {rejectWithValue}) => {
    try {
        const response = await axios.post('/decrease', payload);
        return response.data.updatedCart;
    } catch (error: any) {
        return rejectWithValue(error.message);
    }
});
*/

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCart.pending, (state, action) => {
                state.status = 'loading';
            })
            .addCase(fetchCart.fulfilled, (state, action) => {
                state.status = 'succeeded';
                cartAdapter.setAll(state, action.payload);
            })
            .addCase(fetchCart.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;   
            })
    }
});

export const {
    selectAll: selectAllCartItems,
    selectById: selectCartItemById,
    selectIds: selectCartItemIds
} = cartAdapter.getSelectors((state: { cart: typeof initialState }) => state.cart)

export const getCartStatus = (state: { cart: typeof initialState }) => state.cart.status;
export const getCartError = (state: { cart: typeof initialState }) => state.cart.error;

export default cartSlice.reducer;