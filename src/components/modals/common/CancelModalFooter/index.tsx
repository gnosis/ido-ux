import React from 'react'
import styled from 'styled-components'
import { Token } from 'uniswap-xdai-sdk'

import * as CSS from 'csstype'

import { Button } from '../../../buttons/Button'
import { AlertIcon } from '../../../icons/AlertIcon'
import { ErrorLock } from '../../../icons/ErrorLock'
import DoubleLogo from '../../../token/DoubleLogo'
import TokenLogo from '../../../token/TokenLogo'
import { Text } from '../pureStyledComponents/Text'

const ActionButton = styled(Button)`
  margin-top: 40px;
  width: 100%;
`
interface WrapProps {
  margin?: string
}
const Wrap = styled.div<Partial<CSS.Properties & WrapProps>>`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin: ${(props) => (props.margin ? props.margin : '0')};
`

const IconWrap = styled.div`
  margin-right: 15px;
  width: 20px;
  height: 20px;
  svg {
    width: 20px;
    height: auto;
    .fill {
      fill: ${({ theme }) => theme.error};
    }
  }
  + p {
    max-width: calc(100% - 35px);
    margin-bottom: 0;
  }
`

const FieldRowTokenStyled = styled.div`
  align-items: center;
  display: flex;
  margin-left: 12px;

  .tokenLogo {
    border-width: 1px;
    margin-left: 6px;
  }
`

interface Props {
  confirmText: string
  invertPrices: boolean
  onCancelOrder: () => any
  orderData?: any
  tokens?: { auctioningToken: Maybe<Token>; biddingToken: Maybe<Token> } | null
}

const CancelModalFooter: React.FC<Props> = (props) => {
  const { confirmText, invertPrices, onCancelOrder, orderData, tokens } = props
  return (
    <>
      <Wrap margin={'0 0 15px 0'}>
        <Text fontSize="18px" margin={'0'}>
          Min (max) DAI per GNO
        </Text>
        <Wrap>
          <Text fontSize="18px" margin={'0'}>
            {orderData.price}
          </Text>
          <FieldRowTokenStyled>
            {tokens.biddingToken.address && (
              <TokenLogo
                size={'18px'}
                token={{ address: tokens.biddingToken.address, symbol: tokens.biddingToken.symbol }}
              />
            )}
          </FieldRowTokenStyled>
        </Wrap>
      </Wrap>
      <Wrap margin={'0 0 15px 0'}>
        <Text fontSize="18px" margin={'0'}>
          DAI tokens sold
        </Text>
        <Wrap>
          <Text fontSize="18px" margin={'0'}>
            {orderData.sellAmount}
          </Text>
          <FieldRowTokenStyled>
            {invertPrices ? (
              <DoubleLogo
                auctioningToken={{
                  address: tokens.biddingToken.address,
                  symbol: tokens.biddingToken.symbol,
                }}
                biddingToken={{
                  address: tokens.auctioningToken.address,
                  symbol: tokens.auctioningToken.symbol,
                }}
                size="16px"
              />
            ) : (
              <DoubleLogo
                auctioningToken={{
                  address: tokens.auctioningToken.address,
                  symbol: tokens.auctioningToken.symbol,
                }}
                biddingToken={{
                  address: tokens.biddingToken.address,
                  symbol: tokens.biddingToken.symbol,
                }}
                size="16px"
              />
            )}
          </FieldRowTokenStyled>
        </Wrap>
      </Wrap>
      <Wrap>
        <IconWrap>
          <ErrorLock />
        </IconWrap>
        <Text fontSize="14px">
          If you Cancel an order in xDAI, you will receive back WXDAI tokens in xDAI.
        </Text>
      </Wrap>
      <Wrap>
        <IconWrap>
          <AlertIcon />
        </IconWrap>
        <Text fontSize="14px">
          You will need to place a new order if you still want to participate in this auction.
        </Text>
      </Wrap>
      <ActionButton onClick={onCancelOrder}>{confirmText}</ActionButton>
    </>
  )
}

export default CancelModalFooter
