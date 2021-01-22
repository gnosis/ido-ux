import React from "react";
import { RouteComponentProps } from "react-router-dom";
import OrderPlacement from "../../components/OrderPlacement";
import Claimer from "../../components/Claimer";
import styled from "styled-components";
import {
  AuctionState,
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

const Wrapper = styled.div`
  display: flex;
  flex-flow: row wrap;
  width: 100%;
  height: 100%;
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
    case AuctionState.NOT_YET_STARTED:
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

  return (
    <AppBody>
      {!account ? (
        <div>
          <h3>
            EasyAuction is a platform designed for fair price finding of
            one-time events.
          </h3>
          <ButtonLight onClick={toggleWalletModal}>Connect Wallet</ButtonLight>
        </div>
      ) : (
        <Wrapper>
          <AuctionHeader />
          {renderAuctionElements({
            auctionState,
          })}
        </Wrapper>
      )}
    </AppBody>
  );
}
