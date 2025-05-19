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
      <DropdownMenuContent className="p font-[900] text-[16px] mr-6 z-10000000000">
        <DropdownMenuItem onClick={() => router.push("/add-auto")}>
          <Plus />
          Ajoute une auto
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
