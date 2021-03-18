import React, { useMemo } from 'react'
import styled from 'styled-components'

import { useClearingPriceInfo } from '../../../hooks/useCurrentClearingOrderAndVolumeCallback'
import {
  AuctionState,
  orderToPrice,
  orderToSellOrder,
  useDerivedAuctionInfo,
  useDerivedAuctionState,
  useSwapState,
} from '../../../state/orderPlacement/hooks'
import { getEtherscanLink, getTokenDisplay } from '../../../utils'
import { normalizePrice } from '../../../utils/tools'
import { KeyValue } from '../../common/KeyValue'
import TokenLogo from '../../common/TokenLogo'
import { Tooltip } from '../../common/Tooltip'
import { ExternalLink } from '../../navigation/ExternalLink'
import { BaseCard } from '../../pureStyledComponents/BaseCard'
import { AuctionTimer } from '../AuctionTimer'

const Wrapper = styled(BaseCard)`
  align-items: center;
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

const AuctionDetails = () => {
  const { chainId } = useSwapState()
  const derivedAuctionInfo = useDerivedAuctionInfo()
  const { auctionState } = useDerivedAuctionState()

  const auctionTokenAddress = useMemo(
    () => getEtherscanLink(chainId, derivedAuctionInfo?.auctioningToken?.address, 'address'),
    [chainId, derivedAuctionInfo?.auctioningToken],
  )

  const biddingTokenAddress = useMemo(
    () => getEtherscanLink(chainId, derivedAuctionInfo?.biddingToken?.address, 'address'),
    [chainId, derivedAuctionInfo?.biddingToken],
  )

  const { clearingPriceInfo } = useClearingPriceInfo()
  const biddingTokenDisplay = useMemo(() => getTokenDisplay(derivedAuctionInfo?.biddingToken), [
    derivedAuctionInfo?.biddingToken,
  ])
  const auctioningTokenDisplay = useMemo(
    () => getTokenDisplay(derivedAuctionInfo?.auctioningToken),
    [derivedAuctionInfo?.auctioningToken],
  )
  const clearingPriceDisplay = useMemo(() => {
    const clearingPriceInfoAsSellOrder =
      clearingPriceInfo &&
      orderToSellOrder(
        clearingPriceInfo.clearingOrder,
        derivedAuctionInfo?.biddingToken,
        derivedAuctionInfo?.auctioningToken,
      )
    const clearingPriceNumber = orderToPrice(clearingPriceInfoAsSellOrder)?.toSignificant(4)

    return clearingPriceNumber
      ? `${clearingPriceNumber} ${getTokenDisplay(
          derivedAuctionInfo?.biddingToken,
        )}/${getTokenDisplay(derivedAuctionInfo?.auctioningToken)}`
      : '-'
  }, [derivedAuctionInfo?.auctioningToken, derivedAuctionInfo?.biddingToken, clearingPriceInfo])

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

  const initialPriceToDisplay = derivedAuctionInfo?.initialPrice
  return (
    <Wrapper noPadding>
      <Cell
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
        itemValue={clearingPriceDisplay ? clearingPriceDisplay : '-'}
      />
      <Break />
      <Cell
        itemKey={
          <>
            <span>Bidding with</span>
            <Tooltip id="biddingWith" text={'Bidding with tooltip'} />
          </>
        }
        itemValue={
          derivedAuctionInfo?.biddingToken ? (
            <>
              <TokenLogo
                size={'20px'}
                token={{
                  address: derivedAuctionInfo?.biddingToken.address,
                  symbol: derivedAuctionInfo?.biddingToken.symbol,
                }}
              />
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
            <Tooltip id="totalAuctioned" text={'Total auctioned tooltip'} />
          </>
        }
        itemValue={
          derivedAuctionInfo?.auctioningToken && derivedAuctionInfo?.initialAuctionOrder ? (
            <>
              <TokenLogo
                size={'20px'}
                token={{
                  address: derivedAuctionInfo?.auctioningToken.address,
                  symbol: derivedAuctionInfo?.auctioningToken.symbol,
                }}
              />
              <span>{`${derivedAuctionInfo?.initialAuctionOrder?.sellAmount.toSignificant(
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
            <Tooltip id="minSellPrice" text={'Min Sell Price tooltip'} />
          </>
        }
        itemValue={
          <>
            {initialPriceToDisplay ? initialPriceToDisplay?.toSignificant(2) : ' - '}
            {initialPriceToDisplay && auctioningTokenDisplay
              ? `${biddingTokenDisplay}/${auctioningTokenDisplay}`
              : '-'}
          </>
        }
      />
    </Wrapper>
  )
}

export default AuctionDetails
