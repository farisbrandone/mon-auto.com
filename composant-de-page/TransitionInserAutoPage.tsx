"use client";
import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import MyLogo from "@/components/MyLogo";
import HeaderCars from "@/components/HeaderCars";

export default function TransitionInserAutoPage() {
  const router = useRouter();
  return (
    <div className="bg-white flex flex-col  justify-center items-center w-screen h-screen text-[#636364] p-2 text-[16px] ">
      <HeaderCars />
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative flex items-center justify-center p-3 min-w-[250px]  sm:min-w-[350px] h-[300px] loginShaddow"
      >
        <h1 className="text-2xl font-bold mb-4 text-green-600 w-full text-center">
          L'auto a été inserée avec success
        </h1>
        <div className="absolute flex flex-col gap-3 bottom-1 w-full p-1 ">
          <Button
            className="bg-red-400 text-white w-full px-1 py-2.5 text-center"
            onClick={() => router.push("/addAuto")}
          >
            Inserer une nouvelle auto
          </Button>
          <Button
            className="bg-[#333333] text-white w-full px-1 py-2.5 text-center"
            onClick={() => router.push("/cars")}
          >
            Retour à l'accueil
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
