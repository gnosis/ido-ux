import { Token } from "@uniswap/sdk";
import React, { useContext } from "react";
import { ArrowDown } from "react-feather";
import { Text } from "rebass";
import { ThemeContext } from "styled-components";
import { Field } from "../../state/orderplacement/actions";
import { TYPE } from "../../theme";
import { AutoColumn } from "../Column";
import { RowBetween, RowFixed } from "../Row";
import TokenLogo from "../TokenLogo";
import { TruncatedText } from "./styleds";

export default function SwapModalHeader({
  formattedAmounts,
  tokens,
  independentField,
}: {
  formattedAmounts?: { [field in Field]?: string };
  tokens?: { [field in Field]?: Token };
  independentField: Field;
}) {
  const theme = useContext(ThemeContext);
  return <AutoColumn gap={"md"} style={{ marginTop: "20px" }}></AutoColumn>;
}
