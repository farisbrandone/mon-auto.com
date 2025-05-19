import { FaWhatsapp } from "@/components/icon/WhatsappIcon";
import CarsPage from "@/composant-de-page/CarsPage";
import Link from "next/link";
import React from "react";

function page() {
  return (
    <div>
      <CarsPage />
      <Link
        href="https://wa.me/237655968956"
        className="whatsapp-float"
        target="_blank"
      >
        <FaWhatsapp />
      </Link>
    </div>
  );
}

export default page;
