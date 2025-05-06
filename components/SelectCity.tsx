import * as React from "react";
import { villesCameroun } from "@/lib/constants/carProperties";
import { useState } from "react";

import AsyncSelect from "react-select/async";
import { FixedSizeList as List } from "react-window";

interface MenuListProps {
  children: React.ReactNode;
  [key: string]: any;
}

export interface CityProps {
  city: string;
}

function SelectCity({
  setSelectedCity,
  selectedCity,
  placeholder,
}: {
  setSelectedCity: React.Dispatch<React.SetStateAction<CityProps | null>>;
  selectedCity: CityProps | null;
  placeholder: string;
}) {
  const cityOptions: CityProps[] = villesCameroun.map((value) => ({
    city: value,
  }));

  const formatOptionLabel = ({ city }: CityProps) => (
    <div style={{ display: "flex", alignItems: "center", color: "black" }}>
      {city}
    </div>
  );

  const loadOptions = (
    inputValue: string,
    callback: (options: CityProps[]) => void
  ) => {
    const filtered = cityOptions.filter((option) =>
      option.city.toLowerCase().includes(inputValue.toLowerCase())
    );
    setTimeout(() => {
      callback(filtered);
    }, 300); // Debounce delay
  };

  const MenuList: React.FC<MenuListProps> = ({ children, ...props }) => {
    const height = 35;
    const totalHeight = React.Children.count(children) * height;

    return (
      <List
        height={Math.min(350, totalHeight)}
        itemCount={React.Children.count(children)}
        itemSize={height}
        width="100%"
      >
        {({ index, style }) => (
          <div style={style}>{React.Children.toArray(children)[index]}</div>
        )}
      </List>
    );
  };

  return (
    <div className="w-full my-[0px] ">
      <AsyncSelect<CityProps>
        cacheOptions
        defaultOptions={cityOptions.slice(0, villesCameroun.length)} // Initial loaded options
        loadOptions={loadOptions}
        onChange={(newValue) => {
          setSelectedCity(newValue);
        }}
        value={selectedCity}
        formatOptionLabel={formatOptionLabel}
        components={{ MenuList }}
        placeholder={placeholder}
        noOptionsMessage={({ inputValue }) =>
          inputValue
            ? "Aucune ville trouvée"
            : "Commence à saisir pour rechercher"
        }
        styles={{
          option: (provided, state) => ({
            ...provided,
            padding: "8px 12px",
            backgroundColor: state.isFocused ? "#f0f0f0" : "white",
            fontSize: "16px",
          }),
          control: (provided) => ({
            ...provided,
            minHeight: "30px",
            fontSize: "16px",
          }),
        }}
      />
    </div>
  );
}

export default SelectCity;
