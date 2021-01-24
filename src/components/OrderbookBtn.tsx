import React, { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import Modal, { useModal } from "./MesaModal";

// assets
import { faChartLine } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// const, types, utils
import { Token } from "@uniswap/sdk";

// components
import { DEFAULT_MODAL_OPTIONS } from "./Modal";
import { ButtonLight } from "./Button";
import OrderBookWidget, { processRawApiData } from "./OrderbookWidget";

// hooks
import { useActiveWeb3React } from "../hooks";
import {
  useDerivedAuctionInfo,
  useSwapState,
} from "../state/orderPlacement/hooks";

// utils
import { getTokenDisplay } from "../utils";
import OrderBookChart, {
  OrderBookError,
  PricePointDetails,
} from "./OrderbookChart";
import { additionalServiceApi } from "../api";

const ViewOrderBookBtn = styled(ButtonLight)`
  margin: 0 0 0 0;
  background-color: ${({ theme }) => theme.bg1};

  max-height: 200px;
  > svg {
    margin: 0 0 0 5px;
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
  const [apiData, setApiData] = useState<PricePointDetails[] | null>(null);
  const [error, setError] = useState<Error | null>(null);

  // sync resetting ApiData to avoid old data on new labels flash
  // and layout changes
  useMemo(() => {
    setApiData(null);
    setError(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [biddingToken, auctioningToken, chainId]);

  useEffect(() => {
    // handle stale fetches resolving out of order
    let cancelled = false;

    const fetchApiData = async (): Promise<void> => {
      try {
        const rawData = await additionalServiceApi.getOrderBookData({
          networkId: chainId,
          auctionId,
        });

        if (cancelled) return;

        const processedData = processRawApiData({
          data: rawData,
          quoteToken: biddingToken,
          baseToken: auctioningToken,
        });

        setApiData(processedData);
      } catch (error) {
        if (cancelled) return;
        console.error("Error populating orderbook with data", error);
        setError(error);
      }
    };

    fetchApiData();

    return (): void => {
      cancelled = true;
    };
  }, [biddingToken, auctioningToken, chainId, auctionId, setApiData, setError]);

  if (error) return <OrderBookError error={error} />;

  return (
    <>
      <ViewOrderBookBtn
        className={className}
        onClick={toggleModal}
        type="button"
      >
        <OrderBookChart
          baseToken={auctioningToken}
          quoteToken={biddingToken}
          networkId={chainId}
          data={apiData}
        />
      </ViewOrderBookBtn>
      <Modal.Modal {...modalHook} />
    </>
  );
};
