import { FaWhatsapp } from "@/components/icon/WhatsappIcon";
import CarsDetails from "@/composant-de-page/CarsDetails";
import Link from "next/link";
import React from "react";

function page() {
  return (
    <>
      <CarsDetails />
      <Link
        href="https://wa.me/237655968956"
        className="whatsapp-float"
        target="_blank"
      >
        <FaWhatsapp />
      </Link>
    </>
  );
}

export default page;
