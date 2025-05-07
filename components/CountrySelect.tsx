// src/components/CountrySelect.tsx
"use client";

import { getNameList } from "country-list";
import { UseFormRegister } from "react-hook-form";

interface CountrySelectProps {
  id: string;
  register: UseFormRegister<any>;
  error?: string;
  label?: string;
  required?: boolean;
  className?: string;
}

export const CountrySelect = ({
  id,
  register,
  error,
  label,
  required = false,
  className = "",
}: CountrySelectProps) => {
  const countries = Object.keys(getNameList());

  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label}
          {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <select
        id={id}
        {...register(id)}
        className={`w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
          error ? "border-red-500" : "border-gray-300"
        }`}
      >
        <option value="">Choisir un pays</option>
        {countries.map((country) => (
          <option key={country} value={country}>
            {country}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};
