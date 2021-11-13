import React, { useMemo } from 'react'
import styled from 'styled-components'

import { BigNumber } from '@ethersproject/bignumber'
import { Fraction, Percent, Token, TokenAmount, Trade } from '@josojo/honeyswap-sdk'

import { NUMBER_OF_DIGITS_FOR_INVERSION } from '../../../../constants/config'
import { ChainId, getTokenDisplay } from '../../../../utils'
import { abbreviation } from '../../../../utils/numeral'
import { convertPriceIntoBuyAndSellAmount, getInverse } from '../../../../utils/prices'
import { Button } from '../../../buttons/Button'
import { ErrorLock } from '../../../icons/ErrorLock'
import { ErrorRow, ErrorText, ErrorWrapper } from '../../../pureStyledComponents/Error'
import DoubleLogo from '../../../token/DoubleLogo'
import TokenLogo from '../../../token/TokenLogo'

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

const TextNoWrap = styled(Text)`
  white-space: nowrap;
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
  hasRiskNotCoveringClearingPrice: boolean
  orderPlacingOnly?: boolean
  price: string
  priceImpactWithoutFee?: Percent
  realizedLPFee?: TokenAmount
  sellAmount: string
  trade?: Trade
  chainId: ChainId
  isPriceInverted?: boolean
}

const WarnMessageStyled: React.FC = ({ children }) => (
  <>
    <ErrorWrapper>
      <ErrorRowStyled>
        <ErrorLock />
        <ErrorText>{children}</ErrorText>
      </ErrorRowStyled>
    </ErrorWrapper>
  </>
)

const SwapModalFooter: React.FC<Props> = (props) => {
  const {
    auctioningToken,
    biddingToken,
    cancelDate,
    chainId,
    confirmText,
    hasRiskNotCoveringClearingPrice,
    isPriceInverted,
    onPlaceOrder,
    orderPlacingOnly,
    price,
    sellAmount,
  } = props
  const { buyAmountScaled } = convertPriceIntoBuyAndSellAmount(
    auctioningToken,
    biddingToken,
    isPriceInverted ? getInverse(price, NUMBER_OF_DIGITS_FOR_INVERSION) : price,
    sellAmount,
  )

  let minimumReceived = undefined
  if (sellAmount != undefined && buyAmountScaled != undefined) {
    minimumReceived = new Fraction(
      buyAmountScaled.toString(),
      BigNumber.from(10).pow(auctioningToken.decimals).toString(),
    )
  }

  const biddingTokenDisplay = useMemo(
    () => getTokenDisplay(biddingToken, chainId),
    [biddingToken, chainId],
  )
  const auctioningTokenDisplay = useMemo(
    () => getTokenDisplay(auctioningToken, chainId),
    [auctioningToken, chainId],
  )

  return (
    <>
      <Row>
        <Text>{biddingTokenDisplay} Tokens sold</Text>
        <Value>
          <TextNoWrap>{abbreviation(sellAmount, 10)}</TextNoWrap>
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
          <TextNoWrap>{abbreviation(minimumReceived?.toSignificant(4), 10)}</TextNoWrap>
          <div>
            <TokenLogo
              size="24px"
              token={{ address: auctioningToken.address, symbol: auctioningToken.symbol }}
            />
          </div>
        </Value>
      </Row>
      <Row>
        {isPriceInverted ? (
          <Text>
            Min {auctioningTokenDisplay} received per {biddingTokenDisplay}
          </Text>
        ) : (
          <Text>
            Max {biddingTokenDisplay} paid per {auctioningTokenDisplay}
          </Text>
        )}
        <Value>
          <TextNoWrap>{abbreviation(price, 10)}</TextNoWrap>
          <div>
            <DoubleLogo
              auctioningToken={{ address: auctioningToken.address, symbol: auctioningToken.symbol }}
              biddingToken={{ address: biddingToken.address, symbol: biddingToken.symbol }}
              size="24px"
            />
          </div>
        </Value>
      </Row>
      {orderPlacingOnly && !cancelDate && (
        <WarnMessageStyled>
          Remember: You won&apos;t be able to cancel this order after you click the{' '}
          <strong>&quot;Confirm&quot;</strong>
          button.
        </WarnMessageStyled>
      )}
      {cancelDate && (
        <WarnMessageStyled>
          Remember: After <strong>{cancelDate}</strong> orders cannot be canceled.
        </WarnMessageStyled>
      )}
      {hasRiskNotCoveringClearingPrice && (
        <WarnMessageStyled>
          You are placing an order <strong>{isPriceInverted ? 'above' : 'below'}</strong> the
          current clearing price. Most likely your order will not succeed in buying{' '}
          <strong>{auctioningToken.symbol}</strong>.
        </WarnMessageStyled>
      )}
      <ActionButton onClick={onPlaceOrder}>{confirmText}</ActionButton>
    </>
  )
}

export default SwapModalFooter
