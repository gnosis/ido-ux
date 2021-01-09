import React, { useState } from "react";
import { Text } from "rebass";
import { ButtonError, ButtonLight } from "../../components/Button";
import { GreyCard } from "../../components/Card";
import { BottomGrouping, Wrapper } from "../swap/styleds";
import ClaimConfirmationModal from "../ClaimConfirmationModal";

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
import { TYPE } from "../../theme";
import TokenLogo from "../TokenLogo";

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
        <div style={{ padding: "5.4rem" }}>
          <div style={{ width: "50%", float: "left", textAlign: "center" }}>
            <TokenLogo address={biddingToken?.address} size={"35px"} />
            <br></br>
            <Text fontSize={16} fontWeight={"bold"}>
              {claimableBiddingToken?.toSignificant(2)}
            </Text>
          </div>
          <div style={{ width: "50%", float: "right", textAlign: "center" }}>
            <TokenLogo address={auctioningToken?.address} size={"35px"} />
            <br></br>
            <Text fontSize={16} fontWeight={"bold"}>
              {claimableAuctioningToken?.toSignificant(2)}
            </Text>
          </div>
        </div>
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
            <GreyCard style={{ textAlign: "center" }}>
              <TYPE.main mb="4px">{error} </TYPE.main>
            </GreyCard>
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
