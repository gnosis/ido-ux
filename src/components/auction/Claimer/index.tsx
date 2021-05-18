import React, { useMemo, useState } from 'react'
import styled from 'styled-components'

import ReactTooltip from 'react-tooltip'

import { useActiveWeb3React } from '../../../hooks'
import { useClaimOrderCallback, useGetAuctionProceeds } from '../../../hooks/useClaimOrderCallback'
import { useWalletModalToggle } from '../../../state/application/hooks'
import {
  AuctionState,
  DerivedAuctionInfo,
  useDerivedClaimInfo,
} from '../../../state/orderPlacement/hooks'
import { AuctionIdentifier } from '../../../state/orderPlacement/reducer'
import { getTokenDisplay, isTokenXDAI } from '../../../utils'
import { Button } from '../../buttons/Button'
import { ButtonAnchor } from '../../buttons/ButtonAnchor'
import { ButtonType } from '../../buttons/buttonStylingTypes'
import { InlineLoading } from '../../common/InlineLoading'
import { SpinnerSize } from '../../common/Spinner'
import { ErrorInfo } from '../../icons/ErrorInfo'
import ClaimConfirmationModal from '../../modals/ClaimConfirmationModal'
import { BaseCard } from '../../pureStyledComponents/BaseCard'
import { ErrorRow, ErrorText, ErrorWrapper } from '../../pureStyledComponents/Error'
import { PageTitle } from '../../pureStyledComponents/PageTitle'
import TokenLogo from '../../token/TokenLogo'
import { AuctionPending } from '../AuctionPending'

const Wrapper = styled(BaseCard)`
  max-width: 100%;
  min-height: 352px;
  min-width: 100%;
`

const ActionButton = styled(Button)`
  flex-shrink: 0;
  height: 52px;
  margin-top: auto;
`

const TokensWrapper = styled.div`
  background-color: ${({ theme }) => theme.primary4};
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

const SectionTitle = styled(PageTitle)`
  margin-bottom: 0;
  margin-top: 0;
`

interface Props {
  auctionIdentifier: AuctionIdentifier
  derivedAuctionInfo: DerivedAuctionInfo
}

const Claimer: React.FC<Props> = (props) => {
  const { auctionIdentifier, derivedAuctionInfo } = props
  const { chainId } = auctionIdentifier
  const { account } = useActiveWeb3React()
  const [showConfirm, setShowConfirm] = useState<boolean>(false)
  const [userConfirmedTx, setUserConfirmedTx] = useState<boolean>(false)
  const [pendingConfirmation, setPendingConfirmation] = useState<boolean>(true)
  const [txHash, setTxHash] = useState<string>('')
  const pendingText = `Claiming Funds`
  const { error, isLoading: isDerivedClaimInfoLoading } = useDerivedClaimInfo(auctionIdentifier)
  const isValid = !error
  const toggleWalletModal = useWalletModalToggle()

  const { claimableAuctioningToken, claimableBiddingToken } = useGetAuctionProceeds(
    auctionIdentifier,
    derivedAuctionInfo,
  )

  const resetModal = () => setPendingConfirmation(true)
  const claimOrderCallback = useClaimOrderCallback(auctionIdentifier)

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

  const biddingTokenDisplay = useMemo(
    () => getTokenDisplay(derivedAuctionInfo?.biddingToken, chainId),
    [derivedAuctionInfo, chainId],
  )

  const auctioningTokenDisplay = useMemo(
    () => getTokenDisplay(derivedAuctionInfo?.auctioningToken, chainId),
    [derivedAuctionInfo, chainId],
  )

  const isLoading = useMemo(
    () =>
      (account && isDerivedClaimInfoLoading) || !claimableBiddingToken || !claimableAuctioningToken,
    [account, isDerivedClaimInfoLoading, claimableBiddingToken, claimableAuctioningToken],
  )

  const isClaimButtonDisabled = useMemo(
    () => !isValid || showConfirm || isLoading || userConfirmedTx,
    [isValid, showConfirm, isLoading, userConfirmedTx],
  )

  return (
    <>
      {derivedAuctionInfo.auctionState === AuctionState.PRICE_SUBMISSION && (
        <AuctionPending>Auction closed. Pending on-chain price-calculation.</AuctionPending>
      )}
      <SectionTitle as="h2">
        {derivedAuctionInfo.auctionState === AuctionState.CLAIMING && 'Claim Proceeds'}
      </SectionTitle>
      <Wrapper>
        {isLoading && <InlineLoading size={SpinnerSize.small} />}
        {!isLoading && (
          <>
            <TokensWrapper>
              <TokenItem>
                <Token>
                  {derivedAuctionInfo?.biddingToken && biddingTokenDisplay ? (
                    <>
                      <TokenLogo
                        size={'34px'}
                        token={{
                          address: derivedAuctionInfo?.biddingToken.address,
                          symbol: biddingTokenDisplay,
                        }}
                      />
                      <Text>{biddingTokenDisplay != 'XDAI' ? biddingTokenDisplay : `WXDAI`}</Text>
                      {isTokenXDAI(derivedAuctionInfo?.biddingToken.address, chainId) && (
                        <span
                          className={`tooltipComponent`}
                          data-for={'wrap_button'}
                          data-html={true}
                          data-multiline={true}
                          data-tip={`Unwrap ${derivedAuctionInfo?.biddingToken.symbol} on Honeyswap. Do it after you claimed your WXDAI`}
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
                            href={`https://app.honeyswap.org/#/swap?inputCurrency=${derivedAuctionInfo?.biddingToken.address}`}
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
                  {derivedAuctionInfo?.auctioningToken && auctioningTokenDisplay ? (
                    <>
                      <TokenLogo
                        size={'34px'}
                        token={{
                          address: derivedAuctionInfo?.auctioningToken.address,
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
                  {claimableAuctioningToken
                    ? `${claimableAuctioningToken.toSignificant(6)}`
                    : `0.00`}
                </Text>
              </TokenItem>
            </TokensWrapper>
            {!isValid && account && (
              <ErrorWrapper>
                <ErrorRow>
                  <ErrorInfo />
                  <ErrorText>{error}</ErrorText>
                </ErrorRow>
              </ErrorWrapper>
            )}
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
                Claim
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
    </>
  )
}

export default Claimer
