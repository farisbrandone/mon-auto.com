"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { Textarea } from "@/components/ui/textarea";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { contactForm, contactSchema } from "@/lib/validations/seller";
import { zodResolver } from "@hookform/resolvers/zod";

import { useRouter } from "next/navigation";
import { sendContact } from "@/app/actions/actions";
import HeaderCars from "@/components/HeaderCars";

export default function MessagePage() {
  const [disableAfterSend, setDisableAfterSend] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    reset,
  } = useForm<contactForm>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: contactForm) => {
    console.log(data);
    const formData = new FormData();
    formData.set("nom", data.nom);
    formData.set("email", data.email);
    formData.set("message", data.message ? data.message : "");
    formData.set("telephone", data.telephone ? data.telephone : "");
    formData.set("prenom", data.prenom ? data.prenom : "");
    try {
      await sendContact(formData);

      setDisableAfterSend(true);
      reset();
      // Redirect handled in signIn action
    } catch (error) {
      setError("root", {
        type: "manual",
        message: "Une erreur est survenue",
      });
    }
  };

  return (
    <div className="bg-white flex  justify-center items-center w-screen h-screen text-[#636364] p-2 text-[16px] ">
      <div className="fixed w-full p-0 top-0">
        <HeaderCars />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-[500px] mx-auto p-4 loginShaddow max-sm:mt-40"
      >
        <div className="w-full mt-4 border-[1px] border-solid border-[#33333359] shadow-2xl rounded-md max-w-7xl mx-auto ">
          <p className="w-full text-center text-[18px] font-[600] text-[#333333] mb-4 mt-2 ">
            {" "}
            Contactez nous
          </p>
          <form
            className="flex flex-col gap-2 w-full p-3 rounded-md"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className=" flex flex-col sm:grid sm:grid-cols-2 w-full gap-2">
              <div className="flex flex-col gap-5">
                <div className="flex flex-col gap-1">
                  <Label>Nom</Label>
                  <Input
                    type="text"
                    className="border-[1px] border-solid border-[#33333327] rounded-sm "
                    {...register("nom")}
                  />
                  {errors.nom && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.nom.message}
                    </p>
                  )}
                </div>
                <div className="flex flex-col gap-1">
                  <Label>Email</Label>
                  <Input
                    type="email"
                    className="border-[1px] border-solid border-[#33333327] rounded-sm "
                    {...register("email")}
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.email.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-5">
                <div className="flex flex-col gap-1">
                  <Label>Prenom</Label>
                  <Input
                    type="text"
                    className="border-[1px] border-solid border-[#33333327] rounded-sm "
                    {...register("prenom")}
                  />
                  {errors.prenom && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.prenom.message}
                    </p>
                  )}
                </div>
                <div className="flex flex-col gap-1">
                  <Label>Telephone</Label>
                  <Input
                    type="text"
                    className="border-[1px] border-solid border-[#33333327] rounded-sm "
                    {...register("telephone")}
                  />
                  {errors.telephone && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.telephone.message}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <Label>Message</Label>
              <Textarea
                rows={6}
                className="border-[1px] border-solid border-[#33333327] rounded-sm w-full "
                {...register("message")}
              />
              {errors.message && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.message?.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-[250px] mx-auto text-[18px] p-2 bg-[#333333] text-white border-none   cursor-pointer hover:bg-[#3333338a] transition-colors duration-300  rounded-md disabled:cursor-not-allowed "
              onClick={handleSubmit(onSubmit)}
              disabled={disableAfterSend}
            >
              {isSubmitting ? "en cours..." : "Soumettre"}
            </Button>
            <Button
              type="button"
              className="w-[250px] mx-auto text-[18px] p-2 bg-red-400 text-white border-none   cursor-pointer hover:bg-red-300/65 transition-colors duration-300  rounded-md disabled:cursor-not-allowed "
              onClick={() => router.back()}
            >
              Retour
            </Button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
