"use client";

import { deleteFile } from "@/app/actions/actions";
import { UploadProgress } from "@/composant-de-page/AddAutoPage";
import { SellerFormData } from "@/lib/validations/seller";
import { CrossIcon, LoaderCircleIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { SetStateAction, useState } from "react";
import { UseFormSetValue } from "react-hook-form";
import { toast } from "sonner";
import { EosIconsLoading } from "./Spinner";

interface DeleteImageMultipleProps {
  item: UploadProgress;
  index: number;
  images_auto: File[];
  setValue: UseFormSetValue<SellerFormData>;
  setUploadProgressMultiple: (value: SetStateAction<UploadProgress[]>) => void;
  removeFiles: (fileName: string, index: number) => Promise<void>;
}

export default function DeleteImageMultiple({
  item,
  index,
  images_auto,
  setValue,
  setUploadProgressMultiple,
  removeFiles,
}: DeleteImageMultipleProps) {
  const [loadingDelete, setLoadingDelete] = useState(false);
  const router = useRouter();

  const removeFile = async (fileName: string, index: number) => {
    try {
      setLoadingDelete(true);
      await removeFiles(fileName, index);
      toast.success("l'image a été supprimé avec success");
      setLoadingDelete(false);
    } catch (error) {
      setLoadingDelete(false);
      toast.error("Une erreur est survenue pendant la suppression");
    }
  };

  return (
    <>
      {item.downloadUrl && (
        <div className="relative group">
          <Image
            alt={item.fileName}
            src={item.downloadUrl}
            width={150}
            height={150}
            className="object-cover w-[80px] h-[80px] sm:w-[150px] sm:h-[150px] "
          />
          <button
            type="button"
            onClick={() => removeFile(item.downloadUrl as string, index)}
            className="absolute w-[30px] h-[30px] top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 flex items-center justify-center disabled:bg-red-300 disabled:opacity-90"
            disabled={loadingDelete}
          >
            {""}
            {loadingDelete ? (
              <EosIconsLoading color="white" />
            ) : (
              <CrossIcon className="text-white" />
            )}
          </button>
        </div>
      )}

      {item.error && (
        <div className="text-[12px] sm:tex-[14px] text-red-500 ">
          {item.error}
        </div>
      )}
    </>
  );
}
