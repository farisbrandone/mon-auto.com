"use server";

import axios from "axios";

export async function requestToGetAllAuto() {
  try {
    const response = await axios.get(`http://localhost:8090/autos`);
    console.log({ status: response.status, data: response.data });
    if (response.status === 200) {
      console.log(response.data);

      return { success: true, data: response.data, error: null };
    } else {
      throw new Error("problème de connexion");
    }
  } catch (error) {
    console.error("Erreur lors de l'inscription:", error);
    throw new Error("une erreur est survenue ou problème de connexion");
  }
}
