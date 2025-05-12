import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";

export interface autoState {
  id: String;
  code: string;
  carteGriseUrl: string;
  pvControleTechniqueUrl: string;
  prix: string;
  devise: string;
  marques: string;
  typesCarrosserie: string;
  anneeDeFabrication: string;
  categorie: string;
  typeCarburant: string;
  typeMoteur: string;
  dateOfCreated: string;
  dateOfModified: string;
  kilometrage: string;
  kilometrageUnit: string;
  typeTransmission: string;
  lastMaintenanceDate: string;
  typeDeTrainConducteur: string;
  nbreDePlace: 0;
  nbreDePorte: 0;
  statusOfAuto: string;
  villeDuBien: string;
  acceptsTerms: false;
  immatriculation: string;
  model: string;
  couleurExt: string;
  couleurInt: string;
  imagesAuto: string;
  seller: string;
}

export const ColumnAutoHeader: ColumnDef<autoState>[] = [
  {
    accessorKey: "marques",
    header: () => <div className="text-left">Marque</div>,
    cell: ({ row }) => (
      <div className="text-left"> {row.original.marques} </div>
    ),
  },

  {
    accessorKey: "model",
    header: () => <div className="text-left">Model</div>,
    cell: ({ row }) => <div className="text-left"> {row.original.model} </div>,
  },
  {
    accessorKey: "prix",
    header: () => <div className="text-left">Prix</div>,
    cell: ({ row }) => (
      <div className="text-left">
        {row.original.devise} {row.original.prix}
      </div>
    ),
  },

  {
    accessorKey: "villeDuBien",
    header: () => <div className="text-left">Ville</div>,
    cell: ({ row }) => (
      <div className="text-left">{row.original.villeDuBien}</div>
    ),
  },
  {
    accessorKey: "dateOfCreated",
    header: () => <div className="text-left">Crée le</div>,
    cell: ({ row }) => (
      <div className="text-left">{row.original.dateOfCreated}</div>
    ),
  },

  {
    accessorKey: "dateOfModified",
    header: () => <div className="text-left">Modifié le</div>,
    cell: ({ row }) => (
      <div className="text-left">{row.original.dateOfModified}</div>
    ),
  },

  {
    id: "actions",
    header: () => <div className="text-left">Détail</div>,
    cell: ({ row }) => {
      console.log({ id: row.original.id });
      return (
        <div>
          {/* http://localhost:8090/autos/1 
          
            imagesAuto: { href: 'http://localhost:8090/autos/1/imagesAuto' },
    seller: { href: 'http://localhost:8090/autos/1/seller' }
          
          */}
          <Link href={`/backoffice-user-dashboard/${row.original.id}`}>
            {" "}
            Voir les détails{" "}
          </Link>
        </div>
      );
    },
  },
];
