"use client";

import React, { ChangeEvent } from "react";
import { Label } from "@radix-ui/react-label";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import Image from "next/image";
import MyLogo, { Logo } from "@/components/MyLogo";
import { zodResolver } from "@hookform/resolvers/zod";

import { LoginFormData, LoginSchema } from "@/lib/validations/seller";
import { signIn } from "@/app/actions/auth";
import { useForm } from "react-hook-form";

import { useEffect, useState } from "react";
// You'll need to implement this

const page = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    reset,
  } = useForm<LoginFormData>({
    resolver: zodResolver(LoginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    console.log("popo");
    const formData = new FormData();
    formData.set("password", data.password);
    formData.set("email", data.email);
    try {
      const sol = await signIn(data);
      const val = JSON.stringify(sol);
      localStorage.setItem("mon-auto-token", val);
      if (sol) {
        console.log(sol);
      }

      reset();
      // Redirect handled in signIn action
    } catch (error) {
      setError("root", {
        type: "manual",
        message: "Invalid email or password",
      });
    }
  };

  return (
    <div className="bg-white flex sm:grid sm:grid-cols-2 justify-center gap-1 w-screen h-screen text-[#636364] p-2 text-[16px] ">
      {/*  <Image
        alt=""
        width={100}
        height={100}
        src="/logo.png"
        className=" bg-black absolute top-1 left-1"
      /> */}
      <Logo />
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex items-center w-full justify-center"
      >
        <div className="flex flex-col items-center w-full ">
          <div className="flex flex-col gap-0.5 mb-[20px]">
            <p className="font-medium text-[28px]  sm:text-[34px] w-full text-center ">
              Bon retour parmi nous
            </p>
            <p className="text-[14px] font-normal ">
              Remplis les champs ci-dessous et connecte toi.
            </p>
          </div>
          <div className="flex flex-col items-center gap-5 mb-2 w-full lg:w-[500px] ">
            <div className="flex flex-col w-full items-center gap-0.5">
              <Label htmlFor="email" className="text-start w-full">
                Email
              </Label>
              <Input
                type="email"
                //value={email}

                autoComplete="email"
                {...register("email")}
                //onChange={handleEmail}
                className="w-full"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div className="flex flex-col w-full items-center gap-0.5">
              <Label htmlFor="password" className="text-start w-full">
                Mot de passe
              </Label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                {...register("password")}
                className="w-full"
              />
            </div>
            <div className="flex items-center justify-between w-full mt-2">
              <div className="w-full">
                <input title="Se souvenir" type="checkbox" />
                <label htmlFor="boxremember" className="ml-0.5">
                  Se souvenir de moi
                </label>
              </div>

              <Link
                href="seller-forgot-password"
                className="w-full text-end underline"
              >
                {" "}
                Mot de passe oublié
              </Link>
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-[#ea454c] cursor-pointer text-center py-2 rounded-[12px] text-white text-[16px] sm:w-[300px] mt-10 disabled:opacity-50 disabled:cursor-not-allowed "
            disabled={isSubmitting}
            onClick={handleSubmit(onSubmit)}
          >
            {isSubmitting ? "Se connecter..." : "Se connecter"}
          </button>
          <div className="flex items-center gap-1 mt-1">
            <p>Vous n'avez pas de compte ? </p>
            <Link
              href="/seller-signup"
              className="text-[#ea454c] underline disabled:text-[#ea454d3a]  "
            >
              Inscrivez vous ici
            </Link>{" "}
          </div>
        </div>
      </form>
      <img
        src="/auth-image.jpg"
        alt=""
        className=" w-full h-full hidden sm:flex object-cover"
      />
    </div>
  );
};

export default page;
