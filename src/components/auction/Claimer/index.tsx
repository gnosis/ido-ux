import React, { useMemo, useState } from 'react'
import styled from 'styled-components'

import { useActiveWeb3React } from '../../../hooks'
import { useClaimOrderCallback, useGetAuctionProceeds } from '../../../hooks/useClaimOrderCallback'
import { useWalletModalToggle } from '../../../state/application/hooks'
import { DerivedAuctionInfo, useDerivedClaimInfo } from '../../../state/orderPlacement/hooks'
import { AuctionIdentifier } from '../../../state/orderPlacement/reducer'
import { getTokenDisplay } from '../../../utils'
import { Button } from '../../buttons/Button'
import { InlineLoading } from '../../common/InlineLoading'
import { SpinnerSize } from '../../common/Spinner'
import { ErrorInfo } from '../../icons/ErrorInfo'
import ClaimConfirmationModal from '../../modals/ClaimConfirmationModal'
import { BaseCard } from '../../pureStyledComponents/BaseCard'
import { ErrorRow, ErrorText, ErrorWrapper } from '../../pureStyledComponents/Error'
import TokenLogo from '../../token/TokenLogo'

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
interface ClaimerProps {
  auctionIdentifier: AuctionIdentifier
  derivedAuctionInfo: DerivedAuctionInfo
}
const Claimer: React.FC<ClaimerProps> = (props) => {
  const { auctionIdentifier, derivedAuctionInfo } = props
  const { account } = useActiveWeb3React()
  const toggleWalletModal = useWalletModalToggle()
  const { error } = useDerivedClaimInfo(auctionIdentifier)

  const isValid = !error
  const [showConfirm, setShowConfirm] = useState<boolean>(false)
  const [pendingConfirmation, setPendingConfirmation] = useState<boolean>(true) // waiting for user confirmation

  const { claimableAuctioningToken, claimableBiddingToken } = useGetAuctionProceeds(
    auctionIdentifier,
    derivedAuctionInfo,
  )
  const [txHash, setTxHash] = useState<string>('')

  function resetModal() {
    setPendingConfirmation(true)
  }

  const claimOrderCallback = useClaimOrderCallback(auctionIdentifier)

  function onClaimOrder() {
    claimOrderCallback()
      .then((hash) => {
        setTxHash(hash)
        setPendingConfirmation(false)
      })
      .catch(() => {
        resetModal()
        setShowConfirm(false)
      })
  }

  const pendingText = `Claiming Funds`
  const biddingTokenDisplay = useMemo(() => getTokenDisplay(derivedAuctionInfo?.biddingToken), [
    derivedAuctionInfo,
  ])
  const auctioningTokenDisplay = useMemo(
    () => getTokenDisplay(derivedAuctionInfo?.auctioningToken),
    [derivedAuctionInfo],
  )

  const isLoading = !claimableBiddingToken || !claimableAuctioningToken

  return (
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
                    <Text>{biddingTokenDisplay}</Text>
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
                {claimableAuctioningToken ? `${claimableAuctioningToken.toSignificant(6)}` : `0.00`}
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
              disabled={!isValid}
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
  )
}

export default Claimer
