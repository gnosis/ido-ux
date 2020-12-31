import { Fraction, Percent, Token, TokenAmount, Trade } from "@uniswap/sdk";
import React, { useContext } from "react";
import { Text } from "rebass";
import { ThemeContext } from "styled-components";

import { AutoRow, RowBetween } from "../Row";
import { Field } from "../../state/orderplacement/actions";
import { ButtonError } from "../Button";
import { AutoColumn } from "../Column";

export default function SwapModalFooter({
  onPlaceOrder,
  confirmText,
  price,
  sellAmount,
  auctioningToken,
  biddingToken,
}: {
  trade?: Trade;
  showInverted: boolean;
  setShowInverted: (inverted: boolean) => void;
  onPlaceOrder: () => any;
  parsedAmounts?: { [field in Field]?: TokenAmount };
  realizedLPFee?: TokenAmount;
  price?: string;
  sellAmount?: string;
  auctioningToken?: Token;
  biddingToken?: Token;
  priceImpactWithoutFee?: Percent;
  confirmText: string;
}) {
  const theme = useContext(ThemeContext);
  let minimumReceived = new Fraction("0", "1");
  if (sellAmount != undefined || price != undefined) {
    minimumReceived = new Fraction(sellAmount, "1").multiply(
      new Fraction("1", price),
    );
  }
  return (
    <>
      <AutoColumn gap="0px">
        <RowBetween align="center">
          <Text fontWeight={400} fontSize={16} color={theme.text2}>
            Tokens sold [{biddingToken?.symbol}]:
          </Text>
          <Text
            fontWeight={500}
            fontSize={16}
            color={theme.text1}
            style={{
              justifyContent: "center",
              alignItems: "center",
              display: "flex",
              textAlign: "right",
              paddingLeft: "10px",
            }}
          >
            {sellAmount}
          </Text>
        </RowBetween>

        <RowBetween align="center">
          <Text fontWeight={400} fontSize={16} color={theme.text2}>
            Minimum received [{auctioningToken?.symbol}]:
          </Text>
          <Text
            fontWeight={500}
            fontSize={16}
            color={theme.text1}
            style={{
              justifyContent: "center",
              alignItems: "center",
              display: "flex",
              textAlign: "right",
              paddingLeft: "10px",
            }}
          >
            {minimumReceived.toSignificant(2)}
          </Text>
        </RowBetween>
        <br></br>
        <RowBetween align="center">
          <Text fontWeight={400} fontSize={16} color={theme.text2}>
            Max price paid [{auctioningToken?.symbol}/{biddingToken?.symbol}]:
          </Text>
          <Text
            fontWeight={500}
            fontSize={16}
            color={theme.text1}
            style={{
              justifyContent: "center",
              alignItems: "center",
              display: "flex",
              textAlign: "right",
              paddingLeft: "10px",
            }}
          >
            {price}
          </Text>
        </RowBetween>
      </AutoColumn>

      <AutoRow>
        <ButtonError
          onClick={onPlaceOrder}
          style={{ margin: "10px 0 0 0" }}
          id="confirm-swap-or-send"
        >
          <Text fontSize={20} fontWeight={500}>
            {confirmText}
          </Text>
        </ButtonError>
      </AutoRow>
    </>
  );
}
