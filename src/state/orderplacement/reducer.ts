import { parse } from "qs";
import { createReducer } from "@reduxjs/toolkit";
import {
  Field,
  setDefaultsFromURLSearch,
  SellAmountInput,
  priceInput,
} from "./actions";

export interface SwapState {
  readonly independentField: Field;
  readonly price: string;
  readonly sellAmount: string;
  readonly auctionId: number;
  readonly [Field.INPUT]: {
    readonly address: string | undefined;
  };
  readonly [Field.OUTPUT]: {
    readonly address: string | undefined;
  };
}

const initialState: SwapState = {
  independentField: Field.INPUT,
  price: "1",
  auctionId: 1,
  sellAmount: "",
  [Field.INPUT]: {
    address: "",
  },
  [Field.OUTPUT]: {
    address: "",
  },
};

function parseAuctionIdParameter(urlParam: any): number {
  return typeof urlParam === "string" && !isNaN(parseInt(urlParam))
    ? parseInt(urlParam)
    : 1;
}

export default createReducer<SwapState>(initialState, (builder) =>
  builder
    .addCase(setDefaultsFromURLSearch, (_, { payload: { queryString } }) => {
      if (queryString && queryString.length > 1) {
        const parsedQs = parse(queryString, {
          parseArrays: false,
          ignoreQueryPrefix: true,
        });

        return {
          ...initialState,
          auctionId: parseAuctionIdParameter(parsedQs.auctionId),
        };
      }

      return {
        ...initialState,
        auctionId: 1,
      };
    })
    .addCase(SellAmountInput, (state, { payload: { sellAmount } }) => {
      return {
        ...state,
        sellAmount,
      };
    })
    .addCase(priceInput, (state, { payload: { price } }) => {
      return {
        ...state,
        price,
      };
    }),
);
