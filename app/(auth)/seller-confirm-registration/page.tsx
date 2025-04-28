"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { z } from "zod";
import axios from "axios";
import { motion } from "framer-motion";

// Schéma de validation

export default function ConfirmationInscription() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [error, setError] = useState<string | null>(null);

  const validateToken = async (token: string) => {
    try {
      setStatus("loading");
      setError(null);

      // Validation avec Zod

      // Envoi au backend avec le token en query param
      const response = await axios.get(
        `http://localhost:8090/confirm?token=${token}`
      );
      console.log({ status: response.status, data: response.data });
      /* if (response.status === 200) { */
      console.log(response.data);
      setStatus("success");
      //router.push("/seller-login");
      /*  } else {
        throw new Error(response.data.message || "Échec de la confirmation");
      } */
    } catch (err) {
      console.log(err);
      setStatus("success");
      if (err instanceof z.ZodError) {
        setError("Token invalide");
      } else if (axios.isAxiosError(err)) {
        if (err.response) {
          console.log({ statusError: err.response.status });
          // Server responded with err status (4xx, 5xx)
          console.log("Server responded with err:", {
            status: err.response.status,
            data: err.response.data,
            headers: err.response.headers,
          });
        }
        setError(err.response?.data?.message || "Erreur serveur");
      } else {
        setError((err as Error).message);
      }

      if (axios.isAxiosError(error)) {
        console.log("dans axios");
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
            console.log({
              status: error.response.status,
              data: "401",
              headers: error.response.headers,
            });
            // Handle unauthorized (e.g., refresh token or redirect to login)
          }
        } else if (error.request) {
          console.log({ status: error, data: "request" });
          console.error("No response received:", error.request);
        } else {
          // Something happened in setting up the request
          console.error("Request setup error:", error.message);
        }
      } else {
        // Non-Axios error (e.g., in your code)
        console.error("Unexpected error:", error);
      }
    }
  };

  useEffect(() => {
    if (token && typeof token === "string") {
      validateToken(token);
    } else if (Array.isArray(token)) {
      setError("Token mal formé");
      setStatus("error");
    }
  }, [token]);

  if (status === "loading") {
    return (
      <div className="bg-white flex  justify-center items-center w-screen h-screen text-[#636364] p-2 text-[16px] ">
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-[300px] mx-auto p-4 loginShaddow"
        >
          <h1 className="text-2xl font-bold mb-4">Confirmation en cours...</h1>
          <p>Veuillez patienter pendant que nous validons votre inscription.</p>
        </motion.div>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="bg-white flex  justify-center items-center w-screen h-screen text-[#636364] p-2 text-[16px] ">
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className=" mx-auto p-4 loginShaddow"
        >
          <h1 className="text-2xl font-bold mb-4 text-green-600">
            Confirmation réussie !
          </h1>
          <p>Votre compte a été confirmé avec succès.</p>
          <button
            onClick={() => router.push("/seller-login")}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
          >
            Se connecter
          </button>
        </motion.div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="bg-white flex  justify-center items-center w-screen h-screen text-[#636364] p-2 text-[16px] ">
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className=" mx-auto p-4 loginShaddow"
        >
          <h1 className="text-2xl font-bold mb-4 text-red-600">
            Erreur de confirmation
          </h1>
          <p className="text-red-500">{error}</p>
          <button
            onClick={() => router.push("/contact")}
            className="mt-4 bg-gray-500 text-white px-4 py-2 rounded"
          >
            Contactez le support
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="bg-white flex  justify-center items-center w-screen h-screen text-[#636364] p-2 text-[16px] ">
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className=" mx-auto p-4 loginShaddow"
      >
        <h1 className="text-2xl font-bold mb-4">Validation du token...</h1>
      </motion.div>
    </div>
  );
}
