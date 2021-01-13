import React from "react";
import styled from "styled-components";
import { BoxTitle } from "../components/BoxTitle";

const Body = styled.div`
  position: relative;
  width: calc(50% - 8px);
  background: none;
  border: ${({ theme }) => `1px solid ${theme.bg2}`};
  box-shadow: none;
  border-radius: 20px;
  padding: 16px;
  flex: 0 1 auto;

  ${({ theme }) => theme.mediaWidth.upToMedium`
    width: 100%;
  `};
`;

/**
 * The styled container element that wraps the content of most pages and the tabs.
 */
export default function ClaimerBody({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Body>
      <BoxTitle>Claim Proceedings</BoxTitle>
      <>{children}</>
    </Body>
  );
}
