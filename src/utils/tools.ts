import { ChainId } from '.'

export const truncateStringInTheMiddle = (
  str: string,
  strPositionStart: number,
  strPositionEnd: number,
) => {
  const minTruncatedLength = strPositionStart + strPositionEnd
  if (minTruncatedLength < str.length) {
    return `${str.substr(0, strPositionStart)}...${str.substr(
      str.length - strPositionEnd,
      str.length,
    )}`
  }
  return str
}

export const getDays = (seconds: number): number => {
  return Math.floor(seconds / 24 / 60 / 60) % 360
}

export const getHours = (seconds: number): number => {
  return Math.floor(seconds / 60 / 60) % 24
}

export const getMinutes = (seconds: number): number => {
  return Math.floor(seconds / 60) % 60
}

export const getSeconds = (seconds: number): number => {
  return Math.floor(seconds % 60)
}

export const calculateTimeLeft = (auctionEndDate: number) => {
  if (isNaN(auctionEndDate)) return -1

  const diff = auctionEndDate - Date.now() / 1000

  if (diff < 0) return -1

  return diff
}

export const calculateTimeProgress = (auctionStartDate: number, auctionEndDate: number): number => {
  const totalTime = auctionEndDate - auctionStartDate
  const now = Math.trunc(Date.now() / 1000)
  const passedTime = auctionEndDate - now
  const percentage =
    now >= auctionEndDate
      ? 100
      : now <= auctionStartDate
      ? 0
      : Math.trunc((passedTime * 100) / totalTime)

  return isNaN(auctionStartDate) || isNaN(auctionEndDate) ? 0 : percentage
}

export const getChainName = (chainId: number) => {
  return (
    (chainId === ChainId.RINKEBY && 'Rinkeby') ||
    (chainId === ChainId.MAINNET && 'Mainnet') ||
    (chainId === ChainId.XDAI && 'xDai') ||
    (chainId === ChainId.MATIC && 'Polygon') ||
    'Unknown Network'
  )
}
