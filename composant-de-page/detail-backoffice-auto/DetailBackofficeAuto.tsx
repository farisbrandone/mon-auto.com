"use client";

import React, {
  ChangeEvent,
  useEffect,
  useReducer,
  useRef,
  useState,
} from "react";
import { useParams, useRouter } from "next/navigation";
import { AutoReducer, AutoState } from "./autoReducer";
import {
  deleteFile,
  deleteImage,
  deleteSellerAuto,
  getImageAuto,
  getSingleAutoDataAsync,
  getUserDataAsync,
  updateSellerAuto,
  uploadFile,
} from "@/app/actions/actions";
import {
  SellerUpdateFormData,
  SellerUpdateSchema,
} from "@/lib/validations/seller";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import MyLogo from "@/components/MyLogo";
import ScrollToTopButton from "@/components/ScrollToTopButton";
import "react-datepicker/dist/react-datepicker.css";
import VehicleColorPicker, { ColorOption } from "@/components/SelectColors2";
import SelectCity, { CityProps } from "@/components/SelectCity";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  CURRENCIES,
  FUEL_TYPES,
  MARQUES,
  MILEAGE_UNITS,
  TRANSMISSION_TYPES,
  TYPE_TRAIN_CONDUCTEUR,
  TYPES_CARROSSERIE,
  TYPES_MOTEUR,
} from "@/lib/constants/carProperties";
import DatePicker from "react-datepicker";
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
import axios from "axios";
import { fileResponseType, UploadProgress } from "../AddAutoPage";
import { LoaderCircleIcon } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import DeleteImageMultiple from "@/components/DeleteImageMultiple";
import DeleteBackofficeImageMultiple from "@/components/DeleteBackofficeImageMultiple";
const initialState = {} as AutoState;

export default function DetailBackofficeAuto() {
  const { slug } = useParams();
  const [autoState, dispatch] = useReducer(AutoReducer, initialState);
  const [loading, setLoading] = useState(false);
  const [loadingFail, setLoadingFail] = useState(false);
  const [auto, setAuto] = useState<SellerUpdateFormData | undefined>();
  const [deleteData, setDeleteData] = useState(false);
  const [allImages, setAllImages] = useState<{ url: string; id: string }[]>([]);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    control,
    watch,
    setValue,
    reset,
  } = useForm<SellerUpdateFormData>({
    resolver: zodResolver(SellerUpdateSchema),
    defaultValues: {
      lastMaintenanceDate: new Date(),
    },
  });
  const images_autos = watch("imagesAuto");
  const [autreAuto, setAutreAuto] = useState("");
  const [selectedColor, setSelectedColor] = useState<ColorOption | null>(null);
  const [selectedColor2, setSelectedColor2] = useState<ColorOption | null>(
    null
  );
  const [selectedCity, setSelectedCity] = useState<CityProps | null>(null);
  const [openDialogAuto, setOpenDialogAuto] = useState(false);
  const [dateOfCreated, setDateOfCreated] = useState("");
  const carte_grise = watch("carteGrise");
  const pv_controle_technique = watch("pvControleTechnique");
  const [deleteStateImage, setDeleteStateImage] = useState(false);
  const [downloadUrlCartegrise, setDownloadUrlCartegrise] =
    useState<fileResponseType>();
  const [downloadUrlPv, setDownloadUrlPv] = useState<fileResponseType>();
  const [isUploading, setIsUploading] = useState(false);
  const [isUploadingPv, setIsUploadingPv] = useState(false);
  const [isUploadingCarte, setIsUploadingCarte] = useState(false);
  const [isDeleteCarte, setIsDeleteCarte] = useState(false);
  const [isDeletePv, setIsDeletePv] = useState(false);

  const fileInputRef2Carte = useRef<HTMLInputElement>(null);
  const fileInputRefPv = useRef<HTMLInputElement>(null);
  const selectedCurrency = watch("devise");
  const mileageUnit = watch("kilometrageUnit");
  const marques = watch("marques");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const images_autoInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const handleMarqueAuto = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setAutreAuto(e.target.value);
  };

  const handleCouleurExt = (value: string) => {
    setValue("couleurExt", value);
  };
  const handleCouleurInt = (value: string) => {
    setValue("couleurInt", value);
  };

  const handleFileCarteGrise = async (e: ChangeEvent<HTMLInputElement>) => {
    //beginning get url of carte grise
    const mm = e.target.files;
    const carteGriseFormData = new FormData();

    if (!mm) return;
    if (mm[0].size > 10 * 1024 * 1024) {
      toast.error("La taille du fichier est supérieur à 10Mo");
    }

    carteGriseFormData.append("file", mm[0]);

    try {
      setIsUploadingCarte(true);
      if (!localStorage.getItem("mon-auto-token")) {
        router.push("/seller-signup");
      }
      const token = JSON.parse(
        localStorage.getItem("mon-auto-token") as string
      );

      const response = await uploadFile(token, carteGriseFormData);
      console.log({ response });
      const keys = Object.keys(response.data);
      const values = Object.values(response.data) as string[];

      setDownloadUrlCartegrise(
        { url: values[0], originalName: keys[0] }

        /* responsePv.data */
      );

      setValue("carteGrise", values[0] + "--" + keys[0]);

      if (fileInputRef2Carte.current) {
        fileInputRef2Carte.current.value = "";
      }
      setIsUploadingCarte(false);
    } catch (error) {
      setIsUploadingCarte(false);
      toast.error("Une erreur est survenue pendant la suppression de l'image");
      console.log(error);
    }
    //end get url of carte grise
  };

  const handleFilePv = async (e: ChangeEvent<HTMLInputElement>) => {
    //beginning get url of pv
    const mm = e.target.files;
    const pvControlFormData = new FormData();
    if (!mm) return;
    if (mm[0].size > 10 * 1024 * 1024) {
      toast.error("La taille du fichier est supérieur à 10Mo");
    }

    pvControlFormData.append("file", mm[0]);

    try {
      setIsUploadingPv(true);
      if (!localStorage.getItem("mon-auto-token")) {
        router.push("/seller-signup");
      }
      const token = JSON.parse(
        localStorage.getItem("mon-auto-token") as string
      );

      const responsePv = await uploadFile(token, pvControlFormData);

      const keys = Object.keys(responsePv.data);
      const values = Object.values(responsePv.data) as string[];

      setDownloadUrlPv(
        { url: values[0], originalName: keys[0] }

        /* responsePv.data */
      );
      setValue("pvControleTechnique", values[0] + "--" + keys[0]);

      if (fileInputRefPv.current) {
        fileInputRefPv.current.value = "";
      }
      setIsUploadingPv(false);
    } catch (error) {
      setIsUploadingPv(false);
      toast.error("Une erreur est survenue pendant la suppression");
      console.log(error);
    }

    //end get url of pv
  };

  const onSubmit = async (data: SellerUpdateFormData) => {
    console.log("pppp");

    const formData = new FormData();
    if (!localStorage.getItem("mon-auto-token")) {
      router.push("/seller-signup");
    }
    const token = JSON.parse(localStorage.getItem("mon-auto-token") as string);
    console.log(token);
    if (!data.carteGrise || !data.pvControleTechnique || !data.imagesAuto) {
      alert(
        "vérifier l'insertion des fichiers carte grise, pv controle technique et images de l'auto"
      );
      return;
    }

    if (!selectedCity) {
      alert("Vous n'avez pas insérer la ville ou se trouve l'auto.");
      return;
    }
    formData.set("mon-refresh-token", token["refresh-token"]);
    formData.set("mon-auto-token", token["access-token"]);
    formData.set("villeDuBien", selectedCity.city);
    formData.set("nbreDePlace", data.nbreDePlace.toString());
    formData.set("nbreDePorte", data.nbreDePorte.toString());
    formData.set("marques", autreAuto ? autreAuto : data.marques);
    formData.set(
      "typesCarrosserie",
      data.typesCarrosserie ? data.typesCarrosserie : ""
    );
    formData.set("dateOfCreated", dateOfCreated as string);
    formData.set("typeCarburant", data.typeCarburant.toUpperCase());
    formData.set("prix", data.prix.toString());
    formData.set("devise", data.devise);
    formData.set(
      "typeTransmission",
      "TRANSMISSION_" + data.typeTransmission.toUpperCase()
    );
    formData.set(
      "kilometrage",
      data.kilometrage ? data.kilometrage.toString() : ""
    );
    formData.set(
      "kilometrageUnit",
      data.kilometrageUnit ? data.kilometrageUnit : ""
    );
    formData.set(
      "typeDeTrainConducteur",
      data.typeDeTrainConducteur ? data.typeDeTrainConducteur : ""
    );

    formData.set(
      "conso100kmAutoRoute",
      data.conso100kmAutoRoute ? data.conso100kmAutoRoute.toString() : ""
    );

    formData.set(
      "conso100kmVille",
      data.conso100kmVille ? data.conso100kmVille.toString() : ""
    );

    formData.set(
      "tailleDuMoteur",
      data.tailleDuMoteur ? data.tailleDuMoteur.toString() : ""
    );

    formData.set("couleurInt", data.couleurInt ? data.couleurInt : "");
    formData.set("couleurExt", data.couleurExt ? data.couleurExt : "");
    formData.set("typeMoteur", data.typeMoteur);
    formData.set("statusOfAuto", data.statusOfAuto);
    formData.set(
      "pvControleTechnique",
      data.pvControleTechnique
        ? downloadUrlPv?.url + "--" + downloadUrlPv?.originalName
        : ""
    );
    formData.set(
      "carteGrise",
      data.carteGrise
        ? downloadUrlCartegrise?.url +
            "--" +
            downloadUrlCartegrise?.originalName
        : ""
    );
    formData.set(
      "anneeDeFabrication",
      data.anneeDeFabrication ? data.anneeDeFabrication.toUTCString() : ""
    );
    formData.set("model", data.model);
    formData.set(
      "lastMaintenanceDate",
      data.lastMaintenanceDate ? data.lastMaintenanceDate.toUTCString() : ""
    );
    formData.set(
      "immatriculation",
      data.immatriculation ? data.immatriculation : ""
    );
    formData.set(
      "descriptionAuto",
      data.descriptionAuto ? data.descriptionAuto : ""
    );
    formData.set("climatisation", data.climatisation ? data.climatisation : "");
    if (data.imagesAuto) {
      let i: number = 0;
      console.log(data.imagesAuto);
      for (let image of data.imagesAuto) {
        formData.set("imagesAuto" + i, JSON.stringify(image));
        i++;
      }
      formData.set("size_image", data.imagesAuto.length.toString());
    }

    if (data.acceptsTerms) {
      formData.set("acceptsTerms", "on");
    } else {
      formData.set("acceptsTerms", "off");
    }
    /* === "on" */ try {
      const result = await updateSellerAuto(formData, slug as string);
      if (result.token) {
        const val = JSON.stringify(result.token);
        localStorage.setItem("mon-auto-token", val);
      }
      reset();
      toast.success("L'auto a été mis a jour avec success");
      router.back();
      //Rediriger ou afficher un message de succès
    } catch (error) {
      console.error("Erreur lors de l'inscription:", error);
      toast.error("Une erreur est survenue pendant la suppression");
      // Afficher une erreur à l'utilisateur
    }
  };

  const deleteAuto = async () => {
    const token = JSON.parse(localStorage.getItem("mon-auto-token") as string);
    try {
      setDeleteData(true);
      const result = await deleteSellerAuto(slug as string, token);
      if (result.token) {
        const val = JSON.stringify(result.token);
        localStorage.setItem("mon-auto-token", val);
      }
      toast.success("L'auto a été supprimer avec success");
      setDeleteData(false);
      setOpenDialogAuto(false);
      router.back();
    } catch (error) {
      setDeleteData(false);
      toast.error("Une erreur est survenue pendant la suppression");
      setOpenDialogAuto(false);
    }
  };

  const deleteMyImage = async (id: string, index: number) => {
    const token = JSON.parse(localStorage.getItem("mon-auto-token") as string);
    try {
      setDeleteStateImage(true);
      const result = await deleteImage(id, token);
      if (result.token) {
        const val = JSON.stringify(result.token);
        localStorage.setItem("mon-auto-token", val);
      }
      const newFiles = [...allImages];
      newFiles.splice(index, 1);
      setValue("imagesAuto", newFiles);
      setAllImages(newFiles);
      setDeleteStateImage(false);
    } catch (error) {
      toast.error("Une erreur est survenue pendant la suppression");
      setDeleteStateImage(false);
    }
  };

  const deletePvFile = async (fileName: string) => {
    try {
      setIsDeletePv(true);
      if (!localStorage.getItem("mon-auto-token")) {
        router.push("/seller-signup");
      }
      const token = JSON.parse(
        localStorage.getItem("mon-auto-token") as string
      );
      const response = await deleteFile(token, fileName);

      if (response.success) {
        if (response.token) {
          console.log("lolo");
          const val = JSON.stringify(response.token);
          localStorage.setItem("mon-auto-token", val);
        }

        setValue("pvControleTechnique", "");
        if (fileInputRefPv.current) {
          fileInputRefPv.current.value = "";
        }
        setIsDeletePv(false);
        toast.success("Image supprimé avec success");
        return;
      }
      throw new Error("");
    } catch (error) {
      console.log(error);
      setIsDeletePv(false);
      toast.error("Une erreur est survenue pendant la suppression");
    }
  };

  const deleteCarteFile = async (fileName: string) => {
    try {
      setIsDeleteCarte(true);
      if (!localStorage.getItem("mon-auto-token")) {
        router.push("/seller-signup");
      }
      const token = JSON.parse(
        localStorage.getItem("mon-auto-token") as string
      );
      const response = await deleteFile(token, fileName);

      if (response.success) {
        if (response.token) {
          console.log("lolo");
          const val = JSON.stringify(response.token);
          localStorage.setItem("mon-auto-token", val);
        }

        setValue("carteGrise", "");
        if (fileInputRef2Carte.current) {
          fileInputRef2Carte.current.value = "";
        }
        setIsDeleteCarte(false);
        toast.success("Image supprimé avec success");
        return;
      }
      throw new Error("");
    } catch (error) {
      console.log(error);
      setIsDeleteCarte(false);
      toast.error("Une erreur est survenue pendant la suppression");
    }
  };

  const handleUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const mm = e.target.files;
    if (!mm) return;
    if (mm.length <= 0) return;
    if (mm.length > 8) {
      toast.error("Plus de 8 images ont été télécharger");
      return;
    }

    setIsUploading(true);

    const files = Array.from(mm);
    const myFile = files.find((val) => val.size > 5 * 1024 * 1024);
    if (myFile) {
      toast.error("Vous avez au moins une image de taille supérieur à 5Mo");
      return;
    }

    // Initialize progress tracking for each file

    let arrarResponse: any = [];
    try {
      // Upload files sequentially (for better progress tracking)
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const formData = new FormData();
        formData.append("file", file); // Note 'files' instead of 'file'
        if (!localStorage.getItem("mon-auto-token")) {
          router.push("/seller-signup");
        }
        const token = JSON.parse(
          localStorage.getItem("mon-auto-token") as string
        );

        const response = uploadFile(token, formData);

        arrarResponse.push(response);
      }
      const result = await Promise.all([...arrarResponse]);
      result.forEach((val) => {
        const keys = Object.keys(val.data);

        const values = Object.values(val.data) as string[];
        const data = { id: uuidv4(), url: keys[0] };
        setValue("imagesAuto", { ...images_autos, ...data });
        setAllImages((prev) => [...prev, data]);
      });

      toast.success("Le téléchargement s'est effectué avec success");
    } catch (err) {
      console.error("Upload error:", err);
      toast.error("Une erreur est survenue pendant la téléchargement");
    } finally {
      setIsUploading(false);
    }
  };

  useEffect(() => {
    const getAutoWithId = async () => {
      try {
        setLoading(true);
        const response = await getSingleAutoDataAsync(slug as string);
        const responseImg = await getImageAuto(slug as string);
        console.log(responseImg);
        setValue("imagesAuto", [...responseImg.data]);
        setAllImages([...responseImg.data]);
        const newAutos = response.data;
        console.log(newAutos);
        setAuto(newAutos);
        setValue("marques", newAutos.marques);
        setValue("anneeDeFabrication", new Date(newAutos.anneeDeFabrication));
        setValue("carteGrise", newAutos.carteGriseUrl);
        const vovo = newAutos.carteGriseUrl.split("--");
        setDownloadUrlCartegrise({ url: vovo[0], originalName: vovo[1] });
        setValue("conso100kmAutoRoute", newAutos.conso100kmAutoRoute);
        setValue("conso100kmVille", newAutos.conso100kmVille);
        setValue("couleurExt", newAutos.couleurExt);
        setValue("couleurInt", newAutos.couleurInt);
        newAutos.couleurExt &&
          setSelectedColor({
            label: newAutos.couleurExt?.split("-")[0],
            value: newAutos.couleurExt?.split("-")[1],
          });
        newAutos.couleurInt &&
          setSelectedColor2({
            label: newAutos.couleurInt?.split("-")[0],
            value: newAutos.couleurInt?.split("-")[1],
          });
        setValue("devise", newAutos.devise);
        setValue("immatriculation", newAutos.immatriculation);
        setValue("kilometrage", newAutos.kilometrage);
        setValue("kilometrageUnit", newAutos.kilometrageUnit);
        setValue("lastMaintenanceDate", new Date(newAutos.lastMaintenanceDate));
        setValue("model", newAutos.model);
        setValue("nbreDePlace", newAutos.nbreDePlace);
        setValue("nbreDePorte", newAutos.nbreDePorte);
        setValue("prix", newAutos.prix);
        setValue("pvControleTechnique", newAutos.pvControleTechniqueUrl);
        const dodo = newAutos.pvControleTechniqueUrl.split("--");
        setDownloadUrlCartegrise({ url: dodo[0], originalName: dodo[1] });
        setValue("statusOfAuto", newAutos.statusOfAuto);
        setValue("tailleDuMoteur", newAutos.tailleDuMoteur);

        setValue("typeDeTrainConducteur", newAutos.typeDeTrainConducteur);

        const dd = newAutos.typeCarburant;
        const typcarb =
          dd === "ESSENCE"
            ? "Essence"
            : dd === "DIESEL"
            ? "Diesel"
            : dd === "HYBRIDE"
            ? "Hybride"
            : dd === "ELECTRIQUE"
            ? "Electrique"
            : "GPL";
        setValue("typeCarburant", typcarb);
        setValue("typeMoteur", newAutos.typeMoteur);

        const toto = newAutos.typeTransmission;
        const trans =
          toto === "TRANSMISSION_MANUELLE"
            ? "Manuelle"
            : toto === "TRANSMISSION_AUTOMATIQUE"
            ? "Automatique"
            : "Semi_automatique";
        setValue("typeTransmission", trans);
        setValue("typesCarrosserie", newAutos.typesCarrosserie);
        setValue("villeDuBien", newAutos.villeDuBien);
        setValue("climatisation", newAutos.climatisation);
        setValue("descriptionAuto", newAutos.descriptionAuto);
        newAutos.villeDuBien && setSelectedCity({ city: newAutos.villeDuBien });
        setDateOfCreated(newAutos.dateOfCreated);
        setLoading(false);
      } catch (err) {
        console.log(err);
        setLoading(false);
        setLoadingFail(true);
      }
    };

    getAutoWithId();
  }, []);

  console.log(errors);
  console.log(watch("imagesAuto"));
  /*  if (!watch("imagesAuto")) {
    if (auto?.imagesAuto) {
      setValue("imagesAuto", [...auto?.imagesAuto]);
    }
  } */
  return (
    <div className="max-w-2xl mx-auto my-10 p-6 bg-white">
      <MyLogo />
      <ScrollToTopButton />
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className=" mx-auto bg-white p-5 rounded-lg loginShaddow mt-14"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 ">
          {/* Spécialisations */}
          <div className="space-y-4 ">
            <h2 className="text-xl font-semibold">Caractéristique de l'auto</h2>

            <div>
              <label
                htmlFor="mymarque"
                className="block text-sm font-medium text-gray-700"
              >
                Marque de l'auto *
              </label>
              <select
                id="mymarque"
                {...register("marques")}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Choisir la marque de l'auto</option>
                {MARQUES.map((brand, index) => (
                  <option value={brand} key={index}>
                    {" "}
                    {brand}{" "}
                  </option>
                ))}
              </select>
              {errors.marques && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.marques.message}
                </p>
              )}

              {marques === "Autre" && (
                <input
                  type="text"
                  id="marque"
                  value={autreAuto}
                  onChange={handleMarqueAuto}
                  className="mt-1 block w-full px-3 py-2 border border-red-400 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Entrer la marque autre de l'auto ici"
                />
              )}
            </div>

            <div>
              <label
                htmlFor="mymodels"
                className="block text-sm font-medium text-gray-700"
              >
                Model associé à la marque choisis *
              </label>
              <input
                type="text"
                id="mymodels"
                {...register("model")}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="ex:Corolla"
              />
              {errors.immatriculation && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.model?.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="mytypescarrosserie"
                className="block text-sm font-medium text-gray-700"
              >
                Type de carrosserie
              </label>
              <select
                id="mytypescarrosserie"
                {...register("typesCarrosserie")}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Choisir le type de carrosserie </option>
                {TYPES_CARROSSERIE.map((brand, index) => (
                  <option value={brand} key={index}>
                    {" "}
                    {brand}{" "}
                  </option>
                ))}
              </select>
              {errors.typesCarrosserie && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.typesCarrosserie.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="couleurExt"
                className="block text-sm font-medium text-gray-700"
              >
                Couleur Extérieur
              </label>

              <VehicleColorPicker
                handleCouleur={handleCouleurExt}
                selectedColor={selectedColor}
                setSelectedColor={setSelectedColor}
                placeholder="Couleur extérieur de l'auto"
              />
            </div>

            <div>
              <label
                htmlFor="couleurExt"
                className="block text-sm font-medium text-gray-700"
              >
                Couleur intérieur
              </label>

              <VehicleColorPicker
                handleCouleur={handleCouleurInt}
                selectedColor={selectedColor2}
                setSelectedColor={setSelectedColor2}
                placeholder="Couleur intérieur de l'auto"
              />
            </div>

            <div>
              <label
                htmlFor="mytypescarburant"
                className="block text-sm font-medium text-gray-700"
              >
                Type de carburant *
              </label>
              <select
                id="mytypescarburant"
                {...register("typeCarburant")}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Choisir le type de carburant</option>
                {FUEL_TYPES.map((brand, index) => (
                  <option value={brand} key={index}>
                    {" "}
                    {brand === "Electrique" ? "Électrique" : brand}{" "}
                  </option>
                ))}
              </select>
              {errors.typeCarburant && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.typeCarburant.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="typeTransmission"
                className="block text-sm font-medium text-gray-700"
              >
                Type de transmission *
              </label>
              <select
                id="typeTransmission"
                {...register("typeTransmission")}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Choisir le type de transmission</option>
                {TRANSMISSION_TYPES.map((brand, index) => (
                  <option value={brand} key={index}>
                    {brand === "Semi_automatique" ? "Semi-automatique" : brand}{" "}
                  </option>
                ))}
              </select>
              {errors.typeTransmission && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.typeTransmission.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="typeMoteur"
                className="block text-sm font-medium text-gray-700"
              >
                Type de moteur *
              </label>
              <select
                id="typeMoteur"
                {...register("typeMoteur")}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Choisir le type moteur</option>
                {TYPES_MOTEUR.map((brand, index) => (
                  <option value={brand} key={index}>
                    {" "}
                    {brand === "CYLINDRE4"
                      ? "4 Cylindres"
                      : brand === "CYLINDRE6"
                      ? "6 Cylindres"
                      : "Électrique"}{" "}
                  </option>
                ))}
              </select>
              {errors.typeMoteur && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.typeMoteur.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="typeDeTrainConducteur"
                className="block text-sm font-medium text-gray-700"
              >
                Type train conducteur
              </label>
              <select
                id="typeDeTrainConducteur"
                {...register("typeDeTrainConducteur")}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Choisir le type de train conducteur</option>
                {TYPE_TRAIN_CONDUCTEUR.map((brand, index) => (
                  <option value={brand} key={index}>
                    {" "}
                    {brand}{" "}
                  </option>
                ))}
              </select>
              {errors.typeDeTrainConducteur && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.typeDeTrainConducteur.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="couleurExt"
                className="block text-sm font-medium text-gray-700"
              >
                Ville ou se trouve le bien
              </label>

              <SelectCity
                selectedCity={selectedCity}
                setSelectedCity={setSelectedCity}
                placeholder="Selectionner une ville"
              />
            </div>

            {/* Champ Prix avec devise */}
            <div className="w-full">
              <div>
                <label
                  htmlFor="price"
                  className="block text-sm font-medium text-gray-700"
                >
                  À quel prix vendez-vous *
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <input
                    id="price"
                    type="number"
                    {...register("prix", { valueAsNumber: true })}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    placeholder="0.00"
                    step="10"
                    min={0}
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center">
                    <select
                      {...register("devise")}
                      className="focus:ring-blue-500 focus:border-blue-500 h-full py-0 pl-2 pr-7 border-transparent bg-transparent text-gray-500 sm:text-sm rounded-md"
                    >
                      {CURRENCIES.map((currency) => (
                        <option key={currency} value={currency}>
                          {currency}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                {errors.prix && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.prix.message}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label
                htmlFor="immatriculation"
                className="block text-sm font-medium text-gray-700"
              >
                Numéro d'immatriculation de l'auto
              </label>
              <input
                type="text"
                id="immatriculation"
                {...register("immatriculation")}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder=""
              />
              {errors.immatriculation && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.immatriculation.message}
                </p>
              )}
            </div>

            {/* Champ Date de mise en circulation */}
            <div className="">
              <label
                htmlFor="registrationDate"
                className="block text-sm font-medium text-gray-700"
              >
                Date de première mise en circulation
              </label>
              <Controller
                control={control}
                name="anneeDeFabrication"
                render={({ field }) => (
                  <div className="mt-1 relative rounded-md">
                    <DatePicker
                      selected={field.value}
                      onChange={field.onChange}
                      dateFormat="dd/MM/yyyy"
                      className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      maxDate={new Date()}
                      showYearDropdown
                      dropdownMode="select"
                    />
                  </div>
                )}
              />
              {errors?.anneeDeFabrication && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.anneeDeFabrication.message}
                </p>
              )}
            </div>

            <div className="">
              <label
                htmlFor="lastMaintenanceDate"
                className="block text-sm font-medium text-gray-700"
              >
                Date du dernier entretien
              </label>
              <Controller
                control={control}
                name="lastMaintenanceDate"
                render={({ field }) => (
                  <div className="mt-1 relative rounded-md">
                    <DatePicker
                      selected={field.value}
                      onChange={field.onChange}
                      dateFormat="dd/MM/yyyy"
                      className="block w-full mt-1 pl-3 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      maxDate={new Date()}
                      /* isClearable */
                      /* placeholderText="Sélectionner une date" */
                      showYearDropdown
                      dropdownMode="select"
                    />
                  </div>
                )}
              />
              {errors?.lastMaintenanceDate && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.lastMaintenanceDate.message}
                </p>
              )}
            </div>

            {/* Champ Kilométrage */}
            <div>
              <label
                htmlFor="mileage"
                className="block text-sm font-medium text-gray-700"
              >
                Kilométrage *
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <input
                  id="mileage"
                  type="number"
                  {...register("kilometrage", { valueAsNumber: true })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder="0"
                  step="10"
                  min={0}
                />
                <div className="absolute inset-y-0 right-0 flex items-center">
                  <select
                    {...register("kilometrageUnit")}
                    className="focus:ring-blue-500 focus:border-blue-500 h-full py-0 pl-2 pr-7 border-transparent bg-transparent text-gray-500 sm:text-sm rounded-md"
                  >
                    {MILEAGE_UNITS.map((unit) => (
                      <option key={unit} value={unit}>
                        {unit}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              {errors.kilometrage && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.kilometrage.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="conso100kmAutoRoute"
                className="block text-sm font-medium text-gray-700"
              >
                Consommation au 100km sur autoroute
              </label>

              <div className="mt-1 relative rounded-md shadow-sm">
                <input
                  type="number"
                  id="conso100kmAutoRoute"
                  {...register("conso100kmAutoRoute", {
                    valueAsNumber: true, // This ensures the value is returned as a number
                  })}
                  className="mt-1 block w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder=""
                  min={0}
                />

                <div className="absolute inset-y-0 right-2 flex items-center text-[#333333d3] ">
                  Litre
                </div>
              </div>

              {errors.conso100kmAutoRoute && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.conso100kmAutoRoute.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="conso100kmAutoRoute"
                className="block text-sm font-medium text-gray-700"
              >
                Consommation au 100km en ville
              </label>

              <div className="mt-1 relative rounded-md shadow-sm">
                <input
                  type="number"
                  id="conso100kmVille"
                  {...register("conso100kmVille", {
                    valueAsNumber: true, // This ensures the value is returned as a number
                  })}
                  className="mt-1 block w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder=""
                  min={0}
                />

                <div className="absolute inset-y-0 right-2 flex items-center text-[#333333d3] ">
                  Litre
                </div>
              </div>

              {errors.conso100kmVille && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.conso100kmVille.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="conso100kmAutoRoute"
                className="block text-sm font-medium text-gray-700"
              >
                Taille du moteur
              </label>

              <div className="mt-1 relative rounded-md shadow-sm">
                <input
                  type="number"
                  id="tailleDuMoteur"
                  {...register("tailleDuMoteur", {
                    valueAsNumber: true, // This ensures the value is returned as a number
                  })}
                  className="mt-1 block w-full px-3 py-2 pr-10 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  placeholder=""
                  min={0}
                />

                <div className="absolute inset-y-0 right-2 flex items-center text-[#333333d3] ">
                  Litre
                </div>
              </div>

              {errors.tailleDuMoteur && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.tailleDuMoteur.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="nbreDePlace"
                className="block text-sm font-medium text-gray-700"
              >
                nombre de place de l'auto *
              </label>
              <input
                type="number"
                id="nbreDePlace"
                {...register("nbreDePlace", {
                  valueAsNumber: true, // This ensures the value is returned as a number
                })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder=""
                min={0}
              />
              {errors.nbreDePlace && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.nbreDePlace.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="nbreDePorte"
                className="block text-sm font-medium text-gray-700"
              >
                nombre de portière de l'auto *
              </label>
              <input
                type="number"
                id="nbreDePorte"
                {...register("nbreDePorte", {
                  valueAsNumber: true, // This ensures the value is returned as a number
                })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder=""
                min={0}
              />
              {errors.nbreDePorte && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.nbreDePorte.message}
                </p>
              )}
            </div>
          </div>

          {/*  <div>
            <label className="block text-sm font-medium text-gray-700">
              Insérer la Carte grise du véhicule
            </label>
            <div className="mt-1 flex items-center">
              {carte_grise && downloadUrlCartegrise ? (
                <div className="flex items-center gap-4">
                  <p>{downloadUrlCartegrise.originalName}</p>
                  <button
                    type="button"
                    onClick={() => {
                      deleteCarteFile(downloadUrlCartegrise.url);
                    }}
                    className="text-sm text-red-600 hover:text-red-800 disabled:text-red-400 disabled:cursor-not-allowed disabled:hover:text-red-400"
                    disabled={isDeleteCarte}
                  >
                    {isDeleteCarte ? <LoaderCircleIcon /> : "Supprimer"}
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <div className="flex text-sm text-gray-600">
                    <input
                      id="carteGrise"
                      type="file"
                      className="sr-only"
                      ref={fileInputRef2Carte}
                      onChange={(e) => {
                        handleFileCarteGrise(e);
                      }}
                    />

                    <button
                      type="button"
                      onClick={() => {
                        fileInputRef2Carte.current?.click();
                      }}
                      className="mt-1 inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-slate-200  hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer disabled:cursor-not-allowed"
                      disabled={isUploadingCarte}
                    >
                      {isUploadingCarte
                        ? "En cours..."
                        : "Télécharger des fichiers"}
                    </button>

                    {downloadUrlCartegrise && (
                      <div className="success-message">
                        <p>File uploaded successfully!</p>
                        <a
                          href={downloadUrlCartegrise.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          View/Download File
                        </a>
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-gray-500">jusqu'à 10MB</p>
                </div>
              )}
            </div>
            {errors.carteGrise && (
              <p className="mt-1 text-sm text-red-600">
                {errors.carteGrise.message}
              </p>
            )}
          </div>
 */}
          {/*    <div>
            <label className="block text-sm font-medium text-gray-700">
              Insérer le Procès verbal du controle technique du véhicule
            </label>
            <div className="mt-1 flex items-center">
              {pv_controle_technique && downloadUrlPv ? (
                <div className="flex items-center gap-4">
                  <p>{downloadUrlPv.originalName} </p>
                  <button
                    type="button"
                    onClick={() => {
                      deletePvFile(downloadUrlPv.url);
                    }}
                    className="text-sm text-red-600 hover:text-red-800 disabled:text-red-400 disabled:cursor-not-allowed disabled:hover:text-red-400"
                    disabled={isDeletePv}
                  >
                    {isDeletePv ? <LoaderCircleIcon /> : "Supprimer"}
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <div className="flex text-sm text-gray-600">
                  
                    <input
                      id="pvControleTechnique"
                      type="file"
                     
                      className="sr-only"
                      ref={fileInputRefPv}
                      onChange={(e) => {
                        handleFilePv(e);
                      }}
                    />
                   
                    <button
                      type="button"
                      onClick={() => {
                        fileInputRefPv.current?.click();
                      }}
                      className="mt-1 inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-slate-200  hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer disabled:cursor-not-allowed"
                      disabled={isUploadingPv}
                    >
                      {isUploadingPv
                        ? "En cours..."
                        : "Télécharger des fichiers"}
                    </button>

                    {downloadUrlPv && (
                      <div className="success-message">
                        <p>File uploaded successfully!</p>
                        <a
                          href={downloadUrlPv.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          View/Download File
                        </a>
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-gray-500">jusqu'à 10MB</p>
                </div>
              )}
            </div>
            {errors.pvControleTechnique && (
              <p className="mt-1 text-sm text-red-600">
                {errors.pvControleTechnique.message}
              </p>
            )}
          </div>
 */}
          <div className="text-sm">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700"
            >
              Description du véhicule
            </label>
            <textarea
              id="description"
              {...register("descriptionAuto")}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Décrit le véhicule avec tes propres mots"
            />
            {errors.immatriculation && (
              <p className="mt-1 text-sm text-red-600">
                {errors.descriptionAuto?.message}
              </p>
            )}
          </div>
          <div className="text-sm">
            <label
              htmlFor="climatisation"
              className="block text-sm font-medium text-gray-700"
            >
              Climatisation
            </label>
            <select
              id="climatisation"
              {...register("climatisation")}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Climatisation</option>
              {["Climatisé", "Non climatisé"].map((brand, index) => (
                <option value={brand} key={index}>
                  {brand}
                </option>
              ))}
            </select>
            {errors.typeMoteur && (
              <p className="mt-1 text-sm text-red-600">
                {errors.climatisation?.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="imagesAuto"
              className="block text-sm font-medium text-gray-700"
            >
              Insérer des Images du véhicules (max 8) *
            </label>
            <input
              id="imagesAuto"
              type="file"
              multiple
              accept="image/jpeg, image/png, image/webp"
              className="sr-only"
              ref={images_autoInputRef}
              onChange={(e) => {
                handleUpload(e);
              }}
            />
            <button
              type="button"
              onClick={() => {
                images_autoInputRef.current?.click();
              }}
              className="mt-1 inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-slate-200  hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer"
            >
              {isUploading ? "En cours..." : "Télécharger des fichiers"}
            </button>

            <div className="mt-2 flex flex-row flex-wrap sm:grid sm:grid-cols-4 gap-2">
              {allImages.map((item, index) => (
                <DeleteBackofficeImageMultiple
                  item={item}
                  index={index}
                  images_autos={images_autos}
                  setAllImages={setAllImages}
                  setValue={setValue}
                />
              ))}
            </div>
            {errors.imagesAuto && (
              <p className="mt-1 text-sm text-red-600">
                {errors.imagesAuto.message}
              </p>
            )}
          </div>

          {/* Champ pour plusieurs images de voitures */}
          <div>
            <label
              htmlFor="imagesAuto"
              className="block text-sm font-medium text-gray-700"
            >
              Insérer des Images du véhicules (max 8) *
            </label>
            <input
              id="imagesAuto"
              type="file"
              multiple
              accept="image/jpeg, image/png, image/webp"
              className="sr-only"
              ref={images_autoInputRef}
              onChange={(e) => {
                if (e.target.files) {
                  const files = Array.from(e.target.files);
                  setValue("imagesAuto", [
                    ...watch("imagesAuto"),
                    ...files.map((val) => ({
                      url: val.name,
                      id: (allImages?.length + 1).toString(),
                    })),
                  ]);
                  setAllImages([
                    ...watch("imagesAuto"),
                    ...files.map((val) => ({
                      url: val.name,
                      id: (allImages?.length + 1).toString(),
                    })),
                  ]);
                }
              }}
            />
            <button
              type="button"
              onClick={() => images_autoInputRef.current?.click()}
              className="mt-1 inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-slate-200  hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer"
            >
              Télécharger des fichiers
            </button>

            {/* Aperçu des images sélectionnées */}
            <div className="mt-2 grid grid-cols-3 gap-2">
              {allImages &&
                allImages.map((file, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={"/" + file.url}
                      alt={`Aperçu ${index + 1}`}
                      className="h-24 w-full object-cover rounded"
                    />
                    <button
                      type="button"
                      onClick={() => deleteMyImage(file.id, index)}
                      className="flex items-center justify-center cursor-pointer absolute w-[20px] h-[20px] top-1 right-1 bg-red-500 text-white rounded-full  opacity-0 group-hover:opacity-100"
                    >
                      {deleteStateImage ? "..." : "X"}
                    </button>

                    <a
                      title="Download"
                      href={"/" + file.url}
                      download
                      className="flex items-center justify-center cursor-pointer absolute w-[20px] h-[20px] top-1 left-1 bg-gray-700 text-white rounded-full  opacity-0 group-hover:opacity-100"
                    >
                      <span className="icon-[fa6-solid--download] text-white text-xl"></span>
                    </a>
                  </div>
                ))}
            </div>
            {errors.imagesAuto && (
              <p className="mt-1 text-sm text-red-600">
                {errors.imagesAuto.message}
              </p>
            )}
          </div>

          {/* Conditions */}
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="acceptsTerms"
                type="checkbox"
                {...register("acceptsTerms")}
                className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
              />
            </div>
            <div className="ml-3 text-sm">
              <label
                htmlFor="acceptsTerms"
                className="font-medium text-gray-700"
              >
                J'accepte les conditions générales d'utilisation *
              </label>
              <p className="text-gray-500">
                En cochant cette case, vous acceptez nos conditions générales et
                notre politique de confidentialité.
              </p>
              {errors.acceptsTerms && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.acceptsTerms.message}
                </p>
              )}
            </div>
          </div>

          {/* Bouton de soumission */}
          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleSubmit(onSubmit)}
            >
              {isSubmitting ? "Mis à jour en cours..." : "Mettre à jour"}
            </button>
          </div>
        </form>
        <div>
          {
            <AlertDialog open={openDialogAuto}>
              <AlertDialogTrigger
                onClick={() => setOpenDialogAuto(true)}
                className="w-full flex mt-2 justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-[#333333] bg-gray-300 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
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
                  <AlertDialogCancel onClick={() => setOpenDialogAuto(false)}>
                    Annuler
                  </AlertDialogCancel>
                  <AlertDialogAction onClick={deleteAuto} disabled={deleteData}>
                    {deleteData ? "Suppression en cours..." : "Supprimer"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          }
        </div>
        <div>
          <button
            type="button"
            disabled={isSubmitting}
            className="mt-5  flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-red-400 hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300"
            onClick={() => router.back()}
          >
            Retour
          </button>
        </div>
      </motion.div>
    </div>
  );
}
