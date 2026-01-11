import { ProductsContext, UseProductContextType } from "@/app/context/ProductProvider"
import { useContext } from "react"

const useProducts = (): UseProductContextType => {
    return useContext(ProductsContext)
}

export default useProducts;