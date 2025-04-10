"use client";
import HeaderCars from "@/components/HeaderCars";
import { Search } from "lucide-react";

import React from "react";

function page() {
  return (
    <div className="text-black text-[16px] ">
      <HeaderCars />

      <div className="flex flex-col gap-1 px-4  pt-3 mt-4 mx-2 border-[#333333] border-solid border-[2px] shadow-2xl rounded-md  ">
        <div className="flex items-center gap-1 ">
          <Search />
          Configurer et lancer votre recherche
        </div>

        <div className="flex flex-col gap-1 items-center mx-2 "></div>
      </div>
    </div>
  );
}

export default page;
