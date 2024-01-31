import Link from "next/link";
import React from "react";

type Props = {
  product: {
    id: number;
    title: string;
    description: string;
    url: string;
    price: number;
  };
};

function Product(props: Props) {
  return (
    <>
      <Link
        href={`/product/${props?.product?.id}`}
        className="max-w-[1200px] border border-gray-50 hover:border-gray-200 hover:shadow-xl bg-gray-100 rounded mx-auto"
      >
        {props?.product?.url ? (
          <img
            className="rounded cursor-pointer"
            src={props?.product?.url + "/190"}
          />
        ) : null}
        <div className="pt-2 px-1">
          <div className="font-semibold text-[15px] hover:underline cursor-pointer">
            {props?.product?.title}
          </div>
          <div className="font-extrabold">
            &#163;{(props?.product?.price / 100).toFixed(2)}
          </div>
          <div className="relative flex items-center text-[12px] text-gray-500">
            <div className="line-through">
              &#163;{((props?.product?.price * 1.2) / 100).toFixed(2)}
            </div>
            <div className="px-2">-</div>
            <div className="line-through">20%</div>
          </div>
        </div>
      </Link>
    </>
  );
}

export default Product;
