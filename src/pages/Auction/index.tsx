import React from "react";
import { RouteComponentProps } from "react-router-dom";
import OrderPlacement from "../../components/OrderPlacement";
import Claimer from "../../components/Claimer";
import { Wrapper } from "../../components/swap/styleds";
import {
  useDefaultsFromURLSearch,
  useDerivedAuctionInfo,
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
  const { auctionEndDate } = useDerivedAuctionInfo(auctionId);

  return (
    <>
      <AppBody>
        {!account ? (
          <ButtonLight onClick={toggleWalletModal}>Connect Wallet</ButtonLight>
        ) : (
          <div>
            <div style={{ padding: "1rem" }}>
              <AuctionHeader></AuctionHeader>
            </div>
            <div
              style={{
                width: "35%",
                float: "left",
                alignContent: "center",
                padding: "0.5rem",
              }}
            >
              <AuctionDetails></AuctionDetails>
            </div>
            <div
              style={{
                width: "65%",
                float: "right",
                alignContent: "right",
                padding: "0.5rem",
              }}
            >
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
          </div>
        )}
      </AppBody>
    </>
  );
}
