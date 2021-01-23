import { Token } from "@uniswap/sdk";
import React from "react";
import { Text } from "rebass";

import { AutoRow } from "../Row";
import { ButtonError } from "../Button";

export default function CancelModalFooter({
  onCancelOrder,
  confirmText,
}: {
  orderId?: string;
  onCancelOrder: () => any;
  biddingToken?: Token;
  confirmText: string;
}) {
  return (
    <>
      <AutoRow>
        <ButtonError
          onClick={onCancelOrder}
          style={{ margin: "1px 0 0 0" }}
          id="confirm-cancel"
        >
          <Text fontSize={20} fontWeight={500}>
            {confirmText}
          </Text>
        </ButtonError>
      </AutoRow>
    </>
  );
}
