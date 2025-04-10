"use client";

// app/cars/page.tsx
import { CarCard } from "@/components/car-card";
import { Pagination } from "@/components/pagination";
import { SearchFilters } from "@/components/search-filters";
import { z } from "zod";

// Zod schema for car data validation
const CarSchema = z.object({
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
  images: z.array(z.string() /* .url() */).min(1),
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

// Zod schema for search filters
const SearchFiltersSchema = z.object({
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

type Car = z.infer<typeof CarSchema>;
type SearchFilters = z.infer<typeof SearchFiltersSchema>;

async function getCars(
  filters: SearchFilters
): Promise<{ cars: Car[]; totalCount: number }> {
  // In a real app, this would fetch from your API
  // Here we'll simulate with mock data
  const mockCars: Car[] = [
    {
      id: "1",
      make: "Toyota",
      model: "Camry",
      year: 2022,
      price: 28990,
      mileage: 15000,
      transmission: "Automatic",
      fuelType: "Gasoline",
      exteriorColor: "Silver",
      images: ["/auth-image.jpg", "/toyota2.jpeg"],
      bodyStyle: "Sedan",
      drivetrain: "FWD",
      featured: true,
    },
    // More mock cars...
  ];

  // Validate each car with Zod
  const validatedCars = mockCars.map((car) => CarSchema.parse(car));

  return {
    cars: validatedCars,
    totalCount: 100, // Mock total count
  };
}

export default async function CarsPage({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  // Parse and validate search params
  const filters = SearchFiltersSchema.parse({
    make: searchParams.make,
    model: searchParams.model,
    minPrice: searchParams.minPrice ? Number(searchParams.minPrice) : undefined,
    maxPrice: searchParams.maxPrice ? Number(searchParams.maxPrice) : undefined,
    minYear: searchParams.minYear ? Number(searchParams.minYear) : undefined,
    maxYear: searchParams.maxYear ? Number(searchParams.maxYear) : undefined,
    bodyStyle: searchParams.bodyStyle,
    transmission: searchParams.transmission,
    drivetrain: searchParams.drivetrain,
    fuelType: searchParams.fuelType,
    searchQuery: searchParams.search,
    page: searchParams.page ? Number(searchParams.page) : 1,
    sortBy: searchParams.sortBy as any,
  });

  const { cars, totalCount } = await getCars(filters);
  const totalPages = Math.ceil(totalCount / 10); // Assuming 10 items per page

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Used Cars for Sale in Calgary</h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters sidebar */}
        <div className="lg:col-span-1">
          <SearchFilters currentFilters={filters} />
        </div>

        {/* Main content */}
        <div className="lg:col-span-3">
          {/* Sorting options */}
          <div className="flex justify-between items-center mb-6">
            <div>
              <span className="text-gray-600">{totalCount} vehicles found</span>
            </div>
            <div>
              <select
                title="select"
                defaultValue={filters.sortBy}
                className="border rounded p-2"
                onChange={(e) => {
                  // Handle sort change (would update URL in real app)
                }}
              >
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="year-desc">Year: Newest First</option>
                <option value="mileage-asc">Mileage: Low to High</option>
              </select>
            </div>
          </div>

          {/* Car listings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {cars.map((car) => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8">
              <Pagination currentPage={filters.page} totalPages={totalPages} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
