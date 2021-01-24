import React from "react";
import styled from "styled-components";
import { BoxTitle } from "../components/BoxTitle";

const Wrapper = styled.div`
  position: relative;
  background: none;
  border: ${({ theme }) => `1px solid ${theme.bg2}`};
  box-shadow: none;
  border-radius: 20px;
  padding: 16px;
  flex: 0 1 auto;
  width: calc(50% - 8px);

  ${({ theme }) => theme.mediaWidth.upToMedium`
    width: 100%;
    margin: 0 0 16px;
    order: 0;
    border: 0;
    padding: 16px 0;
  `};
`;

/**
 * The styled container element that wraps the content of most pages and the tabs.
 */
export default function ParticipationBody({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Wrapper>
      <BoxTitle>Place Order</BoxTitle>
      <>{children}</>
    </Wrapper>
  );
}
