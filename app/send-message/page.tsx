import { FaWhatsapp } from "@/components/icon/WhatsappIcon";
import MessagePage from "@/composant-de-page/MessagePage";
import Link from "next/link";

export default function page() {
  return (
    <>
      <MessagePage />
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
