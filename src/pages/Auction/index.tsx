import React, { useEffect, useState } from "react";
import { RouteComponentProps } from "react-router-dom";
import OrderPlacement from "../../components/OrderPlacement";
import Claimer from "../../components/Claimer";
import styled from "styled-components";
import {
  AuctionState,
  useCurrentUserOrdersForDisplay,
  useDefaultsFromURLSearch,
  useDerivedAuctionState,
} from "../../state/orderPlacement/hooks";
import AppBody from "../AppBody";
import OrderBody from "../OrderBody";
import ClaimerBody from "../ClaimerBody";

import AuctionDetails from "../../components/AuctionDetails";
import AuctionHeader from "../../components/AuctionHeader";
import { ButtonLight } from "../../components/Button";
import { useActiveWeb3React } from "../../hooks";
import { useWalletModalToggle } from "../../state/application/hooks";
import OrderDisplayDropdown from "../../components/OrderDropdown";
import {
  useOrderActionHandlers,
  useOrderState,
} from "../../state/orders/hooks";
import { OrderState } from "../../state/orders/reducer";

const Wrapper = styled.div`
  display: flex;
  flex-flow: row wrap;
  width: 100%;
  justify-content: space-between;
  align-items: stretch;
  ${({ theme }) => theme.mediaWidth.upToMedium`flex-flow: column wrap;`};
`;
function renderAuctionElements({
  auctionState,
}: {
  auctionState: AuctionState;
}) {
  switch (auctionState) {
    case undefined || AuctionState.NOT_YET_STARTED:
      return <></>;
    case AuctionState.ORDER_PLACING:
    case AuctionState.ORDER_PLACING_AND_CANCELING:
      return (
        <>
          <AuctionDetails />
          <OrderBody>
            <OrderPlacement />
          </OrderBody>
        </>
      );

    case AuctionState.CLAIMING:
      return (
        <>
          <AuctionDetails />
          <ClaimerBody>
            <Claimer />
          </ClaimerBody>
        </>
      );

    default:
      return <div></div>;
  }
}

export default function Auction({ location: { search } }: RouteComponentProps) {
  useDefaultsFromURLSearch(search);
  const { account } = useActiveWeb3React();
  const toggleWalletModal = useWalletModalToggle();
  const { auctionState } = useDerivedAuctionState();
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);
  const orders: OrderState | undefined = useOrderState();
  const ordersFromApi = useCurrentUserOrdersForDisplay();
  const [userOrders, setUserOrders] = useState<boolean>();
  const { onNewOrder } = useOrderActionHandlers();

  useEffect(() => {
    if (userOrders == undefined && ordersFromApi.length > 0) {
      onNewOrder(ordersFromApi);
      setUserOrders(false);
    }
  }, [ordersFromApi, onNewOrder, userOrders]);

  return (
    <AppBody>
      {!account ? (
        <div>
          <h3>
            GnosisAuction is a platform designed for fair price finding of
            one-time events.
          </h3>
          <ButtonLight onClick={toggleWalletModal}>Connect Wallet</ButtonLight>
        </div>
      ) : (
        <>
          <Wrapper>
            <AuctionHeader />
            {renderAuctionElements({
              auctionState,
            })}
          </Wrapper>
          <OrderDisplayDropdown
            showAdvanced={showAdvanced}
            setShowAdvanced={setShowAdvanced}
            orders={orders.orders}
          />
        </>
      )}
    </AppBody>
  );
}
