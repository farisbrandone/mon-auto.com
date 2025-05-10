import * as React from "react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import axios from "axios";
import ImageWithSkeleton from "./ImageWithSkeleton";
import SkeletonTrue from "./SkeletonTrue";
import Image from "next/image";

export const tab = [
  "/vehicule1.jpg",
  "/vehicule2.jpg",
  "/vehicule3.jpg",
  "/vehicule4.jpg",
  "/vehicule5.jpg",
  "/vehicule6.jpg",
];

export function ImageCaroussel({
  className,
  position,
  setPosition,
  imagesAuto,
}: {
  className: string;
  setPosition: React.Dispatch<React.SetStateAction<number>>;
  position: number;
  imagesAuto: string;
}) {
  const [images, setImages] = React.useState<any[] | null>();
  const [loading, setLoading] = React.useState(false);
  React.useEffect(() => {
    const getImagesAuto = async () => {
      try {
        setLoading(true);
        const imagesUrl = await axios.get(imagesAuto);
        console.log({ zizi: imagesUrl.data._embedded.imageAutos });
        setImages(imagesUrl.data._embedded.imageAutos);
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    };
    getImagesAuto();
  }, []);

  if (loading) {
    return <SkeletonTrue className={className + " h-[300px]"} />;
  }

  return (
    <Carousel className={className}>
      <CarouselContent>
        {images &&
          images.map((value, index) => (
            <CarouselItem key={index}>
              {value.url && (
                <ImageWithSkeleton
                  src={value.url.split("--")[0]}
                  alt=""
                  className=" w-full rounded-t-lg"
                />
              )}
            </CarouselItem>
          ))}
      </CarouselContent>
      <CarouselPrevious position={position} setPosition={setPosition} />
      <CarouselNext position={position} setPosition={setPosition} />
    </Carousel>
  );
}

export function ImageCaroussel2({
  className,
  position,
  setPosition,
  imagesAuto,
  setImages,
  images,
}: {
  className: string;
  setPosition: React.Dispatch<React.SetStateAction<number>>;
  position: number;
  imagesAuto: string;
  setImages: React.Dispatch<React.SetStateAction<any[] | null | undefined>>;
  images: any[] | null | undefined;
}) {
  React.useEffect(() => {
    const getImagesAuto = async () => {
      try {
        const imagesUrl = await axios.get(imagesAuto);
        console.log({ zizi: imagesUrl.data._embedded.imageAutos });
        setImages(imagesUrl.data._embedded.imageAutos);
      } catch (error) {
        console.log(error);
      }
    };
    getImagesAuto();
  }, []);

  return (
    <Carousel className={className}>
      <CarouselContent>
        {images &&
          images.map((value, index) => (
            <CarouselItem key={index}>
              {value.url && (
                <Image
                  src={value.url.split("--")[0]}
                  alt=""
                  className="w-full object-cover rounded-t-lg"
                />
              )}
            </CarouselItem>
          ))}
      </CarouselContent>
      <CarouselPrevious position={position} setPosition={setPosition} />
      <CarouselNext position={position} setPosition={setPosition} />
    </Carousel>
  );
}

export function ImageCaroussel3({
  className,
  position,
  setPosition,
  imagesAuto,
}: {
  className: string;
  setPosition: React.Dispatch<React.SetStateAction<number>>;
  position: number;
  imagesAuto: any[];
}) {
  return (
    <Carousel className={className}>
      <CarouselContent>
        {imagesAuto &&
          imagesAuto.map((value) => (
            <CarouselItem key={value.id}>
              <Image
                src={"/" + value.url}
                alt=""
                className="w-full object-cover rounded-t-lg"
              />
            </CarouselItem>
          ))}
      </CarouselContent>
      <CarouselPrevious position={position} setPosition={setPosition} />
      <CarouselNext position={position} setPosition={setPosition} />
    </Carousel>
  );
}
