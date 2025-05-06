// app/register/page.tsx
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useParams, useRouter } from "next/navigation";
import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  RegisterFormData,
  RegisterSchema,
  RegisterUpdateFormData,
  RegisterUpdateSchema,
  typeDoc,
  UserType,
} from "@/lib/validations/seller";
import { registerUser, updateUser } from "@/app/actions/auth";
import { Logo, Logo2 } from "@/components/MyLogo";
import { CountrySelect } from "@/components/CountrySelect";
import { PhoneInput } from "@/components/PhoneInput";
import ScrollToTopButton from "@/components/ScrollToTopButton";
import "react-datepicker/dist/react-datepicker.css";
import {
  deleteSellerUser,
  getSingleUserDataAsync,
} from "@/app/actions/actions";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function BackofficeDetailUser() {
  const { slug } = useParams();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string>("");
  const [errorSend, setErrorSend] = useState("");
  const [successSend, setSuccessSend] = useState(false);
  const [loading, setLoading] = useState(false);
  const [openDialogUser, setOpenDialogUser] = useState(false);
  const [deleteData, setDeleteData] = useState(false);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<RegisterUpdateFormData>({
    resolver: zodResolver(RegisterUpdateSchema),
    defaultValues: {
      activeState: false,
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setValue("identificationDocumentFile", file.name);
      setFileName(file.name);
    }
  };

  const onSubmit = async (data: RegisterUpdateFormData) => {
    const result = RegisterSchema.safeParse(data);

    if (!result.success) {
      setErrorSend("Une erreur est survenue,réessayez svp");
      return;
    }

    const formData = new FormData();

    if (!localStorage.getItem("mon-auto-token")) {
      router.push("/seller-signup");
    }
    const token = localStorage.getItem("mon-auto-token") as string;
    console.log(token);

    console.log(data.phone);
    formData.set("usetToken", token);
    formData.set("nom", data.nom);
    formData.set("prenom", data.prenom);
    formData.set("email", data.email);
    formData.set("identificationDocumentFile", data.identificationDocumentFile);
    formData.set("description", data.description);
    formData.set("typeSeller", data.typeSeller);
    formData.set("adresse", data.adresse);
    formData.set(
      "telephone",
      `(${data.phone.countryCode})${data.phone.number}`
    );
    formData.set(
      "telephoneWhatsapp",
      `(${data.phoneWhatsapp.countryCode})${data.phoneWhatsapp.number}`
    );
    formData.set("activeState", `${data.activeState}`);

    formData.set("ville", data.ville ? data.ville : "");
    formData.set("country", data.country);

    formData.set(
      "typeSellerIdentificationDoc",
      data.typeSellerIdentificationDoc
    );

    try {
      // Envoyer le token au serveur pour vérification

      const value = await updateUser(formData, slug as string);
      console.log(value);
      if (value) {
        if (value?.success) {
          setSuccessSend(true);
          toast.success("mis à jour de l'utilisateur réussi");
          router.back();
        } else {
          toast.error("Une erreur est survenue pendant la mis à jour");
          if (value.errors) {
            setErrorSend("Une erreur est survenue,réessayez svp");
          }
        }
      }
      //reset();
      // Redirection ou message de succès
    } catch (error) {
      toast.error("Une erreur est survenue pendant la mis à jour");
      console.error("Erreur lors de l'inscription:", error);
    }
  };

  const deleteUser = async () => {
    const token = JSON.parse(localStorage.getItem("mon-auto-token") as string);
    try {
      setDeleteData(true);

      const result = await deleteSellerUser(slug as string, token);
      if (result.token) {
        const val = JSON.stringify(result.token);
        localStorage.setItem("mon-auto-token", val);
      }
      toast.success("L'utilisateur a été supprimer avec success");
      setDeleteData(false);
      setOpenDialogUser(false);
      router.back();
    } catch (error) {
      setDeleteData(false);
      toast.error("Une erreur est survenue pendant la suppression");
      setOpenDialogUser(false);
    }
  };

  useEffect(() => {
    const getUserById = async () => {
      setLoading(true);
      const token = JSON.parse(
        localStorage.getItem("mon-auto-token") as string
      );
      const response = await getSingleUserDataAsync(slug as string, token);
      const newUsers = response.data;
      console.log({ newUsers });
      setValue("adresse", newUsers.adresse);

      setValue("country", newUsers.country);
      setValue("description", newUsers.description);
      setValue("email", newUsers.email);
      setValue(
        "identificationDocumentFile",
        newUsers.identificationDocumentFile
      );
      setFileName(newUsers.identificationDocumentFile);
      setValue("nom", newUsers.nom);
      setValue("phone", {
        number: newUsers.telephone.split(")")[1],
        countryCode: newUsers.telephone.split(")")[0].replaceAll("(", ""),
      });
      setValue("phoneWhatsapp", {
        number: newUsers.telephoneWhatsapp.split(")")[1],
        countryCode: newUsers.telephoneWhatsapp
          .split(")")[0]
          .replaceAll("(", ""),
      });
      setValue(
        "phoneWhatsapp.countryCode",
        newUsers.telephoneWhatsapp.split(")")[0].replaceAll("(", "")
      );
      setValue("phone.number", newUsers.telephone.split(")")[1]);
      setValue(
        "phoneWhatsapp.number",
        newUsers.telephoneWhatsapp.split(")")[0].replaceAll("(", "")
      );
      setValue(
        "phone.countryCode",
        newUsers.telephone.split(")")[0].replaceAll("(", "")
      );
      setValue("prenom", newUsers.prenom);
      //setValue("roleSeller", newUsers.roleSeller);
      setValue("typeSeller", newUsers.typeSeller);
      setValue(
        "typeSellerIdentificationDoc",
        newUsers.typeSellerIdentificationDoc
      );
      setValue("ville", newUsers.ville);
    };

    getUserById();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 pt-12 px-4 sm:px-6 lg:px-8">
      <ScrollToTopButton />
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative max-w-md mx-auto flex-1 bg-white p-8 pt-1 rounded-lg loginShaddow mt-3 mb-5 "
      >
        {errorSend && <p className="mt-1 text-sm text-red-600">{errorSend}</p>}
        <div className=" flex items-center sm:flex-col sm:gap-3 mb-5">
          <Logo2 />
          <div className="flex items-center justify-center text-2xl font-bold text-center flex-1 ">
            Mise à jour
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Nom et Prénom */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
            <div>
              <label
                htmlFor="nom"
                className="block text-sm font-medium text-gray-700"
              >
                Nom *
              </label>
              <input
                id="nom"
                {...register("nom")}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
              {errors.nom && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.nom.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="prenom"
                className="block text-sm font-medium text-gray-700"
              >
                Prénom *
              </label>
              <input
                id="prenom"
                {...register("prenom")}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
              {errors.prenom && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.prenom.message}
                </p>
              )}
            </div>
          </div>
          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email *
            </label>
            <input
              id="email"
              type="email"
              {...register("email")}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">
                {errors.email.message}
              </p>
            )}
          </div>
          {/* Mot de passe */}

          {/* Fichier Passeport */}
          <div className="grid grid-cols-1 md:grid-cols-2  gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Type de document pour identification
              </label>
              <div className="mt-1 space-y-2">
                {typeDoc.options.map((type) => (
                  <div key={type} className="flex items-center">
                    <input
                      id={`userType-${type}`}
                      type="radio"
                      value={type}
                      {...register("typeSellerIdentificationDoc")}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                    />
                    <label
                      htmlFor={`userType-${type}`}
                      className="ml-2 block text-sm text-gray-700"
                    >
                      {type}
                    </label>
                  </div>
                ))}
              </div>
              {errors.typeSellerIdentificationDoc && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.typeSellerIdentificationDoc.message}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="file"
                className="block text-sm font-medium text-gray-700"
              >
                Insérer le document pour identification choisis *
              </label>
              <div className="mt-1 flex items-center">
                <input
                  id="file"
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Choisir un fichier
                </button>
                <span className="ml-2 text-sm text-gray-500">
                  {fileName || "Aucun fichier sélectionné"}
                </span>
              </div>
              {errors.identificationDocumentFile && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.identificationDocumentFile.message}
                </p>
              )}
            </div>
          </div>
          {/* Description */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              Description *
            </label>
            <textarea
              id="description"
              rows={3}
              {...register("description")}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">
                {errors.description.message}
              </p>
            )}
          </div>
          {/* Type d'utilisateur */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Type d'utilisateur *
            </label>
            <div className="mt-1 space-y-2">
              {UserType.options.map((type) => (
                <div key={type} className="flex items-center">
                  <input
                    id={`userType-${type}`}
                    type="radio"
                    value={type}
                    {...register("typeSeller")}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  />
                  <label
                    htmlFor={`userType-${type}`}
                    className="ml-2 block text-sm text-gray-700"
                  >
                    {type}
                  </label>
                </div>
              ))}
            </div>
            {errors.typeSeller && (
              <p className="mt-1 text-sm text-red-600">
                {errors.typeSeller.message}
              </p>
            )}
          </div>
          {/* typeSellerIdentificationDoc */}
          {/* Adresse */}
          <div>
            <label
              htmlFor="adresse"
              className="block text-sm font-medium text-gray-700"
            >
              Adresse *
            </label>
            <input
              id="adresse"
              {...register("adresse")}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
            {errors.adresse && (
              <p className="mt-1 text-sm text-red-600">
                {errors.adresse.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="Ville"
              className="block text-sm font-medium text-gray-700"
            >
              Ville
            </label>
            <input
              id="Ville"
              {...register("ville")}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
            {errors.ville && (
              <p className="mt-1 text-sm text-red-600">
                {errors.ville.message}
              </p>
            )}
          </div>
          <div className="grid grid-cols-1  gap-4">
            <CountrySelect
              register={register}
              id="country"
              error={errors.country?.message}
              label="Pays"
            />

            <PhoneInput
              name="phone"
              label="Telephone"
              error={errors.phone?.message}
              register={register}
            />
          </div>
          <PhoneInput
            name="phoneWhatsapp"
            label="Telephone Whatsapp"
            error={errors.phoneWhatsapp?.message}
            register={register}
          />
          {/* Statut (caché ou visible selon besoin) */}
          <input type="hidden" {...register("activeState")} />
          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex justify-center text-[16px] py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 cursor-pointer "
            >
              {isSubmitting ? "Mis à jour en cours..." : "Mettre à jour"}
            </button>
          </div>
          {
            <AlertDialog open={openDialogUser}>
              <AlertDialogTrigger
                onClick={() => setOpenDialogUser(true)}
                className="w-full flex justify-center text-[16px] py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-black bg-gray-300 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 disabled:opacity-50 cursor-pointer"
              >
                Supprimer
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Es-tu absolument sur de vouloir supprimer
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    Cette action ne peut être annulée. Elle supprimera
                    définitivement votre compte et vos données de nos serveurs.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel onClick={() => setOpenDialogUser(false)}>
                    Annuler
                  </AlertDialogCancel>
                  <AlertDialogAction onClick={deleteUser} disabled={deleteData}>
                    {deleteData ? "Suppression en cours..." : "Supprimer"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          }

          <div>
            <button
              type="button"
              onClick={() => router.back()}
              className="w-[150px] cursor-pointer flex justify-center text-[16px] py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-400 hover:bg-red-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-400 disabled:opacity-50"
            >
              Retour
            </button>
          </div>
        </form>
      </motion.div>
      {/* </div> */}
      <p className="text-sm w-full flex-1  text-center ">
        © {new Date().getUTCFullYear()} PAMOD TECHNOLOGIE, All rights reserved.
      </p>
    </div>
  );
}
