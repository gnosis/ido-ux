import React from "react";
import { RouteComponentProps } from "react-router-dom";
import OrderPlacement from "../../components/OrderPlacement";
import Claimer from "../../components/Claimer";
// import { Wrapper } from "../../components/swap/styleds";
import styled from "styled-components";
import {
  AuctionState,
  useDefaultsFromURLSearch,
  useDerivedAuctionInfo,
} from "../../state/orderplacement/hooks";
import AppBody from "../AppBody";
import OrderBody from "../OrderBody";
import ClaimerBody from "../ClaimerBody";

import AuctionDetails from "../../components/AuctionDetails";
import AuctionHeader from "../../components/AuctionHeader";
import { ButtonLight } from "../../components/Button";
import { useActiveWeb3React } from "../../hooks";
import { useWalletModalToggle } from "../../state/application/hooks";

export default function Auction({ location: { search } }: RouteComponentProps) {
  useDefaultsFromURLSearch(search);
  const { account } = useActiveWeb3React();
  const toggleWalletModal = useWalletModalToggle();

  // swap state
  const { auctionState } = useDerivedAuctionInfo();

  const Wrapper = styled.div`
    display: flex;
    flex-flow: row wrap;
    width: 100%;
    height: 100%;
    justify-content: space-between;
    align-items: stretch;
    ${({ theme }) => theme.mediaWidth.upToMedium`flex-flow: column wrap;`};
  `;

  return (
    <>
      <AppBody>
        {!account ? (
          <div>
            <h3>
              EasyAuction is a platform designed for fair price finding of
              one-time events.
            </h3>
            <ButtonLight onClick={toggleWalletModal}>
              Connect Wallet
            </ButtonLight>
          </div>
        ) : (
          <Wrapper>
            <AuctionHeader />
            <AuctionDetails />
            {auctionState == AuctionState.ORDER_PLACING ||
            auctionState == AuctionState.ORDER_PLACING_AND_CANCELING ? (
              <OrderBody>
                <OrderPlacement />
              </OrderBody>
            ) : (
              <ClaimerBody>
                <Claimer />
              </ClaimerBody>
            )}
          </Wrapper>
        )}
      </AppBody>
    </>
  );
}
