import React from "react";
import styled from "styled-components";
import Modal, { useModal } from "./MesaModal";

// assets
import { faChartLine } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// const, types, utils
import { Token } from "@uniswap/sdk";

// components
import { DEFAULT_MODAL_OPTIONS } from "./Modal";
import OrderBookWidget from "./OrderbookWidget";

// hooks
import { useActiveWeb3React } from "../hooks";
import {
  useDerivedAuctionInfo,
  useSwapState,
} from "../state/orderplacement/hooks";

const ViewOrderBookBtn = styled.button`
  margin: 40px auto 40px auto;
  text-align: right;
  display: flex;
  align-items: center;
  background: ${({ theme }) => theme.bg2};

  svg {
    font-size: 2.7rem;
    fill: var(--color-text-active);
    margin: 0px 40px 0px 40px;
  }
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
  background: ${({ theme }) => theme.bg2};

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
    font-size: 1.2rem;
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

  const { auctioningToken, biddingToken } = useDerivedAuctionInfo(auctionId);

  const [modalHook, toggleModal] = useModal({
    ...DEFAULT_MODAL_OPTIONS,
    large: true,
    title: `${auctioningToken?.symbol}-${biddingToken?.symbol} Order book`,
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

  return (
    <>
      <ViewOrderBookBtn
        className={className}
        onClick={toggleModal}
        type="button"
      >
        {/* {label || "View Order Book"}{" "} */}
        <FontAwesomeIcon className="chart-icon" icon={faChartLine} />
      </ViewOrderBookBtn>
      <Modal.Modal {...modalHook} />
    </>
  );
};
