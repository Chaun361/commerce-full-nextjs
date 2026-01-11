'use client'

import { createContext, ReactNode, useEffect, useState } from "react";
import { fetchProducts, type Product } from "@/lib/actions/FetchProducts";

type ChildrenType = { children: ReactNode }

export type UseProductContextType = { products: Product[]};

const initContextState: UseProductContextType = { products: []};

export const ProductsContext = createContext<UseProductContextType>(initContextState);

export const ProductsProvider = ({children}: ChildrenType) => {
    const [products, setProducts] = useState<Product[]>([]);
    
    useEffect(() => {
        const fetch = async () => {
            try {
                const response = await fetchProducts();
                setProducts(response);
            } catch (err: any) {
                console.error(err);
            } 
        }  

        fetch();
    }, []);

    return (
        <ProductsContext.Provider value={{products}}>
            {children}
        </ProductsContext.Provider>
    );
}