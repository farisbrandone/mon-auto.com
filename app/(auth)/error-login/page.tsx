import MyLogo from "@/components/MyLogo";
import { Input } from "@/components/ui/input";

import { Label } from "@radix-ui/react-label";
import Link from "next/link";
export default function ErrorPage({
  searchParams,
}: {
  searchParams: { [key: string]: string };
}) {
  const emailError = searchParams.email;
  const passwordError = searchParams.password;
  const emailErr = searchParams.emailErrorMessage;
  const passwordErr = searchParams.passwordErrorMessage;
  return (
    <div className="bg-white flex sm:grid sm:grid-cols-2 justify-center gap-1 w-screen h-screen text-[#636364] p-2 text-[16px] ">
      <MyLogo />

      <form
        action="/api"
        method="POST"
        //onSubmit={handleSubmit}
        className="flex flex-col items-center w-full justify-center"
      >
        {emailErr && (
          <p className="text-red-700 w-full text-center ">
            Erreur sur email: {emailErr}
          </p>
        )}
        {passwordErr && (
          <p className="text-red-700 w-full text-center ">
            Erreur sur mot de passe: {passwordErr}
          </p>
        )}
        <div className="flex flex-col items-center w-full ">
          <div className="flex flex-col gap-0.5 mb-[20px]">
            <p className="font-medium text-[34px] w-full text-center ">
              Bon retour parmi nous
            </p>
            <p className="text-[14px] font-normal ">
              Remplis les champs ci-dessous et connecte toi
            </p>
          </div>
          <div className="flex flex-col items-center gap-5 mb-2 w-full lg:w-[500px] ">
            <div className="flex flex-col w-full items-center gap-0.5">
              <Label htmlFor="email" className="text-start w-full">
                Email
              </Label>
              <Input
                type="text"
                defaultValue={emailError ? emailError : ""}
                //value={email}
                name="email"
                //onChange={handleEmail}
                className="w-full"
              />
            </div>
            <div className="flex flex-col w-full items-center gap-0.5">
              <Label htmlFor="password" className="text-start w-full">
                Mot de passe
              </Label>
              <Input
                type="password"
                defaultValue={passwordError ? passwordError : ""}
                //value={password}
                name="password"
                //onChange={handlePassword}
                className="w-full"
                required
              />
            </div>
            <div className="flex items-center justify-between w-full mt-2">
              <div className="w-full">
                <input title="Se souvenir" type="checkbox" />
                <label htmlFor="boxremember" className="ml-0.5">
                  Se souvenir de moi
                </label>
              </div>

              <Link href="#" className="w-full text-end underline">
                {" "}
                Mot de passe oublié
              </Link>
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-[#ea454c] cursor-pointer text-center py-2 rounded-[12px] text-white text-[16px] sm:w-[300px] mt-10 "
          >
            Se connecter
          </button>
          <div className="flex items-center gap-1 mt-1">
            <p>Vous n'avez pas de compte ? </p>
            <Link href="#" className="text-[#ea454c] underline  ">
              Inscrivez vous ici
            </Link>{" "}
          </div>
        </div>
      </form>
      <img
        src="/auth-image.jpg"
        alt=""
        className=" w-full h-full hidden sm:flex object-cover"
      />
    </div>
  );
}
