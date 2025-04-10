import Image from "next/image";
import Link from "next/link";
import React from "react";

function MyLogo() {
  return (
    <div className="absolute top-1 left-1 flex items-center w-full shadow-2xs ">
      <Link href="/">
        <Image
          alt=""
          width={100}
          height={100}
          src="/logo.png"
          className=" bg-black"
        />
      </Link>
      <h1 className="text-3xl font-bold mb-6 w-full flex-1 text-center">
        Insérer une auto
      </h1>
    </div>
  );
}

export default MyLogo;

function Logo() {
  return (
    <Link href="/" className=" absolute top-1 left-1">
      <Image
        alt=""
        width={100}
        height={100}
        src="/logo.png"
        className="bg-black "
      />
    </Link>
  );
}

export { Logo };
