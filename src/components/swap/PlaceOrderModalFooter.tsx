import React, { useMemo } from 'react'
import styled from 'styled-components'
import { Fraction, Percent, Token, TokenAmount, Trade } from 'uniswap-xdai-sdk'

import { BigNumber } from '@ethersproject/bignumber'

import DoubleLogo from '../../components/common/DoubleLogo'
import TokenLogo from '../../components/common/TokenLogo'
import { ErrorLock } from '../../components/icons/ErrorLock'
import { ErrorRow, ErrorText, ErrorWrapper } from '../../components/pureStyledComponents/Error'
import { getTokenDisplay } from '../../utils'
import { convertPriceIntoBuyAndSellAmount } from '../../utils/prices'
import { Button } from '../buttons/Button'

const Row = styled.div`
  align-items: center;
  display: flex;
  justify-content: space-between;
  margin-bottom: 14px;
`

const Text = styled.div`
  color: ${({ theme }) => theme.text1};
  font-size: 18px;
  font-weight: normal;
  line-height: 1.4;
`

const Value = styled.div`
  align-items: center;
  column-gap: 10px;
  display: grid;
  grid-template-columns: 1fr 52px;
  justify-content: flex-start;
`

const ErrorRowStyled = styled(ErrorRow)`
  margin-top: 15px;
`

const ActionButton = styled(Button)`
  margin-top: 45px;
  width: 100%;
`

interface Props {
  auctioningToken?: Token
  biddingToken?: Token
  cancelDate?: string
  confirmText: string
  onPlaceOrder: () => any
  orderPlacingOnly?: boolean
  price: string
  priceImpactWithoutFee?: Percent
  realizedLPFee?: TokenAmount
  sellAmount: string
  trade?: Trade
}

const SwapModalFooter: React.FC<Props> = (props) => {
  const {
    auctioningToken,
    biddingToken,
    cancelDate,
    confirmText,
    onPlaceOrder,
    orderPlacingOnly,
    price,
    sellAmount,
  } = props
  const { buyAmountScaled } = convertPriceIntoBuyAndSellAmount(
    auctioningToken,
    biddingToken,
    price,
    sellAmount,
  )

  let minimumReceived = undefined
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
      <Row>
        <Text>{biddingTokenDisplay} Tokens sold</Text>
        <Value>
          <Text>{sellAmount}</Text>
          <div>
            <TokenLogo
              size="24px"
              token={{ address: biddingToken.address, symbol: biddingToken.symbol }}
            />
          </div>
        </Value>
      </Row>
      <Row>
        <Text>Minimum {auctioningTokenDisplay} received</Text>
        <Value>
          <Text>{minimumReceived?.toSignificant(2)}</Text>
          <div>
            <TokenLogo
              size="24px"
              token={{ address: auctioningToken.address, symbol: auctioningToken.symbol }}
            />
          </div>
        </Value>
      </Row>
      <Row>
        <Text>
          Max {biddingTokenDisplay} paid per {auctioningTokenDisplay}
        </Text>
        <Value>
          <Text>{price}</Text>
          <div>
            <DoubleLogo
              auctioningToken={{ address: auctioningToken.address, symbol: auctioningToken.symbol }}
              biddingToken={{ address: biddingToken.address, symbol: biddingToken.symbol }}
              size="24px"
            />
          </div>
        </Value>
      </Row>
      {(cancelDate || orderPlacingOnly) && (
        <ErrorWrapper>
          {orderPlacingOnly && (
            <ErrorRowStyled>
              <ErrorLock />
              <ErrorText>
                Remember: You won&apos;t be able to cancel this order after you click the{' '}
                <strong>&quot;Confirm&quot;</strong>
                button.
              </ErrorText>
            </ErrorRowStyled>
          )}
          {cancelDate && (
            <ErrorRowStyled>
              <ErrorLock />
              <ErrorText>
                Remember: After <strong>{cancelDate}</strong> and until the end of the auction,
                orders cannot be canceled.
              </ErrorText>
            </ErrorRowStyled>
          )}
        </ErrorWrapper>
      )}
      <ActionButton onClick={onPlaceOrder}>{confirmText}</ActionButton>
    </>
  )
}

export default SwapModalFooter
