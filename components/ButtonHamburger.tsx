"use client";

import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Hamburger } from "./icon/Hamburger";
import { useRouter } from "next/navigation";

export function DropdownMenuDemo() {
  const router = useRouter();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="lg:hidden">
        <Button variant="outline">
          {" "}
          <Hamburger />{" "}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="p-2 font-[900] text-[16px] mr-6 ">
        <DropdownMenuItem onClick={() => router.push("/add-auto")}>
          <Plus />
          Ajouter une auto
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
