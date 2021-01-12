import React from "react";
import { RouteComponentProps } from "react-router-dom";
import OrderPlacement from "../../components/OrderPlacement";
import Claimer from "../../components/Claimer";
// import { Wrapper } from "../../components/swap/styleds";
import styled from "styled-components";
import {
  useDefaultsFromURLSearch,
  useDerivedSwapInfo,
  useSwapState,
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
  const { auctionId } = useSwapState();
  const { auctionEndDate } = useDerivedSwapInfo(auctionId);

  const Wrapper = styled.div`
    display: flex;
    flex-flow: row wrap;
    width: 100%;
    height: 100%;
    justify-content: space-between;
    align-items: stretch;
  `;

  return (
    <>
      <AppBody>
        {!account ? (
          <ButtonLight onClick={toggleWalletModal}>Connect Wallet</ButtonLight>
        ) : (
          <Wrapper>
            <AuctionHeader />
            <AuctionDetails />
            {auctionEndDate >= new Date().getTime() / 1000 ? (
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
