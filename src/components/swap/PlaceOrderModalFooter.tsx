import React, { useContext, useMemo } from 'react'
import { ThemeContext } from 'styled-components'

import { BigNumber } from '@ethersproject/bignumber'
import { Fraction, Percent, Token, TokenAmount, Trade } from '@uniswap/sdk'
import { Text } from 'rebass'

import { getTokenDisplay } from '../../utils'
import { convertPriceIntoBuyAndSellAmount } from '../../utils/prices'
import { ButtonError } from '../Button'
import { AutoColumn } from '../Column'
import { AutoRow, RowBetween } from '../Row'

export default function SwapModalFooter({
  auctioningToken,
  biddingToken,
  confirmText,
  onPlaceOrder,
  price,
  sellAmount,
}: {
  trade?: Trade
  showInverted: boolean
  setShowInverted: (inverted: boolean) => void
  onPlaceOrder: () => any
  realizedLPFee?: TokenAmount
  price: string
  sellAmount: string
  auctioningToken?: Token
  biddingToken?: Token
  priceImpactWithoutFee?: Percent
  confirmText: string
}) {
  const theme = useContext(ThemeContext)
  let minimumReceived = undefined
  const { buyAmountScaled } = convertPriceIntoBuyAndSellAmount(
    auctioningToken,
    biddingToken,
    price,
    sellAmount,
  )
  if (sellAmount != undefined && buyAmountScaled != undefined) {
    minimumReceived = new Fraction(
      buyAmountScaled.toString(),
      BigNumber.from(10).pow(biddingToken.decimals).toString(),
    )
  }

  const biddingTokenDisplay = useMemo(() => getTokenDisplay(biddingToken), [biddingToken])

  const auctioningTokenDisplay = useMemo(() => getTokenDisplay(auctioningToken), [auctioningToken])

  return (
    <>
      <AutoColumn gap="0px">
        <RowBetween align="center">
          <Text color={theme.text2} fontSize={16} fontWeight={400}>
            Tokens sold [{biddingTokenDisplay}]:
          </Text>
          <Text
            color={theme.text1}
            fontSize={16}
            fontWeight={500}
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              display: 'flex',
              textAlign: 'right',
              paddingLeft: '10px',
            }}
          >
            {sellAmount}
          </Text>
        </RowBetween>

        <RowBetween align="center">
          <Text color={theme.text2} fontSize={16} fontWeight={400}>
            Minimum received [{auctioningTokenDisplay}]:
          </Text>
          <Text
            color={theme.text1}
            fontSize={16}
            fontWeight={500}
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              display: 'flex',
              textAlign: 'right',
              paddingLeft: '10px',
            }}
          >
            {minimumReceived?.toSignificant(2)}
          </Text>
        </RowBetween>
        <br></br>
        <RowBetween align="center">
          <Text color={theme.text2} fontSize={16} fontWeight={400}>
            Max price paid [{auctioningTokenDisplay}/{biddingTokenDisplay}]:
          </Text>
          <Text
            color={theme.text1}
            fontSize={16}
            fontWeight={500}
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              display: 'flex',
              textAlign: 'right',
              paddingLeft: '10px',
            }}
          >
            {price}
          </Text>
        </RowBetween>
      </AutoColumn>

      <AutoRow>
        <ButtonError
          id="confirm-swap-or-send"
          onClick={onPlaceOrder}
          style={{ margin: '10px 0 0 0' }}
        >
          <Text fontSize={20} fontWeight={500}>
            {confirmText}
          </Text>
        </ButtonError>
      </AutoRow>
    </>
  )
}
