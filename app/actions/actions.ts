// app/actions.ts
"use server";

import axios from "axios";
import { redirect } from "next/navigation";

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

  const refreshToken = formData.get("mon-refresh-token");

  // Convertir FormData en objet
  const rawData = {
    marques: formData.get("marques"),
    conso100kmAutoRoute: formData.get("conso100kmAutoRoute"),
    conso100kmVille: formData.get("conso100kmVille"),
    tailleDuMoteur: formData.get("tailleDuMoteur"),
    model: formData.get("model"),
    nbreDePlace: formData.get("nbreDePlace"),
    nbreDePort: formData.get("nbreDePorte"),
    villeDuBien: formData.get("villeDuBien"),
    couleurInt: formData.get("couleurInt"),
    couleurExt: formData.get("couleurExt"),
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

    if (response.status === 200) {
      return { success: true, data: response.data, error: null, token: null };
    } else {
      throw new Error("problème de connexion");
    }
  } catch (error) {
    let myError = "";
    console.error("Erreur lors de l'inscription:", error);
    if (axios.isAxiosError(error)) {
      // Axios error (network or HTTP)
      if (error.response) {
        console.log({ statusError: error.response.status });
        // Server responded with error status (4xx, 5xx)
        console.error("Server responded with error:", {
          status: error.response.status,
          data: error.response.data,
          headers: error.response.headers,
        });

        // Handle specific status codes
        if (error.response.status === 401) {
          console.log("dd, dd");
          // Handle unauthorized (e.g., refresh token or redirect to login)
          try {
            const response = await axios.get(
              `http://localhost:8090/refreshToken`,
              {
                headers: {
                  Authorization: `Bearer ${refreshToken}`,
                },
              }
            );
            console.log(response.data);
            /*  const val = JSON.stringify(response.data);
            localStorage.setItem("mon-auto-token", val); */
            console.log("toto");
            console.log({ token: response.data["access-token"] });
            rawData.userToken = response.data["access-token"];
            const response2 = await axios.post(
              `http://localhost:8090/addAuto`,
              rawData,
              {
                headers: {
                  Authorization: `Bearer ${response.data["access-token"]}`,
                  "Content-Type": "application/json",
                },
              }
            );

            if (response2.status === 200) {
              console.log("Oups on a reussie");
              return {
                success: true,
                data: response2.data,
                error: null,
                token: response.data,
              };
            } else {
              console.log({ zouk: response2.data });
            }
          } catch (error) {
            console.log("rateeeeeeeeeeeeee");
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
    return { success: false, data: null, error: myError };
  }
}

export async function getsearchAutoData(url: string): Promise<any> {
  try {
    const response = await axios.get(url);

    console.log(response.data.content);
    return response.data;
  } catch (error) {
    console.log(error);
  }
}

export async function sendContact(formData: FormData) {
  const data = {
    email: formData.get("email"),
    nom: formData.get("nom"),
    prenom: formData.get("prenom"),
    telephone: formData.get("telephone"),
    message: formData.get("message"),
  };

  try {
    const response = await axios.post(
      `http://localhost:8090/sendContact`,
      data
    );

    console.log({ contactStatus: response.status });

    if (response.status === 200) {
      return { success: true, error: null };
    } else {
      throw new Error("problème de connexion");
    }
  } catch (error) {
    throw new Error("Une erreur est survenue");
  }
}

export const getDataAsync = async (token: any) => {
  const senToken = JSON.parse(token);

  try {
    const response = await axios.get(`http://localhost:8090/sellers`, {
      headers: {
        Authorization: `Bearer ${senToken["access-token"]}`,
        "Content-Type": "application/json",
      },
    });

    const data = response.data;

    const newAutos = data._embedded.sellers;
    console.log(newAutos[0]._links.autos);
    if (response.status === 200) {
      return { success: true, data: newAutos, error: null, token: null };
    } else {
      throw new Error("problème de connexion");
    }
  } catch (error) {
    let myError = "";
    console.error("Erreur lors de l'inscription:", error);
    if (axios.isAxiosError(error)) {
      // Axios error (network or HTTP)
      if (error.response) {
        console.log({ statusError: error.response.status });
        // Server responded with error status (4xx, 5xx)
        console.error("Server responded with error:", {
          status: error.response.status,
          data: error.response.data,
          headers: error.response.headers,
        });

        // Handle specific status codes
        if (error.response.status === 401) {
          console.log("dd, dd");
          // Handle unauthorized (e.g., refresh token or redirect to login)
          try {
            const response = await axios.get(
              `http://localhost:8090/refreshToken`,
              {
                headers: {
                  Authorization: `Bearer ${senToken["refresh-token"]}`,
                },
              }
            );

            const response2 = await axios.get(`http://localhost:8090/sellers`, {
              headers: {
                Authorization: `Bearer ${response.data["access-token"]}`,
                "Content-Type": "application/json",
              },
            });

            if (response2.status === 200) {
              const data = response2.data;

              const newAutos = data._embedded.sellers;
              console.log(newAutos[0]._links.autos);
              return {
                success: true,
                data: newAutos,
                error: null,
                token: response.data,
              };
            } else {
              throw new Error("problème de connexion");
            }
          } catch (error) {
            redirect("/seller-login");
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
    return { success: false, data: null, error: myError };
  }
};

export const getUserDataAsync = async (token: any, userId: string) => {
  const senToken = JSON.parse(token);

  try {
    const response = await axios.get(
      `http://localhost:8090/sellers/${userId}/autos`,
      {
        headers: {
          Authorization: `Bearer ${senToken["access-token"]}`,
          "Content-Type": "application/json",
        },
      }
    );

    const data = response.data;

    const newAutos = data._embedded.autos;
    console.log(newAutos[0]);

    if (response.status === 200) {
      return { success: true, data: newAutos, error: null, token: null };
    } else {
      throw new Error("problème de connexion");
    }
  } catch (error) {
    let myError = "";
    console.error("Erreur lors de l'inscription:", error);
    if (axios.isAxiosError(error)) {
      // Axios error (network or HTTP)
      if (error.response) {
        console.log({ statusError: error.response.status });
        // Server responded with error status (4xx, 5xx)
        console.error("Server responded with error:", {
          status: error.response.status,
          data: error.response.data,
          headers: error.response.headers,
        });

        // Handle specific status codes
        if (error.response.status === 401) {
          // Handle unauthorized (e.g., refresh token or redirect to login)
          try {
            const response = await axios.get(
              `http://localhost:8090/refreshToken`,
              {
                headers: {
                  Authorization: `Bearer ${senToken["refresh-token"]}`,
                },
              }
            );

            /*  const val = JSON.stringify(response.data);
                localStorage.setItem("mon-auto-token", val); */

            console.log({ token: response.data["access-token"] });

            const response2 = await axios.get(
              `http://localhost:8090/sellers/${userId}/autos`,
              {
                headers: {
                  Authorization: `Bearer ${response.data["access-token"]}`,
                  "Content-Type": "application/json",
                },
              }
            );

            if (response2.status === 200) {
              const data = response2.data;

              const newAutos = data._embedded.autos;
              console.log(newAutos[0]);

              return {
                success: true,
                data: newAutos,
                error: null,
                token: response.data,
              };
            } else {
              throw new Error("problème de connexion");
            }
          } catch (error) {
            redirect("/seller-login");
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
    return { success: false, data: null, error: myError };
  }
};

export const getAutoDataAsync = async (page: number) => {
  try {
    const response = await axios.get(
      `http://localhost:8090/autos?page=${page}&size=20`
    );

    const data = response.data;

    const newAutos = data._embedded;
    const pageData = data.page;
    console.log(pageData);

    if (response.status === 200) {
      return {
        success: true,
        data: newAutos,
        error: null,
        page: pageData,
        token: null,
      };
    } else {
      throw new Error("problème de connexion");
    }
  } catch (error) {
    console.error("Erreur lors de l'inscription:", error);
    throw error;
  }
};
