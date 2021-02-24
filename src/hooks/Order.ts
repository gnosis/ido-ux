import { BigNumber } from '@ethersproject/bignumber'

export interface SellOrder {
  sellAmount: BigNumber
  buyAmount: BigNumber
}

export interface Order {
  sellAmount: BigNumber
  buyAmount: BigNumber
  userId: BigNumber
}

export function decodeOrder(bytes: string): Order {
  return {
    userId: BigNumber.from('0x' + bytes.substring(2, 18)),
    buyAmount: BigNumber.from('0x' + bytes.substring(19, 42)),
    sellAmount: BigNumber.from('0x' + bytes.substring(43, 66)),
  }
}

export function encodeOrder(order: Order): string {
  return (
    '0x' +
    order.userId.toHexString().slice(2).padStart(16, '0') +
    order.buyAmount.toHexString().slice(2).padStart(24, '0') +
    order.sellAmount.toHexString().slice(2).padStart(24, '0')
  )
}
