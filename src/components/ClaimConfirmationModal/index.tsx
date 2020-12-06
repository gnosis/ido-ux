import React, { useContext } from "react";
import styled, { ThemeContext } from "styled-components";
import Modal from "../Modal";
import Loader from "../Loader";
import { ExternalLink } from "../../theme";
import { Text } from "rebass";
import { CloseIcon } from "../../theme/components";
import { RowBetween } from "../Row";
import { ArrowUpCircle } from "react-feather";
import { ButtonPrimary } from "../Button";
import { AutoColumn, ColumnCenter } from "../Column";

import { useActiveWeb3React } from "../../hooks";
import { getEtherscanLink } from "../../utils";

const Wrapper = styled.div`
  width: 100%;
`;
const Section = styled(AutoColumn)`
  padding: 24px;
`;

const ConfirmedIcon = styled(ColumnCenter)`
  padding: 60px 0;
`;

interface ConfirmationModalProps {
  isOpen: boolean;
  onDismiss: () => void;
  hash: string;
  pendingConfirmation: boolean;
  pendingText: string;
}

export default function ClaimConfirmationModal({
  isOpen,
  onDismiss,
  hash,
  pendingConfirmation,
  pendingText,
}: ConfirmationModalProps) {
  const { chainId } = useActiveWeb3React();
  const theme = useContext(ThemeContext);

  return (
    <Modal isOpen={isOpen} onDismiss={onDismiss} maxHeight={90}>
      {
        <Wrapper>
          <Section>
            <RowBetween>
              <div />
              <CloseIcon onClick={onDismiss} />
            </RowBetween>
            <ConfirmedIcon>
              {pendingConfirmation ? (
                <Loader size="90px" />
              ) : (
                <ArrowUpCircle
                  strokeWidth={0.5}
                  size={90}
                  color={theme.primary1}
                />
              )}
            </ConfirmedIcon>
            <AutoColumn gap="12px" justify={"center"}>
              <Text fontWeight={500} fontSize={20}>
                {!pendingConfirmation
                  ? "Transaction Submitted"
                  : "Waiting For Confirmation"}
              </Text>
              <AutoColumn gap="12px" justify={"center"}>
                <Text
                  fontWeight={600}
                  fontSize={14}
                  color=""
                  textAlign="center"
                >
                  {pendingText}
                </Text>
              </AutoColumn>
              {!pendingConfirmation && (
                <>
                  <ExternalLink
                    href={getEtherscanLink(chainId, hash, "transaction")}
                  >
                    <Text fontWeight={500} fontSize={14} color={theme.primary1}>
                      View on Etherscan
                    </Text>
                  </ExternalLink>
                  <ButtonPrimary
                    onClick={onDismiss}
                    style={{ margin: "20px 0 0 0" }}
                  >
                    <Text fontWeight={500} fontSize={20}>
                      Close
                    </Text>
                  </ButtonPrimary>
                </>
              )}

              {pendingConfirmation && (
                <Text fontSize={12} color="#565A69" textAlign="center">
                  Confirm this transaction in your wallet
                </Text>
              )}
            </AutoColumn>
          </Section>
        </Wrapper>
      }
    </Modal>
  );
}
