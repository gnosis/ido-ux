import React, { useState } from "react";
import styled from "styled-components";
import { Text } from "rebass";

import { useCancelOrderCallback } from "../../hooks/useCancelOrderCallback";
import {
  AuctionState,
  useDerivedAuctionInfo,
  useDerivedAuctionState,
} from "../../state/orderPlacement/hooks";
import { ButtonCancel } from "../Button";
import ConfirmationModal from "../ConfirmationModal";
import CancelModalFooter from "../swap/CancelOrderModealFooter";
import SwapModalHeader from "../swap/SwapModalHeader";
import { useOrderActionHandlers } from "../../state/orders/hooks";
import { OrderDisplay, OrderStatus } from "../../state/orders/reducer";

const StyledRow = styled.div`
  display: grid;
  grid-template-columns: 1.5fr 0.6fr 1fr 1fr 1fr;
  grid-template-areas: "amount price fill status action";
  font-weight: normal;
  font-size: 13px;
  padding: 8px 0;
  transition: background-color 0.1s ease-in-out;

  &:hover {
    background-color: ${({ theme }) => theme.advancedBG};
  }

  &:not(:last-child) {
    border-bottom: 1px solid rgba(43, 43, 43, 0.435);
  }

  > div {
    display: flex;
    align-items: center;
  }

  > div:last-of-type {
    margin: 0 0 0 auto;
  }
`;

const StyledHeader = styled(StyledRow)`
  &:hover {
    background: none;
  }
  > div {
    font-weight: 700;
  }
`;

const Wrapper = styled.div`
  width: 100%;
  padding: 0;
`;

function Table(orders: OrderDisplay[]) {
  const { auctionState } = useDerivedAuctionState();
  const { biddingToken } = useDerivedAuctionInfo();
  const cancelOrderCallback = useCancelOrderCallback(biddingToken);
  const { onDeleteOrder } = useOrderActionHandlers();

  // modal and loading
  const [showConfirm, setShowConfirm] = useState<boolean>(false);
  const [attemptingTxn, setAttemptingTxn] = useState<boolean>(false); // clicked confirmed
  const [pendingConfirmation, setPendingConfirmation] = useState<boolean>(true); // waiting for user confirmation

  // txn values
  const [txHash, setTxHash] = useState<string>("");
  const [orderId, setOrderId] = useState<string>("");

  // reset modal state when closed
  function resetModal() {
    setPendingConfirmation(true);
    setAttemptingTxn(false);
  }

  function onCancelOrder() {
    setAttemptingTxn(true);

    cancelOrderCallback(orderId).then((hash) => {
      onDeleteOrder(orderId);
      setTxHash(hash);
      setPendingConfirmation(false);
    });
  }

  function modalHeader() {
    return <SwapModalHeader />;
  }

  function modalBottom() {
    return (
      <CancelModalFooter
        orderId={orderId}
        confirmText={"Cancel Order"}
        onCancelOrder={onCancelOrder}
        biddingToken={biddingToken}
      />
    );
  }
  const pendingText = `Canceling Order`;
  let error = undefined;
  if (auctionState != AuctionState.ORDER_PLACING_AND_CANCELING) {
    error = "Not allowed";
  }
  return (
    <>
      <ConfirmationModal
        isOpen={showConfirm}
        title="Confirm Order Cancellation"
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
      <StyledHeader>
        <div>Amount</div>
        <div>Price</div>
        <div>Est. Fill</div>
        <div>Status</div>
        <div>Actions</div>
      </StyledHeader>
      {Object.entries(orders).map((order) => (
        <StyledRow key={order[1].id}>
          <div>{order[1].sellAmount}</div>
          <div>{order[1].price}</div>
          <div>100</div>
          <div>
            {order[1].status == OrderStatus.PLACED ? "Placed" : "Pending"}
          </div>
          <div>
            {order[1].status == OrderStatus.PENDING ? (
              <div></div>
            ) : (
              <ButtonCancel
                onClick={() => {
                  if (!error) {
                    setOrderId(order[1].id);
                    setShowConfirm(true);
                  }
                }}
                id="cancel-button"
              >
                <Text fontSize={10} fontWeight={500}>
                  {error ?? `Cancel Order`}
                </Text>
              </ButtonCancel>
            )}
          </div>
        </StyledRow>
      ))}
    </>
  );
}

export default function OrderTable(orders: OrderDisplay[]) {
  return (
    <Wrapper>
      <Table {...orders} />
    </Wrapper>
  );
}
