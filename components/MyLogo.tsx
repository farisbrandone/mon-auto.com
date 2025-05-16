import Image from "next/image";
import Link from "next/link";
import React from "react";

function MyLogo() {
  return (
    <div className="fixed top-0 left-0 p-2 flex items-center w-full border-b-gray-300 border-solid border shadow-2xs bg-white z-100000000000 font-playfair ">
      <Link href="/">
        <Image
          alt=""
          width={100}
          height={100}
          src="/logo.png"
          className=" bg-black w-[50px] h-[50px] sm:w-[70px] sm:h-[70px] "
        />
      </Link>
      <h1 className="text-18px sm:text-2xl font-bold  w-full flex-1 text-center place-items-center h-full">
        Ajoute une auto
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
        className="bg-black w-[70px] h-[70px] "
      />
    </Link>
  );
}

function Logo2() {
  return (
    <div className="sm:w-full">
      <Link href="/" className="">
        <Image
          alt=""
          width={100}
          height={100}
          src="/logo.png"
          className="bg-black w-[70px] h-[70px] "
        />
      </Link>
    </div>
  );
}

export { Logo, Logo2 };
