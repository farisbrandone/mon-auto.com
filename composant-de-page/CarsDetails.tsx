"use client";

import { sendContact } from "@/app/actions/actions";
import Footer from "@/components/Footer";
import HeaderCars from "@/components/HeaderCars";
import { DoubleBack } from "@/components/icon/DoubleBack";
import { Email } from "@/components/icon/Email";
import { Previous } from "@/components/icon/Previous";
import {
  ImageCaroussel,
  ImageCaroussel2,
  tab,
} from "@/components/ImageCarousel";
import ScrollToTopButton from "@/components/ScrollToTopButton";
import SkeletonTrue from "@/components/SkeletonTrue";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { baseUrl, formatDate, formatMoney } from "@/lib/utils";
import { contactForm, contactSchema } from "@/lib/validations/seller";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import clsx from "clsx";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

function CarsDetails() {
  const [position, setPosition] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadingFail, setLoadingFail] = useState(false);
  const [auto, setAuto] = useState<any>();
  const [images, setImages] = React.useState<any[] | null>();
  const [startSendContact, setStartSendContact] = useState(false);
  const [disableAfterSend, setDisableAfterSend] = useState(false);

  const { slug } = useParams();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    reset,
  } = useForm<contactForm>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: contactForm) => {
    console.log(data);
    const formData = new FormData();
    formData.set("nom", data.nom);
    formData.set("email", data.email);
    formData.set("message", data.message ? data.message : "");
    formData.set("telephone", data.telephone ? data.telephone : "");
    formData.set("prenom", data.prenom ? data.prenom : "");
    try {
      setStartSendContact(true);
      await sendContact(formData);

      setStartSendContact(false);
      setDisableAfterSend(true);
      reset();
      // Redirect handled in signIn action
    } catch (error) {
      setStartSendContact(false);
      setError("root", {
        type: "manual",
        message: "Une erreur est survenue",
      });
    }
  };

  useEffect(() => {
    const getAllAutos = async () => {
      try {
        setLoading(true);
        const data = await axios.get(`${baseUrl}/autos/${slug}`);
        setAuto(data.data);

        setLoading(false);
      } catch (error) {
        setLoadingFail(true);
      }
    };
    getAllAutos();
  }, []);

  if (loading) {
    return (
      <div className="text-black text-[16px] min-h-screen flex flex-col ">
        <HeaderCars />
        <Link
          href="/cars"
          className="flex items-center mt-2 cursor-pointer pl-2 max-w-[200px] "
        >
          <div className="p-1.5 bg-[#1eb0fc] flex items-center rounded-sm ">
            <Previous />
            <Previous className="-ml-1" />
          </div>
          <p className="ml-2">retour à l'inventaire</p>
        </Link>
        <div className="flex flex-grow flex-col gap-1 sm:grid sm:grid-cols-2 mt-2 mb-2 p-2">
          {/*  <div className="flex items-center space-x-4 max-w-7xl p-1 mx-auto">
            <div className="space-y-2 w-full">
             
            </div>
          </div> */}
          <div className="mt-2">
            <SkeletonTrue className="h-[450px] w-full " />
            {/*  <Skeleton className="h-[450px] w-full " /> */}
          </div>

          <div className="w-full mt-4 border-[1px] border-solid border-[#33333359] shadow-2xl rounded-md max-w-7xl mx-auto ">
            <p className="w-full text-center text-[18px] font-[600] text-[#333333] mb-4 mt-2 ">
              {" "}
              Contactez nous
            </p>
            <form
              className="flex flex-col gap-2 w-full p-3 rounded-md"
              onSubmit={handleSubmit(onSubmit)}
            >
              <div className=" flex flex-col sm:grid sm:grid-cols-2 w-full gap-2">
                <div className="flex flex-col gap-5">
                  <div className="flex flex-col gap-1">
                    <Label>Nom</Label>
                    <Input
                      type="text"
                      className="border-[1px] border-solid border-[#33333327] rounded-sm "
                      {...register("nom")}
                    />
                    {errors.nom && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.nom.message}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col gap-1">
                    <Label>Email</Label>
                    <Input
                      type="email"
                      className="border-[1px] border-solid border-[#33333327] rounded-sm "
                      {...register("email")}
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.email.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-5">
                  <div className="flex flex-col gap-1">
                    <Label>Prenom</Label>
                    <Input
                      type="text"
                      className="border-[1px] border-solid border-[#33333327] rounded-sm "
                      {...register("prenom")}
                    />
                    {errors.prenom && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.prenom.message}
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col gap-1">
                    <Label>Telephone</Label>
                    <Input
                      type="text"
                      className="border-[1px] border-solid border-[#33333327] rounded-sm "
                      {...register("telephone")}
                    />
                    {errors.telephone && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.telephone.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <Label>Message</Label>
                <Textarea
                  rows={6}
                  className="border-[1px] border-solid border-[#33333327] rounded-sm w-full "
                  {...register("message")}
                />
                {errors.message && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.message?.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-[120px] text-[18px] p-2 bg-[#333333] text-white border-none   cursor-pointer hover:bg-[#3333338a] transition-colors duration-300  rounded-md disabled:cursor-not-allowed "
                onClick={handleSubmit(onSubmit)}
                disabled={true}
              >
                {isSubmitting ? "en cours..." : "Soumettre"}
              </Button>
            </form>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (loadingFail) {
    throw new Error("");
  }

  return (
    <div className="relative text-black text-[14px] sm:text-[16px] min-h-screen flex flex-col  ">
      <HeaderCars />
      <ScrollToTopButton />
      <Link
        href="/cars"
        className="flex items-center mt-2 cursor-pointer pl-2 w-[250px] "
      >
        <div className="p-1.5 bg-[#1eb0fc] flex items-center rounded-sm ">
          <Previous />
          <Previous className="-ml-1" />
        </div>
        <p className="ml-2 w-full flex-1 ">retour à l'inventaire</p>
      </Link>

      <div className="flex flex-grow flex-col mt-6 xl:flex-row xl:gap-2">
        {auto && (
          <div className="flex flex-col">
            <div className="flex items-center gap-2 px-1.5">
              <img
                src="/vehicule1.jpg"
                alt=""
                className="w-[50px] h-[50px] object-cover rounded-full  "
              />
              {/*  <div className="flex flex-col gap-2"> */}
              <p className="text-[20px] font-black ">
                {formatDate(auto?.anneeDeFabrication)} {auto.marques}{" "}
                {auto.model} - {formatMoney(auto.kilometrage)}{" "}
                {auto.kilometrageUnit}
              </p>
              {/*  <p>
                  {formatDate(auto?.anneeDeFabrication)} {auto.marques}{" "}
                  {auto.model} {auto.tailleDuMoteur} {"L "}
                  Préférence : {auto.typeDeTrainConducteur}
                </p> */}
              {/*  </div> */}
            </div>
            <ImageCaroussel2
              className="w-full max-w-7xl rounded-lg mt-3 p-2 "
              position={position}
              setPosition={setPosition}
              imagesAuto={auto._links.imagesAuto.href}
              setImages={setImages}
              images={images}
            />
            <div className="flex items-center gap-3 max-w-5xl p-2 flex-wrap">
              {images &&
                images.map((val, index) => {
                  return (
                    <img
                      src={"/" + val.url}
                      alt=""
                      key={index}
                      className={clsx("max-w-100px h-[100px] object-cover ", {
                        "border-[2px] border-solid border-[#1eb0fc] ":
                          position === index,
                      })}
                    />
                  );
                })}
            </div>

            <div className="mt-2 flex flex-col w-full">
              <p className="text-[18px] font-black mb-4 p-2 ">
                Caractéristiques
              </p>
              <div className="flex flex-col  sm:grid sm:grid-cols-3 p-2.5 sm:gap-3">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <p>
                      {" "}
                      <strong>Année:</strong>{" "}
                    </p>
                    <p>{formatDate(auto?.anneeDeFabrication)}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p>
                      {" "}
                      <strong>Style Carosserie:</strong>{" "}
                    </p>
                    <p>{auto.typesCarrosserie}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p>
                      {" "}
                      <strong>Moteur:</strong>{" "}
                    </p>
                    <p>
                      {auto.typeMoteur === "CYLINDRE4"
                        ? "4 Cylindres"
                        : auto.typeMoteur === "CYLINDRE6"
                        ? "6 Cylindres"
                        : "Électrique"}{" "}
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p>
                      {" "}
                      <strong>Couleur extérieur:</strong>{" "}
                    </p>
                    <div className="flex items-center gap-1">
                      {" "}
                      <div
                        style={{
                          width: "20px",
                          height: "20px",
                          backgroundColor: auto.couleurExt.split("-")[1],
                        }}
                        /*  className={`w-[20px] h-[20px] bg-[${
                          auto.couleurExt.split("-")[1]
                        }] `} */
                      />{" "}
                      <p>{auto.couleurExt.split("-")[0]}</p>{" "}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <p>
                      {" "}
                      <strong>Passagers:</strong>{" "}
                    </p>
                    <p>{auto.nbreDePlace}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p>
                      {" "}
                      <strong>Consommation autoroute:</strong>{" "}
                    </p>
                    <p>
                      {auto.conso100kmAutoRoute}
                      {"L"}/100KM
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <p>
                      {" "}
                      <strong>Marque:</strong>{" "}
                    </p>
                    <p>{auto.marques}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p>
                      {" "}
                      <strong>Kilometrage:</strong>{" "}
                    </p>
                    <p>
                      {formatMoney(auto.kilometrage)} {auto.kilometrageUnit}
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p>
                      {" "}
                      <strong>Taille du moteur:</strong>{" "}
                    </p>
                    <p>{auto.tailleDuMoteur}L </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p>
                      {" "}
                      <strong>Couleur intérieur:</strong>{" "}
                    </p>
                    <div className="flex items-center gap-1">
                      {" "}
                      <div
                        style={{
                          width: "20px",
                          height: "20px",
                          backgroundColor: auto.couleurInt.split("-")[1],
                        }}
                        /*  className={`w-[20px] h-[20px] bg-[${
                          auto.couleurExt.split("-")[1]
                        }]`} */
                      />{" "}
                      <p>{auto.couleurExt.split("-")[0]}</p>{" "}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <p>
                      {" "}
                      <strong>Type carburant:</strong>{" "}
                    </p>
                    <p>{auto.typeCarburant}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p>
                      {" "}
                      <strong>Code produit:</strong>{" "}
                    </p>
                    <p>{auto.id}</p>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <p>
                      {" "}
                      <strong>Model:</strong>{" "}
                    </p>
                    <p>{auto.model}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p>
                      {" "}
                      <strong>Transmission:</strong>{" "}
                    </p>
                    <p>{auto.typeTransmission}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p>
                      {" "}
                      <strong>Train d'entraînement:</strong>{" "}
                    </p>
                    <p>{auto.typeDeTrainConducteur}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p>
                      {" "}
                      <strong>Nombre de portes:</strong>{" "}
                    </p>
                    <p>{auto.nbreDePorte}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p>
                      {" "}
                      <strong>Consommation ville:</strong>{" "}
                    </p>
                    <p>
                      {auto.conso100kmVille}
                      {"L"}/100KM
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p>
                      {" "}
                      <strong>Vignette:</strong>{" "}
                    </p>
                    <p>ascedfrgfnbvcdesq</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col p-2 ">
          {auto && (
            <div className="flex items-center justify-between mb-2 p-2 bg-[#cccacaa1] rounded-md mt-5 ">
              <p className="text-[18px] font-black ">Prix d'achat:</p>
              <p className="text-[18px] font-black text-red-600 ">
                FCFA {formatMoney(auto.prix)}{" "}
              </p>
            </div>
          )}
          {
            <div className="w-full mt-4 border-[1px] border-solid border-[#33333359] shadow-2xl rounded-md ">
              <p className="w-full text-center text-[18px] font-[600] text-[#333333] mb-4 mt-2 ">
                {" "}
                Contactez nous
              </p>
              <form
                className="flex flex-col gap-2 w-full p-3 rounded-md"
                onSubmit={handleSubmit(onSubmit)}
              >
                <div className=" flex flex-col sm:grid sm:grid-cols-2 w-full gap-2">
                  <div className="flex flex-col gap-5">
                    <div className="flex flex-col gap-1">
                      <Label>Nom</Label>
                      <Input
                        type="text"
                        className="border-[1px] border-solid border-[#33333327] rounded-sm "
                        {...register("nom")}
                      />
                      {errors.nom && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.nom.message}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col gap-1">
                      <Label>Email</Label>
                      <Input
                        type="email"
                        className="border-[1px] border-solid border-[#33333327] rounded-sm "
                        {...register("email")}
                      />
                      {errors.email && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.email.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col gap-5">
                    <div className="flex flex-col gap-1">
                      <Label>Prenom</Label>
                      <Input
                        type="text"
                        className="border-[1px] border-solid border-[#33333327] rounded-sm "
                        {...register("prenom")}
                      />
                      {errors.prenom && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.prenom.message}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col gap-1">
                      <Label>Telephone</Label>
                      <Input
                        type="text"
                        className="border-[1px] border-solid border-[#33333327] rounded-sm "
                        {...register("telephone")}
                      />
                      {errors.telephone && (
                        <p className="mt-1 text-sm text-red-600">
                          {errors.telephone.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <Label>Message</Label>
                  <Textarea
                    rows={6}
                    className="border-[1px] border-solid border-[#33333327] rounded-sm w-full "
                    {...register("message")}
                  />
                  {errors.message && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.message?.message}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-[120px] text-[18px] p-2 bg-[#333333] text-white border-none   cursor-pointer hover:bg-[#3333338a] transition-colors duration-300  rounded-md disabled:cursor-not-allowed "
                  onClick={handleSubmit(onSubmit)}
                  disabled={isSubmitting || disableAfterSend}
                >
                  {isSubmitting ? "en cours..." : "Soumettre"}
                </Button>
              </form>
            </div>
          }
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default CarsDetails;
