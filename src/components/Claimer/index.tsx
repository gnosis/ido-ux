import React, { useState } from "react";
import { Text } from "rebass";
import {
  ButtonPrimary,
  ButtonError,
  ButtonLight,
} from "../../components/Button";
import { BottomGrouping, Wrapper } from "../swap/styleds";
import ClaimConfirmationModal from "../ClaimConfirmationModal";
import styled from "styled-components";

import { useActiveWeb3React } from "../../hooks";
import {
  useClaimOrderCallback,
  useGetAuctionProceeds,
} from "../../hooks/useClaimOrderCallback";
import { useWalletModalToggle } from "../../state/application/hooks";
import {
  useDerivedClaimInfo,
  useDerivedAuctionInfo,
  useSwapState,
} from "../../state/orderplacement/hooks";
// import { TYPE } from "../../theme";
import TokenLogo from "../TokenLogo";

export const AuctionTokenWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-flow: column wrap;
  justify-content: center;
  box-sizing: border-box;
  padding: 0 0 16px;
`;

export const AuctionToken = styled.div`
  display: flex;
  padding: 0;
  margin: 0 0 10px;
  box-sizing: border-box;
  align-items: center;

  > img {
    margin: 0 10px 0 0;
  }
`;

export default function Claimer() {
  const { account } = useActiveWeb3React();

  // toggle wallet when disconnected
  const toggleWalletModal = useWalletModalToggle();

  // swap state
  const { auctionId } = useSwapState();
  const { biddingToken, auctioningToken } = useDerivedAuctionInfo();
  const { error } = useDerivedClaimInfo(auctionId);

  const isValid = !error;
  // modal and loading
  const [showConfirm, setShowConfirm] = useState<boolean>(false);
  const [pendingConfirmation, setPendingConfirmation] = useState<boolean>(true); // waiting for user confirmation

  const {
    claimableBiddingToken,
    claimableAuctioningToken,
  } = useGetAuctionProceeds();

  // txn values
  const [txHash, setTxHash] = useState<string>("");

  // reset modal state when closed
  function resetModal() {
    setPendingConfirmation(true);
  }

  // the callback to execute the swap
  const claimOrderCallback = useClaimOrderCallback();

  function onClaimOrder() {
    claimOrderCallback().then((hash) => {
      setTxHash(hash);
      setPendingConfirmation(false);
    });
  }

  // text to show while loading
  const pendingText = `Claiming Funds`;

  return (
    <>
      <Wrapper id="swap-page">
        <AuctionTokenWrapper>
          <AuctionToken>
            <TokenLogo address={biddingToken?.address} size={"42px"} />
            <Text fontSize={15} fontWeight={"bold"}>
              {claimableBiddingToken
                ? claimableBiddingToken.toSignificant(2)
                : `0 ${biddingToken?.symbol}`}
            </Text>
          </AuctionToken>

          <AuctionToken>
            <TokenLogo address={auctioningToken?.address} size={"42px"} />
            <Text fontSize={15} fontWeight={"bold"}>
              {claimableAuctioningToken
                ? claimableAuctioningToken.toSignificant(2)
                : `0 ${auctioningToken?.symbol}`}
            </Text>
          </AuctionToken>
        </AuctionTokenWrapper>

        <ClaimConfirmationModal
          isOpen={showConfirm}
          onDismiss={() => {
            resetModal();
            setShowConfirm(false);
          }}
          pendingConfirmation={pendingConfirmation}
          hash={txHash}
          pendingText={pendingText}
        />
        <BottomGrouping>
          {!account ? (
            <ButtonLight onClick={toggleWalletModal}>
              Connect Wallet
            </ButtonLight>
          ) : error ? (
            <ButtonPrimary disabled>{error}</ButtonPrimary>
          ) : (
            <ButtonError
              onClick={() => {
                setShowConfirm(true);
                onClaimOrder();
              }}
              id="swap-button"
              disabled={!isValid}
              error={isValid}
            >
              <Text fontSize={20} fontWeight={500}>
                {error ?? `Claim Funds`}
              </Text>
            </ButtonError>
          )}
        </BottomGrouping>
      </Wrapper>
    </>
  );
}
