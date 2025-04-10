// components/car-card.tsx

import type { Car } from "@/types/types";
import Image from "next/image";

export function CarCard({ car }: { car: Car }) {
  return (
    <div className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="relative h-48">
        <Image
          src={car.images[0]}
          alt={`${car.year} ${car.make} ${car.model}`}
          fill
          className="object-cover"
        />
        {car.featured && (
          <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 text-xs font-bold rounded">
            Featured
          </div>
        )}
      </div>
      <div className="p-4">
        <h2 className="text-xl font-bold">
          {car.year} {car.make} {car.model}
        </h2>
        <div className="flex justify-between items-center mt-2">
          <span className="text-lg font-semibold">
            ${car.price.toLocaleString()}
          </span>
          <span className="text-gray-600">
            {car.mileage.toLocaleString()} km
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2 mt-4 text-sm text-gray-600">
          <div>
            <span className="font-medium">Transmission:</span>{" "}
            {car.transmission}
          </div>
          <div>
            <span className="font-medium">Drivetrain:</span> {car.drivetrain}
          </div>
          <div>
            <span className="font-medium">Fuel Type:</span> {car.fuelType}
          </div>
          <div>
            <span className="font-medium">Color:</span> {car.exteriorColor}
          </div>
        </div>
        <button className="mt-4 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors">
          View Details
        </button>
      </div>
    </div>
  );
}
