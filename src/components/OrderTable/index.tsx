import React, { useState } from "react";
import styled from "styled-components";
import { Text } from "rebass";

import { useCancelOrderCallback } from "../../hooks/useCancelOrderCallback";
import {
  AuctionState,
  useDerivedAuctionInfo,
} from "../../state/orderPlacement/hooks";
import { OrderDisplay, OrderStatus } from "../../state/orders/reducer";
import { ButtonCancel } from "../Button";
import ConfirmationModal from "../ConfirmationModal";
import CancelModalFooter from "../swap/CancelOrderModealFooter";
import SwapModalHeader from "../swap/SwapModalHeader";
import { Wrapper } from "../swap/styleds";
import { AutoColumn } from "../Column";
import { useOrderActionHandlers } from "../../state/orders/hooks";

const Styles = styled.div`
  align-items: center
  width: 100%;
  padding: 0.1rem;
  table {
    margin-left: auto;
    margin-right: auto;
    text-align: center;
    border-spacing: 0.5;
    tr {

      border-bottom: 1px solid black;
      border-right: 1px solid black;
      :last-child {
        td {
          border-bottom: 1;
        }
      }
    }
    th,
    td {
      margin: 0;
      padding: 0.5rem;
      :last-child {
        border-right: 0;
      }
    }
  }
`;

function Table(orders: OrderDisplay[]) {
  const { biddingToken, auctionState } = useDerivedAuctionInfo();
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
      <Wrapper id="orders-page">
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
        <AutoColumn gap={"md"}>
          <>
            <table style={{ alignSelf: "center" }}>
              <thead>
                <tr key="header">
                  <th>Amount</th>
                  <th>Price</th>
                  <th>Estimated Fill</th>
                  <th>Status</th>
                  <th>Cancellation</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(orders).map((order) => {
                  return (
                    <tr key={order[1].id}>
                      <td>{order[1].sellAmount}</td>
                      <td>{order[1].price}</td>
                      <td>100</td>
                      <td>
                        {order[1].status == OrderStatus.PLACED
                          ? "Placed"
                          : "Pending"}
                      </td>
                      <td>
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
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </>
        </AutoColumn>
      </Wrapper>
    </>
  );
}

export default function OrderTable(orders: OrderDisplay[]) {
  return (
    <Styles>
      <Table {...orders} />
    </Styles>
  );
}
