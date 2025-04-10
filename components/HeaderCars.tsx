import React from "react";
import { Hamburger } from "./icon/Hamburger";
import { Message } from "./icon/Message";
import { DropdownMenuDemo } from "./ButtonHamburger";
import Link from "next/link";
import { Plus } from "./icon/Plus";

function HeaderCars() {
  return (
    <div className="flex items-center justify-between w-full bg-[#333333] px-4 py-2 sm:py-5">
      <div
        className="w-[40px] h-[40px] flex items-center justify-center cursor-pointer "
        title="Envoyez-nous un message"
      >
        <Message width={35} height={35} color="white" />
      </div>

      <img
        src="/logo.png"
        alt=""
        className="w-[100px] h-[100px] object-cover cursor-pointer "
      />
      <div className="w-[35px] h-[35px] lg:w-[180px] flex items-center justify-center cursor-pointer ">
        <DropdownMenuDemo />
        <Link
          href="#"
          className="hidden lg:flex lg:items-center w-[180px] text-[18px] text-[#333333] bg-white rounded-md p-1 font-bold  "
        >
          <Plus className="mr-1" />
          Ajouter une auto
        </Link>
        {/*  <Hamburger width={30} height={30} color="white" /> */}
      </div>
    </div>
  );
}

export default HeaderCars;
