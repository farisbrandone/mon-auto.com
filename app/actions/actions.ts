// app/actions.ts
"use server";

import { SellerSchema } from "@/lib/validations/seller";
import axios from "axios";
//import { hash } from "bcryptjs";

export async function registerSeller(formData: FormData) {
  let carte_grise = formData.get("carteGrise") as File | null;
  let pv_controle_technique = formData.get(
    "pvControleTechnique"
  ) as File | null;
  const size = formData.get("size_image");
  console.log(size);
  const images_auto: File[] = [];
  if (size && Number(size) !== 0) {
    for (let i = 0; i < Number(size); i++) {
      const value = formData.get("imagesAuto" + i) as File;
      images_auto.push(value);
    }
  }

  if (carte_grise && carte_grise.size === 0) {
    carte_grise = null;
  }

  if (pv_controle_technique && pv_controle_technique.size === 0) {
    pv_controle_technique = null;
  }

  // Convertir FormData en objet
  const rawData = {
    marques: formData.get("marques"),
    typesCarrosserie: formData.get("typesCarrosserie"),
    typeCarburant: formData.get("typeCarburant"),
    typeTransmission: formData.get("typeTransmission"),
    typeDeTrainConducteur: formData.get("typeDeTrainConducteur"),
    typeMoteur: formData.get("typeMoteur"),
    kilometrage: formData.get("kilometrage"),
    kilometrageUnit: formData.get("kilometrageUnit"),
    prix: formData.get("prix"),
    devise: formData.get("devise"),
    immatriculation: formData.get("immatriculation"),
    acceptsTerms: formData.get("acceptsTerms") === "on",
    carteGriseUrl: carte_grise?.name,
    pvControleTechniqueUrl: pv_controle_technique?.name,
    imagesAuto: images_auto
      .filter((file) => file.size > 0)
      .map((val) => val.name),
    statusOfAuto: formData.get("statusOfAuto"),
    anneeDeFabrication: new Date(
      formData.get("anneeDeFabrication") as string
    ).toISOString(),
    lastMaintenanceDate: formData.get("lastMaintenanceDate")
      ? new Date(formData.get("lastMaintenanceDate") as string).toISOString()
      : "",
    dateOfCreated: new Date().toISOString(),
    dateOfModified: new Date().toISOString(),
    userToken: formData.get("mon-auto-token"),
  };

  console.log({ rawData });

  // Valider les données
  /*  const result = SellerSchema.safeParse(rawData);

  if (!result.success) {
    console.log({ errors: result.error.flatten() });
    return {
      success: false,
      errors: result.error.flatten(),
    };
  } */

  try {
    const response = await axios.post(
      `http://localhost:8090/addAuto`,
      rawData,
      {
        headers: {
          Authorization: `Bearer ${rawData.userToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    console.log({ status: response.status, data: response.data });
    if (response.status === 200) {
      console.log(response.data);

      return { success: true, data: response.data, error: null };
    } else {
      throw new Error("problème de connexion");
    }
  } catch (error) {
    let myError = "";
    console.error("Erreur lors de l'inscription:", error);
    if (axios.isAxiosError(error)) {
      // Axios error (network or HTTP)
      if (error.response) {
        // Server responded with error status (4xx, 5xx)
        console.error("Server responded with error:", {
          status: error.response.status,
          data: error.response.data,
          headers: error.response.headers,
        });

        // Handle specific status codes
        if (error.response.status === 401) {
          // Handle unauthorized (e.g., refresh token or redirect to login)
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
    return { success: false, data: null, error: myError };
  }
}
