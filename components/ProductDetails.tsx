"use client";

import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectProductById, fetchProducts } from '../lib/features/products/productsSlicer';
import { RootState, useAppDispatch } from '../lib/store';

const ProductDetails = ({slug}: {slug: string}) => {
    
    const dispatch = useAppDispatch();
    const product = useSelector((state: RootState) => selectProductById(state, slug));

    useEffect(() => {
        if (!product) {
            dispatch(fetchProducts());
        }
    }, [product, dispatch]);

    if (!product) return <p>Product not found</p>;

    const IMG_URL = product.imageUrl ?? `/${slug}.jpg`

  return (
    <div>
        <img src={IMG_URL} alt={product.name} style={{ width: '100px', height: '100px' }}></img>
        <h3>{product.name}</h3>
        <h4>{product.price}$</h4>
        <h4>In stock: x{product.inStock}</h4>
        <p>{product.details}</p>
        <button>Add to Cart</button>
    </div>
  )
}

export default ProductDetails