import React, { useEffect } from 'react'
import { RouteComponentProps } from 'react-router-dom'
import styled, { css } from 'styled-components'

import AuctionBody from '../../components/auction/AuctionBody'
import AuctionDetails from '../../components/auction/AuctionDetails'
import { ButtonCopy } from '../../components/buttons/ButtonCopy'
import { InlineLoading } from '../../components/common/InlineLoading'
import { NetworkIcon } from '../../components/icons/NetworkIcon'
import WarningModal from '../../components/modals/WarningModal'
import { PageTitle } from '../../components/pureStyledComponents/PageTitle'
import {
  useDefaultsFromURLSearch,
  useDerivedAuctionInfo,
  useSwapActionHandlers,
  useSwapState,
} from '../../state/orderPlacement/hooks'
import { parseURL } from '../../state/orderPlacement/reducer'
import { useTokenListState } from '../../state/tokenList/hooks'
import { isAddress } from '../../utils'
import { showChartsInverted } from '../../utils/prices'
import { getChainName } from '../../utils/tools'

const Title = styled(PageTitle)`
  margin-bottom: 2px;
`

const SubTitleWrapperStyled = styled.div`
  align-items: center;
  display: flex;
  margin-bottom: 20px;
`

const SubTitle = styled.h2`
  align-items: center;
  color: ${({ theme }) => theme.text1};
  display: flex;
  font-size: 15px;
  font-weight: 400;
  line-height: 1.2;
  margin: 0 8px 0 0;
`

const AuctionId = styled.span`
  align-items: center;
  display: flex;
`

const IconCSS = css`
  height: 14px;
  width: 14px;
`

const CopyButton = styled(ButtonCopy)`
  ${IconCSS}
`

const Network = styled.span`
  align-items: center;
  display: flex;
  margin-right: 5px;
`

const NetworkIconStyled = styled(NetworkIcon)`
  ${IconCSS}
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
  const { showPriceInverted } = useSwapState()
  // Start with inverted prices, if orderbook is also show inverted,
  // i.e. if the baseToken/auctioningToken is a stable token
  useEffect(() => {
    if (derivedAuctionInfo?.auctioningToken != null && !showPriceInverted) {
      if (showChartsInverted(derivedAuctionInfo?.auctioningToken)) {
        onInvertPrices()
      }
    }
  }, [derivedAuctionInfo?.auctioningToken, onInvertPrices, showPriceInverted])
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
