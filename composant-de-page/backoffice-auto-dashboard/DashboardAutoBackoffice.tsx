"use client";

import HeaderCars from "@/components/HeaderCars";
import React, { useEffect, useState } from "react";

import { DashboardTable } from "../dashboard-backoffice/DashboardTable";
import { ColumnAutoHeader } from "./ColumnAutoHeader";
import { getAutoDataAsync } from "@/app/actions/actions";
import { DashboardAutoTable } from "./DashboardAutoTable";

export default function DashboardAutoBackoffice() {
  const [userData, setUserData] = useState<any[]>();
  const [totalElements, setTotalElements] = useState(0);
  const [loading, setLoading] = useState(false);
  const [loadingFail, setLoadingFail] = useState(false);

  const [actualPage, setActualPage] = useState(0);
  const [totalPage, setTotalPage] = useState(1);
  useEffect(() => {
    const getDataAsyncFront = async () => {
      try {
        setLoading(true);

        /* 
       { success: true, data: newAutos, error: null, token: null };
       */

        const response = await getAutoDataAsync(actualPage);
        const newAutos = response.data;

        setUserData([...newAutos.autos]);
        const pageData = response.page;
        setTotalElements(pageData.totalElements);
        setActualPage(pageData.number);
        setTotalPage(pageData.totalPages);

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
          Nombre d'auto =
          <span className="font-bold text-red-600 ">
            {" "}
            {totalElements ? totalElements : "..."}
          </span>{" "}
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
        <DashboardAutoTable
          columns={ColumnAutoHeader}
          data={userData}
          setUserData={setUserData}
          actualPage={actualPage}
          setActualPage={setActualPage}
          setTotalPage={setTotalPage}
          totalPage={totalPage}
        />
      )}
    </div>
  );
}
