import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { RegisterFormData } from "@/lib/validations/seller";
import Link from "next/link";

export interface userSchema {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  telephoneWhatsapp: string;
}

export const ColumnHeader: ColumnDef<userSchema>[] = [
  {
    accessorKey: "nom",
    header: () => <div className="text-left">Nom</div>,
    cell: ({ row }) => <div className="text-left"> {row.original.nom} </div>,
  },

  {
    accessorKey: "email",
    header: () => <div className="text-left">Email</div>,
    cell: ({ row }) => <div className="text-left"> {row.original.email} </div>,
  },
  {
    accessorKey: "telephone",
    header: () => <div className="text-left">Telephone</div>,
    cell: ({ row }) => (
      <div className="text-left">{row.original.telephone}</div>
    ),
  },

  {
    accessorKey: "telephoneWhatsapp",
    header: () => <div className="text-left">Telephone whatsapp</div>,
    cell: ({ row }) => (
      <div className="text-left">{row.original.telephoneWhatsapp}</div>
    ),
  },

  {
    id: "actions",
    header: () => <div className="text-left">Détail</div>,
    cell: ({ row }) => {
      console.log({ id: row.original.id });
      return (
        <div>
          <Link href={`/backoffice-user-dashboard/${row.original.id}`}>
            {" "}
            Voir ces autos{" "}
          </Link>
        </div>
      );
    },
  },
];
