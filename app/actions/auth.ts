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
    ) as any,
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
    dateOfCreated: new Date().toISOString(),
    dateOfModified: new Date().toISOString(),
  };

  console.log(rawData);

  try {
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

    if (response2.status === 200) {
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

export async function updateUser(formData: FormData, id: string) {
  // Convertir FormData en objet

  const token = JSON.parse(formData.get("userToken") as string);
  const rawData = {
    nom: formData.get("nom"),
    prenom: formData.get("prenom"),
    email: formData.get("email"),
    identificationDocumentFile: formData.get("identificationDocumentFile"),
    description: formData.get("description"),
    typeSeller: formData.get("typeSeller"),
    adresse: formData.get("adresse"),
    telephone: formData.get("telephone"),
    telephoneWhatsapp: formData.get("telephoneWhatsapp"),
    activeState: formData.get("activeState") === "true" ? true : false,
    typeSellerIdentificationDoc: formData.get("typeSellerIdentificationDoc"),
    country: formData.get("country"),
    ville: formData.get("ville"),
    dateOfModified: new Date().toISOString(),
  };

  console.log(rawData);

  try {
    const response2 = await axios.put(
      `http://localhost:8090/updateUser/${id}`,
      {
        ...rawData,
      },
      {
        headers: {
          Authorization: `Bearer ${token["access-token"]}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (response2.status === 201) {
      return { success: true, data: response2.data, errors: null };
    }
    //
  } catch (error) {
    let myError = "";
    console.error("Erreur lors de l'inscription:", error);
    if (axios.isAxiosError(error)) {
      // Axios error (network or HTTP)
      if (error.response) {
        // Handle specific status codes
        if (error.response.status === 401) {
          // Handle unauthorized (e.g., refresh token or redirect to login)
          try {
            const response = await axios.get(
              `http://localhost:8090/refreshToken`,
              {
                headers: {
                  Authorization: `Bearer ${token["refresh-token"]}`,
                },
              }
            );

            const response2 = await axios.put(
              `http://localhost:8090/updateUser/${id}`,
              rawData,
              {
                headers: {
                  Authorization: `Bearer ${response.data["access-token"]}`,
                  "Content-Type": "application/json",
                },
              }
            );

            if (response2.status === 200) {
              return {
                success: true,
                data: response2.data,
                error: null,
                token: response.data,
              };
            } else {
              throw new Error("");
            }
          } catch (error) {
            console.log(error);
            throw new Error("");
            // redirect("/seller-login");
          }
        }
      } else if (error.request) {
        // Request was made but no response received
        console.error("No response received:", error.request);
        myError = error.message;
      } else {
        // Something happened in setting up the request
        console.error("Request setup error:", error.message);
        myError = error.message;
      }
    } else {
      // Non-Axios error (e.g., in your code)
      console.error("Unexpected error:", error);
      myError = "Une erreur est survenue vérifié votre connexion";
    }
    throw new Error(myError);
  }
}

export async function forgotPassword(email: string) {
  try {
    const response2 = await axios.post(
      "http://localhost:8090/forgot-password",
      {
        email,
      }
    );
    console.log(response2.status);
    return { success: "Reset email sent!" };
  } catch (error) {
    console.log(error);
    return { error: "Une erreur est survenue" };
  }
}

export async function verifyResetToken(token: string) {
  /*  const existingToken = await db.passwordResetToken.findUnique({
    where: { token }
  }); */
  console.log(token);

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
  try {
    const response2 = await axios.post("http://localhost:8090/reset-password", {
      newPassword: data.password,
      token: data.token,
    });
    console.log(response2.status);
    return { success: "Password updated successfully!" };
  } catch (error) {
    console.log(error);
    return { error: `${error}` };
  }
}
