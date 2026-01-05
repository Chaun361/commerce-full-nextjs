import { configureStore } from '@reduxjs/toolkit'
import productReducer from './features/products/productsSlicer'
import cartReducer from './features/cart/cartSlice'
import authReducer from './features/auth/authSlice'
import { useDispatch } from 'react-redux'

export const store = configureStore({
  reducer: {
    products: productReducer,
    cart: cartReducer,
    auth: authReducer
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export const useAppDispatch = useDispatch.withTypes<AppDispatch>() 