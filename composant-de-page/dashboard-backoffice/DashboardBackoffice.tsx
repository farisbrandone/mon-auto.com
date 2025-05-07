"use client";

import HeaderCars from "@/components/HeaderCars";
import React, { useEffect, useState } from "react";
import { DashboardTable } from "./DashboardTable";
import { ColumnHeader } from "./ColumnHeader";

import { getDataAsync } from "@/app/actions/actions";

export default function DashboardBackoffice() {
  const [userData, setUserData] = useState<any[]>();

  const [loading, setLoading] = useState(false);
  const [loadingFail, setLoadingFail] = useState(false);
  const [tokenState, setTokenState] = useState("");

  useEffect(() => {
    const getDataAsyncFront = async () => {
      try {
        setLoading(true);
        const saved = window.localStorage.getItem("mon-auto-token");
        if (saved) {
          setTokenState(saved);
        } else {
          return;
        }
        /* 
       { success: true, data: newAutos, error: null, token: null };
       */

        const response = await getDataAsync(saved);
        const newAutos = response.data;
        console.log({ newAutos });
        setUserData([...newAutos]);
        if (response.token) {
          window.localStorage.setItem(
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
        <p className="text-[20px] font-bold ">Tous les clients</p>
        <p className="text-[#333333] text-[20px] ">
          Nombre de client ={" "}
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

      {userData && <DashboardTable columns={ColumnHeader} data={userData} />}
    </div>
  );
}
