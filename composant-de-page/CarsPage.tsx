"use client";
import Footer from "@/components/Footer";
import HeaderCars from "@/components/HeaderCars";
import { Localisation } from "@/components/icon/Localisation";
import { Telephone } from "@/components/icon/Telephone";
import { ImageCaroussel } from "@/components/ImageCarousel";
import VehicleColorPicker, { ColorOption } from "@/components/SelectColors2";
import { SelectComponent } from "@/components/SelectComponent";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import {
  FUEL_TYPES,
  MARQUES,
  MIN_YEAR,
  TRANSMISSION_TYPES,
  TYPES_CARROSSERIE,
  TYPES_MOTEUR,
  villesCameroun,
} from "@/lib/constants/carProperties";
import { Search } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, {
  ChangeEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import { MySkeleton } from "@/components/MySkeleton";
import { formatDate, formatMoney } from "@/lib/utils";

import { useInfiniteAutos } from "@/hook/useInfiniteAuto";
import { useForm } from "react-hook-form";
import { searchForm, searchSchema } from "@/lib/validations/seller";
import { zodResolver } from "@hookform/resolvers/zod";
import ScrollToTopButton from "@/components/ScrollToTopButton";

export interface SearchCriteria {
  marques?: string;
  typesCarrosserie?: string;
  anneeMin?: number;
  anneeMax?: number;
  kilometrageMin?: number;
  kilometrageMax?: number;
  PrixMin?: number;
  PrixMax?: number;
  typeMoteur?: string;
  selectedColor?: string;
  keyword?: string;
  typeCarburant?: string;
  typeTransmission?: string;
  villeDuBien?: string;
  // Add other search criteria as needed
}

function CarsPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    control,
    watch,
    setValue,
    reset,
  } = useForm<searchForm>({
    resolver: zodResolver(searchSchema),
    defaultValues: {
      PrixMax: null,
      PrixMin: null,
      anneeMax: null,
      anneeMin: null,
      kilometrageMax: null,
      kilometrageMin: null,
    },
  });

  const router = useRouter();
  const [couleur, setCouleur] = useState("");
  const [selectedColor, setSelectedColor] = useState<ColorOption | null>(null);
  const [position, setPosition] = useState(0);

  const [isOpen, setIsOpen] = useState(false);
  const contentRef = useRef<HTMLFormElement>(null);
  const [lolo, setLolo] = useState(true);

  const { autos, loading, hasMore, fetchMore } = useInfiniteAutos();
  const observer = useRef<IntersectionObserver>(null);

  const lastCarElementRef = useCallback(
    (node: HTMLDivElement) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          fetchMore();
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  const updateSearchParams = useCallback((newCriteria: SearchCriteria) => {
    const params = new URLSearchParams();

    if (newCriteria.marques) params.set("marques", newCriteria.marques);
    if (newCriteria.typesCarrosserie)
      params.set("typesCarrosserie", newCriteria.typesCarrosserie);
    if (newCriteria.anneeMin)
      params.set("anneeMin", newCriteria.anneeMin.toString() + "/01/01");
    if (newCriteria.anneeMax)
      params.set("anneeMax", newCriteria.anneeMax.toString() + "/01/01");

    if (newCriteria.kilometrageMin)
      params.set("kilometrageMin", newCriteria.kilometrageMin.toString());
    if (newCriteria.kilometrageMax)
      params.set("kilometrageMax", newCriteria.kilometrageMax.toString());

    if (newCriteria.PrixMin)
      params.set("PrixMin", newCriteria.PrixMin.toString());
    if (newCriteria.PrixMax)
      params.set("PrixMax", newCriteria.PrixMax.toString());

    if (newCriteria.typeMoteur)
      params.set("typeMoteur", newCriteria.typeMoteur);
    if (newCriteria.selectedColor)
      params.set("selectedColor", newCriteria.selectedColor);

    if (newCriteria.keyword) params.set("keyword", newCriteria.keyword);
    if (newCriteria.typeCarburant)
      params.set("typeCarburant", newCriteria.typeCarburant);

    if (newCriteria.typeTransmission)
      params.set("typeTransmission", newCriteria.typeTransmission);
    if (newCriteria.villeDuBien)
      params.set("villeDuBien", newCriteria.villeDuBien);

    console.log(params.toString());
    router.push(`http://localhost:3000/search?${params.toString()}`);
  }, []);

  const handleCouleur = (value: string) => {
    console.log({ value });
    setCouleur(value);
  };

  const onSubmit = async (data: searchForm) => {
    const queryState: SearchCriteria = {};

    if (data.anneeMin && Number(data.anneeMin) !== 0) {
      queryState.anneeMin = Number(data.anneeMin);
    }
    if (data.anneeMax && Number(data.anneeMax) !== 0) {
      queryState.anneeMax = Number(data.anneeMax);
    }
    if (data.kilometrageMin && Number(data.kilometrageMin) !== 0) {
      queryState.kilometrageMin = Number(data.kilometrageMin);
    }
    if (data.kilometrageMax && Number(data.kilometrageMax)) {
      queryState.kilometrageMax = Number(data.kilometrageMax);
    }
    if (data.PrixMin && Number(data.PrixMin)) {
      queryState.PrixMin = Number(data.PrixMin);
    }
    if (data.PrixMax && Number(data.PrixMax)) {
      queryState.PrixMax = Number(data.PrixMax);
    }
    if (data.marques) {
      queryState.marques = data.marques;
    }
    if (data.typesCarrosserie) {
      queryState.typesCarrosserie = data.typesCarrosserie;
    }
    if (data.typeMoteur) {
      queryState.typeMoteur = data.typeMoteur;
    }
    if (data.keyword) {
      queryState.keyword = data.keyword;
    }
    if (data.typeCarburant) {
      queryState.typeCarburant = data.typeCarburant;
    }

    if (data.selectedColor) {
      queryState.selectedColor = data.selectedColor;
    }
    if (data.villeDuBien) {
      queryState.villeDuBien = data.villeDuBien;
    }
    if (data.typeTransmission) {
      queryState.typeTransmission = data.typeTransmission;
    }

    console.log(queryState);

    updateSearchParams(queryState);
  };

  useEffect(() => {
    setLolo(false);
  }, []);

  return (
    <div className="text-black text-[16px] min-h-screen flex flex-col ">
      <HeaderCars />
      <ScrollToTopButton />
      <div className="flex flex-col gap-1 px-1 sm:px-4  py-3 my-4 mx-2 border-[#33333349] border-solid border-[2px] shadow-2xl rounded-md  ">
        <div
          className="flex items-center gap-1 transition-colors cursor-pointer "
          onClick={() => setIsOpen(!isOpen)}
        >
          <Search className="cursor-pointer" />
          Configurer et lancer votre recherche
        </div>

        <form
          ref={contentRef}
          className={`
          bg-white rounded-lg shadow-md
          transition-all duration-300 ease-in-out
          ${isOpen ? "opacity-100" : "max-h-0 opacity-0 hidden"}
          lg:opacity-100 lg:max-h-full
        `}
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="flex flex-col gap-2 items-center mx-2 mt-3 lg:grid lg:grid-cols-4 lg:grid-rows-3 ">
            <SelectComponent
              /*  value={marques} */
              /*  myValue={watch().marques} */
              register={register}
              fieldForm="marques"
              variable={[...MARQUES]}
              placeholder="Choisir une marque"
              /*  handleValue={handleMarque} */
            />

            <SelectComponent
              /*  value={typesCarrosserie} */
              myValue={watch().typesCarrosserie}
              fieldForm="typesCarrosserie"
              variable={[...TYPES_CARROSSERIE]}
              register={register}
              placeholder="Type de carrosserie"
              /*  handleValue={handleModel} */
            />

            <div className="grid grid-cols-2 grid-rows-3 w-full gap-2 lg:col-span-2 lg:row-span-3 ">
              <div>
                <SelectComponent
                  /*  value={anneeMin} */
                  myValue={watch().anneeMin}
                  fieldForm="anneeMin"
                  variable={[...MIN_YEAR]}
                  register={register}
                  placeholder="Année Min"
                  /* handleValue={handleAnneMin} */
                />
              </div>
              <div>
                <SelectComponent
                  /*  value={anneeMax} */
                  myValue={watch().anneeMax}
                  fieldForm="anneeMax"
                  variable={[...MIN_YEAR]}
                  register={register}
                  placeholder="Année Max"
                  /*  handleValue={handleAnneMax} */
                />
                {errors.anneeMax && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.anneeMax.message}
                  </p>
                )}
              </div>

              <div>
                <Input
                  type="number"
                  min={0}
                  placeholder="Kilometrage Min"
                  {...register("kilometrageMin", {
                    valueAsNumber: true,
                    setValueAs: (v) => (v === "" ? NaN : Number(v)),
                    validate: (value) => {
                      console.log("dodo");
                      return (
                        value !== undefined && value !== null && isNaN(value)
                      );
                    },
                  })}
                  /* value={kilometrageMin} */
                  /* onChange={handleKilometrageMin}  */
                  className="pl-2 text-[14px] sm:[text-16px] rounded-[2px]  border-[1px] border-solid border-[#3333334d] "
                />
                {errors.kilometrageMin && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.kilometrageMin.message}
                  </p>
                )}
              </div>

              <div>
                <Input
                  type="number"
                  placeholder="Kilometrage Max"
                  {...register("kilometrageMax", {
                    valueAsNumber: true,
                  })}
                  /*  value={kilometrageMax} */
                  /*  onChange={handleKilometrageMax} */
                  className="pl-2 text-[14px] sm:[text-16px] rounded-[2px]  border-[1px] border-solid border-[#3333334d] "
                />
                {errors.kilometrageMax && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.kilometrageMax.message}
                  </p>
                )}
              </div>

              <div>
                <Input
                  type="number"
                  placeholder="Prix Min"
                  {...register("PrixMin", {
                    valueAsNumber: true,
                  })}
                  /*  value={PrixMin} */
                  /* onChange={handlePrixMin} */
                  className="pl-2 text-[14px] sm:[text-16px] rounded-[2px]  border-[1px] border-solid border-[#3333334d] "
                />
                {errors.PrixMin && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.PrixMin.message}
                  </p>
                )}
              </div>

              <div>
                <Input
                  type="number"
                  placeholder="Prix Max"
                  {...register("PrixMax", {
                    valueAsNumber: true,
                  })}
                  /*  value={PrixMax}
                onChange={handlePrixMax} */
                  className="pl-2 text-[14px] sm:[text-16px] rounded-[2px]  border-[1px] border-solid border-[#3333334d] "
                />
                {errors.PrixMax && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.PrixMax.message}
                  </p>
                )}
              </div>
            </div>
            <div className="w-full">
              <SelectComponent
                /*  value={typeMoteur} */
                myValue={watch().typeMoteur}
                fieldForm="typeMoteur"
                variable={[...TYPES_MOTEUR]}
                register={register}
                placeholder="Moteurs"
                /*  handleValue={handleTypeMoteur} */
              />
              {errors.typeMoteur && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.typeMoteur.message}
                </p>
              )}
            </div>

            <div className="w-full">
              <SelectComponent
                /* value={typeCarburant} */
                myValue={watch().typeTransmission}
                fieldForm="typeTransmission"
                variable={[...TRANSMISSION_TYPES]}
                register={register}
                placeholder="Type de transmission"
              />
              {errors.typeTransmission && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.typeTransmission.message}
                </p>
              )}
            </div>

            <div className="w-full">
              <SelectComponent
                /* value={typeCarburant} */
                myValue={watch().typeCarburant}
                fieldForm="typeCarburant"
                variable={[...FUEL_TYPES]}
                register={register}
                placeholder="Type de carburant"
                /*  handleValue={handleTypeCarburant} */
              />
              {errors.typeCarburant && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.typeCarburant.message}
                </p>
              )}
            </div>

            <div className="w-full">
              <VehicleColorPicker
                handleCouleur={handleCouleur}
                selectedColor={selectedColor}
                setSelectedColor={setSelectedColor}
                placeholder="Choisir une couleur"
                register={setValue}
                fieldForm="selectedColor"
              />
              {errors.selectedColor && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.selectedColor.message}
                </p>
              )}
            </div>
          </div>
          <div className="flex flex-col w-full gap-2 mt-1 lg:flex-row px-2 ">
            <div className="w-full lg:max-w-[300px]">
              <SelectComponent
                myValue={watch().villeDuBien}
                fieldForm="villeDuBien"
                variable={[...villesCameroun]}
                register={register}
                placeholder="Choisir une ville"
              />
              {errors.villeDuBien && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.villeDuBien.message}
                </p>
              )}
            </div>

            <div>
              <Input
                type="text"
                placeholder="Chercher par mot clé"
                {...register("keyword")}
                className=" text-[14px]  sm:[text-16px] rounded-[2px]  border-[1px] border-solid border-[#3333334d] lg:max-w-[300px]"
              />
              {errors.keyword && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.keyword.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              onClick={() => handleSubmit(onSubmit)}
              disabled={
                isSubmitting ||
                (!watch().PrixMax &&
                  !watch().PrixMin &&
                  !watch().anneeMax &&
                  !watch().anneeMin &&
                  !watch().keyword &&
                  !watch().kilometrageMax &&
                  !watch().kilometrageMin &&
                  !watch().marques &&
                  !watch().selectedColor &&
                  !watch().typeCarburant &&
                  !watch().typeMoteur &&
                  !watch().typesCarrosserie)
              }
              className=" bg-[#191919] text-white rounded-[1px] border-[2px] border-solid border-[#191919] lg:max-w-[300px] lg:flex-1 cursor-pointer hover:bg-[#bebebe] hover:text-[#191919] hover:border-[#bebebe] transition-colors duration-500 "
            >
              {
                /* !startSending */ !isSubmitting
                  ? "Rechercher"
                  : "Patienter..."
              }
            </Button>

            <Button
              type="button"
              onClick={() => {
                reset();
                setSelectedColor(null);
              }}
              className=" w-full bg-[#1eb0fc] text-white rounded-[1px] border-[2px] border-solid border-[#33333383] lg:max-w-[300px] cursor-pointer hover:bg-white hover:text-[#1eb0fc]"
            >
              Réinitialiser
            </Button>
          </div>
        </form>
      </div>

      <div className="flex flex-col sm:grid md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 w-full gap-4 mb-3.5 p-2">
        {autos &&
          autos?.map((val, index) => {
            return (
              <div
                ref={index === autos.length - 1 ? lastCarElementRef : null}
                className="flex flex-col items-center max-w-xl mx-auto  border-[1px] border-[#00000021] border-solid  rounded-lg cardDetailShadow"
              >
                <ImageCaroussel
                  className="w-full max-w-xl rounded-lg"
                  position={position}
                  setPosition={setPosition}
                  imagesAuto={val._links.imagesAuto.href}
                />
                <p className="w-full flex items-center justify-end text-red-600 mt-2 text-[20px] mr-1 ">
                  FCFA {formatMoney(val.prix)}
                </p>

                <p className="w-full font-black text-[18px] flex flex-col p-2 mt-2 after:w-full after:border-1 after:border-solid after:mt-2 after:border-[#33333383] ">
                  model: {formatDate(val.anneeDeFabrication)} {val.marques}{" "}
                  {val.model}
                </p>
                <div className="flex flex-col gap-3 w-full p-2">
                  <div className="grid grid-cols-2 w-full">
                    <p className="font-[800]"> Kilometrage : </p>
                    <p className="text-end w-full">
                      {" "}
                      {formatMoney(val.kilometrage)} {val.kilometrageUnit}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 w-full">
                    <p className="font-[800]"> Moteur : </p>
                    <p className="text-end w-full">
                      {val.typeMoteur === "CYLINDRE4"
                        ? "4 Cylindres"
                        : val.typeMoteur === "CYLINDRE6"
                        ? "6 Cylindres"
                        : "Électrique"}{" "}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 w-full">
                    <p className="font-[800]"> chaîne de traction : </p>
                    <p className="text-end w-full">
                      {" "}
                      {val.typeDeTrainConducteur}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 w-full">
                    <p className="font-[800]"> Type de carburant : </p>
                    <p className="text-end w-full"> {val.typeCarburant}</p>
                  </div>
                  <div className="grid grid-cols-2 w-full">
                    <p className="font-[800]"> Transmission </p>
                    <p className="text-end w-full">
                      {" "}
                      {val.typeTransmission.split("_")[0]}{" "}
                      {val.typeTransmission.split("_")[1]}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 w-full">
                    <p className="font-[800]"> Ville : </p>
                    <p className="text-end w-full"> {val.villeDuBien} </p>
                  </div>
                </div>
                <Link
                  href={`/detail-car/${val.id}`}
                  className=" text-center p-1 text-[18px] w-full bg-[#191919] text-white rounded-[4px] border-none border-[#33333383]  cursor-pointer hover:bg-[#cacaca] hover:text-[#191919] mx-1 transition-colors duration-500 "
                >
                  Voir les détails
                </Link>
                <div className="flex items-center w-full justify-between mt-2 text-[18px] font-[400] px-2">
                  <div className="flex items-center">
                    <Localisation color="#d14141" />
                    <p className="ml-1 hover:text-red-600  cursor-pointer ">
                      MonAuto.com
                    </p>{" "}
                  </div>
                  <div className="flex items-center">
                    <Telephone color="#d14141" />
                    <p className="ml-1  hover:text-red-600 cursor-pointer">
                      Tel: 655968956
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        {(loading || lolo) && (
          <>
            {/*   <MySkeleton />
            <MySkeleton />

            <MySkeleton />
            <MySkeleton /> */}
            <div className="flex justify-center py-8 col-span-2 items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-t-4 border-[#333333]"></div>
            </div>
          </>
        )}
        {/* {!hasMore && <div className="no-more">No more cars to load</div>} */}

        {((!loading && autos.length === 0) || !hasMore) && !lolo && (
          <div className=" w-full no-results mt-6 text-center text-gray-500 col-span-2">
            Aucune autre voiture trouvé
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

export default CarsPage;
