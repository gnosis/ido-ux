import React, { useMemo, useState } from 'react'
import styled from 'styled-components'

import { Text } from 'rebass'

import { ButtonError, ButtonLight, ButtonPrimary } from '../../components/Button'
import { useActiveWeb3React } from '../../hooks'
import { useClaimOrderCallback, useGetAuctionProceeds } from '../../hooks/useClaimOrderCallback'
import { useWalletModalToggle } from '../../state/application/hooks'
import {
  useDerivedAuctionInfo,
  useDerivedClaimInfo,
  useSwapState,
} from '../../state/orderPlacement/hooks'
import { getTokenDisplay } from '../../utils'
import ClaimConfirmationModal from '../ClaimConfirmationModal'
import TokenLogo from '../TokenLogo'
import { BottomGrouping } from '../swap/styleds'

const Wrapper = styled.div`
  border-radius: 12px;
  border: 1px solid ${({ theme }) => theme.border};
`

const AuctionTokenWrapper = styled.div`
  box-sizing: border-box;
  display: flex;
  flex-flow: column wrap;
  justify-content: center;
  padding: 0 0 16px;
  width: 100%;
`

const AuctionToken = styled.div`
  align-items: center;
  box-sizing: border-box;
  display: flex;
  margin: 0 0 10px;
  padding: 0;

  > img {
    margin: 0 10px 0 0;
  }
`

const Claimer: React.FC = () => {
  const { account } = useActiveWeb3React()

  // toggle wallet when disconnected
  const toggleWalletModal = useWalletModalToggle()

  // swap state
  const { auctionId } = useSwapState()
  const { auctioningToken, biddingToken } = useDerivedAuctionInfo()
  const { error } = useDerivedClaimInfo(auctionId)

  const isValid = !error
  // modal and loading
  const [showConfirm, setShowConfirm] = useState<boolean>(false)
  const [pendingConfirmation, setPendingConfirmation] = useState<boolean>(true) // waiting for user confirmation

  const { claimableAuctioningToken, claimableBiddingToken } = useGetAuctionProceeds()

  // txn values
  const [txHash, setTxHash] = useState<string>('')

  // reset modal state when closed
  function resetModal() {
    setPendingConfirmation(true)
  }

  // the callback to execute the swap
  const claimOrderCallback = useClaimOrderCallback()

  function onClaimOrder() {
    claimOrderCallback().then((hash) => {
      setTxHash(hash)
      setPendingConfirmation(false)
    })
  }

  // text to show while loading
  const pendingText = `Claiming Funds`

  const biddingTokenDisplay = useMemo(() => getTokenDisplay(biddingToken), [biddingToken])

  const auctioningTokenDisplay = useMemo(() => getTokenDisplay(auctioningToken), [auctioningToken])
  return (
    <Wrapper id="swap-page">
      <AuctionTokenWrapper>
        <AuctionToken>
          <TokenLogo address={biddingToken?.address} size={'42px'} />
          <Text fontSize={15} fontWeight={'bold'}>
            {claimableBiddingToken
              ? claimableBiddingToken.toSignificant(2)
              : `0 ${biddingTokenDisplay}`}
          </Text>
        </AuctionToken>

        <AuctionToken>
          <TokenLogo address={auctioningToken?.address} size={'42px'} />
          <Text fontSize={15} fontWeight={'bold'}>
            {claimableAuctioningToken
              ? claimableAuctioningToken.toSignificant(2)
              : `0 ${auctioningTokenDisplay}`}
          </Text>
        </AuctionToken>
      </AuctionTokenWrapper>

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
      <BottomGrouping>
        {!account ? (
          <ButtonLight onClick={toggleWalletModal}>Connect Wallet</ButtonLight>
        ) : error ? (
          <ButtonPrimary disabled>{error}</ButtonPrimary>
        ) : (
          <ButtonError
            disabled={!isValid}
            error={isValid}
            id="swap-button"
            onClick={() => {
              setShowConfirm(true)
              onClaimOrder()
            }}
          >
            <Text fontSize={20} fontWeight={500}>
              {error ?? `Claim Funds`}
            </Text>
          </ButtonError>
        )}
      </BottomGrouping>
    </Wrapper>
  )
}

export default Claimer
