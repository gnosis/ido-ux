import { JSBI, TokenAmount, WETH, ChainId } from "@uniswap/sdk";
import React, { useState } from "react";
import { RouteComponentProps } from "react-router-dom";
import OrderPlacement from "../../components/OrderPlacement";
import Claimer from "../../components/Claimer";
import AdvancedSwapDetailsDropdown from "../../components/swap/AdvancedSwapDetailsDropdown";
import { Wrapper } from "../../components/swap/styleds";
import SwapModalFooter from "../../components/swap/SwapModalFooter";
import SwapModalHeader from "../../components/swap/SwapModalHeader";
import { TokenWarningCards } from "../../components/TokenWarningCard";
import {
  DEFAULT_DEADLINE_FROM_NOW,
  INITIAL_ALLOWED_SLIPPAGE,
  MIN_ETH,
} from "../../constants";
import { useActiveWeb3React } from "../../hooks";
import { EASY_AUCTION_NETWORKS } from "../../constants";
import { useApproveCallback } from "../../hooks/useApproveCallback";
import { usePlaceOrderCallback } from "../../hooks/usePlaceOrderCallback";
import { Field } from "../../state/orderplacement/actions";
import {
  useDefaultsFromURLSearch,
  useDerivedSwapInfo,
  useSwapActionHandlers,
  useSwapState,
} from "../../state/orderplacement/hooks";
import AppBody from "../AppBody";
import OrderBody from "../OrderBody";
import ClaimerBody from "../ClaimerBody";

import AuctionDetails from "../../components/AuctionDetails";
import AuctionHeader from "../../components/AuctionHeader";

export default function Swap({ location: { search } }: RouteComponentProps) {
  useDefaultsFromURLSearch(search);

  const { chainId } = useActiveWeb3React();

  // swap state
  const { auctionId, independentField, sellAmount } = useSwapState();
  const {
    tokenBalances,
    parsedAmounts,
    tokens,
    error,
    sellToken,
    buyToken,
    auctionEndDate,
  } = useDerivedSwapInfo(auctionId);
  const { onUserSellAmountInput } = useSwapActionHandlers();
  const { onUserPriceInput } = useSwapActionHandlers();

  const isValid = !error;
  const dependentField: Field =
    independentField === Field.INPUT ? Field.OUTPUT : Field.INPUT;

  // modal and loading
  const [showConfirm, setShowConfirm] = useState<boolean>(false);
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);
  const [attemptingTxn, setAttemptingTxn] = useState<boolean>(false); // clicked confirmed
  const [pendingConfirmation, setPendingConfirmation] = useState<boolean>(true); // waiting for user confirmation

  // txn values
  const [txHash, setTxHash] = useState<string>("");
  const [deadline, setDeadline] = useState<number>(DEFAULT_DEADLINE_FROM_NOW);
  const [allowedSlippage, setAllowedSlippage] = useState<number>(
    INITIAL_ALLOWED_SLIPPAGE,
  );

  const formattedAmounts = {
    [independentField]: sellAmount,
    [dependentField]: parsedAmounts[dependentField]
      ? parsedAmounts[dependentField].toSignificant(6)
      : "",
  };

  const userHasSpecifiedInputOutput =
    !!tokens[Field.INPUT] &&
    !!tokens[Field.OUTPUT] &&
    !!parsedAmounts[independentField] &&
    parsedAmounts[independentField].greaterThan(JSBI.BigInt(0));

  const approvalTokenAmount: TokenAmount | undefined =
    buyToken == undefined || sellAmount == undefined
      ? undefined
      : new TokenAmount(buyToken, sellAmount);
  // check whether the user has approved the router on the input token
  const [approval, approveCallback] = useApproveCallback(
    approvalTokenAmount,
    EASY_AUCTION_NETWORKS[chainId as ChainId],
  );

  const maxAmountInput: TokenAmount =
    !!tokenBalances[Field.INPUT] &&
    !!tokens[Field.INPUT] &&
    !!WETH[chainId] &&
    tokenBalances[Field.INPUT].greaterThan(
      new TokenAmount(
        tokens[Field.INPUT],
        tokens[Field.INPUT].equals(WETH[chainId]) ? MIN_ETH : "0",
      ),
    )
      ? tokens[Field.INPUT].equals(WETH[chainId])
        ? tokenBalances[Field.INPUT].subtract(
            new TokenAmount(WETH[chainId], MIN_ETH),
          )
        : tokenBalances[Field.INPUT]
      : undefined;
  const atMaxAmountInput: boolean =
    maxAmountInput && parsedAmounts[Field.INPUT]
      ? maxAmountInput.equalTo(parsedAmounts[Field.INPUT])
      : undefined;

  // reset modal state when closed
  function resetModal() {
    // clear input if txn submitted
    if (!pendingConfirmation) {
      onUserSellAmountInput("");
    }
    setPendingConfirmation(true);
    setAttemptingTxn(false);
    setShowAdvanced(false);
  }

  // the callback to execute the swap
  const placeOrderCallback = usePlaceOrderCallback(sellToken, buyToken);

  function onPlaceOrder() {
    setAttemptingTxn(true);
    placeOrderCallback().then((hash) => {
      setTxHash(hash);
      setPendingConfirmation(false);
    });
  }

  // errors
  const [showInverted, setShowInverted] = useState<boolean>(false);

  function modalHeader() {
    return (
      <SwapModalHeader
        independentField={independentField}
        tokens={tokens}
        formattedAmounts={formattedAmounts}
      />
    );
  }

  function modalBottom() {
    return (
      <SwapModalFooter
        confirmText={"Confirm Order"}
        showInverted={showInverted}
        setShowInverted={setShowInverted}
        onPlaceOrder={onPlaceOrder}
        parsedAmounts={parsedAmounts}
      />
    );
  }

  // text to show while loading
  const pendingText = `Placing order`;

  return (
    <>
      <TokenWarningCards tokens={tokens} />
      <AppBody>
        <div>
          <AuctionHeader></AuctionHeader>
        </div>
        <div style={{ width: "28%", float: "left", alignContent: "center" }}>
          <AuctionDetails></AuctionDetails>
        </div>
        <div style={{ width: "70%", float: "right", alignContent: "right" }}>
          {auctionEndDate >= new Date().getTime() / 1000 ? (
            <OrderBody>
              <Wrapper id="auction-page">
                <OrderPlacement></OrderPlacement>
              </Wrapper>
            </OrderBody>
          ) : (
            <ClaimerBody>
              <Wrapper id="auction-page">
                <Claimer></Claimer>
              </Wrapper>
            </ClaimerBody>
          )}
        </div>
      </AppBody>

      {
        <AdvancedSwapDetailsDropdown
          rawSlippage={allowedSlippage}
          deadline={deadline}
          showAdvanced={showAdvanced}
          setShowAdvanced={setShowAdvanced}
          setDeadline={setDeadline}
          setRawSlippage={setAllowedSlippage}
        />
      }
    </>
  );
}
