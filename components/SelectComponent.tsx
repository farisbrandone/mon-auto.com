import * as React from "react";
import AsyncSelect from "react-select/async";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  COULEURS,
  COULEURS2,
  searchValue,
} from "@/lib/constants/carProperties";
import clsx from "clsx";
import { FieldErrors, UseFormRegister } from "react-hook-form";
import { searchSchema } from "@/lib/validations/seller";
import { z } from "zod";

export function SelectComponent({
  variable,
  placeholder,
  myValue,
  register,
  fieldForm,
  errors,
}: {
  variable: (string | number)[];
  placeholder: string;
  myValue?: any;
  register: UseFormRegister<z.infer<typeof searchSchema>>;
  fieldForm: searchValue;
  errors?: FieldErrors<z.infer<typeof searchSchema>>;
}) {
  const numberState = fieldForm === "anneeMin" || fieldForm === "anneeMax";
  return (
    <>
      <select
        /*  value={value} */
        /*  onValueChange={handleValue} */ /* onChange={handleValue} */
        className={clsx(
          "w-full rounded-[2px] h-[36px] text-[14px]  border-[1px] border-solid border-[#3333334d] "
          /*  { "lg:max-w-[300px] ": fieldForm === "villeDuBien" } */
        )}
        {...register(fieldForm, {
          valueAsNumber: numberState,
        })}
      >
        {/* <SelectTrigger className="w-full rounded-[2px]  border-[1px] border-solid border-[#3333334d] ">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger> */}
        {/*  <SelectContent className=""> */}
        <option value="" disabled selected>
          {placeholder}
        </option>
        {variable.sort().map((value, index) => {
          return (
            <option key={index} value={value}>
              {" "}
              {value === "CYLINDRE4"
                ? "4 Cylindres"
                : value === "CYLINDRE6"
                ? "6 Cylindres"
                : value === "ELECTRIQUE"
                ? "Électrique"
                : value === "Electrique"
                ? "Électrique"
                : value}{" "}
            </option>
          );
        })}
        {/* </SelectContent> */}
      </select>
      {errors && errors.anneeMin && (
        <p className="mt-1 text-sm text-red-600">{errors.anneeMin.message}</p>
      )}
    </>
  );
}

export function SelectCouleur({
  variable,
  placeholder,
  handleValue,
}: {
  variable: typeof COULEURS2;
  placeholder: string;
  handleValue: (val: any) => any;
}) {
  return (
    <Select onValueChange={handleValue}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent className="w-full">
        {variable.sort().map((value) => {
          const color = value.hex;
          return (
            <SelectItem value={value.name + "-" + value.hex} className="w-full">
              {" "}
              <div className="flex-1 flex items-center justify-between w-full gap-4">
                <p> {value.name} </p>
                <div
                  style={{
                    width: "40px",
                    height: "40px",
                    backgroundColor: color,
                    border: "1px solid #333333",
                    borderRadius: "5px",
                  }}
                ></div>
              </div>{" "}
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}
