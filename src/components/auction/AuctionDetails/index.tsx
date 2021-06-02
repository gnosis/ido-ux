import { rgba } from 'polished'
import React, { useMemo, useState } from 'react'
import styled, { css } from 'styled-components'
import { Fraction, TokenAmount } from 'uniswap-xdai-sdk'

import { BigNumber } from '@ethersproject/bignumber'

import { useAuctionDetails } from '../../../hooks/useAuctionDetails'
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
import { DoubleChevronDown } from '../../icons/DoubleChevronDown'
import { ExternalLink } from '../../navigation/ExternalLink'
import { BaseCard } from '../../pureStyledComponents/BaseCard'
import TokenLogo from '../../token/TokenLogo'
import { AuctionTimer, TIMER_SIZE } from '../AuctionTimer'
import { ExtraDetailsItem, Props as ExtraDetailsItemProps } from '../ExtraDetailsItem'

const DETAILS_HEIGHT = '120px'

const Wrapper = styled.div`
  margin: 0 0 32px;
  min-height: ${TIMER_SIZE};
  position: relative;
`

const MainDetails = styled(BaseCard)`
  align-items: center;
  display: grid;
  justify-content: center;
  max-width: 100%;
  padding: 20px 15px;
  row-gap: 20px;
  position: relative;
  z-index: 5;

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
  line-height: 1.4;
  margin-bottom: 0;
  justify-content: center;
  white-space: nowrap;

  .tokenLogo {
    margin-top: -4px;
  }

  & > * {
    margin-right: 0;
  }
`

const TokenText = styled.span`
  margin: 0 10px 0 6px;
  white-space: nowrap;
`

const ExtraDetailsWrapper = styled.div`
  margin-left: auto;
  margin-right: auto;
  position: relative;
  width: calc(100% - 20px);
  z-index: 10;

  @media (min-width: ${({ theme }) => theme.themeBreakPoints.xl}) {
    margin-top: calc(calc(${TIMER_SIZE} - ${DETAILS_HEIGHT}) / -2);
  }
`

const ToggleExtraDetails = styled.span`
  align-items: center;
  color: ${({ theme }) => theme.primary1};
  cursor: pointer;
  display: flex;
  font-size: 13px;
  font-weight: 400;
  justify-content: center;
  line-height: 1.2;
  position: absolute;
  right: 10px;
  top: 8px;
  user-select: none;
  z-index: 10;
`

const DoubleChevron = styled(DoubleChevronDown)<{ isOpen: boolean }>`
  margin-left: 5px;
  transform: rotate(${(props) => (props.isOpen ? '180deg' : '0deg')});
`

const ExtraDetailsAnimWrapper = styled.div<{ wrapperHeight?: number }>`
  height: ${(props) => (props.wrapperHeight ? `${props.wrapperHeight}px` : '0')};
  overflow: hidden;
  position: relative;
  transition: height 0.15s ease-out;
  z-index: 5;
`

const ExtraDetails = styled.div`
  border-bottom-left-radius: 12px;
  border-bottom-right-radius: 12px;
  border-bottom: solid 1px ${({ theme }) => theme.primary2};
  border-left: solid 1px ${({ theme }) => theme.primary2};
  border-right: solid 1px ${({ theme }) => theme.primary2};
  column-gap: 15px;
  display: grid;
  grid-template-columns: 1fr;
  overflow: hidden;
  padding: 35px 20px 15px;
  row-gap: 25px;

  @media (min-width: ${({ theme }) => theme.themeBreakPoints.md}) {
    grid-auto-flow: column;
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: repeat(4, 1fr);
    row-gap: 15px;
  }

  @media (min-width: ${({ theme }) => theme.themeBreakPoints.xl}) {
    grid-template-columns: repeat(4, 1fr);
    grid-template-rows: repeat(2, 1fr);
  }
`

interface Props {
  auctionIdentifier: AuctionIdentifier
  derivedAuctionInfo: DerivedAuctionInfo
}

const isOdd = (value: number) => {
  return value % 2 == 0 ? false : true
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
  const { auctionDetails } = useAuctionDetails(auctionIdentifier)

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
  const [showMoreDetails, setShowMoreDetails] = useState(false)

  const toggleExtraDetails = () => {
    setShowMoreDetails(!showMoreDetails)
  }

  const tokenSold = useMemo(
    () =>
      derivedAuctionInfo &&
      auctionDetails &&
      new Fraction(Number(auctionDetails.currentBiddingAmount).toString(), '1').divide(
        derivedAuctionInfo.clearingPrice,
      ),
    [auctionDetails, derivedAuctionInfo],
  )
  const extraDetails: Array<ExtraDetailsItemProps> = React.useMemo(
    () => [
      {
        title: 'Last order cancelation date',
        tooltip: 'Last date at which an order cancelation is allowed',
        value:
          auctionDetails &&
          new Date(auctionDetails.orderCancellationEndDate * 1000).toLocaleString(),
      },
      {
        title: 'Auction End Date',
        value: auctionDetails && new Date(auctionDetails.endTimeTimestamp * 1000).toLocaleString(),
      },
      {
        progress:
          auctionDetails && derivedAuctionInfo
            ? auctionDetails.minFundingThreshold === '0x0'
              ? '-'
              : new Fraction(
                  BigNumber.from(10)
                    .pow(derivedAuctionInfo?.biddingToken.decimals + 2)
                    .mul(BigNumber.from(auctionDetails.currentBiddingAmount))
                    .toString(),
                  BigNumber.from(auctionDetails.minFundingThreshold).toString(),
                )
                  .toSignificant(2)
                  .concat(' %')
            : '-',
        title: 'Minimun funding',
        tooltip: 'Auction will not be executed, unless this minimum funding threshold is met',
        value:
          auctionDetails == null || auctionDetails.minFundingThreshold == '0x0'
            ? '0'
            : `${abbreviation(
                new TokenAmount(
                  derivedAuctionInfo.biddingToken,
                  auctionDetails.minFundingThreshold,
                ).toSignificant(2),
              )} ${getTokenDisplay(derivedAuctionInfo?.biddingToken, chainId)}`,
      },
      {
        progress:
          tokenSold && derivedAuctionInfo && derivedAuctionInfo.initialAuctionOrder
            ? tokenSold
                .multiply(
                  new Fraction(
                    BigNumber.from('10')
                      .pow(derivedAuctionInfo.auctioningToken.decimals + 2)
                      .toString(),
                    derivedAuctionInfo?.initialAuctionOrder?.sellAmount.raw.toString(),
                  ),
                )
                .toSignificant(2)
                .concat('%')
            : '-',
        title: 'Estimated tokens sold',
        tooltip:
          'If no further bids were canceled or placed, then this would be amount of tokens sold',
        value:
          tokenSold && derivedAuctionInfo
            ? `${abbreviation(tokenSold.toSignificant(2))}  ${getTokenDisplay(
                derivedAuctionInfo?.auctioningToken,
                chainId,
              )}`
            : '-',
      },
      {
        title: 'Atomic closure ',
        tooltip:
          'If atomic closure is enabled, one arbitrageur is allowed to place one further order at the time of auction settlement. This allows bridging on-chain liquidity into the auction',
        value: auctionDetails
          ? auctionDetails.isAtomicClosureAllowed
            ? 'Enabled'
            : 'Disabled'
          : '-',
      },
      {
        title: 'Min bidding amount per order',
        tooltip: 'Each order must at least bid this amount',
        value: auctionDetails
          ? `${abbreviation(
              new TokenAmount(
                derivedAuctionInfo?.biddingToken,
                auctionDetails.minimumBiddingAmountPerOrder,
              ).toSignificant(2),
            )} ${getTokenDisplay(derivedAuctionInfo?.biddingToken, chainId)}`
          : '-',
      },
      {
        title: 'Allow List Contract',
        tooltip: 'Address of the contract managing the allow-list for participation',
        url: `https://etherscan.io/address/${auctionDetails?.allowListManager}`,
        value: `${
          auctionDetails && auctionDetails.allowListManager == ''
            ? auctionDetails.allowListManager.substr(0, 6).concat('...')
            : 'None'
        }`,
      },
      {
        title: 'Signer Address',
        tooltip: 'Signer Address',
        url: `https://etherscan.io/address/${auctionDetails?.allowListSigner}`,
        value: `${
          auctionDetails && auctionDetails.allowListSigner == ''
            ? auctionDetails.allowListSigner.substr(0, 6).concat('...')
            : 'None'
        }`,
      },
    ],
    [auctionDetails, chainId, derivedAuctionInfo, tokenSold],
  )

  const [extraDetailsHeight, setExtraDetailsHeight] = useState(0)
  const componentRef = React.useRef(null)

  const updateExtraDetailsHeight = () => {
    setExtraDetailsHeight(componentRef?.current?.offsetHeight)
  }

  React.useEffect(() => {
    updateExtraDetailsHeight()
    // extraDetails is a dependency because we need to update the container's
    // height if the array's contents change
  }, [extraDetails])

  window.addEventListener('resize', updateExtraDetailsHeight)

  const showEmptyProgressColumn = (index: number): boolean => {
    if (!extraDetails[index + 1]) return false

    return (
      (isOdd(index) &&
        extraDetails[index - 1].progress !== undefined &&
        extraDetails[index].progress === undefined) ||
      (!isOdd(index) &&
        extraDetails[index + 1].progress !== undefined &&
        extraDetails[index].progress === undefined)
    )
  }

  return (
    <Wrapper>
      <MainDetails>
        <CellPair>
          <Cell
            itemKey={
              <>
                <span>Total auctioned</span>
                <Tooltip text={'Total amount of tokens available to be bought in the auction.'} />
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
                <Tooltip text={'This is the token that is accepted for bidding in the auction.'} />
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
                <Tooltip text={'Minimum bidding price the auctioneer defined for participation.'} />
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
      <ExtraDetailsWrapper>
        <ToggleExtraDetails onClick={toggleExtraDetails}>
          {showMoreDetails ? 'Less' : 'More Details'} <DoubleChevron isOpen={showMoreDetails} />
        </ToggleExtraDetails>
        <ExtraDetailsAnimWrapper wrapperHeight={showMoreDetails ? extraDetailsHeight : 0}>
          <ExtraDetails ref={componentRef}>
            {extraDetails.map((item, index) => (
              <ExtraDetailsItem
                key={index}
                progress={item.progress}
                showEmptyProgressColumn={showEmptyProgressColumn(index)}
                title={item.title}
                tooltip={item.tooltip}
                url={item.url}
                value={item.value}
              />
            ))}
          </ExtraDetails>
        </ExtraDetailsAnimWrapper>
      </ExtraDetailsWrapper>
    </Wrapper>
  )
}

export default AuctionDetails
