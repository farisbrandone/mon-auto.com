"use server";

import { baseFrontUrl } from "@/lib/utils";
// app/api/validate/route.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const formData = await req.formData();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  console.log("poopou");
  console.log({ email, password });
  //const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  //const passwordCondition = password && password.length >= 8;

  /*  const errors: {
    email?: string;
    password?: string;
    emailErrorMessage?: string;
    passwordErrorMessage?: string;
  } = {};

  if (!email || !emailRegex.test(email.toString())) {
    errors.email = email;
    errors.password = password;
    errors.emailErrorMessage = "Format d'email invalide";
  }

  if (!passwordCondition) {
    errors.email = email;
    errors.password = password;
    errors.passwordErrorMessage =
      "votre mots de passe doit avoir au moins 8 caractères";
  }

  if (Object.keys(errors).length > 0) {
    const errorQuery = new URLSearchParams(errors).toString();
    return NextResponse.redirect(
      `http://localhost:3000/error-login?${errorQuery}`
    );
  } */

  return NextResponse.redirect(`${baseFrontUrl}`);
}
