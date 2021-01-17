import { TokenAmount, ChainId } from "@uniswap/sdk";
import React, { useState, useEffect } from "react";
import { Text } from "rebass";
import {
  ButtonError,
  ButtonLight,
  ButtonPrimary,
} from "../../components/Button";
import { AutoColumn } from "../../components/Column";
import ConfirmationModal from "../../components/ConfirmationModal";
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
  useSwapActionHandlers,
  useSwapState,
} from "../../state/orderPlacement/hooks";
import { useOrderActionHandlers } from "../../state/orders/hooks";

export default function OrderPlacement() {
  const { chainId, account } = useActiveWeb3React();

  // toggle wallet when disconnected
  const toggleWalletModal = useWalletModalToggle();

  // swap state
  const { price, sellAmount } = useSwapState();
  const {
    biddingTokenBalance,
    parsedBiddingAmount,
    error,
    auctioningToken,
    biddingToken,
  } = useDerivedAuctionInfo();
  const { onUserSellAmountInput } = useSwapActionHandlers();
  const { onUserPriceInput } = useSwapActionHandlers();
  const { onNewOrder } = useOrderActionHandlers();

  const isValid = !error;

  // modal and loading
  const [showConfirm, setShowConfirm] = useState<boolean>(false);
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
              // eslint-disable-next-line @typescript-eslint/no-empty-function
              label={
                "Price  [" +
                auctioningToken?.symbol +
                "/" +
                biddingToken?.symbol +
                "]"
              }
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
                <Dots>Approving {biddingToken?.symbol}</Dots>
              ) : (
                "Approve " + biddingToken?.symbol
              )}
            </ButtonPrimary>
          ) : (
            <ButtonError
              onClick={() => {
                setShowConfirm(true);
              }}
              id="swap-button"
              disabled={!isValid}
              error={isValid}
            >
              <Text fontSize={20} fontWeight={500}>
                {error ?? `Execute Order`}
              </Text>
            </ButtonError>
          )}
        </BottomGrouping>
      </Wrapper>
    </>
  );
}
