import React, { useMemo, useState } from 'react'
import styled from 'styled-components'

import { useActiveWeb3React } from '../../../hooks'
import { useClaimOrderCallback, useGetAuctionProceeds } from '../../../hooks/useClaimOrderCallback'
import { useWalletModalToggle } from '../../../state/application/hooks'
import {
  useDerivedAuctionInfo,
  useDerivedClaimInfo,
  useSwapState,
} from '../../../state/orderPlacement/hooks'
import { getTokenDisplay } from '../../../utils'
import ClaimConfirmationModal from '../../ClaimConfirmationModal'
import { Button } from '../../buttons/Button'
import TokenLogo from '../../common/TokenLogo'
import { ErrorInfo } from '../../icons/ErrorInfo'
import { BaseCard } from '../../pureStyledComponents/BaseCard'
import { ErrorRow, ErrorText, ErrorWrapper } from '../../pureStyledComponents/Error'

const Wrapper = styled(BaseCard)`
  max-width: 100%;
  min-height: 380px;
  min-width: 100%;
`

const ActionButton = styled(Button)`
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

const Claimer: React.FC = () => {
  const { account } = useActiveWeb3React()
  const toggleWalletModal = useWalletModalToggle()
  const { auctionId } = useSwapState()
  const { auctioningToken, biddingToken } = useDerivedAuctionInfo()
  const { error } = useDerivedClaimInfo(auctionId)

  const isValid = !error
  const [showConfirm, setShowConfirm] = useState<boolean>(false)
  const [pendingConfirmation, setPendingConfirmation] = useState<boolean>(true) // waiting for user confirmation

  const { claimableAuctioningToken, claimableBiddingToken } = useGetAuctionProceeds()
  const [txHash, setTxHash] = useState<string>('')

  function resetModal() {
    setPendingConfirmation(true)
  }

  const claimOrderCallback = useClaimOrderCallback()

  function onClaimOrder() {
    claimOrderCallback().then((hash) => {
      setTxHash(hash)
      setPendingConfirmation(false)
    })
  }

  const pendingText = `Claiming Funds`
  const biddingTokenDisplay = useMemo(() => getTokenDisplay(biddingToken), [biddingToken])
  const auctioningTokenDisplay = useMemo(() => getTokenDisplay(auctioningToken), [auctioningToken])

  return (
    <Wrapper>
      <TokensWrapper>
        <TokenItem>
          <Token>
            {biddingToken && biddingTokenDisplay ? (
              <>
                <TokenLogo
                  size={'34px'}
                  token={{ address: biddingToken.address, symbol: biddingTokenDisplay }}
                />
                <Text>{biddingTokenDisplay}</Text>
              </>
            ) : (
              '-'
            )}
          </Token>
          <Text>
            {claimableBiddingToken ? `${claimableBiddingToken.toSignificant(2)} ` : `0.00`}
          </Text>
        </TokenItem>
        <TokenItem>
          <Token>
            {auctioningToken && auctioningTokenDisplay ? (
              <>
                <TokenLogo
                  size={'34px'}
                  token={{ address: auctioningToken.address, symbol: auctioningTokenDisplay }}
                />
                <Text>{auctioningTokenDisplay}</Text>
              </>
            ) : (
              '-'
            )}
          </Token>
          <Text>
            {claimableAuctioningToken ? `${claimableAuctioningToken.toSignificant(2)}` : `0.00`}
          </Text>
        </TokenItem>
      </TokensWrapper>
      {!isValid && (
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
    </Wrapper>
  )
}

export default Claimer
