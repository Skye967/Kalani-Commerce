"use client";

import Link from "next/link";
import { BsChevronDown } from "react-icons/bs";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { useUser } from "@/app/context/user";
import { useState } from "react";
import { useCart } from "../../context/cart";
import { useRouter } from "next/navigation";
import ClientOnly from "@/app/components/ClientOnly";

function TopMenu() {
  const router = useRouter();
  const user = useUser();
  const cart = useCart();

  const [isMenu, setIsMenu] = useState(false);

  const isLoggedIn = () => {
    if (user && user?.id) {
      return (
        <button
          onClick={() => (!isMenu ? setIsMenu(true) : setIsMenu(false))}
          className="flex items-center gap-2 hover:underline cursor-pointer"
        >
          <div>Hi, {user.name}</div>
          <BsChevronDown />
        </button>
      );
    }

    return (
      <Link
        href="/auth"
        className="flex items-center gap-2 hover:underline cursor-pointer"
      >
        <div>Login</div>
        <BsChevronDown />
      </Link>
    );
  };

  return (
    <>
      <div id="TopMenu" className="border-b">
        <div className="flex items-center justify-between w-full mx-auto max-w-[1200px]">
          <ul
            id="TopMenuLeft"
            className="flex items-center text-[11px] text-[#333333] px-2 h-8"
          >
            <li className="relative px-3">
              {isLoggedIn()}
              <div
                id="AuthDropdown"
                className={`absolute bg-white w-[200px] text-[#333333] z-40 left-0 border shadow-lg ${
                  isMenu ? "visible" : "hidden"
                }`}
              >
                <div className="flex items-center justify-start gap-1 p-3">
                  <img
                    width={50}
                    src={user?.picture ? user.picture : undefined}
                  />
                  <div className="font-bold text-[13px]">{user?.name}</div>
                </div>
                <div className="border-b" />
                <ul className="bg-white">
                  <li className="text-[11px] py-2 px-4 w-full hover:underline text-blue-500 hover:text-blue-600 cursor-pointer">
                    <Link href="/orders">My Orders</Link>
                  </li>
                  <li
                    onClick={() => {
                      user?.singOut();
                      setIsMenu(false);
                    }}
                    className="text-[11px] py-2 px-4 w-full hover:underline text-blue-500 hover:text-blue-600 cursor-pointer"
                  >
                    Sign Out
                  </li>
                </ul>
              </div>
            </li>
            <li className="px-3 hover:underline cursor-pointer">Daily Deals</li>
            <li className="px-3 hover:underline cursor-pointer">
              Help & Contact
            </li>
          </ul>
          <ul
            id="TopMenuRight"
            className="flex items-center text-[11px] text-[#333333] px-2 h-8"
          >
            <li className="flex items-center gap-2 px-3 hover:underline cursor pointer">
              <img width={32} src="/images/uk.png" />
              Ship to
            </li>
            <ClientOnly>
            <li className="px-3 hover:underline cursor-pointer">
              <div onClick={()=>router.push('/cart')} className="relative">
                <AiOutlineShoppingCart size={22} />

                {cart.cartCount() > 0 ? (
                  <div className="absolute text-[10px] -top-[2px] -right-[5px] bg-red-500 w-[14px] rounded-full text-white">
                    <div className="flex items-center justify-center -mt-[1px] ">
                      {cart.cartCount()}
                    </div>
                  </div>
                ) : (
                  <div></div>
                )}
              </div>
            </li>
            </ClientOnly>
          </ul>
        </div>
      </div>
    </>
  );
}

export default TopMenu;
