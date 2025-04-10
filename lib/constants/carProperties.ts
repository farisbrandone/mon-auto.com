// app/lib/constants/carProperties.ts
export const MARQUES = [
  "Peugeot",
  "Renault",
  "Citroën",
  "Volkswagen",
  "BMW",
  "Mercedes",
  "Audi",
  "Toyota",
  "Ford",
  "Chevrolet",
  "Hyundai",
  "Kia",
  "Mitsubishi",
  "Nissan",
  "Autre",
  // Ajoutez d'autres marques...
] as const;

export const TYPES_CARROSSERIE = [
  "Berline",
  "SUV",
  "Break",
  "Monospace",
  "Coupé",
  "Cabriolet",
  // Ajoutez d'autres types...
] as const;

export const FUEL_TYPES = [
  "Essence",
  "Diesel",
  "Hybride",
  "Electrique",
  "GPL",
  // Ajoutez d'autres carburants...
] as const;

export const TRANSMISSION_TYPES = [
  "Manuelle",
  "Automatique",
  "Semi_automatique",
  // Ajoutez d'autres transmissions...
] as const;

export const TYPE_TRAIN_CONDUCTEUR = [
  "Traction avant (FWD)",
  "Propulsion arrière (RWD)",
  "Transmission intégrale permanante (HWD)",
  "Tranmission integrale enclanchable (4WD)",
] as const;

export const TYPES_MOTEUR = ["CYLINDRE4", "CYLINDRE6", "ELECTRIQUE"] as const;

export const CURRENCIES = ["FCFA", "USD", "EUR", "CAD"] as const;
export const MILEAGE_UNITS = ["km", "miles"] as const;
