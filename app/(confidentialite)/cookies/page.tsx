"use client";

import Link from "next/link";
import { FC, useState } from "react";

const CookieBanner: FC = () => {
  const [accepted, setAccepted] = useState<boolean>(false);

  if (accepted) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-800 text-white p-4 z-50">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between">
        <p className="mb-4 md:mb-0 md:mr-4">
          Nous utilisons des cookies essentiels pour le bon fonctionnement du
          site.
          <Link href="/cookies" className="text-blue-300 hover:underline ml-1">
            En savoir plus
          </Link>
        </p>
        <div className="flex space-x-4">
          <button
            onClick={() => setAccepted(true)}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
          >
            Accepter
          </button>
          <button
            onClick={() => setAccepted(true)}
            className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded"
          >
            Refuser
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieBanner;
