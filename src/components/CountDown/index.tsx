import styled from "styled-components";
import React, { useEffect, useState } from "react";
import { Text } from "rebass";
const CountDownStyled = styled.div`
  display: flex;
  float: right;
  order: 2;
  font-family: var(--font-mono);
  text-align: left;
  font-size: 0.6rem;
  color: var(--color-text-primary);
  letter-spacing: 0;
  > strong {
    color: var(--color-text-active);
  }
`;

export function formatSeconds(seconds: number): string {
  const days = Math.floor(seconds / 24 / 60 / 60) % 360;
  const hours = Math.floor(seconds / 60 / 60) % 24;
  const minutes = Math.floor(seconds / 60) % 60;
  const remainderSeconds = Math.floor(seconds % 60);
  let s = "";

  if (days > 0) {
    s += `${days}d `;
  }
  if (hours > 0) {
    s += `${hours}h `;
  }
  if (minutes > 0) {
    s += `${minutes}m `;
  }
  if (remainderSeconds > 0 && hours < 2) {
    s += `${remainderSeconds}s`;
  }
  if (minutes === 0 && remainderSeconds === 0) {
    s = "0s";
  }

  return s;
}

const calculateTimeLeft = (auctionEndDate) => {
  const diff = auctionEndDate?.toNumber() - Date.now() / 1000;
  if (diff < 0) return 0;
  return diff;
};

export default function CountdownTimer({
  auctionEndDate,
}: {
  auctionEndDate: number;
}) {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(auctionEndDate));

  useEffect(() => {
    setTimeout(() => {
      setTimeLeft(calculateTimeLeft(auctionEndDate));
    }, 1000);
  }),
    [auctionEndDate];

  return (
    <CountDownStyled>
      {timeLeft > 0 ? (
        <Text fontSize={16} fontWeight={500} textAlign={"right"}>
          {" "}
          Auction ends: <br></br> <strong>{formatSeconds(timeLeft)}</strong>
        </Text>
      ) : (
        ""
      )}
    </CountDownStyled>
  );
}
