import React, { useEffect, useState } from "react";
import { RouteComponentProps } from "react-router-dom";
import OrderPlacement from "../../components/OrderPlacement";
import Claimer from "../../components/Claimer";
import styled from "styled-components";
import {
  AuctionState,
  useDefaultsFromURLSearch,
  useDerivedAuctionInfo,
  useSwapState,
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
  OrderDisplay,
  OrderState,
  OrderStatus,
} from "../../state/orders/reducer";
import {
  useOrderActionHandlers,
  useOrderState,
} from "../../state/orders/hooks";
import { additionalServiceApi } from "../../api";
import { decodeOrder } from "../../hooks/Order";
import { BigNumber } from "@ethersproject/bignumber";
import { Fraction } from "@uniswap/sdk";

const Wrapper = styled.div`
  display: flex;
  flex-flow: row wrap;
  width: 100%;
  justify-content: space-between;
  align-items: stretch;
  ${({ theme }) => theme.mediaWidth.upToMedium`flex-flow: column wrap;`};
`;

export default function Auction({ location: { search } }: RouteComponentProps) {
  useDefaultsFromURLSearch(search);
  const { account, chainId } = useActiveWeb3React();
  const toggleWalletModal = useWalletModalToggle();
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);
  const { auctionId } = useSwapState();
  const {
    auctionState,
    biddingToken,
    auctioningToken,
  } = useDerivedAuctionInfo();
  const orders: OrderState | undefined = useOrderState();
  const { onNewOrder } = useOrderActionHandlers();
  const [userOrders, setUserOrders] = useState<boolean>();

  // initial loading of orders from user from api
  useEffect(() => {
    async function fetchData() {
      if (
        chainId == undefined ||
        account == undefined ||
        biddingToken == undefined ||
        auctioningToken == undefined
      ) {
        return;
      }
      const sellOrdersFromUser = await additionalServiceApi.getCurrentUserOrders(
        {
          networkId: chainId,
          auctionId,
          user: account,
        },
      );
      const sellOrderDisplays: OrderDisplay[] = [];
      for (const orderString of sellOrdersFromUser) {
        const order = decodeOrder(orderString);
        sellOrderDisplays.push({
          id: orderString,
          sellAmount: new Fraction(
            order.sellAmount.toString(),
            BigNumber.from(10).pow(biddingToken.decimals).toString(),
          ).toSignificant(2),
          price: new Fraction(
            order.sellAmount
              .mul(BigNumber.from(10).pow(auctioningToken.decimals))
              .toString(),
            order.buyAmount
              .mul(BigNumber.from(10).pow(biddingToken.decimals))
              .toString(),
          ).toSignificant(2),
          status: OrderStatus.PLACED,
        });
      }
      onNewOrder(sellOrderDisplays);
      setUserOrders(true);
    }
    if (!userOrders) {
      fetchData();
    }
  }, [
    account,
    auctionId,
    chainId,
    biddingToken,
    auctioningToken,
    onNewOrder,
    userOrders,
  ]);

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
        <div>
          <Wrapper>
            <AuctionHeader />
            <Wrapper>
              <AuctionDetails />
              {auctionState == AuctionState.ORDER_PLACING ||
              auctionState == AuctionState.ORDER_PLACING_AND_CANCELING ? (
                <div style={{ width: "60%" }}>
                  <OrderBody>
                    <OrderPlacement />
                  </OrderBody>
                </div>
              ) : (
                <ClaimerBody>
                  <Claimer />
                </ClaimerBody>
              )}
            </Wrapper>
            {orders != undefined && orders.orders.length > 0 ? (
              <OrderDisplayDropdown
                showAdvanced={showAdvanced}
                setShowAdvanced={setShowAdvanced}
                orders={orders.orders}
              />
            ) : (
              <div></div>
            )}
          </Wrapper>
        </div>
      )}
    </AppBody>
  );
}
