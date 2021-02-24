import React, { useEffect, useState } from 'react'
import styled from 'styled-components'

const CountDownStyled = styled.div``

export function formatSeconds(seconds: number): string {
  const days = Math.floor(seconds / 24 / 60 / 60) % 360
  const hours = Math.floor(seconds / 60 / 60) % 24
  const minutes = Math.floor(seconds / 60) % 60
  const remainderSeconds = Math.floor(seconds % 60)
  let s = ''

  if (days > 0) {
    s += `${days}d `
  }
  if (hours > 0) {
    s += `${hours}h `
  }
  if (minutes > 0) {
    s += `${minutes}m `
  }
  if (remainderSeconds > 0 && hours < 2) {
    s += `${remainderSeconds}s`
  }
  if (minutes === 0 && remainderSeconds === 0) {
    s = '0s'
  }

  return s
}

const calculateTimeLeft = (auctionEndDate) => {
  const diff = auctionEndDate - Date.now() / 1000
  if (diff < 0) return 0
  return diff
}

export default function CountdownTimer({
  auctionEndDate,
  showText,
}: {
  auctionEndDate: number
  showText: boolean
}) {
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(auctionEndDate))

  useEffect(() => {
    let mounted = true
    setTimeout(() => {
      if (mounted) setTimeLeft(calculateTimeLeft(auctionEndDate))
    }, 1000)

    return () => {
      mounted = false
    }
  }, [auctionEndDate])

  return timeLeft && timeLeft > 0 ? (
    <CountDownStyled>
      {showText ? <>Auction ends in</> : <></>}
      <strong>{formatSeconds(timeLeft)}</strong>
    </CountDownStyled>
  ) : null
}
