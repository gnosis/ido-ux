import React, { useMemo } from 'react'
import styled from 'styled-components'

import { useActiveWeb3React } from '../../hooks'
import { useClearingPriceInfo } from '../../hooks/useCurrentClearingOrderAndVolumeCallback'
import {
  AuctionState,
  orderToPrice,
  orderToSellOrder,
  useDerivedAuctionInfo,
  useDerivedAuctionState,
} from '../../state/orderPlacement/hooks'
import { getEtherscanLink, getTokenDisplay } from '../../utils'
import { KeyValue } from '../common/KeyValue'
import { Tooltip } from '../common/Tooltip'

const Wrapper = styled.div`
  align-items: center;
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.border};
  display: grid;
  grid-template-columns: 1fr 1fr 154px 1fr 1fr;
  margin: 0 0 50px;
  max-width: 100%;
  min-height: 130px;
`

const Cell = styled.div``

const AuctionDetails = () => {
  const { chainId } = useActiveWeb3React()
  const {
    auctioningToken,
    biddingToken,
    clearingPrice,
    initialAuctionOrder,
    initialPrice,
  } = useDerivedAuctionInfo()
  const { auctionState } = useDerivedAuctionState()

  const auctionTokenAddress = useMemo(
    () => getEtherscanLink(chainId, auctioningToken?.address, 'address'),
    [chainId, auctioningToken],
  )

  const biddingTokenAddress = useMemo(
    () => getEtherscanLink(chainId, biddingToken?.address, 'address'),
    [chainId, biddingToken],
  )

  const clearingPriceInfo = useClearingPriceInfo()
  const biddingTokenDisplay = useMemo(() => getTokenDisplay(biddingToken), [biddingToken])
  const auctioningTokenDisplay = useMemo(() => getTokenDisplay(auctioningToken), [auctioningToken])

  const clearingPriceDisplay = useMemo(() => {
    const clearingPriceInfoAsSellOrder =
      clearingPriceInfo &&
      orderToSellOrder(clearingPriceInfo.clearingOrder, biddingToken, auctioningToken)
    let clearingPriceNumber = orderToPrice(clearingPriceInfoAsSellOrder)?.toSignificant(4)

    if (clearingPrice) {
      clearingPriceNumber = clearingPrice && clearingPrice.toSignificant(4)
    }

    return clearingPriceNumber
      ? `${clearingPriceNumber} ${getTokenDisplay(biddingToken)}/${getTokenDisplay(
          auctioningToken,
        )}`
      : '-'
  }, [auctioningToken, biddingToken, clearingPrice, clearingPriceInfo])

  const titlePrice = useMemo(
    () =>
      auctionState === AuctionState.ORDER_PLACING ||
      auctionState === AuctionState.ORDER_PLACING_AND_CANCELING
        ? 'Current price'
        : auctionState === AuctionState.PRICE_SUBMISSION
        ? 'Clearing price'
        : 'Closing price',
    [auctionState],
  )

  return (
    <Wrapper>
      <Cell>
        <KeyValue
          itemKey={
            <>
              <span>{titlePrice}</span>
              <Tooltip
                id="auctionPrice"
                text={
                  '"Current Price" shows the current closing price of the auction if no more bids are submitted or canceled'
                }
              />
            </>
          }
          itemValue={clearingPriceDisplay}
        />
      </Cell>
      <Cell>
        {/* <ExternalLink href={biddingTokenAddress}>{} ↗</ExternalLink> */}
        <KeyValue
          itemKey={
            <>
              <span>Bidding with</span>
              <Tooltip id="biddingWith" text={'Bidding with tooltip'} />
            </>
          }
          itemValue={biddingTokenDisplay}
        />
      </Cell>
      <Cell>Time</Cell>
      <Cell>
        {/* <ExternalLink href={auctionTokenAddress}>{} ↗</ExternalLink> */}
        <KeyValue
          itemKey={
            <>
              <span>Total auctioned</span>
              <Tooltip id="totalAuctioned" text={'Total auctioned tooltip'} />
            </>
          }
          itemValue={`${initialAuctionOrder?.sellAmount.toSignificant(
            2,
          )} ${auctioningTokenDisplay}`}
        />
      </Cell>
      <Cell>
        <KeyValue
          itemKey={
            <>
              <span>Min Sell Price</span>
              <Tooltip id="minSellPrice" text={'Min Sell Price tooltip'} />
            </>
          }
          itemValue={`${initialPrice ? initialPrice?.toSignificant(2) : ' - '}
          ${biddingTokenDisplay}/${auctioningTokenDisplay}`}
        />
      </Cell>
    </Wrapper>
  )
}

export default AuctionDetails
