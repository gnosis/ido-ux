import React from "react";
import styled from "styled-components";

const FooterFrame = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  position: fixed;
  right: 1rem;
  bottom: 1rem;
  ${({ theme }) => theme.mediaWidth.upToMedium`
    display: none;
  `};
`;

export default function Footer() {
  return <FooterFrame></FooterFrame>;
}
