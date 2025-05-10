// app/lib/validations/seller.ts
import { z } from "zod";
import {
  MARQUES,
  TYPES_CARROSSERIE,
  FUEL_TYPES,
  TRANSMISSION_TYPES,
  TYPE_TRAIN_CONDUCTEUR,
  TYPES_MOTEUR,
  CURRENCIES,
} from "../constants/carProperties";
import { getNameList } from "country-list";

export interface autoState {
  id: string;
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

const countries = Object.keys(getNameList());
export const UserType = z.enum(["PARTICULIER", "ENTREPRISE"]);
export const typeDoc = z.enum(["PASSPORT", "CNI"]);
export const UserStatus = z.enum(["ACTIVATE", "DESACTIVATE"]);

export const SellerSchema = z.object({
  marques: z.string(z.enum(MARQUES)).min(1, "Sélectionnez au moins une marque"),
  model: z.string().min(1, "Doit contenir au moins un caractères"),

  villeDuBien: z
    .string()
    .min(1, "Doit contenir au moins un caractères")
    .optional(),
  typesCarrosserie: z
    .string(z.enum(TYPES_CARROSSERIE))
    .min(1, "Sélectionnez au moins un type")
    .optional(),
  couleurExt: z
    .string()
    .min(1, "Doit contenir au moins un caractères")
    .optional(),
  couleurInt: z
    .string()
    .min(1, "Doit contenir au moins un caractères")
    .optional(),
  typeCarburant: z
    .string(z.enum(FUEL_TYPES))
    .min(1, "Sélectionnez au moins un type de carburant"),
  typeTransmission: z
    .string(z.enum(TRANSMISSION_TYPES))
    .min(1, "Sélectionnez au moins un type de transmission"),
  typeDeTrainConducteur: z
    .string(z.enum(TYPE_TRAIN_CONDUCTEUR))
    .min(1, "Sélectionnez au moins un type de transmission")
    .optional(),
  typeMoteur: z
    .string(z.enum(TYPES_MOTEUR))
    .min(1, "Sélectionnez au moins un type de transmission"),
  acceptsTerms: z.literal(true, {
    errorMap: () => ({
      message: "Vous devez accepter les conditions générales",
    }),
  }),
  statusOfAuto: z
    .string()
    .min(8, "Le status doit contenir au moins 8 caractères")
    .max(11, "Le status doit contenir au plus 11 caractères")
    .default("ACTIVATE"),
  immatriculation: z
    .string()
    .min(2, "Le numéro d'immatriculation doit contenir au moins 2 caractères")
    .optional(),
  prix: z
    .number()
    .min(0, "Le prix ne doit pas etre un nombre et doit etre supérieur à zero"),
  conso100kmVille: z
    .number()
    .min(0, "Le prix ne doit pas etre un nombre et doit etre supérieur à zero")
    .optional(),
  conso100kmAutoRoute: z
    .number()
    .min(0, "Le prix ne doit pas etre un nombre et doit etre supérieur à zero")
    .optional(),
  tailleDuMoteur: z
    .number()
    .min(0, "Le prix ne doit pas etre un nombre et doit etre supérieur à zero")
    .optional(),

  devise: z.enum(CURRENCIES),
  anneeDeFabrication: z
    .date()
    .max(
      new Date(),
      "La date de fabrication doit etre inférieur à la date actuelle"
    )
    .optional(),
  kilometrage: z
    .number()
    .min(0, "Le kilométrage doit etre supérieur à zero et doit etre un nombre"),
  kilometrageUnit: z.enum(["km", "miles"]).default("km"),
  nbreDePlace: z
    .number()
    .min(
      2,
      "Le nombre de place doit etre au moins deux et doit etre un nombre"
    ),

  nbreDePorte: z
    .number()
    .min(2, "Le nombre de portes doit etre au moins 2 et doit etre un nombre")
    .max(8, "Le nombre de portes doit etre au plus 8 et doit etre un nombre"),

  carteGrise: z
    .instanceof(File)
    .refine(
      (file) => file.size <= 10 * 1024 * 1024,
      "Le fichier doit faire moins de 10MB"
    )
    .optional(),

  pvControleTechnique: z
    .instanceof(File)
    .refine(
      (file) => file.size <= 10 * 1024 * 1024,
      "Le fichier doit faire moins de 10MB"
    )
    .optional(),

  imagesAuto: z
    .array(z.instanceof(File))
    .refine(
      (files) => files.every((file) => file.size <= 5 * 1024 * 1024),
      "Chaque fichier doit faire moins de 5MB"
    )
    .refine(
      (files) =>
        files.every((file) =>
          ["image/jpeg", "image/png", "image/webp"].includes(file.type)
        ),
      "Seuls les formats .jpg, .png et .webp sont acceptés"
    ),

  dateOfCreated: z
    .date()
    .min(new Date(1900, 0, 1), { message: "La date doit être après 1900" })
    .max(new Date(), { message: "La date ne peut pas être dans le futur" })
    .optional(),
  dateOfModified: z
    .date()
    .min(new Date(1900, 0, 1), { message: "La date doit être après 1900" })
    .max(new Date(), { message: "La date ne peut pas être dans le futur" })
    .optional(),
  lastMaintenanceDate: z
    .date()
    .min(new Date(1900, 0, 1), { message: "La date doit être après 1900" })
    .max(new Date(), { message: "La date ne peut pas être dans le futur" }),
});

export type SellerFormData = z.infer<typeof SellerSchema>;

export const LoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export type LoginFormData = z.infer<typeof LoginSchema>;

export const RegisterSchema = z
  .object({
    nom: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
    prenom: z.string().min(2, "Le prénom doit contenir au moins 2 caractères"),
    email: z.string().email("Email invalide"),
    typeSellerIdentificationDoc: typeDoc,
    identificationDocumentFile: z
      .instanceof(File)
      .refine(
        (file) => file.size <= 5 * 1024 * 1024,
        "Le fichier doit faire moins de 5MB"
      ),
      /* .refine(
        (file) => file.type === "application/pdf",
        "Seuls les fichiers PDF sont acceptés"
      ), */
    description: z
      .string()
      .min(10, "La description doit contenir au moins 10 caractères"),
    typeSeller: UserType,
    adresse: z.string().min(5, "L'adresse doit contenir au moins 5 caractères"),
    roleSeller: z.array(z.string()).default(["USER"]),
    activeState: z.boolean().default(false),
    phone: z.object({
      countryCode: z.string().min(1, "Country code is required"),
      number: z
        .string()
        .regex(/^\+?[0-9\s-]{10,}$/, "Numéro de téléphone invalide")
        .min(5, "Phone number is required"),
    }),
    phoneWhatsapp: z.object({
      countryCode: z.string().min(1, "Country code is required"),
      number: z
        .string()
        .regex(/^\+?[0-9\s-]{10,}$/, "Numéro de téléphone invalide")
        .min(5, "Phone number is required"),
    }),
    ville: z
      .string()
      .min(3, "La ville doit contenir au moins 2 caractères")
      .optional(),
    country: z
      .string()
      .refine(
        (value) => countries.includes(value),
        "Please select a valid country"
      ),
    password: z
      .string()
      .min(8, "Le mot de passe doit contenir au moins 8 caractères")
      .regex(/[a-z]/, "Le mot de passe doit contenir au moins une minuscule")
      .regex(/[A-Z]/, "Le mot de passe doit contenir au moins une majuscule")
      .regex(/[0-9]/, "Le mot de passe doit contenir au moins un chiffre"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"], // Associe l'erreur au champ confirmPassword
  });

export type RegisterFormData = z.infer<typeof RegisterSchema>;

export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[a-z]/, "Le mot de passe doit contenir au moins une minuscule")
      .regex(/[A-Z]/, "Le mot de passe doit contenir au moins une majuscule")
      .regex(/[0-9]/, "Le mot de passe doit contenir au moins un chiffre"),
    confirmPassword: z.string(),
    token: z.string().min(1, "Token is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

export const contactSchema = z.object({
  nom: z.string().min(3, "Le nom est requis et doit avoir au moins 3 lettres"),
  email: z.string().email("Entrer un email valide"),
  prenom: z.string().optional(),
  telephone: z.string().optional(),
  message: z.string().optional(),
});

export type contactForm = z.infer<typeof contactSchema>;

export const searchSchema = z
  .object({
    marques: z.string(z.enum(MARQUES)).optional(),
    typesCarrosserie: z.string(z.enum(TYPES_CARROSSERIE)).optional(),
    selectedColor: z.string().optional(),
    typeCarburant: z.string(z.enum(FUEL_TYPES)).optional(),
    typeMoteur: z.string(z.enum(TYPES_MOTEUR)).optional(),
    typeTransmission: z.string(z.enum(TRANSMISSION_TYPES)).optional(),
    PrixMin: z.preprocess((val) => {
      const num = Number(val);
      return isNaN(num) ? null : num;
    }, z.number().nullable().optional()),
    PrixMax: z.preprocess((val) => {
      const num = Number(val);
      return isNaN(num) ? null : num;
    }, z.number().nullable().optional()),
    anneeMin: z.preprocess((val) => {
      const num = Number(val);
      return isNaN(num) ? null : num;
    }, z.number().nullable().optional()),
    anneeMax: z.preprocess((val) => {
      const num = Number(val);
      return isNaN(num) ? null : num;
    }, z.number().nullable().optional()),
    kilometrageMin: z.preprocess((val) => {
      // Handle empty string or invalid numbers
      const num = Number(val);
      return isNaN(num) ? null : num;
    }, z.number().nullable().optional()),
    kilometrageMax: z.preprocess((val) => {
      const num = Number(val);
      return isNaN(num) ? null : num;
    }, z.number().nullable().optional()),
    keyword: z.string().optional(),
    villeDuBien: z.string().optional(),
  })
  .refine(
    (data) => {
      if (!!data.PrixMax && !!data.PrixMin) {
        return data.PrixMax > data.PrixMin;
      } else return true;
    },
    {
      message: "Prix max doit etre superieur au prix mini",
      path: ["PrixMax"],
    }
  )
  .refine(
    (data) => {
      if (!!data.kilometrageMax && !!data.kilometrageMin) {
        return data.kilometrageMax > data.kilometrageMin;
      } else return true;
    },
    {
      message: "Kilometrage max doit etre superieur au kilometrage min",
      path: ["kilometrageMax"],
    }
  )
  .refine(
    (data) => {
      if (!!data.anneeMax && !!data.anneeMin) {
        return data.anneeMax > data.anneeMin;
      } else return true;
    },
    {
      message: "L'année max doit etre superieur à l'année mini",
      path: ["anneeMax"],
    }
  );

export type searchForm = z.infer<typeof searchSchema>;

export const RegisterUpdateSchema = z.object({
  nom: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  prenom: z.string().min(2, "Le prénom doit contenir au moins 2 caractères"),
  email: z.string().email("Email invalide"),
  typeSellerIdentificationDoc: typeDoc,
  identificationDocumentFile: z
    .string()
    .min(1, "Le prénom doit contenir au moins 2 caractères"),
  description: z
    .string()
    .min(10, "La description doit contenir au moins 10 caractères"),
  typeSeller: UserType,
  adresse: z.string().min(5, "L'adresse doit contenir au moins 5 caractères"),
  activeState: z.boolean().default(false),
  phone: z.object({
    countryCode: z.string().min(1, "Country code is required"),
    number: z
      .string()
      .regex(/^\+?[0-9\s-]{10,}$/, "Numéro de téléphone invalide")
      .min(5, "Phone number is required"),
  }),
  phoneWhatsapp: z.object({
    countryCode: z.string().min(1, "Country code is required"),
    number: z
      .string()
      .regex(/^\+?[0-9\s-]{10,}$/, "Numéro de téléphone invalide")
      .min(5, "Phone number is required"),
  }),
  ville: z
    .string()
    .min(3, "La ville doit contenir au moins 2 caractères")
    .optional(),
  country: z
    .string()
    .refine(
      (value) => countries.includes(value),
      "Please select a valid country"
    ),
});

export type RegisterUpdateFormData = z.infer<typeof RegisterUpdateSchema>;

export const SellerUpdateSchema = z.object({
  marques: z.string(z.enum(MARQUES)).min(1, "Sélectionnez au moins une marque"),
  model: z.string().min(1, "Doit contenir au moins un caractères"),

  villeDuBien: z
    .string()
    .min(1, "Doit contenir au moins un caractères")
    .optional(),
  typesCarrosserie: z
    .string(z.enum(TYPES_CARROSSERIE))
    .min(1, "Sélectionnez au moins un type")
    .optional(),
  couleurExt: z
    .string()
    .min(1, "Doit contenir au moins un caractères")
    .optional(),
  couleurInt: z
    .string()
    .min(1, "Doit contenir au moins un caractères")
    .optional(),
  typeCarburant: z
    .string(z.enum(FUEL_TYPES))
    .min(1, "Sélectionnez au moins un type de carburant"),
  typeTransmission: z
    .string(z.enum(TRANSMISSION_TYPES))
    .min(1, "Sélectionnez au moins un type de transmission"),
  typeDeTrainConducteur: z
    .string(z.enum(TYPE_TRAIN_CONDUCTEUR))
    .min(1, "Sélectionnez au moins un type de transmission")
    .optional(),
  typeMoteur: z
    .string(z.enum(TYPES_MOTEUR))
    .min(1, "Sélectionnez au moins un type de transmission"),
  acceptsTerms: z.literal(true, {
    errorMap: () => ({
      message: "Vous devez accepter les conditions générales",
    }),
  }),
  statusOfAuto: z
    .string()
    .min(8, "Le status doit contenir au moins 8 caractères")
    .max(11, "Le status doit contenir au plus 11 caractères")
    .default("ACTIVATE"),
  immatriculation: z
    .string()
    .min(2, "Le numéro d'immatriculation doit contenir au moins 2 caractères")
    .optional(),
  prix: z
    .number()
    .min(0, "Le prix ne doit pas etre un nombre et doit etre supérieur à zero"),
  conso100kmVille: z
    .number()
    .min(0, "Le prix ne doit pas etre un nombre et doit etre supérieur à zero")
    .optional(),
  conso100kmAutoRoute: z
    .number()
    .min(0, "Le prix ne doit pas etre un nombre et doit etre supérieur à zero")
    .optional(),
  tailleDuMoteur: z
    .number()
    .min(0, "Le prix ne doit pas etre un nombre et doit etre supérieur à zero")
    .optional(),

  devise: z.enum(CURRENCIES),
  anneeDeFabrication: z
    .date()
    .max(
      new Date(),
      "La date de fabrication doit etre inférieur à la date actuelle"
    )
    .optional(),
  kilometrage: z
    .number()
    .min(0, "Le kilométrage doit etre supérieur à zero et doit etre un nombre"),
  kilometrageUnit: z.enum(["km", "miles"]).default("km"),
  nbreDePlace: z
    .number()
    .min(
      2,
      "Le nombre de place doit etre au moins deux et doit etre un nombre"
    ),

  nbreDePorte: z
    .number()
    .min(2, "Le nombre de portes doit etre au moins 2 et doit etre un nombre")
    .max(8, "Le nombre de portes doit etre au plus 8 et doit etre un nombre"),

  carteGrise: z.string().min(1, "doit avoir au moins 1 caractère"),

  pvControleTechnique: z.string().min(1, "doit avoir au moins 1 caractère"),

  //imagesAuto: z.array(z.string().min(1, "doit avoir au moins 1 caractère")),
  imagesAuto: z.array(
    z.object({
      id: z.string().min(1, "doit avoir au moins 1 caractère"), // or z.number()
      url: z.string().min(1, "doit avoir au moins 1 caractère"), // direct URL validation
    })
  ),
  dateOfCreated: z
    .date()
    .min(new Date(1900, 0, 1), { message: "La date doit être après 1900" })
    .max(new Date(), { message: "La date ne peut pas être dans le futur" })
    .optional(),
  dateOfModified: z
    .date()
    .min(new Date(1900, 0, 1), { message: "La date doit être après 1900" })
    .max(new Date(), { message: "La date ne peut pas être dans le futur" })
    .optional(),
  lastMaintenanceDate: z
    .date()
    .min(new Date(1900, 0, 1), { message: "La date doit être après 1900" })
    .max(new Date(), { message: "La date ne peut pas être dans le futur" }),
});

export type SellerUpdateFormData = z.infer<typeof SellerUpdateSchema>;
