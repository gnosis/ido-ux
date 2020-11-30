import { createAction } from "@reduxjs/toolkit";

export enum Field {
  INPUT = "INPUT",
  OUTPUT = "OUTPUT",
}

export const setDefaultsFromURLSearch = createAction<{
  chainId: number;
  queryString?: string;
}>("setDefaultsFromURL");
export const selectToken = createAction<{ field: Field; address: string }>(
  "selectToken",
);
export const switchTokens = createAction<void>("switchTokens");
export const SellAmountInput = createAction<{ sellAmount: string }>(
  "SellAmountInput",
);
export const priceInput = createAction<{ price: string }>("priceInput");
