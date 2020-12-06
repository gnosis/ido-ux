import { Percent, TokenAmount, Trade } from "@uniswap/sdk";
import React from "react";
import { Text } from "rebass";
import { Field } from "../../state/orderplacement/actions";
import { ButtonError } from "../Button";
import { AutoRow } from "../Row";

export default function SwapModalFooter({
  onPlaceOrder,
  confirmText,
}: {
  trade?: Trade;
  showInverted: boolean;
  setShowInverted: (inverted: boolean) => void;
  onPlaceOrder: () => any;
  parsedAmounts?: { [field in Field]?: TokenAmount };
  realizedLPFee?: TokenAmount;
  priceImpactWithoutFee?: Percent;
  confirmText: string;
}) {
  return (
    <>
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
