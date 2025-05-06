"use client";

import HeaderCars from "@/components/HeaderCars";
import React, { useEffect, useState } from "react";

import { getUserDataAsync } from "@/app/actions/actions";
import { DashboardTable } from "../dashboard-backoffice/DashboardTable";
import { ColumnUserHeader } from "./ColumnUserHeader";

export default function DashboardUserAutoBackoffice({
  userId,
}: {
  userId: string;
}) {
  const [userData, setUserData] = useState<any[]>();

  const [loading, setLoading] = useState(false);
  const [loadingFail, setLoadingFail] = useState(false);
  const [tokenState, setTokenState] = useState(
    localStorage.getItem("mon-auto-token")
  );

  useEffect(() => {
    const getDataAsyncFront = async () => {
      try {
        setLoading(true);

        /* 
       { success: true, data: newAutos, error: null, token: null };
       */

        const response = await getUserDataAsync(tokenState, userId);
        const newAutos = response.data;
        console.log({ newAutos });
        setUserData([...newAutos]);
        if (response.token) {
          localStorage.setItem(
            "mon-auto-token",
            JSON.stringify(response.token)
          );
        }

        setLoading(false);
      } catch (err) {
        console.log(err);
        setLoading(false);
        setLoadingFail(true);
      }
    };

    getDataAsyncFront();
  }, []);

  return (
    <div className="flex flex-col ">
      <HeaderCars />
      <div className="my-5 p-2 w-full flex flex-col gap-2">
        <p className="text-[20px] font-bold ">Tous les autos de: </p>
        <p className="text-[#333333] text-[20px] ">
          Nombre d'auto ={" "}
          <span className="font-bold text-red-600 "> {userData?.length} </span>{" "}
        </p>
      </div>

      {loading && (
        <div className="w-full flex flex-col items-center ">
          <span className="icon-[eos-icons--loading] text-[#333333] text-4xl "></span>
        </div>
      )}

      {loadingFail && (
        <div className="w-full flex flex-col items-center ">
          Une erreur est survenue
        </div>
      )}

      {userData && (
        <DashboardTable columns={ColumnUserHeader} data={userData} />
      )}
    </div>
  );
}
