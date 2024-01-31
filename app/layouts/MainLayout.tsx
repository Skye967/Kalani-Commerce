"use client";

import { useEffect, useState } from "react";
import Footer from "./includes/Footer";
import MainHeader from "./includes/MainHeader";
import SubMenu from "./includes/SubMenu";
import TopMenu from "./includes/TopMenu";
import Loading from "../components/Loading";

type Props = {
  children: React.ReactNode;
};

function MainLayout({ children }: Props) {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    window.addEventListener("storage", function () {
      let res = localStorage.getItem('isLoading');
      res === 'false' ? setIsLoading(false) : setIsLoading(true);
    })
  })

  return (
    <>
      <div
        id="Mainlayout"
        className="border min-w-[1050] max-w-[1300px] mx-auto"
      >
        <div>
          {isLoading ? <Loading/> : <div></div>}
          <TopMenu />
          <MainHeader />
          <SubMenu />

          {children}
          <Footer />
        </div>
      </div>
    </>
  );
}

export default MainLayout;
