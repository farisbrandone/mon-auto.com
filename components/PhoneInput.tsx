// src/components/ui/phone-input.tsx
"use client";

import { FieldValues, Path } from "react-hook-form";
import { getNameList, getCode } from "country-list";

import { Input } from "@/components/ui/input";
import { Country } from "country-telephone-data";
import * as countryTelData from "country-telephone-data";

interface PhoneInputProps<T extends FieldValues> {
  name: Path<T>;
  label?: string;
  className?: string;
  error?: string;
  register: (value: any) => any;
}

const countries = Object.keys(getNameList());

export function PhoneInput<T extends FieldValues>({
  name,
  label,
  className,
  error,
  register,
}: PhoneInputProps<T>) {
  return (
    <div className={className}>
      <div className="flex gap-2">
        <div className="flex flex-col">
          <label
            htmlFor={`${name}.countryCode`}
            className="block text-sm font-medium mb-1"
          >
            Phone code
          </label>

          <select
            id={`${name}.countryCode`}
            title="Select country code"
            {...register(`${name}.countryCode`)}
            className="max-w-[150px]"
          >
            {countries.map((country, index) => {
              const code = getCode(country);
              if (index === 1) {
                console.log(code, countryTelData.allCountries[0].iso2);
              }

              const cam = countryTelData.allCountries.find(
                (c: Country) => c.iso2 === code?.toLowerCase()
              );

              const codes = cam && cam.dialCode;

              return (
                <option key={country} value={`+${codes}`}>
                  {country} (+{codes})
                </option>
              );
            })}
          </select>
        </div>
        <div className="flex flex-col">
          {label && (
            <label
              htmlFor={`${name}.number`}
              className="block text-sm font-medium mb-1"
            >
              {label}
            </label>
          )}

          <Input
            id={`${name}.number`}
            {...register(`${name}.number`)}
            placeholder="Phone number"
          />
        </div>
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}
