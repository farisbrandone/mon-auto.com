import React from "react";
import { Localisation } from "./icon/Localisation";
import { Telephone } from "./icon/Telephone";
import { Email } from "./icon/Email";
import FooterCond from "./politiqueConfid/FooterCond";

function Footer() {
  return (
    <footer className=" font-sans text-[12px] sm:text-[16px] w-full bg-[#333333] p-1 mt-auto ">
      <div className="text-[#fff] flex flex-col  lg:w-full lg:flex-row  lg:items-center  ">
        <div className=" px-2 flex flex-col gap-1 mt-2 lg:mt-0 lg:place-items-start lg:col-span-1  w-full  mb-2 ">
          <p className="text-[16px] sm:text-[20px]  ">
            L'équipe <span className="font-[900]">MonAuto.com</span> à votre
            service 7j/7 et 24h/24
          </p>
          <div className="flex flex-col sm:gap-3 sm:flex-row">
            <p className="  font-black mb-1 lg:mb-2 underline ">
              Nos contacts :
            </p>
            <div className="flex items-center gap-0.5 mb-1">
              <Localisation color="#ff6467" />
              <p className="ml-1 hover:text-red-400 cursor-pointer ">
                Douala Cameroun
              </p>{" "}
            </div>
            <div className="flex items-center gap-0.5 mb-1 ">
              <Telephone color="#ff6467" />
              <p className="ml-1  hover:text-red-400 cursor-pointer">
                Tel: 655968956
              </p>
            </div>
            <div className="flex items-center gap-0.5">
              <Email color="#ff6467" />
              <p className="ml-1  hover:text-red-400 cursor-pointer">
                f.pamod@outlook.com
              </p>
            </div>
          </div>
        </div>
        <FooterCond />
      </div>
    </footer>
  );
}

export default Footer;
