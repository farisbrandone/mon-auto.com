import { FaWhatsapp } from "@/components/icon/WhatsappIcon";
import SearchComponent from "@/composant-de-page/SearchComponent";
import Link from "next/link";
import React from "react";

function page() {
  return (
    <>
      <SearchComponent />
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
