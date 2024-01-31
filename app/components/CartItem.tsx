"use client";

import React from "react";
import { useCart } from "../context/cart";
import { toast } from "react-toastify";

type Props = {
  product: {
    id: number;
    title: string;
    description: string;
    url: string;
    price: number;
  };
};

function CartItem(props: Props) {
  const cart = useCart();

  const removeItemFromCart = () => {
    let res = confirm(`Are you sure you want to remove this? ${props.product.title}`)
    if (res) {
      cart.removeFromCart(props.product)
      toast.info('Removed from cart', {autoClose: 3000})
    }
  }

  return (
    <>
      <div className="relative flex justify-start my-2 border w-full p-6">
        <img
          src={props.product.url + "/150"}
          className="rounded-md w-[150px] h-[150px]"
        />

        <div className="overflow-hidden pl-2 w-full">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center font-semibold justify-between w-[400px] text-[16px] underline">
              {props.product?.title}
            </div>
            <div className="font-bold text-lg">
              &#163;{(props.product?.price / 100).toFixed(2)}
            </div>
          </div>

          <div className="font-semibold mt-2">New</div>

          <div className="text-sm mt-2">
            {props.product?.description.substring(0, 150)}...
          </div>

          <div className="absolute right-0 bottom-0 p-4 text-sm">
            <button onClick={()=>removeItemFromCart()} className="underline text-blue-500">Remove</button>
          </div>
        </div>
      </div>
    </>
  );
}

export default CartItem;
