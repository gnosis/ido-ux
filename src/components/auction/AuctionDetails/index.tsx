import { rgba } from 'polished'
import React, { useMemo } from 'react'
import styled, { css } from 'styled-components'

import { useClearingPriceInfo } from '../../../hooks/useCurrentClearingOrderAndVolumeCallback'
import {
  AuctionState,
  DerivedAuctionInfo,
  orderToPrice,
  orderToSellOrder,
  useOrderPlacementState,
  useSwapActionHandlers,
} from '../../../state/orderPlacement/hooks'
import { AuctionIdentifier } from '../../../state/orderPlacement/reducer'
import { getExplorerLink, getTokenDisplay } from '../../../utils'
import { abbreviation } from '../../../utils/numeral'
import { showChartsInverted } from '../../../utils/prices'
import { KeyValue } from '../../common/KeyValue'
import { Tooltip } from '../../common/Tooltip'
import { ExternalLink } from '../../navigation/ExternalLink'
import { BaseCard } from '../../pureStyledComponents/BaseCard'
import TokenLogo from '../../token/TokenLogo'
import { AuctionTimer, TIMER_SIZE } from '../AuctionTimer'

const DETAILS_HEIGHT = '120px'

const Wrapper = styled.div`
  margin: 0 0 30px;
  position: relative;
`

const MainDetails = styled(BaseCard)`
  align-items: center;
  display: grid;
  justify-content: center;
  max-width: 100%;
  padding: 20px 15px;
  row-gap: 20px;

  @media (min-width: ${({ theme }) => theme.themeBreakPoints.md}) {
    grid-template-columns: 1fr ${TIMER_SIZE} 1fr;
  }

  @media (min-width: ${({ theme }) => theme.themeBreakPoints.xl}) {
    height: ${DETAILS_HEIGHT};
    margin-bottom: calc(calc(${TIMER_SIZE} - ${DETAILS_HEIGHT}) / 2);
    margin-top: calc(calc(${TIMER_SIZE} - ${DETAILS_HEIGHT}) / 2);
    padding: 0;
  }
`

const CellPair = styled.div`
  align-items: center;
  column-gap: 15px;
  display: grid;
  grid-template-columns: 1fr 3px 1fr;
  row-gap: 15px;

  @media (min-width: ${({ theme }) => theme.themeBreakPoints.md}) {
    grid-template-columns: 1fr;
    grid-template-rows: 1fr 3px 1fr;
  }

  @media (min-width: ${({ theme }) => theme.themeBreakPoints.xl}) {
    grid-template-columns: 1fr 3px 1fr;
    grid-template-rows: none;
  }
`

const Cell = styled(KeyValue)`
  .itemKey {
    color: ${({ theme }) => rgba(theme.text1, 0.9)};
    font-size: 15px;
    line-height: 1.2;

    & > * {
      margin-right: 6px;

      &:last-child {
        margin-right: 0;
      }
    }
  }

  .itemValue {
    color: ${({ theme }) => theme.text1};
    flex-direction: column;
    flex-grow: 0;
    font-size: 18px;
    font-weight: 600;
    line-height: 1.2;
    margin-bottom: 0;
  }
`

const BreakCSS = css`
  height: 74px;
  width: 3px;
`

const Break = styled.div`
  background-color: ${({ theme }) => theme.primary1};
  border-radius: 3px;
  margin: auto;
  ${BreakCSS}

  @media (min-width: ${({ theme }) => theme.themeBreakPoints.md}) {
    height: 3px;
    width: 74px;
  }

  @media (min-width: ${({ theme }) => theme.themeBreakPoints.xl}) {
    ${BreakCSS}
  }
`

const Timer = styled(AuctionTimer)`
  margin: auto;

  @media (min-width: ${({ theme }) => theme.themeBreakPoints.xl}) {
    margin-bottom: calc(calc(${TIMER_SIZE} - ${DETAILS_HEIGHT}) / -2);
    margin-top: calc(calc(${TIMER_SIZE} - ${DETAILS_HEIGHT}) / -2);
  }
`

const TokenValue = styled.span`
  font-size: 28px;
  font-weight: 600;
  line-height: 1.2;
  margin-bottom: 1px;
  margin-right: 0;
  text-align: center;
  white-space: nowrap;
`

const TokenSymbol = styled.span`
  align-items: center;
  display: flex;
  font-size: 18px;
  line-height: 1.2;
  margin-bottom: 0;
  justify-content: center;
  white-space: nowrap;

  & > * {
    margin-right: 0;
  }
`

const TokenText = styled.span`
  margin: 0 10px 0 5px;
  white-space: nowrap;
`

interface Props {
  auctionIdentifier: AuctionIdentifier
  derivedAuctionInfo: DerivedAuctionInfo
}

const AuctionDetails = (props: Props) => {
  const {
    auctionIdentifier,
    derivedAuctionInfo: { auctionState },
    derivedAuctionInfo,
  } = props
  const { chainId } = auctionIdentifier

  const auctionTokenAddress = useMemo(
    () => getExplorerLink(chainId, derivedAuctionInfo?.auctioningToken?.address, 'address'),
    [chainId, derivedAuctionInfo?.auctioningToken],
  )
  const { showPriceInverted } = useOrderPlacementState()
  const { onInvertPrices } = useSwapActionHandlers()

  // Start with inverted prices, if orderbook is also show inverted,
  // i.e. if the baseToken/auctioningToken is a stable token
  React.useEffect(() => {
    if (derivedAuctionInfo?.auctioningToken != null && !showPriceInverted) {
      if (showChartsInverted(derivedAuctionInfo?.auctioningToken)) {
        onInvertPrices()
      }
    }
  }, [derivedAuctionInfo?.auctioningToken, onInvertPrices, showPriceInverted])

  const biddingTokenAddress = useMemo(
    () => getExplorerLink(chainId, derivedAuctionInfo?.biddingToken?.address, 'address'),
    [chainId, derivedAuctionInfo?.biddingToken],
  )

  const { clearingPriceInfo } = useClearingPriceInfo(auctionIdentifier)
  const biddingTokenDisplay = useMemo(
    () => getTokenDisplay(derivedAuctionInfo?.biddingToken, chainId),
    [derivedAuctionInfo?.biddingToken, chainId],
  )
  const auctioningTokenDisplay = useMemo(
    () => getTokenDisplay(derivedAuctionInfo?.auctioningToken, chainId),
    [derivedAuctionInfo?.auctioningToken, chainId],
  )
  const clearingPriceDisplay = useMemo(() => {
    const clearingPriceInfoAsSellOrder =
      clearingPriceInfo &&
      orderToSellOrder(
        clearingPriceInfo.clearingOrder,
        derivedAuctionInfo?.biddingToken,
        derivedAuctionInfo?.auctioningToken,
      )
    const clearingPriceNumber = showPriceInverted
      ? orderToPrice(clearingPriceInfoAsSellOrder)?.invert().toSignificant(5)
      : orderToPrice(clearingPriceInfoAsSellOrder)?.toSignificant(5)

    const priceSymbolStrings = showPriceInverted
      ? `${getTokenDisplay(derivedAuctionInfo?.auctioningToken, chainId)} per
    ${getTokenDisplay(derivedAuctionInfo?.biddingToken, chainId)}`
      : `${getTokenDisplay(derivedAuctionInfo?.biddingToken, chainId)} per
    ${getTokenDisplay(derivedAuctionInfo?.auctioningToken, chainId)}
`

    return clearingPriceNumber ? (
      <>
        <TokenValue>{abbreviation(clearingPriceNumber)}</TokenValue>{' '}
        <TokenSymbol>{priceSymbolStrings}</TokenSymbol>
      </>
    ) : (
      '-'
    )
  }, [
    derivedAuctionInfo?.auctioningToken,
    showPriceInverted,
    derivedAuctionInfo?.biddingToken,
    clearingPriceInfo,
    chainId,
  ])

  const titlePrice = useMemo(
    () =>
      !auctionState
        ? 'Loading...'
        : auctionState === AuctionState.ORDER_PLACING ||
          auctionState === AuctionState.ORDER_PLACING_AND_CANCELING
        ? 'Current price'
        : auctionState === AuctionState.PRICE_SUBMISSION
        ? 'Clearing price'
        : 'Closing price',
    [auctionState],
  )

  const initialPriceToDisplay = derivedAuctionInfo?.initialPrice
  return (
    <Wrapper>
      <MainDetails>
        <CellPair>
          <Cell
            itemKey={
              <>
                <span>Total auctioned</span>
                <Tooltip
                  id="totalAuctioned"
                  text={'Total amount of tokens available to be bought in the auction.'}
                />
              </>
            }
            itemValue={
              derivedAuctionInfo?.auctioningToken && derivedAuctionInfo?.initialAuctionOrder ? (
                <>
                  <TokenValue>
                    {abbreviation(
                      derivedAuctionInfo?.initialAuctionOrder?.sellAmount.toSignificant(4),
                    )}
                  </TokenValue>
                  <TokenSymbol>
                    <TokenLogo
                      size={'18px'}
                      token={{
                        address: derivedAuctionInfo?.auctioningToken.address,
                        symbol: derivedAuctionInfo?.auctioningToken.symbol,
                      }}
                    />
                    <TokenText>{auctioningTokenDisplay}</TokenText>
                    <ExternalLink href={auctionTokenAddress} />
                  </TokenSymbol>
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
                <span>Bidding with</span>
                <Tooltip
                  id="biddingWith"
                  text={'This is the token that is accepted for bidding in the auction.'}
                />
              </>
            }
            itemValue={
              derivedAuctionInfo?.biddingToken ? (
                <>
                  <TokenSymbol>
                    <TokenLogo
                      size={'18px'}
                      token={{
                        address: derivedAuctionInfo?.biddingToken.address,
                        symbol: derivedAuctionInfo?.biddingToken.symbol,
                      }}
                    />
                    <TokenText>{biddingTokenDisplay}</TokenText>
                    <ExternalLink href={biddingTokenAddress} />
                  </TokenSymbol>
                </>
              ) : (
                '-'
              )
            }
          />
        </CellPair>
        <Timer derivedAuctionInfo={derivedAuctionInfo} />
        <CellPair>
          <Cell
            itemKey={
              <>
                <span>{titlePrice}</span>
                <Tooltip
                  id="auctionPrice"
                  text={
                    "This will be the auction's Closing Price if no more bids are submitted or canceled, OR it will be the auction's Clearing Price if the auction concludes without additional bids."
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
                <span>{showPriceInverted ? `Max Sell Price` : `Min Sell Price`}</span>
                <Tooltip
                  id="minSellPrice"
                  text={'Minimum bidding price the auctioneer defined for participation.'}
                />
              </>
            }
            itemValue={
              <>
                <TokenValue>
                  {initialPriceToDisplay
                    ? showPriceInverted
                      ? initialPriceToDisplay?.invert().toSignificant(5)
                      : abbreviation(initialPriceToDisplay?.toSignificant(2))
                    : ' - '}
                </TokenValue>
                <TokenSymbol>
                  {initialPriceToDisplay && auctioningTokenDisplay
                    ? showPriceInverted
                      ? ` ${auctioningTokenDisplay} per ${biddingTokenDisplay}`
                      : ` ${biddingTokenDisplay} per ${auctioningTokenDisplay}`
                    : '-'}
                </TokenSymbol>
              </>
            }
          />
        </CellPair>
      </MainDetails>
    </Wrapper>
  )
}

export default AuctionDetails
