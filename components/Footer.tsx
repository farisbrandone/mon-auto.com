import React from "react";
import { Localisation } from "./icon/Localisation";
import { Telephone } from "./icon/Telephone";
import { Email } from "./icon/Email";
import FooterCond from "./politiqueConfid/FooterCond";

function Footer() {
  return (
    <footer className=" font-sans text-[12px] sm:text-[14px] w-full bg-[#333333] p-1 mt-auto ">
      <div className="text-[#fff] flex flex-col gap-1 items-center mt-0.5  ">
        <div className="flex flex-row gap-2">
          <div className="flex items-center gap-0.5 ">
            <Telephone color="#ff6467" />
            <p className="  hover:text-red-400 cursor-pointer">
              {" Tel:(+237) 655968956"}
            </p>
          </div>
          <div className="flex items-center gap-0.5">
            <Email color="#ff6467" />
            <p className="  hover:text-red-400 cursor-pointer">
              f.pamod@outlook.com
            </p>
          </div>
        </div>

        <FooterCond />
      </div>
    </footer>
  );
}

export default Footer;
