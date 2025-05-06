"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function ParentAddAuto({
  children,
}: {
  children: React.ReactNode;
}) {
  const [state, setState] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!localStorage.getItem("mon-auto-token")) {
      router.push("/seller-signup");
    } else {
      setState(true);
    }
  }, []);

  return <>{state && children}</>;
}
