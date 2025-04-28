import React from "react";
import { Localisation } from "./icon/Localisation";
import { Telephone } from "./icon/Telephone";
import { Email } from "./icon/Email";

function Footer() {
  return (
    <footer className=" w-full bg-[#333333] text-white mt-auto ">
      <div className="  lg:w-full lg:grid lg:grid-cols-2 p-2 ">
        <div className=" max-w-2xl flex flex-col lg:col-span-1 font-serif ">
          <p className="font-black mb-2 text-[25px] ">Concessionnaire :</p>

          <p>
            L'équipe <strong>MonAuto.com</strong> s'efforce d'offrir un service
            à la clientèle exceptionnel et de faire en sorte que chaque
            interaction avec nous soit une expérience positive et mémorable.
            Nous sommes fiers de notre personnel compétent qui connaît bien
            l'industrie automobile et qui est capable de fournir des conseils
            d'expert pour vous aider à trouver le véhicule idéal pour votre
            style de vie.
          </p>
        </div>

        <div className="px-2 flex flex-col gap-1 mt-4 lg:mt-0 lg:place-items-end  lg:col-span-1  w-full shadow-2xl font-serif font-stretch-ultra-condensed ">
          <div>
            <p className="font-black mb-1 lg:mb-2 underline ">Nos contacts :</p>
            <div className="flex items-center mb-1">
              <Localisation color="#1eb0fc" />
              <p className="ml-1 hover:text-[#1eb0fc] cursor-pointer ">
                Nouvelle route Bepanda
              </p>{" "}
            </div>
            <div className="flex items-center mb-1 ">
              <Telephone color="#1eb0fc" />
              <p className="ml-1  hover:text-[#1eb0fc] cursor-pointer">
                Tel: 655968956
              </p>
            </div>
            <div className="flex items-center">
              <Email color="#1eb0fc" />
              <p className="ml-1  hover:text-[#1eb0fc] cursor-pointer">
                f.pamod@outlook.com
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
