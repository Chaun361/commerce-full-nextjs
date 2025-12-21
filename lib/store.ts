import { configureStore } from '@reduxjs/toolkit'
import productReducer from './features/products/productsSlicer'
import cartReducer from './features/cart/cartSlice'
import { useDispatch } from 'react-redux'

export const store = configureStore({
  reducer: {
    products: productReducer,
    cart: cartReducer
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export const useAppDispatch = useDispatch.withTypes<AppDispatch>() 