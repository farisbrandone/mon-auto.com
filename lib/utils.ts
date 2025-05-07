import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format } from "date-fns";
import axios from "axios";
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

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
          const response = await axios.get(
            `http://localhost:8090/refreshToken`,
            {
              headers: {
                Authorization: `Bearer ${refreshToken}`,
              },
            }
          );

          rawData.userToken = response.data["access-token"];

          const response2 = await axios.put(
            `http://localhost:8090/updateAuto`,
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
};
