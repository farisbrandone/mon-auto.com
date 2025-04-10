// src/components/ui/advanced-country-select.tsx
"use client";

import { Control, Controller, FieldValues, Path } from "react-hook-form";
import Select from "react-select";
import { getNameList } from "country-list";

interface CountrySelectProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  placeholder?: string;
  className?: string;
}

const countries = Object.keys(getNameList).map((country) => ({
  value: country,
  label: country,
}));

export function AdvancedCountrySelect<T extends FieldValues>({
  control,
  name,
  label,
  placeholder = "Select country",
  className,
}: CountrySelectProps<T>) {
  return (
    <div className={className}>
      {label && (
        <label htmlFor={name} className="block text-sm font-medium mb-1">
          {label}
        </label>
      )}
      <Controller
        control={control}
        name={name}
        render={({ field, fieldState }) => (
          <>
            <Select
              options={countries}
              placeholder={placeholder}
              className="react-select-container"
              classNamePrefix="react-select"
              onChange={(selected) => field.onChange(selected?.value)}
              value={countries.find((c) => c.value === field.value)}
              isClearable
            />
            {fieldState.error && (
              <p className="mt-1 text-sm text-red-600">
                {fieldState.error.message}
              </p>
            )}
          </>
        )}
      />
    </div>
  );
}
