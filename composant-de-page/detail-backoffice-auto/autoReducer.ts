// AutoReducer.ts

import { SellerFormData, SellerSchema } from "@/lib/validations/seller";
export type AutoState = SellerFormData;
export type AutoAction = {
  type: "ADD_VALUE";
  field: keyof AutoState;
  value: ValueType<SellerFormData>;
};
type ValueType<T> = T[keyof T];

export const AutoReducer = (
  state: AutoState,
  action: AutoAction
): AutoState => {
  switch (action.type) {
    case "ADD_VALUE":
      return {
        ...state,

        [action.field]: action.value,
      };

    default:
      return state;
  }
};
