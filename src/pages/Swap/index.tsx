import { JSBI, TokenAmount, WETH, ChainId } from "@uniswap/sdk";
import React, { useContext, useState } from "react";
import { RouteComponentProps } from "react-router-dom";
import { Text } from "rebass";
import { ThemeContext } from "styled-components";
import { ButtonError, ButtonLight } from "../../components/Button";
import Card, { GreyCard } from "../../components/Card";
import { AutoColumn } from "../../components/Column";
import OrderPlacement from "../../components/OrderPlacement";
import Claimer from "../../components/Claimer";
import ConfirmationModal from "../../components/ConfirmationModal";
import CurrencyInputPanel from "../../components/CurrencyInputPanel";
import PriceInputPanel from "../../components/PriceInputPanel";
import QuestionHelper from "../../components/QuestionHelper";
import { RowBetween, RowFixed } from "../../components/Row";
import AdvancedSwapDetailsDropdown from "../../components/swap/AdvancedSwapDetailsDropdown";
import FormattedPriceImpact from "../../components/swap/FormattedPriceImpact";
import { BottomGrouping, Dots, Wrapper } from "../../components/swap/styleds";
import SwapModalFooter from "../../components/swap/SwapModalFooter";
import SwapModalHeader from "../../components/swap/SwapModalHeader";
import TradePrice from "../../components/swap/TradePrice";
import { TokenWarningCards } from "../../components/TokenWarningCard";
import {
  DEFAULT_DEADLINE_FROM_NOW,
  INITIAL_ALLOWED_SLIPPAGE,
  MIN_ETH,
} from "../../constants";
import { useActiveWeb3React } from "../../hooks";
import { EASY_AUCTION_NETWORKS } from "../../constants";
import {
  useApproveCallback,
  ApprovalState,
} from "../../hooks/useApproveCallback";
import { usePlaceOrderCallback } from "../../hooks/usePlaceOrderCallback";
import { useWalletModalToggle } from "../../state/application/hooks";
import { Field } from "../../state/orderplacement/actions";
import {
  useDefaultsFromURLSearch,
  useDerivedSwapInfo,
  useSwapActionHandlers,
  useSwapState,
} from "../../state/orderplacement/hooks";
import {
  computeTradePriceBreakdown,
  warningSeverity,
} from "../../utils/prices";
import AppBody from "../AppBody";
import OrderBody from "../OrderBody";
import ClaimerBody from "../ClaimerBody";

import { PriceSlippageWarningCard } from "../../components/swap/PriceSlippageWarningCard";
import AuctionDetails from "../../components/AuctionDetails";
import AuctionHeader from "../../components/AuctionHeader";

export default function Swap({ location: { search } }: RouteComponentProps) {
  useDefaultsFromURLSearch(search);

  const { chainId, account } = useActiveWeb3React();
  const theme = useContext(ThemeContext);

  // toggle wallet when disconnected
  const toggleWalletModal = useWalletModalToggle();

  // swap state
  const { auctionId, independentField, sellAmount, price } = useSwapState();
  const {
    bestTrade,
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

  const route = bestTrade?.route;
  const userHasSpecifiedInputOutput =
    !!tokens[Field.INPUT] &&
    !!tokens[Field.OUTPUT] &&
    !!parsedAmounts[independentField] &&
    parsedAmounts[independentField].greaterThan(JSBI.BigInt(0));
  const noRoute = !route;

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

  const { priceImpactWithoutFee, realizedLPFee } = computeTradePriceBreakdown(
    bestTrade,
  );

  function onPlaceOrder() {
    setAttemptingTxn(true);
    placeOrderCallback().then((hash) => {
      setTxHash(hash);
      setPendingConfirmation(false);
    });
  }

  // errors
  const [showInverted, setShowInverted] = useState<boolean>(false);

  // warnings on slippage
  const priceImpactSeverity = warningSeverity(priceImpactWithoutFee);

  function modalHeader() {
    return (
      <SwapModalHeader
        independentField={independentField}
        priceImpactSeverity={priceImpactSeverity}
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
        severity={priceImpactSeverity}
        setShowInverted={setShowInverted}
        onPlaceOrder={onPlaceOrder}
        realizedLPFee={realizedLPFee}
        parsedAmounts={parsedAmounts}
        priceImpactWithoutFee={priceImpactWithoutFee}
        trade={bestTrade}
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

      {bestTrade && (
        <AdvancedSwapDetailsDropdown
          trade={bestTrade}
          rawSlippage={allowedSlippage}
          deadline={deadline}
          showAdvanced={showAdvanced}
          setShowAdvanced={setShowAdvanced}
          setDeadline={setDeadline}
          setRawSlippage={setAllowedSlippage}
        />
      )}

      {priceImpactWithoutFee && priceImpactSeverity > 2 && (
        <AutoColumn gap="lg" style={{ marginTop: "1rem" }}>
          <PriceSlippageWarningCard priceSlippage={priceImpactWithoutFee} />
        </AutoColumn>
      )}
    </>
  );
}
