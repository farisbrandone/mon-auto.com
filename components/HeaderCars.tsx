"use client";

import React from "react";

import { Message } from "./icon/Message";
import { DropdownMenuDemo } from "./ButtonHamburger";
import Link from "next/link";
import { Plus } from "./icon/Plus";
import { useRouter } from "next/navigation";
import Image from "next/image";

function HeaderCars() {
  const router = useRouter();
  return (
    <div className=" fixed top-0 left-0 p-2 border-b-gray-950 border-solid border shadow-2xs z-10000 font-playfair flex items-center justify-between w-full bg-[#333333] px-4 py-1 sm:py-2">
      <div
        className="w-[40px] h-[40px] flex items-center justify-center cursor-pointer "
        title="Envoyez-nous un message"
        onClick={() => router.push("/send-message")}
      >
        <Message width={35} height={35} color="white" />
      </div>

      <Image
        src="/logo.png"
        alt=""
        width={100}
        height={100}
        className="w-[70px] h-[70px] object-cover cursor-pointer "
      />
      <div className="w-[35px] h-[35px] lg:w-[180px] flex items-center justify-center cursor-pointer ">
        <DropdownMenuDemo />
        <Link
          href="/add-auto"
          className="hidden lg:flex lg:items-center w-[180px] text-[18px] text-[#333333] bg-white rounded-md p-1 font-bold  "
        >
          <Plus className="mr-1" />
          Ajoute une auto
        </Link>
        {/*  <Hamburger width={30} height={30} color="white" /> */}
      </div>
    </div>
  );
}

export default HeaderCars;
