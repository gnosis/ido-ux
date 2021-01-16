import React, { useState } from "react";
import { RouteComponentProps } from "react-router-dom";
import OrderPlacement from "../../components/OrderPlacement";
import Claimer from "../../components/Claimer";
import { Wrapper } from "../../components/swap/styleds";
import {
  AuctionState,
  useDefaultsFromURLSearch,
  useDerivedAuctionInfo,
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
import { OrderDisplay, OrderStatus } from "../../components/OrderTable";
import { Fraction, TokenAmount } from "@uniswap/sdk";

export default function Auction({ location: { search } }: RouteComponentProps) {
  useDefaultsFromURLSearch(search);
  const { account } = useActiveWeb3React();
  const toggleWalletModal = useWalletModalToggle();
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);

  // swap state
  const { auctionState, biddingToken } = useDerivedAuctionInfo();
  let orders: OrderDisplay[] | undefined;
  if (biddingToken != undefined) {
    orders = [
      {
        sellAmount: new TokenAmount(biddingToken, "10"),
        price: new Fraction("10", "1"),
        status: OrderStatus.PLACED,
      },
    ];
  }

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
              {auctionState == AuctionState.ORDER_PLACING ||
              auctionState == AuctionState.ORDER_PLACING_AND_CANCELING ? (
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
        <OrderDisplayDropdown
          showAdvanced={showAdvanced}
          setShowAdvanced={setShowAdvanced}
          orders={orders}
        />
      </AppBody>
    </>
  );
}
