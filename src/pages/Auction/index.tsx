import React, { useEffect } from 'react'
import { RouteComponentProps } from 'react-router-dom'
import styled from 'styled-components'

import AuctionBody from '../../components/auction/AuctionBody'
import AuctionDetails from '../../components/auction/AuctionDetails'
import { ButtonCopy } from '../../components/buttons/ButtonCopy'
import { InlineLoading } from '../../components/common/InlineLoading'
import { NetworkIcon } from '../../components/icons/NetworkIcon'
import WarningModal from '../../components/modals/WarningModal'
import { PageTitle } from '../../components/pureStyledComponents/PageTitle'
import { SubTitle, SubTitleWrapper } from '../../components/pureStyledComponents/SubTitle'
import {
  useDefaultsFromURLSearch,
  useDerivedAuctionInfo,
  useSwapActionHandlers,
} from '../../state/orderPlacement/hooks'
import { parseURL } from '../../state/orderPlacement/reducer'
import { useTokenListState } from '../../state/tokenList/hooks'
import { isAddress } from '../../utils'
import { showChartsInverted } from '../../utils/prices'
import { getChainName } from '../../utils/tools'

const Title = styled(PageTitle)`
  margin-bottom: 2px;
`

const SubTitleWrapperStyled = styled(SubTitleWrapper)`
  margin-bottom: 110px;

  @media (min-width: ${({ theme }) => theme.themeBreakPoints.md}) {
    margin-bottom: 40px;
  }
`

const AuctionId = styled.span`
  align-items: center;
  display: flex;
`

const CopyButton = styled(ButtonCopy)`
  height: 14px;
  width: 14px;
`

const Network = styled.span`
  align-items: center;
  display: flex;
  margin-right: 5px;
`

const NetworkIconStyled = styled(NetworkIcon)`
  height: 14px;
  width: 14px;
`

const NetworkName = styled.span`
  margin-left: 8px;
  text-transform: capitalize;
`

interface Props extends RouteComponentProps {
  showTokenWarning: (bothTokensSupported: boolean) => void
}

const Auction: React.FC<Props> = (props) => {
  const {
    history,
    location: { search },
    showTokenWarning,
  } = props

  const auctionIdentifier = parseURL(search)
  const derivedAuctionInfo = useDerivedAuctionInfo(auctionIdentifier)
  const { tokens } = useTokenListState()
  const url = window.location.href

  const biddingTokenAddress = derivedAuctionInfo?.biddingToken?.address
  const auctioningTokenAddress = derivedAuctionInfo?.auctioningToken?.address
  const { onInvertPrices } = useSwapActionHandlers()

  // Start with inverted prices, if orderbook is also show inverted,
  // i.e. if the baseToken is a stable token
  useEffect(() => {
    if (derivedAuctionInfo?.biddingToken != null) {
      if (!showChartsInverted(derivedAuctionInfo?.biddingToken)) {
        onInvertPrices()
      }
    }
  }, [derivedAuctionInfo?.biddingToken, onInvertPrices])
  const validBiddingTokenAddress =
    biddingTokenAddress !== undefined &&
    isAddress(biddingTokenAddress) &&
    tokens &&
    tokens[biddingTokenAddress.toLowerCase()] !== undefined
  const validAuctioningTokenAddress =
    auctioningTokenAddress !== undefined &&
    isAddress(auctioningTokenAddress) &&
    tokens &&
    tokens[auctioningTokenAddress.toLowerCase()] !== undefined

  useDefaultsFromURLSearch(search)

  React.useEffect(() => {
    if (
      !derivedAuctionInfo ||
      biddingTokenAddress === undefined ||
      auctioningTokenAddress === undefined
    ) {
      showTokenWarning(false)
      return
    }

    showTokenWarning(!validBiddingTokenAddress || !validAuctioningTokenAddress)
  }, [
    auctioningTokenAddress,
    biddingTokenAddress,
    derivedAuctionInfo,
    showTokenWarning,
    validAuctioningTokenAddress,
    validBiddingTokenAddress,
  ])

  const isLoading = React.useMemo(() => derivedAuctionInfo === null, [derivedAuctionInfo])
  const invalidAuction = React.useMemo(
    () => !auctionIdentifier || derivedAuctionInfo === undefined,
    [auctionIdentifier, derivedAuctionInfo],
  )

  return (
    <>
      {isLoading && <InlineLoading />}
      {!isLoading && !invalidAuction && (
        <>
          <Title>Auction Details</Title>
          <SubTitleWrapperStyled>
            <SubTitle>
              <Network>
                <NetworkIconStyled />
                <NetworkName>Selling on {getChainName(auctionIdentifier.chainId)} -</NetworkName>
              </Network>
              <AuctionId>Auction Id #{auctionIdentifier.auctionId}</AuctionId>
            </SubTitle>
            <CopyButton copyValue={url} title="Copy URL" />
          </SubTitleWrapperStyled>
          <AuctionDetails
            auctionIdentifier={auctionIdentifier}
            auctionState={derivedAuctionInfo?.auctionState}
            derivedAuctionInfo={derivedAuctionInfo}
          />
          <AuctionBody
            auctionIdentifier={auctionIdentifier}
            auctionState={derivedAuctionInfo?.auctionState}
            derivedAuctionInfo={derivedAuctionInfo}
          />
        </>
      )}
      {!isLoading && invalidAuction && (
        <>
          <WarningModal
            content={`This auction doesn't exist or it hasn't started yet.`}
            isOpen
            onDismiss={() => history.push('/overview')}
            title="Warning!"
          />
        </>
      )}
    </>
  )
}

export default Auction
