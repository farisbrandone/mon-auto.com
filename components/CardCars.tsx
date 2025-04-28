import React, { useState } from "react";
import { Telephone } from "./icon/Telephone";
import { Localisation } from "./icon/Localisation";
import { Button } from "./ui/button";
import { ImageCaroussel } from "./ImageCarousel";

function CardCars() {
  const [position, setPosition] = useState(0);
  return (
    <div className="flex flex-col items-center max-w-xl mx-auto px-1">
      {/*  <ImageCaroussel
        className="w-full max-w-xl rounded-lg"
        position={position}
        setPosition={setPosition}
      /> */}
      <p className="w-full flex items-center justify-end text-red-600 mt-2 text-[20px] ">
        $ {"15,499"}
      </p>

      <p className="w-full font-black text-[18px] flex flex-col p-2 mt-2 after:w-full after:border-1 after:border-solid after:mt-2 after:border-[#33333383] ">
        model:2016 Chevrolet Spark EV FWD
      </p>
      <div className="flex flex-col gap-3 w-full p-2">
        <div className="grid grid-cols-2 w-full">
          <p className="font-[800]"> Kilometrage : </p>
          <p> 94 948 KM</p>
        </div>
        <div className="grid grid-cols-2 w-full">
          <p className="font-[800]"> Moteur : </p>
          <p> Électrique</p>
        </div>

        <div className="grid grid-cols-2 w-full">
          <p className="font-[800]"> chaîne de traction : </p>
          <p> FWD</p>
        </div>
        <div className="grid grid-cols-2 w-full">
          <p className="font-[800]"> Type de carburant : </p>
          <p> Électrique</p>
        </div>
        <div className="grid grid-cols-2 w-full">
          <p className="font-[800]"> Transmission </p>
          <p> Automatique</p>
        </div>
        <div className="grid grid-cols-2 w-full">
          <p className="font-[800]"> Stock # : </p>
          <p> 598019 </p>
        </div>
      </div>
      <Button
        type="button"
        className=" text-[18px] w-full bg-[#1eb0fc] text-white rounded-[1px] border-[2px] border-solid border-[#33333383] lg:max-w-[300px] cursor-pointer hover:bg-white hover:text-[#1eb0fc]"
      >
        Voir les détails
      </Button>
      <div className="flex items-center w-full justify-between mt-2 text-[18px] font-[400] ">
        <div className="flex items-center">
          <Localisation color="#1eb0fc" />
          <p className="ml-1 hover:text-[#1eb0fc] cursor-pointer ">
            MonAuto.com
          </p>{" "}
        </div>
        <div className="flex items-center">
          <Telephone color="#1eb0fc" />
          <p className="ml-1  hover:text-[#1eb0fc] cursor-pointer">
            Tel: 655968956
          </p>
        </div>
      </div>
    </div>
  );
}

export default CardCars;
