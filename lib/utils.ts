import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format } from "date-fns";
import axios from "axios";
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const baseUrl = "https://monauobackendtrue.onrender.com";

export const baseFrontUrl = "https://mon-auto-com.onrender.com";

export function formatMoney(
  amount: number,
  decimalCount = 0,
  decimal = ".",
  thousands = " "
) {
  try {
    decimalCount = Math.abs(decimalCount);
    decimalCount = isNaN(decimalCount) ? 2 : decimalCount;

    const negativeSign = amount < 0 ? "-" : "";

    const i = parseInt(
      Math.abs(Number(amount) || 0).toFixed(decimalCount)
    ).toString();
    const j = i.length > 3 ? i.length % 3 : 0;

    return (
      negativeSign +
      (j ? i.substr(0, j) + thousands : "") +
      i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands) +
      (decimalCount
        ? decimal +
          Math.abs(amount - Number(i))
            .toFixed(decimalCount)
            .slice(2)
        : "")
    );
  } catch (e) {
    console.error(e);
  }
}

export function formatDate(stringDate: string) {
  const dateValue = new Date(stringDate);

  return format(dateValue, "yyyy");
}

export const processCatchRequest = async (
  error: unknown,
  refreshToken: any,
  rawData: any,
  url: string
) => {
  console.log(url);
  let myError = "";
  console.error("Erreur lors de l'inscription:", error);
  if (axios.isAxiosError(error)) {
    // Axios error (network or HTTP)
    if (error.response) {
      // Handle specific status codes
      if (error.response.status === 401) {
        // Handle unauthorized (e.g., refresh token or redirect to login)
        try {
          const response = await axios.get(`${baseUrl}/refreshToken`, {
            headers: {
              Authorization: `Bearer ${refreshToken}`,
            },
          });

          rawData.userToken = response.data["access-token"];

          const response2 = await axios.put(`${baseUrl}/updateAuto`, rawData, {
            headers: {
              Authorization: `Bearer ${response.data["access-token"]}`,
              "Content-Type": "application/json",
            },
          });

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
};

export function mapfrontToBackTypeCarburant(val: any) {
  const value = val;
  const myValue =
    value === "Essence"
      ? "ESSENCE"
      : value === "Diesel"
      ? "DIESEL"
      : value === "Electrique"
      ? "ELECTRIQUE"
      : value === "Hybride"
      ? "HYBRIDE"
      : value;

  return myValue;
}

export function mapfrontToBackTypeTransmission(val: any) {
  const value = val;
  const myValue =
    value === "Manuelle"
      ? "TRANSMISSION_MANUELLE"
      : value === "Automatique"
      ? "TRANSMISSION_AUTOMATIQUE"
      : value === "Semi_automatique"
      ? "TRANSMISSION_SEMI_AUTOMATIQUE"
      : value;

  return myValue;
}

export function mapfrontToBackTypeMoteur(val: any) {
  const value = val;
  const myValue =
    value === "4 Cylindres"
      ? "CYLINDRE4"
      : value === "6 Cylindres"
      ? "CYLINDRE6"
      : value === "Electrique"
      ? "ELECTRIQUE"
      : value;

  return myValue;
}

export function mapBackToFrontTypeCarburant(val: any) {
  const value = val;
  const myValue =
    value === "ESSENCE"
      ? "Essence"
      : value === "DIESEL"
      ? "Diesel"
      : value === "ELECTRIQUE"
      ? "Electrique"
      : value === "HYBRIDE"
      ? "Hybride"
      : value;

  return myValue;
}

export function mapBackToFrontTypeMoteur(val: any) {
  const value = val;
  const myValue =
    value === "CYLINDRE4"
      ? "4 Cylindres"
      : value === "CYLINDRE6"
      ? "6 Cylindres"
      : value === "ELECTRIQUE"
      ? "Electrique"
      : value;

  return myValue;
}

export function mapBackToFrontTypeTransmission(val: any) {
  const value = val;
  const myValue =
    value === "TRANSMISSION_MANUELLE"
      ? "Manuelle"
      : value === "TRANSMISSION_AUTOMATIQUE"
      ? "Automatique"
      : value === "TRANSMISSION_SEMI_AUTOMATIQUE"
      ? "Semi_automatique"
      : value;

  return myValue;
}

export function mapBackTofrontTypeTrainConducteur(val: any) {
  const value = val;
  const myValue =
    value === "Traction avant (FWD)"
      ? "Traction avant"
      : value === "Propulsion arrière (RWD)"
      ? "Propulsion arrière"
      : value === "Transmission intégrale permanante (HWD)"
      ? "HWD"
      : value === "Tranmission integrale enclanchable (4WD)"
      ? "4WD"
      : value;

  return myValue;
}
