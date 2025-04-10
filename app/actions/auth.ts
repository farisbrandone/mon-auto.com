// app/actions/auth.ts
"use server";
import axios from "axios";
import { LoginFormData, LoginSchema } from "@/lib/validations/seller";
import qs from "qs";
//import { redirect } from "next/navigation";

export async function signIn(formData: LoginFormData) {
  // Validate form data
  const validatedFields = LoginSchema.safeParse(formData);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { email, password } = validatedFields.data;

  console.log({ email, password });

  try {
    const data = qs.stringify({
      email: email,
      password: password,
    });
    console.log({ data });
    const result = await axios.post("http://localhost:8090/login", data, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    console.log({ data: result.data, status: result.status });
    return result.data;
  } catch (error) {
    console.error({ error });
    throw new Error("error");
  }

  //redirect("/");
}

// app/actions/auth.ts

export async function registerUser(formData: FormData) {
  // Convertir FormData en objet

  console.log(typeof formData.get("identificationDocumentFile"));

  const rawData = {
    nom: formData.get("nom"),
    prenom: formData.get("prenom"),
    email: formData.get("email"),
    identificationDocumentFile: formData.get(
      "identificationDocumentFile"
    ) as File,
    description: formData.get("description"),
    typeSeller: formData.get("typeSeller"),
    adresse: formData.get("adresse"),
    telephone: formData.get("telephone"),
    telephoneWhatsapp: formData.get("telephoneWhatsapp"),
    activeState: formData.get("activeState") === "true" ? true : false,
    password: formData.get("password"),
    typeSellerIdentificationDoc: formData.get("typeSellerIdentificationDoc"),
    country: formData.get("country"),
    ville: formData.get("ville"),
    roleSeller: ["USER", formData.get("typeSeller")],
    //confirmPassword: formData.get("confirmPassword"),
  };

  // Valider les données
  console.log(rawData);

  try {
    // Upload du fichier PDF
    /* const passportBlob = await put(
      `passports/${Date.now()}-${result.data.passportFile.name}`,
      result.data.passportFile,
      { access: 'public' }
    ); */

    // Hacher le mot de passe (si vous en avez un)
    // const hashedPassword = await hash(password, 12);

    // Enregistrer dans la base de données
    /*
    await db.user.create({
      data: {
        ...result.data,
        passportUrl: passportBlob.url,
        // password: hashedPassword,
      },
    });
    */
    const response2 = await axios.post(
      "http://localhost:8090/signup",
      {
        ...rawData,
        identificationDocumentFile: rawData.identificationDocumentFile.name,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    /*   const response = await fetch("http://localhost:8090/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...rawData,
        identificationDocumentFile: rawData.identificationDocumentFile.name,
      }),
    }); */

    console.log({ data: response2.data, status: response2.status });
    if (response2.status === 201) {
      return { success: true, data: response2.data, errors: null };
    }
    //
  } catch (error) {
    console.error("Erreur lors de l'inscription:", error);
    return {
      success: false,
      errors: "Une erreur est survenue lors de l'inscription",
      data: null,
    };
  }
}

export async function forgotPassword(data: { email: string }) {
  //const existingUser = await getUserByEmail(data.email);

  if (2 === 2 /* !existingUser */) {
    return { error: "Email not found!" };
  }

  /*  const passwordResetToken = await generatePasswordResetToken(data.email);
  await sendPasswordResetEmail(
    passwordResetToken.email,
    passwordResetToken.token
  ); */

  return { success: "Reset email sent!" };
}

export async function verifyResetToken(token: string) {
  /*  const existingToken = await db.passwordResetToken.findUnique({
    where: { token }
  }); */

  if (2 == 2 /* !existingToken */) {
    return { error: "Invalid token!" };
  }

  //const hasExpired = new Date(existingToken.expires) < new Date();

  if (2 == 2 /* hasExpired */) {
    return { error: "Token has expired!" };
  }

  return { success: "Token is valid!" };
}

export async function resetPassword(data: { password: string; token: string }) {
  /*  const existingToken = await db.passwordResetToken.findUnique({
    where: { token: data.token }
  }); */

  if (2 == 2 /* !existingToken */) {
    return { error: "Invalid token!" };
  }

  //const hasExpired = new Date(existingToken.expires) < new Date();

  if (2 == 2 /* hasExpired */) {
    return { error: "Token has expired!" };
  }

  //const existingUser = await getUserByEmail(existingToken.email);

  if (2 == 2 /* !existingUser */) {
    return { error: "Email not found!" };
  }

  //const hashedPassword = await hash(data.password, 10);

  /*  await db.user.update({
    where: { id: existingUser.id },
    data: { password: hashedPassword }
  });

  await db.passwordResetToken.delete({
    where: { id: existingToken.id }
  }); */

  return { success: "Password updated successfully!" };
}
