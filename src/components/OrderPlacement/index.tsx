import { JSBI, TokenAmount, WETH, ChainId } from "@uniswap/sdk";
import React, { useState, useEffect } from "react";
import { Text } from "rebass";
import { ButtonError, ButtonLight } from "../../components/Button";
import { GreyCard } from "../../components/Card";
import { AutoColumn } from "../../components/Column";
import ConfirmationModal from "../../components/ConfirmationModal";
import CurrencyInputPanel from "../../components/CurrencyInputPanel";
import PriceInputPanel from "../../components/PriceInputPanel";
import { BottomGrouping, Dots, Wrapper } from "../../components/swap/styleds";
import SwapModalFooter from "../../components/swap/SwapModalFooter";
import SwapModalHeader from "../../components/swap/SwapModalHeader";
import { MIN_ETH } from "../../constants";
import { useActiveWeb3React } from "../../hooks";
import { EASY_AUCTION_NETWORKS } from "../../constants";
import { tryParseAmount } from "../../state/orderplacement/hooks";
import {
  useApproveCallback,
  ApprovalState,
} from "../../hooks/useApproveCallback";
import { usePlaceOrderCallback } from "../../hooks/usePlaceOrderCallback";
import { useWalletModalToggle } from "../../state/application/hooks";
import { Field } from "../../state/orderplacement/actions";
import {
  useDerivedSwapInfo,
  useSwapActionHandlers,
  useSwapState,
} from "../../state/orderplacement/hooks";
import { TYPE } from "../../theme";

export default function OrderPlacement() {
  const { chainId, account } = useActiveWeb3React();

  // toggle wallet when disconnected
  const toggleWalletModal = useWalletModalToggle();

  // swap state
  const { auctionId, independentField, sellAmount, price } = useSwapState();
  const {
    tokenBalances,
    parsedAmounts,
    tokens,
    error,
    sellToken,
    buyToken,
  } = useDerivedSwapInfo(auctionId);
  const { onUserSellAmountInput } = useSwapActionHandlers();
  const { onUserPriceInput } = useSwapActionHandlers();

  const isValid = !error;
  const dependentField: Field =
    independentField === Field.INPUT ? Field.OUTPUT : Field.INPUT;

  // modal and loading
  const [showConfirm, setShowConfirm] = useState<boolean>(false);
  const [attemptingTxn, setAttemptingTxn] = useState<boolean>(false); // clicked confirmed
  const [pendingConfirmation, setPendingConfirmation] = useState<boolean>(true); // waiting for user confirmation

  // txn values
  const [txHash, setTxHash] = useState<string>("");

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
      : tryParseAmount(sellAmount, buyToken);
  // check whether the user has approved the router on the input token
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
              field={Field.INPUT}
              label={"Amount"}
              value={sellAmount}
              showMaxButton={!atMaxAmountInput}
              token={buyToken}
              onUserSellAmountInput={onUserSellAmountInput}
              onMax={() => {
                maxAmountInput &&
                  onUserSellAmountInput(maxAmountInput.toExact());
              }}
              id="swap-currency-input"
            />

            <PriceInputPanel
              field={Field.OUTPUT}
              value={price}
              onUserPriceInput={onUserPriceInput}
              // eslint-disable-next-line @typescript-eslint/no-empty-function
              label={
                "Price  [" + sellToken?.symbol + "/" + buyToken?.symbol + "]"
              }
              showMaxButton={false}
              sellToken={sellToken}
              buyToken={buyToken}
              id="swap-currency-output"
            />
          </>
        </AutoColumn>
        <BottomGrouping>
          {!account ? (
            <ButtonLight onClick={toggleWalletModal}>
              Connect Wallet
            </ButtonLight>
          ) : userHasSpecifiedInputOutput ? (
            <GreyCard style={{ textAlign: "center" }}>
              <TYPE.main mb="4px">
                Insufficient liquidity for this trade.
              </TYPE.main>
            </GreyCard>
          ) : approval === ApprovalState.NOT_APPROVED ||
            approval === ApprovalState.PENDING ? (
            <ButtonLight
              onClick={approveCallback}
              disabled={approval === ApprovalState.PENDING}
            >
              {approval === ApprovalState.PENDING ? (
                <Dots>Approving {buyToken?.symbol}</Dots>
              ) : (
                "Approve " + buyToken?.symbol
              )}
            </ButtonLight>
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
