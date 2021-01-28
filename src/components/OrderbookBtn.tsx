import React, { useMemo } from "react";
import styled from "styled-components";
import Modal, { useModal } from "./MesaModal";

// const, types, utils
import { Token } from "@uniswap/sdk";

// components
import { DEFAULT_MODAL_OPTIONS } from "./Modal";
import { ButtonLight } from "./Button";
import OrderBookWidget from "./OrderbookWidget";

// hooks
import { useActiveWeb3React } from "../hooks";
import {
  useDerivedAuctionInfo,
  useSwapState,
} from "../state/orderPlacement/hooks";

// utils
import { getTokenDisplay } from "../utils";
import { OrderBookError } from "./OrderbookChartSmall";

import OrderBookChartSmall from "./OrderbookChartSmall";
import { useOrderbookDataCallback } from "../hooks/useOrderbookDataCallback";

const ViewOrderBookBtn = styled(ButtonLight)`
  margin: 0 0 0 0;
  background: none;
  height: auto;
  width: 100%;
  padding: 0;
  color: ${({ theme }) => theme.text3};

  &:hover {
    background: none;
  }

  > svg {
    margin: 0 0 0 5px;
  }
`;

const Wrapper = styled.div`
  display: block;
`;

// todo correct circular reference:
// const ModalWrapper = styled(ModalBodyWrapper)`
const ModalWrapper = styled.div`
  display: flex;
  text-align: center;
  height: 100%;
  min-width: 100%;
  width: 100%;
  align-items: center;
  align-content: flex-start;
  flex-flow: row wrap;
  padding: 0;
  justify-content: center;

  > span {
    display: flex;
    flex-flow: row wrap;
    align-items: center;
    margin: 1.6rem 0 1rem;
  }

  > span:first-of-type::after {
    content: "/";
    margin: 0 1rem;
  }

  > span:first-of-type > p {
    margin: 0 1rem 0 0;
  }

  > span:last-of-type > p {
    margin: 0 0 0 1rem;
  }

  .amcharts-Sprite-group {
    font-size: 1rem;
  }

  .amcharts-Container .amcharts-Label {
    text-transform: uppercase;
    font-size: 11px;
  }

  .amcharts-ZoomOutButton-group > .amcharts-RoundedRectangle-group {
    fill: var(--color-text-active);
    opacity: 0.6;
    transition: 0.3s ease-in-out;

    &:hover {
      opacity: 1;
    }
  }
`;

interface OrderBookBtnProps {
  baseToken: Token;
  quoteToken: Token;
  label?: string;
  className?: string;
}

export const OrderBookBtn: React.FC<OrderBookBtnProps> = (
  props: OrderBookBtnProps,
) => {
  const { className } = props;
  //   const theme = useContext(ThemeContext);
  const { chainId } = useActiveWeb3React();
  const { auctionId } = useSwapState();

  const { auctioningToken, biddingToken } = useDerivedAuctionInfo();

  const biddingTokenDisplay = useMemo(() => getTokenDisplay(biddingToken), [
    biddingToken,
  ]);

  const auctioningTokenDisplay = useMemo(
    () => getTokenDisplay(auctioningToken),
    [auctioningToken],
  );

  const [modalHook, toggleModal] = useModal({
    ...DEFAULT_MODAL_OPTIONS,
    large: true,
    title: `${auctioningTokenDisplay}-${biddingTokenDisplay} Order book`,
    message: (
      <ModalWrapper>
        <OrderBookWidget
          baseToken={biddingToken}
          quoteToken={auctioningToken}
          networkId={chainId}
          auctionId={auctionId}
        />
      </ModalWrapper>
    ),
    buttons: [
      <>&nbsp;</>,
      <Modal.Button
        label="Close"
        key="yes"
        isStyleDefault
        onClick={(): void => modalHook.hide()}
      />,
    ],
  });
  const { error, orderbookData } = useOrderbookDataCallback();
  if (error || !orderbookData) return <OrderBookError error={error} />;

  return (
    <Wrapper>
      <ViewOrderBookBtn
        className={className}
        onClick={toggleModal}
        type="button"
      >
        <OrderBookChartSmall
          baseToken={auctioningToken}
          quoteToken={biddingToken}
          networkId={chainId}
          data={orderbookData}
        />
      </ViewOrderBookBtn>
      <Modal.Modal {...modalHook} />
    </Wrapper>
  );
};
