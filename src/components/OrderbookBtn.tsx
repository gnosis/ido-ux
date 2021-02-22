import React, { useMemo } from 'react'
import styled from 'styled-components'

import { Token } from '@uniswap/sdk'

import { useActiveWeb3React } from '../hooks'
import { useSwapState } from '../state/orderPlacement/hooks'
import { useOrderbookState } from '../state/orderbook/hooks'
import { getTokenDisplay } from '../utils'
import { ButtonLight } from './Button'
import OrderBookChartSmall, { OrderBookError } from './OrderbookChartSmall'
import OrderBookWidget, { processOrderbookData } from './OrderbookWidget'
import Modal, { useModal } from './modals/MesaModal'
import { DEFAULT_MODAL_OPTIONS } from './modals/Modal'

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
`

const Wrapper = styled.div`
  display: block;
`

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
    content: '/';
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
`

interface OrderBookBtnProps {
  baseToken: Token
  quoteToken: Token
  label?: string
  className?: string
}

export const OrderBookBtn: React.FC<OrderBookBtnProps> = (props: OrderBookBtnProps) => {
  const { baseToken, className, quoteToken } = props
  //   const theme = useContext(ThemeContext);
  const { chainId } = useActiveWeb3React()
  const { auctionId } = useSwapState()

  const biddingTokenDisplay = useMemo(() => getTokenDisplay(baseToken), [baseToken])

  const auctioningTokenDisplay = useMemo(() => getTokenDisplay(quoteToken), [quoteToken])

  const [modalHook, toggleModal] = useModal({
    ...DEFAULT_MODAL_OPTIONS,
    large: true,
    title: `${biddingTokenDisplay}-${auctioningTokenDisplay} Order book`,
    message: (
      <ModalWrapper>
        <OrderBookWidget
          auctionId={auctionId}
          baseToken={baseToken}
          networkId={chainId}
          quoteToken={quoteToken}
        />
      </ModalWrapper>
    ),
    buttons: [
      <>&nbsp;</>,
      <Modal.Button
        isStyleDefault
        key="yes"
        label="Close"
        onClick={(): void => modalHook.hide()}
      />,
    ],
  })
  const { asks, bids, error, userOrderPrice, userOrderVolume } = useOrderbookState()

  if (error || !asks || asks.length == 0) return <OrderBookError error={error} />
  const processedOrderbook = processOrderbookData({
    data: { bids, asks },
    userOrder: { price: userOrderPrice, volume: userOrderVolume },
    baseToken,
    quoteToken,
  })
  return (
    <Wrapper>
      <ViewOrderBookBtn className={className} onClick={toggleModal} type="button">
        <OrderBookChartSmall
          baseToken={baseToken}
          data={processedOrderbook}
          networkId={chainId}
          quoteToken={quoteToken}
        />
      </ViewOrderBookBtn>
      <Modal.Modal {...modalHook} />
    </Wrapper>
  )
}
