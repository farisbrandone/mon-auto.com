import { Metadata } from "next";
import React, { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Se connecter à MonAuto.com",
  description:
    "Connexion au site de référence pour l'achat et la vente de véhicules neuf et d'occasion",
};

const AuthLayout = ({ children }: { children: ReactNode }) => {
  return <div>{children}</div>;
};

export default AuthLayout;
