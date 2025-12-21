import axios from '../../../config/axios';
import { createAsyncThunk, createEntityAdapter, createSlice } from '@reduxjs/toolkit';

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

const productsAdapter = createEntityAdapter({
    selectId: (product: Product) => product.slug,
});

type ProductStatus = 'idle' | 'loading' | 'succeeded' | 'failed';

const initialState = productsAdapter.getInitialState({
    status: 'idle' as ProductStatus,
    error: null as any
})

export const stateType = typeof initialState;

export const fetchProducts = createAsyncThunk('product/fetchProducts', async ( _ , {rejectWithValue}) => {
    try {
        const response = await axios.get('/api/products');
        return response.data;
    }
    catch (error: any) {
        return rejectWithValue(error.message);
    }
});

const productsSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {},
    extraReducers(builder) {
        builder
            .addCase(fetchProducts.pending, (state, action) => {
                state.status = 'loading';
            })
            .addCase(fetchProducts.fulfilled, (state, action) => {
                state.status = 'succeeded';
                productsAdapter.setAll(state, action.payload);
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;   
            })
    }
})

export const {
    selectAll: selectAllProducts,
    selectById: selectProductById,
    selectIds: selectProductIds
} = productsAdapter.getSelectors((state: { products: typeof initialState }) => state.products)

export const getProductsStatus = (state: { products: typeof initialState }) => state.products.status;
export const getProductsError = (state: { products: typeof initialState }) => state.products.error;

export default productsSlice.reducer;
