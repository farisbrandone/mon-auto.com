import AddAutoPage from "@/composant-de-page/AddAutoPage";
import ParentAddAuto from "@/composant-de-page/ParentAddAuto";
import React from "react";

function page() {
  return (
    <ParentAddAuto>
      <AddAutoPage />
    </ParentAddAuto>
  );
}

export default page;
