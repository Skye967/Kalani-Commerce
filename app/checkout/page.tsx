"use client";

import React, { FormEvent, useEffect, useRef, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import CheckoutItem from "../components/CheckoutItem";
import { useUser } from "../context/user";
import { useCart } from "../context/cart";
import { useRouter } from "next/navigation";
import { ToastContentProps, toast } from "react-toastify";
import useIsLoading from "../hooks/useIsLoading";
import useUserAddress from "../hooks/useUserAddress";
import {
  Stripe,
  StripeCardElement,
  StripeElements,
  loadStripe,
} from "@stripe/stripe-js";
import Product from "../product/[id]/page";
import Link from "next/link";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import ClientOnly from "../components/ClientOnly";

type Props = {};

function Checkout({ }: Props) {
  const user = useUser();
  const cart = useCart();
  const router = useRouter();

  let stripe = useRef<Stripe | null>(null);
  let elements = useRef<StripeElements | undefined>();
  let card = useRef<StripeCardElement>();
  let clientSecret = useRef(null);

  const [addressDetails, setAddressDetails] = useState<{
    name: string | null;
    address: string | null;
    zipcode: string | null;
    city: string | null;
    country: string | null;
  } | null>({
    name: null,
    address: null,
    zipcode: null,
    city: null,
    country: null,
  });
  const [isLoadingAddress, setIsLoadingAddress] = useState(false);

  useEffect(() => {
    if (cart?.cartTotal() <= 0) {
      toast.error("Your cart is empty!", { autoClose: 3000 });
      router.push("/");
    }
    useIsLoading(true);

    const getAddress = async () => {
      if (user?.id == null || user?.id == undefined) {
        useIsLoading(false);
        return;
      }

      setIsLoadingAddress(true);
      const response = await useUserAddress();
      if (response) setAddressDetails(response);
      setIsLoadingAddress(false);
    };

    getAddress();
    setTimeout(() => stripeInit(), 300);
  }, [user]);

  const stripeInit = async () => {
    stripe.current = await loadStripe(
      process.env.NEXT_PUBLIC_STRIPE_PK_KEY || ""
    );

    const response = await fetch("/api/stripe", {
      method: "POST",
      body: JSON.stringify({ amount: cart.cartTotal() }),
    });
    const result = await response.json();

    clientSecret.current = result.client_secret;
    elements.current = stripe?.current?.elements();
    var style = {
      base: {
        fontSize: "18px",
      },
      invalid: {
        fontFamily: "Arial, sans-serif",
        color: "#EE4B2B",
        iconColr: "#EE4B2B",
      },
    };

    card.current = elements?.current?.create("card", {
      hidePostalCode: true,
      style: style,
    });
    card.current?.mount("#card-element");
    card?.current?.on("change", function (event) {
      document.querySelector("button")!.disabled = event.empty;
      document.querySelector("#card-error")!.textContent = event.error
        ? event.error.message
        : "";
    });

    useIsLoading(false);
  };

  const pay = async (event: FormEvent) => {
    event.preventDefault();

    if (Object.entries(addressDetails!).length == 0) {
      showError("Please add shipping address");
      return;
    }

    let result = await stripe!.current!.confirmCardPayment(
      clientSecret!.current!,
      {
        payment_method: { card: card!.current! },
      }
    );

    if (result.error) {
      showError(result!.error!.message!);
    } else {
      useIsLoading(true);

      try {
        let response = await fetch("/api/orders/create", {
          method: "POST",
          body: JSON.stringify({
            stripe_id: result.paymentIntent.id,
            name: addressDetails?.name,
            address: addressDetails?.address,
            zipcode: addressDetails?.zipcode,
            city: addressDetails?.city,
            country: addressDetails?.country,
            products: cart.getCart(),
            total: cart.cartTotal(),
          }),
        });
        if (response.status == 200) {
          toast.success("Order Complete!", { autoClose: 3000 });
          cart.clearCart();
          return router.push("/success");
        }
      } catch (error) {
        console.log(error);
        toast.error("Something went wrong?", { autoClose: 3000 });
      }
    }
  };

  const showError = (errorMsgText: string) => {
    let errorMsg = document.querySelector("#card-error");
    toast.error(errorMsgText, { autoClose: 3000 });
    errorMsg!.textContent = errorMsgText;
    setTimeout(() => {
      errorMsg!.textContent = "";
    }, 3000);
  };

  return (
    <>
      <MainLayout>
        <div id="CheckoutPage" className="mt-4 max-w-[1100px] mx-auto">
          <div className="text-2xl font-bold mt-4 mb-4">Checkout</div>

          <div className="relative flex items-baseline gap-4 justify-between mx-auto w-full">
            <div className="w-[65%]">
              <div className="bg-white rounded-lg p-4 border">
                <div className="text-xl font semibold mb-2">
                  Shipping Address
                </div>

                <div>
                  {!isLoadingAddress ? (
                    <Link
                      href="/address"
                      className="text-blue-500 text-sm underline"
                    >
                      {addressDetails?.name ? "Update Address" : "Add Address"}
                    </Link>
                  ) : null}

                  {!isLoadingAddress && addressDetails?.name ? (
                    <ul className="text-sm mt-2">
                      <li>Name: {addressDetails.name}</li>
                      <li>Address: {addressDetails.address}</li>
                      <li>Zipcode: {addressDetails.zipcode}</li>
                      <li>City: {addressDetails.city}</li>
                      <li>Country: {addressDetails.country}</li>
                    </ul>
                  ) : null}

                  {isLoadingAddress ? (
                    <div className="flex items-center mt-1 gap-2">
                      <AiOutlineLoading3Quarters className="animate-spin" />
                      Getting Address...
                    </div>
                  ) : (
                    <div></div>
                  )}
                </div>
              </div>

              <ClientOnly>
                <div id="Items" className="bg-white rounded-lg mt-4">
                  {cart
                    .getCart()
                    .map(
                      (product: {
                        id: any;
                        title: string;
                        description: string;
                        url: string;
                        price: number;
                      }) => (
                        <CheckoutItem key={product.id} product={product} />
                      )
                    )}
                </div>
              </ClientOnly>
            </div>
            <div
              id="PlaceOrder"
              className="relative -top-[6px] w-[35%] border rounded-lg"
            >
              <ClientOnly>
                <div className="p-4">
                  <div className="flex items-baseline justify-between text-sm mb-1">
                    <div>Items ({cart.getCart().length})</div>
                    <div>&#163;{(cart.cartTotal() / 100).toFixed(2)}</div>
                  </div>
                  <div className="flex items-center justify-between mb-4 text-sm">
                    <div>Shipping:</div>
                    <div>Free</div>
                  </div>
                  <div className="border-t" />
                  <div className="flex items-center justify-between my-4">
                    <div className="font-semibold">Order total</div>
                    <div className="text-2xl font-semibold">
                      &#163;{(cart.cartTotal() / 100).toFixed(2)}
                    </div>
                  </div>
                  <form onSubmit={pay}>
                    <div
                      id="card-element"
                      className="border border-gray-500 p-2 rounded-sm"
                    />
                    <p
                      id="card-error"
                      role="alert"
                      className="text-red-700 text-center font-semibold relative top-2"
                    />
                    <button
                      type="submit"
                      className="mt-4 bg-blue-600 text-lg w-full text-white font-semibold p-3 rounded-full"
                    >
                      Confirm and pay
                    </button>
                  </form>
                </div>
              </ClientOnly>
              <div className="flex items-center p-4 justify-center gap-2 border-t">
                <div className="font-light mb-2 mt-2">MONEY BACK GAURANTEE</div>
              </div>
            </div>
          </div>
        </div>
      </MainLayout>
    </>
  );
}

export default Checkout;
