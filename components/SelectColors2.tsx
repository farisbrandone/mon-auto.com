import * as React from "react";
import { COULEURS2, searchValue } from "@/lib/constants/carProperties";

import AsyncSelect from "react-select/async";
import { FixedSizeList as List } from "react-window";
import { UseFormSetValue } from "react-hook-form";
import { searchSchema } from "@/lib/validations/seller";
import { z } from "zod";

// Type definitions
export interface ColorOption {
  label: string;
  value: string;
}

interface MenuListProps {
  children: React.ReactNode;
  [key: string]: any;
}

function VehicleColorPicker({
  handleCouleur,
  setSelectedColor,
  selectedColor,
  placeholder,
  register,
  fieldForm,
}: {
  handleCouleur: (value: string) => void;
  setSelectedColor: React.Dispatch<React.SetStateAction<ColorOption | null>>;
  selectedColor: ColorOption | null;
  placeholder: string;
  register?: UseFormSetValue<z.infer<typeof searchSchema>>;
  fieldForm?: searchValue;
}) {
  // Complete list of vehicle colors with HEX codes
  const colorOptions: ColorOption[] = COULEURS2.map((value) => ({
    label: value.name,
    value: value.hex,
  }));

  // Custom option component with color preview
  const formatOptionLabel = ({ label, value }: ColorOption) => (
    <div style={{ display: "flex", alignItems: "center" }}>
      <div
        style={{
          width: 20,
          height: 20,
          backgroundColor: value,
          marginRight: 10,
          border: "1px solid #ccc",
        }}
      />
      {label}
    </div>
  );

  // Load options with debouncing
  const loadOptions = (
    inputValue: string,
    callback: (options: ColorOption[]) => void
  ) => {
    setTimeout(() => {
      const filtered = colorOptions.filter((option) =>
        option.label.toLowerCase().includes(inputValue.toLowerCase())
      );
      callback(filtered);
    }, 300); // Debounce delay
  };

  // Custom menu list for virtualization (improves performance)
  const MenuList: React.FC<MenuListProps> = ({ children }) => {
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

  /*  const [selectedColor, setSelectedColor] = useState<ColorOption | null>(null); */

  return (
    <div
      className="w-full my-[0px] z-20 " /* style={{ maxWidth: 400, margin: "20px auto" }} */
    >
      {/*  <h2>Vehicle Color Selector</h2> */}
      <AsyncSelect<ColorOption>
        cacheOptions
        defaultOptions={colorOptions.slice(0, 425)} // Initial loaded options
        loadOptions={loadOptions}
        onChange={(newValue) => {
          setSelectedColor(newValue);
          handleCouleur(newValue?.label + "-" + newValue?.value);
          if (register && fieldForm) {
            register(fieldForm, newValue?.label + "-" + newValue?.value);
          }
        }}
        value={selectedColor}
        formatOptionLabel={formatOptionLabel}
        components={{ MenuList }}
        placeholder={placeholder} /* "Choisir une couleur" */
        noOptionsMessage={({ inputValue }) =>
          inputValue ? "No colors found" : "Start typing to search"
        }
        styles={{
          option: (provided, state) => ({
            ...provided,
            padding: "8px 12px",
            backgroundColor: state.isFocused ? "#f0f0f0" : "white",
            fontSize: "14px",
          }),
          control: (provided) => ({
            ...provided,
            minHeight: "30px",
            fontSize: "14px",
          }),
        }}
      />
    </div>
  );
}

export default VehicleColorPicker;
