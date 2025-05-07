import Link from "next/link";
import { FC } from "react";

const FooterCond: FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className=" py-2">
      <div className="container mx-auto px-2 text-[12px] sm:text-[14px] text-center">
        <div className="flex flex-wrap justify-center gap-3 mb-2">
          <Link
            href="/privacy-policy"
            className="text-gray-50 hover:text-gray-100  hover:underline"
          >
            Politique de confidentialité
          </Link>
          <Link
            href="/legal-notice"
            className="text-gray-50 hover:text-gray-100  hover:underline"
          >
            Mentions légales
          </Link>
          <Link
            href="/cookies"
            className="text-gray-50 hover:text-gray-100  hover:underline"
          >
            Cookies
          </Link>
          <Link
            href="/terms"
            className="text-gray-50 hover:text-gray-100  hover:underline"
          >
            Conditions d&apos;utilisation
          </Link>
          <Link
            href="/contact"
            className="text-gray-50 hover:text-gray-100  hover:underline"
          >
            Contact
          </Link>
        </div>
        <p className="text-gray-50 text-xs">
          © {currentYear} PAMOD TECHNOLOGIE. Tous droits réservés.
        </p>
      </div>
    </footer>
  );
};

export default FooterCond;
