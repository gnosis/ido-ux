import { TokenAmount, ChainId, Fraction } from "uniswap-xdai-sdk";
import React, { useState, useEffect, useMemo } from "react";
import { Text } from "rebass";
import { ButtonLight, ButtonPrimary } from "../../components/Button";
import { AutoColumn } from "../../components/Column";
import ConfirmationModal from "../../components/ConfirmationModal";
import WarningModal from "../../components/WarningModal";
import CurrencyInputPanel from "../../components/CurrencyInputPanel";
import PriceInputPanel from "../../components/PriceInputPanel";
import { BottomGrouping, Dots, Wrapper } from "../../components/swap/styleds";
import SwapModalFooter from "../swap/PlaceOrderModalFooter";
import SwapModalHeader from "../../components/swap/SwapModalHeader";
import { useActiveWeb3React } from "../../hooks";
import { EASY_AUCTION_NETWORKS } from "../../constants";
import {
  useApproveCallback,
  ApprovalState,
} from "../../hooks/useApproveCallback";
import { usePlaceOrderCallback } from "../../hooks/usePlaceOrderCallback";
import { useWalletModalToggle } from "../../state/application/hooks";
import {
  useDerivedAuctionInfo,
  useGetOrderPlacementError,
  useSwapActionHandlers,
  useSwapState,
} from "../../state/orderPlacement/hooks";
import { getTokenDisplay } from "../../utils";
import { useOrderState } from "../../state/orders/hooks";
import { OrderState } from "../../state/orders/reducer";

export default function OrderPlacement() {
  const { chainId, account } = useActiveWeb3React();
  const orders: OrderState | undefined = useOrderState();

  // toggle wallet when disconnected
  const toggleWalletModal = useWalletModalToggle();

  // swap state
  const { price, sellAmount } = useSwapState();
  const {
    biddingTokenBalance,
    parsedBiddingAmount,
    auctioningToken,
    biddingToken,
    initialPrice,
  } = useDerivedAuctionInfo();
  const { error } = useGetOrderPlacementError();
  const { onUserSellAmountInput } = useSwapActionHandlers();
  const { onUserPriceInput } = useSwapActionHandlers();

  const isValid = !error;

  // modal and loading
  const [showConfirm, setShowConfirm] = useState<boolean>(false);
  const [showWarning, setShowWarning] = useState<boolean>(false);
  const [attemptingTxn, setAttemptingTxn] = useState<boolean>(false); // clicked confirmed
  const [pendingConfirmation, setPendingConfirmation] = useState<boolean>(true); // waiting for user confirmation

  // txn values
  const [txHash, setTxHash] = useState<string>("");

  const approvalTokenAmount: TokenAmount | undefined = parsedBiddingAmount;
  // check whether the user has approved the EasyAuction Contract
  const [approval, approveCallback] = useApproveCallback(
    approvalTokenAmount,
    EASY_AUCTION_NETWORKS[chainId as ChainId],
  );
  const [approvalSubmitted, setApprovalSubmitted] = useState<boolean>(false);

  useEffect(() => {
    if (approval === ApprovalState.PENDING) {
      setApprovalSubmitted(true);
    }
  }, [approval, approvalSubmitted]);

  const maxAmountInput: TokenAmount = !!biddingTokenBalance
    ? biddingTokenBalance
    : undefined;
  const atMaxAmountInput: boolean =
    maxAmountInput && parsedBiddingAmount
      ? maxAmountInput.equalTo(parsedBiddingAmount)
      : undefined;

  useEffect(() => {
    if (price == "-" && initialPrice) {
      onUserPriceInput(
        initialPrice.multiply(new Fraction("1001", "1000")).toSignificant(4),
      );
    }
  }, [onUserPriceInput, price, initialPrice]);

  // reset modal state when closed
  function resetModal() {
    // clear input if txn submitted
    if (!pendingConfirmation) {
      onUserSellAmountInput("");
    }
    setPendingConfirmation(true);
    setAttemptingTxn(false);
  }

  // the callback to execute the swap
  const placeOrderCallback = usePlaceOrderCallback(
    auctioningToken,
    biddingToken,
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

  function modalHeader() {
    return <SwapModalHeader />;
  }

  function modalBottom() {
    return (
      <SwapModalFooter
        confirmText={"Confirm Order"}
        showInverted={showInverted}
        setShowInverted={setShowInverted}
        onPlaceOrder={onPlaceOrder}
        biddingToken={biddingToken}
        auctioningToken={auctioningToken}
        price={price}
        sellAmount={sellAmount}
      />
    );
  }

  // text to show while loading
  const pendingText = `Placing order`;

  const biddingTokenDisplay = useMemo(() => getTokenDisplay(biddingToken), [
    biddingToken,
  ]);

  const auctioningTokenDisplay = useMemo(
    () => getTokenDisplay(auctioningToken),
    [auctioningToken],
  );

  const handleShowConfirm = () => {
    const sameOrder = orders.orders.find((order) => order.price === price);

    if (!sameOrder) {
      setShowConfirm(true);
    } else {
      setShowWarning(true);
    }
  };

  return (
    <>
      <Wrapper id="swap-page">
        <ConfirmationModal
          isOpen={showConfirm}
          title="Confirm Order"
          onDismiss={() => {
            resetModal();
            setShowConfirm(false);
          }}
          attemptingTxn={attemptingTxn}
          pendingConfirmation={pendingConfirmation}
          hash={txHash}
          topContent={modalHeader}
          bottomContent={modalBottom}
          pendingText={pendingText}
        />
        <WarningModal
          isOpen={showWarning}
          title="Warning!"
          content={`Pick a different price, you already has an order for ${price} ${biddingTokenDisplay} per ${auctioningTokenDisplay}`}
          onDismiss={() => {
            setShowWarning(false);
          }}
        />
        <AutoColumn gap={"md"}>
          <>
            <CurrencyInputPanel
              label={"Amount"}
              value={sellAmount}
              showMaxButton={!atMaxAmountInput}
              token={biddingToken}
              onUserSellAmountInput={onUserSellAmountInput}
              onMax={() => {
                maxAmountInput &&
                  onUserSellAmountInput(maxAmountInput.toExact());
              }}
              id="auction-input"
            />

            <PriceInputPanel
              value={price}
              onUserPriceInput={onUserPriceInput}
              label={`Price — ${biddingTokenDisplay} per ${auctioningTokenDisplay}`}
              showMaxButton={false}
              auctioningToken={auctioningToken}
              biddingToken={biddingToken}
              id="price-input"
            />
          </>
        </AutoColumn>
        <BottomGrouping>
          {!account ? (
            <ButtonLight onClick={toggleWalletModal}>
              Connect Wallet
            </ButtonLight>
          ) : approval === ApprovalState.NOT_APPROVED ||
            approval === ApprovalState.PENDING ? (
            <ButtonPrimary
              onClick={approveCallback}
              disabled={approval === ApprovalState.PENDING}
            >
              {approval === ApprovalState.PENDING ? (
                <Dots>Approving {biddingTokenDisplay}</Dots>
              ) : (
                `Approve ${biddingTokenDisplay}`
              )}
            </ButtonPrimary>
          ) : (
            <ButtonPrimary
              onClick={handleShowConfirm}
              id="swap-button"
              disabled={!isValid}
            >
              <Text fontSize={20} fontWeight={500}>
                {error ?? `Place Order`}
              </Text>
            </ButtonPrimary>
          )}
        </BottomGrouping>
      </Wrapper>
    </>
  );
}
