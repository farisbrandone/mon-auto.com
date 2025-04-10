// app/inscription-vendeur/page.tsx
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFormState } from "react-hook-form";
import { SellerSchema, SellerFormData } from "@/lib/validations/seller";
import {
  MARQUES,
  TYPES_CARROSSERIE,
  FUEL_TYPES,
  TRANSMISSION_TYPES,
  TYPE_TRAIN_CONDUCTEUR,
  TYPES_MOTEUR,
  CURRENCIES,
  MILEAGE_UNITS,
} from "@/lib/constants/carProperties";
import { registerSeller } from "@/app/actions/actions"; // À implémenter
import Image from "next/image";
import { ChangeEvent, useRef, useState } from "react";
import MyLogo from "@/components/MyLogo";
import { CalendarIcon } from "@heroicons/react/20/solid";
import { Controller } from "react-hook-form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function SellerRegistrationForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    control,
    watch,
    setValue,
    reset,
  } = useForm<SellerFormData>({
    resolver: zodResolver(SellerSchema),
    defaultValues: {
      lastMaintenanceDate: new Date(),
    },
  });

  console.log(errors);

  const [autreAuto, setAutreAuto] = useState("");

  const carte_grise = watch("carteGrise");
  const pv_controle_technique = watch("pvControleTechnique");
  const images_auto = watch("imagesAuto") || [];
  const selectedCurrency = watch("devise");
  const mileageUnit = watch("kilometrageUnit");
  const marques = watch("marques");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const images_autoInputRef = useRef<HTMLInputElement>(null);

  const handleMarqueAuto = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setAutreAuto(e.target.value);
  };

  const onSubmit = async (data: SellerFormData) => {
    console.log("popou");
    const formData = new FormData();

    //formData.set("companyName", data.companyName);
    //formData.set("email", data.email);
    //formData.set("phone", data.phone);
    //formData.set("password", data.password);
    //formData.set("confirmPassword", data.confirmPassword);
    if (!localStorage.getItem("mon-auto-token")) {
      throw new Error("Vous n'ete pas authentifier");
    }
    const token = JSON.parse(localStorage.getItem("mon-auto-token") as string);
    console.log(token);
    if (!data.carteGrise || !data.pvControleTechnique || !data.imagesAuto) {
      alert(
        "vérifier l'insertion des fichiers carte grise, pv controle technique et images de l'auto"
      );
      return;
    }

    formData.set("mon-auto-token", token["access-token"]);

    formData.set("marques", autreAuto ? autreAuto : data.marques);
    formData.set(
      "typesCarrosserie",
      data.typesCarrosserie ? data.typesCarrosserie : ""
    );
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
    formData.set("typeMoteur", data.typeMoteur);
    formData.set("statusOfAuto", data.statusOfAuto);
    formData.set("pvControleTechnique", data.pvControleTechnique as Blob);
    formData.set("carteGrise", data.carteGrise as Blob);
    formData.set(
      "anneeDeFabrication",
      data.anneeDeFabrication ? data.anneeDeFabrication.toUTCString() : ""
    );
    formData.set(
      "lastMaintenanceDate",
      data.lastMaintenanceDate ? data.lastMaintenanceDate.toUTCString() : ""
    );
    formData.set(
      "immatriculation",
      data.immatriculation ? data.immatriculation : ""
    );
    if (data.imagesAuto) {
      let i: number = 0;
      console.log(data.imagesAuto);
      for (let image of data.imagesAuto) {
        formData.set("imagesAuto" + i, image as Blob);
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
      const result = await registerSeller(formData);
      console.log(result);
      //reset();
      // Rediriger ou afficher un message de succès
    } catch (error) {
      console.error("Erreur lors de l'inscription:", error);
      // Afficher une erreur à l'utilisateur
    }
  };

  return (
    <div className="max-w-2xl mx-auto my-10 p-6 bg-white rounded-lg shadow-md">
      <MyLogo />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-14">
        {/* Informations de l'entreprise */}
        {/*  <div className="space-y-4">
          <h2 className="text-xl font-semibold">Informations Personnele</h2>

          <div>
            <label
              htmlFor="companyName"
              className="block text-sm font-medium text-gray-700"
            >
              Nom *
            </label>
            <input
              id="companyName"
              {...register("companyName")}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.companyName && (
              <p className="mt-1 text-sm text-red-600">
                {errors.companyName.message}
              </p>
            )}
          </div>
        </div> */}

        {/* Coordonnées */}
        {/*  <div className="space-y-4">
          <h2 className="text-xl font-semibold">Coordonnées</h2>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email professionnel *
            </label>
            <input
              id="email"
              type="email"
              {...register("email")}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-700"
            >
              Téléphone *
            </label>
            <input
              id="phone"
              {...register("phone")}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="+33 6 12 34 56 78"
            />
            {errors.phone && (
              <p className="mt-1 text-sm text-red-600">
                {errors.phone.message}
              </p>
            )}
          </div>
        </div> */}

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
              <option value="">Choisir le type de carrosserie ou model </option>
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
                {/*  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">
                    {selectedCurrency === "EUR"
                      ? "€"
                      : selectedCurrency === "USD"
                      ? "$"
                      : selectedCurrency === "XOF"
                      ? "CFA"
                      : "CA$"}
                  </span>
                </div> */}
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
          <div className="w-full">
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

          <div className="w-full">
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

          {/* Affichage converti (optionnel) */}
          {/*  {mileageUnit === "miles" && watch("kilometrage") && (
            <div className="text-sm text-gray-500">
              ≈ {Math.round(watch("kilometrage") * 1.60934)} km
            </div>
          )}
          {mileageUnit === "km" && watch("kilometrage") && (
            <div className="text-sm text-gray-500">
              ≈ {Math.round(watch("kilometrage") / 1.60934)} miles
            </div>
          )} */}

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

        {/* Champ pour le logo de l'entreprise */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Insérer la Carte grise du véhicule
          </label>
          <div className="mt-1 flex items-center">
            {carte_grise ? (
              <div className="flex items-center gap-4">
                <p>{carte_grise.name}</p>
                <button
                  type="button"
                  onClick={() => {
                    setValue("carteGrise", undefined);
                    if (fileInputRef.current) {
                      fileInputRef.current.value = "";
                    }
                  }}
                  className="text-sm text-red-600 hover:text-red-800"
                >
                  Supprimer
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <div className="flex text-sm text-gray-600">
                  <label
                    htmlFor="carteGrise"
                    className="relative cursor-pointer rounded-md  font-medium text-blue-600 hover:text-blue-500 bg-slate-200 p-2"
                  >
                    <span>Télécharger un fichier</span>
                    <input
                      id="carteGrise"
                      type="file"
                      /* accept="image/jpeg, image/png, image/webp" */
                      className="sr-only"
                      ref={fileInputRef}
                      onChange={(e) => {
                        if (e.target.files?.[0]) {
                          setValue("carteGrise", e.target.files[0]);
                        }
                      }}
                    />
                  </label>
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

        {/* Champ pour le pv de controle technique  */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Insérer le Procès verbal du controle technique du véhicule
          </label>
          <div className="mt-1 flex items-center">
            {pv_controle_technique ? (
              <div className="flex items-center gap-4">
                <p>{pv_controle_technique.name} </p>
                <button
                  type="button"
                  onClick={() => {
                    setValue("pvControleTechnique", undefined);
                    if (fileInputRef.current) {
                      fileInputRef.current.value = "";
                    }
                  }}
                  className="text-sm text-red-600 hover:text-red-800"
                >
                  Supprimer
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <div className="flex text-sm text-gray-600">
                  <label
                    htmlFor="pvControleTechnique"
                    className="relative cursor-pointer rounded-md bg-slate-200 p-2 font-medium text-blue-600 hover:text-blue-500"
                  >
                    <span>Télécharger un fichier</span>
                    <input
                      id="pvControleTechnique"
                      type="file"
                      /* accept="image/jpeg, image/png, image/webp" */
                      className="sr-only"
                      ref={fileInputRef}
                      onChange={(e) => {
                        if (e.target.files?.[0]) {
                          setValue("pvControleTechnique", e.target.files[0]);
                        }
                      }}
                    />
                  </label>
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
                setValue("imagesAuto", files);
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
            {images_auto.map((file, index) => (
              <div key={index} className="relative group">
                <img
                  src={URL.createObjectURL(file)}
                  alt={`Aperçu ${index + 1}`}
                  className="h-24 w-full object-cover rounded"
                />
                <button
                  type="button"
                  onClick={() => {
                    const newFiles = [...images_auto];
                    newFiles.splice(index, 1);
                    setValue("imagesAuto", newFiles);
                  }}
                  className="absolute w-[20px] h-[20px] top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100"
                >
                  ×
                </button>
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
            <label htmlFor="acceptsTerms" className="font-medium text-gray-700">
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
            {isSubmitting ? "Enregistrement en cours..." : "Ajouter"}
          </button>
        </div>
      </form>
    </div>
  );
}
