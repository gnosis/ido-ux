import { Fraction, Percent, Token, TokenAmount, Trade } from "uniswap-xdai-sdk";
import React, { useContext, useMemo } from "react";
import { Text } from "rebass";
import { ThemeContext } from "styled-components";

import { AutoRow, RowBetween } from "../Row";
import { ButtonError } from "../Button";
import { AutoColumn } from "../Column";
import { getTokenDisplay } from "../../utils";
import { convertPriceIntoBuyAndSellAmount } from "../../utils/prices";
import { BigNumber } from "@ethersproject/bignumber";

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
  realizedLPFee?: TokenAmount;
  price: string;
  sellAmount: string;
  auctioningToken?: Token;
  biddingToken?: Token;
  priceImpactWithoutFee?: Percent;
  confirmText: string;
}) {
  const theme = useContext(ThemeContext);
  let minimumReceived = undefined;
  const { buyAmountScaled } = convertPriceIntoBuyAndSellAmount(
    auctioningToken,
    biddingToken,
    price,
    sellAmount,
  );
  if (sellAmount != undefined && buyAmountScaled != undefined) {
    minimumReceived = new Fraction(
      buyAmountScaled.toString(),
      BigNumber.from(10).pow(biddingToken.decimals).toString(),
    );
  }

  const biddingTokenDisplay = useMemo(() => getTokenDisplay(biddingToken), [
    biddingToken,
  ]);

  const auctioningTokenDisplay = useMemo(
    () => getTokenDisplay(auctioningToken),
    [auctioningToken],
  );

  return (
    <>
      <AutoColumn gap="0px">
        <RowBetween align="center">
          <Text fontWeight={400} fontSize={16} color={theme.text2}>
            Tokens sold [{biddingTokenDisplay}]:
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
            Minimum received [{auctioningTokenDisplay}]:
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
            {minimumReceived?.toSignificant(2)}
          </Text>
        </RowBetween>
        <br></br>
        <RowBetween align="center">
          <Text fontWeight={400} fontSize={16} color={theme.text2}>
            Max price paid [{auctioningTokenDisplay}/{biddingTokenDisplay}]:
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
