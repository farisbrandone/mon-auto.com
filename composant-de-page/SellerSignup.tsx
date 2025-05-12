// app/register/page.tsx
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  RegisterFormData,
  RegisterSchema,
  typeDoc,
  UserType,
} from "@/lib/validations/seller";
import { registerUser } from "@/app/actions/auth";
import { Logo2 } from "@/components/MyLogo";
import { CountrySelect } from "@/components/CountrySelect";
import { PhoneInput } from "@/components/PhoneInput";
import ScrollToTopButton from "@/components/ScrollToTopButton";
import Link from "next/link";
import { fileResponseType } from "./AddAutoPage";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { uploadFile } from "@/app/actions/actions";

export default function SellerSigup() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string>("");
  const [errorSend, setErrorSend] = useState("");
  const [successSend, setSuccessSend] = useState(false);
  const [transitionForAdd, setTransitionForAdd] = useState(false);
  const fileInputRefDoc = useRef<HTMLInputElement>(null);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [downloadUrl, setDownloadUrl] = useState<fileResponseType>();
  const [isUploading, setIsUploading] = useState(false);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      activeState: false,
    },
  });

  const handleFileDoc = async (e: React.ChangeEvent<HTMLInputElement>) => {
    //beginning get url of pv
    console.log("net net");
    const mm = e.target.files;
    const docControlFormData = new FormData();
    if (!mm) return;
    if (mm[0].size > 5 * 1024 * 1024) {
      toast.error("La taille du fichier est supérieur à 5Mo");
    }
    docControlFormData.append("file", mm[0]);
    setValue("identificationDocumentFile", mm[0]);

    try {
      setIsUploading(true);

      if (!localStorage.getItem("mon-auto-token")) {
        router.push("/seller-signup");
      }
      const token = JSON.parse(
        localStorage.getItem("mon-auto-token") as string
      );

      const responsePv = await uploadFile(token, docControlFormData);

      const keys = Object.keys(responsePv.data);
      const values = Object.values(responsePv.data) as string[];

      setDownloadUrl(
        { url: values[0], originalName: keys[0] }

        /* responsePv.data */
      );

      if (fileInputRefDoc.current) {
        fileInputRefDoc.current.value = "";
      }
      setIsUploading(false);
    } catch (error) {
      setIsUploading(false);
      console.log(error);
      toast.error("Une erreur est survenue pendant le téléchargement");
    }

    //end get url of pv
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setValue("identificationDocumentFile", file);
      setFileName(file.name);
    }
  };

  const onSubmit = async (data: RegisterFormData) => {
    const result = RegisterSchema.safeParse(data);

    if (!result.success) {
      setErrorSend("Une erreur est survenue,réessayez svp");
      return;
    }

    const formData = new FormData();
    console.log(data.phone);
    formData.set("nom", data.nom);
    formData.set("prenom", data.prenom);
    formData.set("email", data.email);
    formData.set(
      "identificationDocumentFile",
      downloadUrl?.url + "--" + downloadUrl?.originalName
    );
    //formData.set("identificationDocumentFile", data.identificationDocumentFile);
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
    formData.set("password", data.password);
    formData.set("ville", data.ville ? data.ville : "");
    formData.set("country", data.country);
    formData.set("confirmPassword", data.confirmPassword);
    formData.set(
      "typeSellerIdentificationDoc",
      data.typeSellerIdentificationDoc
    );

    try {
      // Envoyer le token au serveur pour vérification

      const value = await registerUser(formData);
      console.log(value);
      if (value) {
        if (value?.success) {
          setSuccessSend(true);
          reset();
          //router.push("/seller-login");
        } else {
          if (value.errors) {
            setErrorSend("Une erreur est survenue,réessayez svp");
          }
        }
      }
      //reset();
      // Redirection ou message de succès
    } catch (error) {
      console.error("Erreur lors de l'inscription:", error);
    }
  };

  if (successSend) {
    return (
      <div className="bg-white flex  justify-center items-center w-screen h-screen text-[#636364] p-2 text-[14px] sm:text-[16px] ">
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className=" mx-auto sm:w-[400px] min-h-[200px] p-4 loginShaddow"
        >
          <h1 className="text-2xl font-bold mb-4 text-green-600">
            Inscription réussie !
          </h1>
          <p>
            Un email de vérification vous a été envoyé, vérifier si possible
            dans les spams
          </p>
        </motion.div>
      </div>
    );
  }

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
            Inscription
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Mot de passe *
              </label>
              <input
                id="password"
                type="password"
                {...register("password")}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700"
              >
                Confirmer le mot de passe *
              </label>
              <input
                id="confirmPassword"
                type="password"
                {...register("confirmPassword")}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>
          </div>
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
              <div className="mt-1 flex items-center text-[14px]">
                <input
                  id="file"
                  type="file"
                  ref={fileInputRefDoc}
                  onChange={handleFileDoc}
                  /*   onChange={(e) => {
                    if (e.target.files?.[0]) {
                      setValue("identificationDocumentFile", e.target.files[0]);
                    }
                  }} */
                  className="hidden"
                />

                <Button
                  type="button"
                  onClick={() => {
                    fileInputRefDoc.current?.click();
                  }}
                  className="mt-1 inline-flex items-center px-1 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-slate-200  hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer"
                  disabled={isUploading}
                >
                  {isUploading ? "En cours..." : "Télécharger"}
                </Button>
                {uploadProgress > 0 && uploadProgress < 100 && (
                  <div className="progress-bar">
                    <div style={{ width: `${uploadProgress}%` }}>
                      {uploadProgress}%
                    </div>
                  </div>
                )}

                {downloadUrl && (
                  <a
                    href={downloadUrl.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-600 "
                  >
                    {downloadUrl.originalName}
                  </a>
                )}

                <p className=" text-gray-500 ml-1">jusqu'à 10MB</p>

                {/*  <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Choisir un fichier
                </button>
                <span className="ml-2 text-sm text-gray-500">
                  {fileName || "Aucun fichier sélectionné"}
                </span> */}
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
          {/* Téléphone et telephoneWhatsapp */}
          {/*  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="telephone"
                className="block text-sm font-medium text-gray-700"
              >
                Téléphone *
              </label>
              <input
                id="telephone"
                {...register("telephone")}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="+33 6 12 34 56 78"
              />
              {errors.telephone && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.telephone.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="telephoneWhatsapp"
                className="block text-sm font-medium text-gray-700"
              >
                telephoneWhatsapp
              </label>
              <input
                id="telephoneWhatsapp"
                {...register("telephoneWhatsapp")}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="+33 6 12 34 56 78"
              />
              {errors.telephoneWhatsapp && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.telephoneWhatsapp.message}
                </p>
              )}
            </div>
          </div> */}
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
              label="Phone Number"
              error={errors.phone?.message}
              register={register}
            />
          </div>
          <PhoneInput
            name="phoneWhatsapp"
            label="Phone number Whatsapp"
            error={errors.phoneWhatsapp?.message}
            register={register}
          />
          {/* Statut (caché ou visible selon besoin) */}
          <input type="hidden" {...register("activeState")} />
          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex justify-center text-[16px] py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {isSubmitting ? "Inscription en cours..." : "S'inscrire"}
            </button>
          </div>
          <div>
            <button
              type="button"
              onClick={() => router.push("/")}
              className="w-full flex justify-center text-[16px] py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-400 hover:bg-red-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-400 disabled:opacity-50"
            >
              Retour accueil
            </button>
          </div>
          <div className="flex gap-1 w-full justify-center">
            <p>Déja inscrit</p>
            <Link href="/seller-login" className="underline text-red-400 ">
              Connecte-toi ici
            </Link>
          </div>{" "}
        </form>
      </motion.div>
      {/* </div> */}
      <p className="text-sm w-full flex-1  text-center ">
        © {new Date().getUTCFullYear()} PAMOD TECHNOLOGIE, All rights reserved.
      </p>
    </div>
  );
}
