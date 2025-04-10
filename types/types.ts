// types.ts
import { z } from "zod";

export const CarSchema = z.object({
  id: z.string(),
  make: z.string(),
  model: z.string(),
  year: z
    .number()
    .min(1900)
    .max(new Date().getFullYear() + 1),
  price: z.number().min(0),
  mileage: z.number().min(0),
  transmission: z.enum(["Automatic", "Manual", "CVT", "Other"]),
  fuelType: z.enum(["Gasoline", "Diesel", "Electric", "Hybrid", "Other"]),
  exteriorColor: z.string(),
  images: z.array(z.string().url()).min(1),
  featured: z.boolean().optional(),
  vin: z.string().optional(),
  stockNumber: z.string().optional(),
  bodyStyle: z.enum([
    "Sedan",
    "SUV",
    "Truck",
    "Coupe",
    "Convertible",
    "Van",
    "Hatchback",
    "Other",
  ]),
  drivetrain: z.enum(["FWD", "RWD", "AWD", "4WD"]),
  engine: z.string().optional(),
  description: z.string().optional(),
});

export const SearchFiltersSchema = z.object({
  make: z.string().optional(),
  model: z.string().optional(),
  minPrice: z.number().min(0).optional(),
  maxPrice: z.number().min(0).optional(),
  minYear: z.number().min(1900).max(new Date().getFullYear()).optional(),
  maxYear: z.number().min(1900).max(new Date().getFullYear()).optional(),
  bodyStyle: z.string().optional(),
  transmission: z.string().optional(),
  drivetrain: z.string().optional(),
  fuelType: z.string().optional(),
  searchQuery: z.string().optional(),
  page: z.number().min(1).optional().default(1),
  sortBy: z
    .enum(["price-asc", "price-desc", "year-desc", "mileage-asc"])
    .optional(),
});

export type Car = z.infer<typeof CarSchema>;
export type SearchFilters = z.infer<typeof SearchFiltersSchema>;
