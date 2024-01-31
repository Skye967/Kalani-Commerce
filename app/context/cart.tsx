'use client' 

import React, { createContext, useState, useContext } from 'react'
import { useRouter } from 'next/navigation'

const Context = createContext<{
    isItemAdded: boolean;
    getCart: () => any;
    addToCart: (product: Product) => void;
    removeFromCart: (product: Product) => void;
    isItemAddedToCart: (product: Product) => void;
    cartCount: () => any;
    cartTotal: () => number;
    clearCart: () => void;
}>({
    isItemAdded: false,
    getCart: () => {},
    addToCart: (product: Product) => {},
    removeFromCart: (product: Product) => {},
    isItemAddedToCart: (product: Product) => {},
    cartCount: () => {},
    cartTotal: () => 0,
    clearCart: () => {},
});

type Product = {
    id: number | null;
    title: string | null;
    description: string | null;
    url: string | null;
    price: number | null;
}

const Provider = ({ children }: { children: React.ReactNode }) => {
    const router = useRouter();

    const [isItemAdded, setIsItemAdded] = useState(false);

    const getCart = () => {
        let cart = [];

        if (typeof localStorage !== "undefined") {
          // @ts-ignore
          cart = JSON.parse(localStorage.getItem("cart")) || [];
        }
        return cart;
    }

    const addToCart = (product: Product) => {
        let cart = [];

        if (typeof localStorage !== "undefined") {
          // @ts-ignore
          cart = JSON.parse(localStorage.getItem("cart")) || [];
        }
        cart.push(product)
        localStorage.setItem('cart', JSON.stringify(cart));
        isItemAddedToCart(product);
        router.refresh();
    }

    const removeFromCart = (product: Product) => {
        let cart = [];

        if (typeof localStorage !== "undefined") {
          // @ts-ignore
          cart = JSON.parse(localStorage.getItem("cart")) || [];
        }
        cart = cart.filter((item: Product) => item.id !== product.id);
        localStorage.setItem('cart', JSON.stringify(cart));
        isItemAddedToCart(product);
        router.refresh();
    };

    const isItemAddedToCart = (product: Product) => {
        let cart = [];

        if (typeof localStorage !== "undefined") {
          // @ts-ignore
          cart = JSON.parse(localStorage.getItem("cart")) || [];
        }
        cart = cart.filter((item: Product) => item.id === product.id);

        if (cart.length > 0) {
            setIsItemAdded(true);
            return
        }

        setIsItemAdded(false);
    }

    const cartCount = () => {
        let cart = [];
        if (typeof localStorage !== "undefined") {
            // @ts-ignore
            cart = JSON.parse(localStorage.getItem('cart')) || []
        }
        return cart.length;
    }

    const cartTotal = () => {
        let total = 0;
        let cart = [];
        if (typeof localStorage !== "undefined") {
          // @ts-ignore
          cart = JSON.parse(localStorage.getItem("cart")) || [];
        }
        for (let i = 0; i < cart.length; i++) {
            const element = cart[i];
            total += element.price;
        }
        return total
    }

    const clearCart = () => {
        localStorage.removeItem('cart');
        router.refresh();
    }

    const exposed = {
        isItemAdded,
        getCart,
        addToCart,
        removeFromCart,
        isItemAddedToCart,
        cartCount,
        cartTotal,
        clearCart,
    }

    return <Context.Provider value={exposed}>{children}</Context.Provider>
}

export const useCart = () => useContext(Context);

export default Provider;