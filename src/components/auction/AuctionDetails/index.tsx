import React, { useMemo } from 'react'
import styled from 'styled-components'

import { useActiveWeb3React } from '../../../hooks'
import { useClearingPriceInfo } from '../../../hooks/useCurrentClearingOrderAndVolumeCallback'
import {
  AuctionState,
  orderToPrice,
  orderToSellOrder,
  useDerivedAuctionInfo,
  useDerivedAuctionState,
} from '../../../state/orderPlacement/hooks'
import { getEtherscanLink, getTokenDisplay } from '../../../utils'
import TokenLogo from '../../TokenLogo'
import { KeyValue } from '../../common/KeyValue'
import { Tooltip } from '../../common/Tooltip'
import { ExternalLink } from '../../navigation/ExternalLink'
import { AuctionTimer } from '../AuctionTimer'

const Wrapper = styled.div`
  align-items: center;
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.border};
  display: grid;
  grid-template-columns: 1fr 3px 1fr 154px 1fr 3px 1fr;
  margin: 0 0 50px;
  max-width: 100%;
  min-height: 130px;
`

const Cell = styled(KeyValue)`
  padding: 0 10px;

  &:first-child {
    padding-left: 0;
  }

  &:last-child {
    padding-right: 0;
  }
`

const Break = styled.div`
  background-color: ${({ theme }) => theme.primary1};
  border-radius: 3px;
  min-height: 50px;
  width: 3px;
`

const TimerWrapper = styled.div`
  max-height: 130px;
  position: relative;
`

const TooltipStyled = styled(Tooltip)`
  position: relative;
  top: -1px;
`

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
      <Cell
        itemKey={
          <>
            <span>{titlePrice}</span>
            <TooltipStyled
              id="auctionPrice"
              text={
                '"Current Price" shows the current closing price of the auction if no more bids are submitted or canceled'
              }
            />
          </>
        }
        itemValue={clearingPriceDisplay ? clearingPriceDisplay : '-'}
      />
      <Break />
      <Cell
        itemKey={
          <>
            <span>Bidding with</span>
            <TooltipStyled id="biddingWith" text={'Bidding with tooltip'} />
          </>
        }
        itemValue={
          biddingToken ? (
            <>
              <TokenLogo address={biddingToken.address} size={'20px'} />
              <span>{biddingTokenDisplay}</span>
              <ExternalLink href={biddingTokenAddress} />
            </>
          ) : (
            '-'
          )
        }
      />
      <TimerWrapper>
        <AuctionTimer />
      </TimerWrapper>
      <Cell
        itemKey={
          <>
            <span>Total auctioned</span>
            <TooltipStyled id="totalAuctioned" text={'Total auctioned tooltip'} />
          </>
        }
        itemValue={
          auctioningToken ? (
            <>
              <TokenLogo address={auctioningToken.address} size={'20px'} />
              <span>{`${initialAuctionOrder?.sellAmount.toSignificant(
                2,
              )} ${auctioningTokenDisplay}`}</span>
              <ExternalLink href={auctionTokenAddress} />
            </>
          ) : (
            '-'
          )
        }
      />

      <Break />
      <Cell
        itemKey={
          <>
            <span>Min Sell Price</span>
            <TooltipStyled id="minSellPrice" text={'Min Sell Price tooltip'} />
          </>
        }
        itemValue={
          initialPrice && auctioningTokenDisplay && auctioningTokenDisplay
            ? `${initialPrice ? initialPrice?.toSignificant(2) : ' - '}
          ${biddingTokenDisplay}/${auctioningTokenDisplay}`
            : '-'
        }
      />
    </Wrapper>
  )
}

export default AuctionDetails
