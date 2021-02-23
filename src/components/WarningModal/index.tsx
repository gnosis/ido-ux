import React, { useContext } from "react";
import styled, { ThemeContext } from "styled-components";
import { Text } from "rebass";
import { RowBetween } from "../Row";
import { CloseIcon } from "../../theme/components";
import { AutoColumn } from "../Column";
import Modal from "../Modal";

const Wrapper = styled.div`
  width: 100%;
`;
const Section = styled(AutoColumn)`
  padding: 24px;
`;
const BottomSection = styled(Section)`
  background-color: ${({ theme }) => theme.bg2};
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
`;

interface WarningModalProps {
  isOpen: boolean;
  onDismiss: () => void;
  content: string;
  title?: string;
}

export default function WarningModal({
  isOpen,
  onDismiss,
  content,
  title = "",
}: WarningModalProps) {
  return (
    <Modal isOpen={isOpen} onDismiss={onDismiss} maxHeight={90}>
      <Wrapper>
        <Section>
          <RowBetween>
            <Text fontWeight={500} fontSize={20}>
              {title}
            </Text>
            <CloseIcon onClick={onDismiss} />
          </RowBetween>
        </Section>
        <BottomSection gap="12px">{content}</BottomSection>
      </Wrapper>
    </Modal>
  );
}
