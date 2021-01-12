import React from "react";
import styled from "styled-components";
import { BoxTitle } from "../components/BoxTitle";

const Wrapper = styled.div`
  position: relative;
  max-width: 420px;
  width: 100%;
  background: ${({ theme }) => theme.bg2};
  box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.01), 0px 4px 8px rgba(0, 0, 0, 0.04),
    0px 16px 24px rgba(0, 0, 0, 0.04), 0px 24px 32px rgba(0, 0, 0, 0.01);
  border-radius: 20px;
  padding: 16px;
  flex: 0 1 auto;
  box-sizing: border-box;
  background: yellow;
  height: auto;
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
