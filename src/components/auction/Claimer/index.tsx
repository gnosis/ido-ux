import { transparentize } from 'polished'
import React, { useMemo, useState } from 'react'
import styled from 'styled-components'

import ReactTooltip from 'react-tooltip'

import { useActiveWeb3React } from '../../../hooks'
import {
  ClaimState,
  useClaimOrderCallback,
  useGetAuctionProceeds,
} from '../../../hooks/useClaimOrderCallback'
import { useWalletModalToggle } from '../../../state/application/hooks'
import { DerivedAuctionInfo, useDerivedClaimInfo } from '../../../state/orderPlacement/hooks'
import { AuctionIdentifier } from '../../../state/orderPlacement/reducer'
import { getTokenDisplay, isTokenWETH, isTokenXDAI } from '../../../utils'
import { Button } from '../../buttons/Button'
import { ButtonAnchor } from '../../buttons/ButtonAnchor'
import { ButtonType } from '../../buttons/buttonStylingTypes'
import { InlineLoading } from '../../common/InlineLoading'
import { SpinnerSize } from '../../common/Spinner'
import { ErrorInfo } from '../../icons/ErrorInfo'
import ClaimConfirmationModal from '../../modals/ClaimConfirmationModal'
import { BaseCard } from '../../pureStyledComponents/BaseCard'
import { ErrorRow, ErrorText } from '../../pureStyledComponents/Error'
import TokenLogo from '../../token/TokenLogo'

const Wrapper = styled(BaseCard)`
  max-width: 100%;
  min-height: 352px;
  min-width: 100%;
  height: calc(100% - 35px);
`

const ActionButton = styled(Button)`
  flex-shrink: 0;
  height: 52px;
  margin-top: auto;
`

const TokensWrapper = styled.div`
  background-color: ${({ theme }) => transparentize(0.9, theme.bg6)};
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.textField.borderColor};
  margin-bottom: 20px;
`

const TokenItem = styled.div`
  align-items: center;
  border-bottom: 1px solid ${({ theme }) => theme.textField.borderColor};
  display: flex;
  justify-content: space-between;
  padding: 7px 14px;

  &:last-child {
    border-bottom: none;
  }
`

const Token = styled.div`
  align-items: center;
  display: flex;
  justify-content: space-between;
`

const Text = styled.div`
  color: ${({ theme }) => theme.text1};
  font-size: 24px;
  font-weight: 600;
  line-height: 1.2;
  margin-left: 10px;
`

const ButtonWrap = styled(ButtonAnchor)`
  border-radius: 4px;
  font-size: 12px;
  height: 20px;
  margin: -2px 0 0 15px;
  padding: 0 5px;
`

interface Props {
  auctionIdentifier: AuctionIdentifier
  derivedAuctionInfo: DerivedAuctionInfo
}

const Claimer: React.FC<Props> = (props) => {
  const { auctionIdentifier, derivedAuctionInfo } = props
  const { chainId } = auctionIdentifier
  const { account, chainId: Web3ChainId } = useActiveWeb3React()
  const [showConfirm, setShowConfirm] = useState<boolean>(false)
  const [userConfirmedTx, setUserConfirmedTx] = useState<boolean>(false)
  const [pendingConfirmation, setPendingConfirmation] = useState<boolean>(true)
  const [txHash, setTxHash] = useState<string>('')
  const pendingText = `Claiming Funds`
  const [claimStatus, claimOrderCallback] = useClaimOrderCallback(auctionIdentifier)
  const { error, isLoading: isDerivedClaimInfoLoading } = useDerivedClaimInfo(
    auctionIdentifier,
    claimStatus,
  )
  const isValid = !error
  const toggleWalletModal = useWalletModalToggle()

  const { claimableAuctioningToken, claimableBiddingToken } = useGetAuctionProceeds(
    auctionIdentifier,
    derivedAuctionInfo,
  )

  const { auctioningToken, biddingToken } = derivedAuctionInfo

  const resetModal = () => setPendingConfirmation(true)

  const onClaimOrder = () =>
    claimOrderCallback()
      .then((hash) => {
        setTxHash(hash)
        setPendingConfirmation(false)
        setUserConfirmedTx(true)
      })
      .catch(() => {
        resetModal()
        setShowConfirm(false)
        setUserConfirmedTx(false)
      })

  const biddingTokenDisplay = useMemo(() => getTokenDisplay(biddingToken, chainId), [
    biddingToken,
    chainId,
  ])

  const biddingTokenDisplayWrapped = useMemo(
    () =>
      biddingTokenDisplay === 'XDAI'
        ? 'WXDAI'
        : biddingTokenDisplay === 'ETH'
        ? 'WETH'
        : biddingTokenDisplay,
    [biddingTokenDisplay],
  )

  const auctioningTokenDisplay = useMemo(() => getTokenDisplay(auctioningToken, chainId), [
    auctioningToken,
    chainId,
  ])

  const isLoading = useMemo(
    () =>
      (account && isDerivedClaimInfoLoading) || !claimableBiddingToken || !claimableAuctioningToken,
    [account, isDerivedClaimInfoLoading, claimableBiddingToken, claimableAuctioningToken],
  )

  const isClaimButtonDisabled = useMemo(
    () =>
      !isValid ||
      showConfirm ||
      isLoading ||
      userConfirmedTx ||
      claimStatus != ClaimState.NOT_CLAIMED ||
      chainId !== Web3ChainId,
    [isValid, showConfirm, isLoading, userConfirmedTx, claimStatus, chainId, Web3ChainId],
  )

  const isXDAI = isTokenXDAI(derivedAuctionInfo.biddingToken.address, chainId)
  const isWETH = isTokenWETH(derivedAuctionInfo.biddingToken.address, chainId)

  const showUnwrapButton = useMemo(
    () =>
      (isXDAI || isWETH) &&
      account &&
      chainId === Web3ChainId &&
      claimableBiddingToken &&
      claimableBiddingToken.greaterThan('0'),
    [Web3ChainId, account, chainId, claimableBiddingToken, isWETH, isXDAI],
  )

  const unwrapTooltip = `Unwrap ${biddingToken.symbol} on ${
    isXDAI ? 'Honeyswap' : 'Uniswap'
  }. Do it after you claimed your ${biddingTokenDisplayWrapped}`
  const unwrapURL = isXDAI
    ? `https://app.honeyswap.org/#/swap?inputCurrency=${biddingToken.address}`
    : `https://app.uniswap.org/#/swap?inputCurrency=${biddingToken.address}`

  return (
    <Wrapper>
      {isLoading && <InlineLoading size={SpinnerSize.small} />}
      {!isLoading && (
        <>
          <TokensWrapper>
            <TokenItem>
              <Token>
                {biddingToken && biddingTokenDisplay ? (
                  <>
                    <TokenLogo
                      size={'34px'}
                      token={{
                        address: biddingToken.address,
                        symbol: biddingTokenDisplay,
                      }}
                    />
                    <Text>{biddingTokenDisplayWrapped}</Text>
                    {showUnwrapButton && (
                      <span
                        className={`tooltipComponent`}
                        data-for={'wrap_button'}
                        data-html={true}
                        data-multiline={true}
                        data-tip={unwrapTooltip}
                      >
                        <ReactTooltip
                          arrowColor={'#001429'}
                          backgroundColor={'#001429'}
                          border
                          borderColor={'#174172'}
                          className="customTooltip"
                          delayHide={50}
                          delayShow={250}
                          effect="solid"
                          id={'wrap_button'}
                          textColor="#fff"
                        />
                        <ButtonWrap
                          buttonType={ButtonType.primaryInverted}
                          href={unwrapURL}
                          target="_blank"
                        >
                          Unwrap
                        </ButtonWrap>
                      </span>
                    )}
                  </>
                ) : (
                  '-'
                )}
              </Token>
              <Text>
                {claimableBiddingToken ? `${claimableBiddingToken.toSignificant(6)} ` : `0.00`}
              </Text>
            </TokenItem>
            <TokenItem>
              <Token>
                {auctioningToken && auctioningTokenDisplay ? (
                  <>
                    <TokenLogo
                      size={'34px'}
                      token={{
                        address: auctioningToken.address,
                        symbol: auctioningTokenDisplay,
                      }}
                    />
                    <Text>{auctioningTokenDisplay}</Text>
                  </>
                ) : (
                  '-'
                )}
              </Token>
              <Text>
                {claimableAuctioningToken ? `${claimableAuctioningToken.toSignificant(6)}` : `0.00`}
              </Text>
            </TokenItem>
          </TokensWrapper>
          {!account ? (
            <ActionButton onClick={toggleWalletModal}>Connect Wallet</ActionButton>
          ) : (
            <ActionButton
              disabled={isClaimButtonDisabled}
              onClick={() => {
                setShowConfirm(true)
                onClaimOrder()
              }}
            >
              {claimStatus === ClaimState.PENDING ? (
                `Claiming `
              ) : !isValid && account ? (
                <>
                  <ErrorRow>
                    <ErrorInfo />
                    <ErrorText>{error}</ErrorText>
                  </ErrorRow>
                </>
              ) : (
                `Claim`
              )}
            </ActionButton>
          )}
          <ClaimConfirmationModal
            hash={txHash}
            isOpen={showConfirm}
            onDismiss={() => {
              resetModal()
              setShowConfirm(false)
            }}
            pendingConfirmation={pendingConfirmation}
            pendingText={pendingText}
          />
        </>
      )}
    </Wrapper>
  )
}

export default Claimer
