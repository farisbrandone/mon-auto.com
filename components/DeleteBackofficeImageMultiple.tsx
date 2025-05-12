"use client";

import { deleteFile, deleteImage } from "@/app/actions/actions";
import { UploadProgress } from "@/composant-de-page/AddAutoPage";
import { SellerFormData, SellerUpdateFormData } from "@/lib/validations/seller";
import { CrossIcon, LoaderCircleIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { SetStateAction, useState } from "react";
import { UseFormSetValue } from "react-hook-form";
import { toast } from "sonner";

type urlType = { id: string; url: string };

interface DeleteUpdateImageMultipleProps {
  item: urlType;
  index: number;
  images_autos: urlType[];
  setValue: UseFormSetValue<SellerUpdateFormData>;
  setAllImages: (value: SetStateAction<{ id: string; url: string }[]>) => void;
}

export default function DeleteBackofficeImageMultiple({
  item,
  index,
  images_autos,
  setValue,
  setAllImages,
}: DeleteUpdateImageMultipleProps) {
  const [loadingDelete, setLoadingDelete] = useState(false);
  const router = useRouter();

  /*  const removeFile = async (fileName: string, index: number) => {
    try {
      setLoadingDelete(true);
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

        const newFiles = [...images_auto];
        newFiles.splice(index, 1);
        setValue("imagesAuto", newFiles);
        setUploadProgressMultiple((prev) =>
          prev.filter((item) => item.fileName !== fileName)
        );
        toast.success("l'image a été supprimé avec success");
      }
      setLoadingDelete(false);
    } catch (error) {
      setLoadingDelete(false);
      toast.error("Une erreur est survenue pendant la suppression");
    }
  }; */

  const deleteMyImage = async (id: string, index: number) => {
    const token = JSON.parse(localStorage.getItem("mon-auto-token") as string);
    try {
      setLoadingDelete(true);
      const result = await deleteImage(id, token);
      if (result.token) {
        const val = JSON.stringify(result.token);
        localStorage.setItem("mon-auto-token", val);
      }
      const newFiles = [...images_autos];
      newFiles.splice(index, 1);
      setValue("imagesAuto", newFiles);
      setAllImages((prev) => prev.filter((item) => item.id !== id));
      toast.success("l'image a été supprimé avec success");

      setLoadingDelete(true);
    } catch (error) {
      toast.error("Une erreur est survenue pendant la suppression");
      setLoadingDelete(true);
    }
  };

  return (
    <>
      {item.url && (
        <div className="relative group">
          <Image
            alt={""}
            src={item.url}
            width={150}
            height={150}
            className="object-cover w-[80px] h-[80px] sm:w-[150px] sm:h-[150px] "
          />
          <button
            type="button"
            onClick={() => deleteMyImage(item.id as string, index)}
            className="absolute w-[30px] h-[30px] top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 flex items-center justify-center disabled:bg-red-300 disabled:opacity-90"
            disabled={loadingDelete}
          >
            {""}
            {loadingDelete ? (
              <LoaderCircleIcon className="text-white " />
            ) : (
              <CrossIcon className="text-white" />
            )}
          </button>
        </div>
      )}
    </>
  );
}
