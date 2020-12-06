import { Token } from "@uniswap/sdk";
import React from "react";
import { Field } from "../../state/orderplacement/actions";
import { AutoColumn } from "../Column";

export default function SwapModalHeader({}: {
  formattedAmounts?: { [field in Field]?: string };
  tokens?: { [field in Field]?: Token };
  independentField: Field;
}) {
  return <AutoColumn gap={"md"} style={{ marginTop: "20px" }}></AutoColumn>;
}
