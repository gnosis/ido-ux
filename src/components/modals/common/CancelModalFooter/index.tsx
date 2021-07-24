import React from 'react'
import styled from 'styled-components'
import { Token } from 'uniswap-xdai-sdk'

import * as CSS from 'csstype'

import { useActiveWeb3React } from '../../../../hooks'
import { DerivedAuctionInfo } from '../../../../state/orderPlacement/hooks'
import { getChainName } from '../../../../utils/tools'
import { Button } from '../../../buttons/Button'
import { AlertIcon } from '../../../icons/AlertIcon'
import { ErrorLock } from '../../../icons/ErrorLock'
import DoubleLogo from '../../../token/DoubleLogo'
import TokenLogo from '../../../token/TokenLogo'

const ActionButton = styled(Button)`
  margin-top: 40px;
  width: 100%;
`
interface WrapProps {
  margin?: string
  txtAlign?: string
  fs?: string
}
const Wrap = styled.div<Partial<CSS.Properties & WrapProps>>`
  display: grid;
  grid-template-columns: ${(props) => (props.columns ? props.columns : '1fr 1fr')};
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

const Text = styled.div<Partial<CSS.Properties & WrapProps>>`
  color: ${({ theme }) => theme.text1};
  font-size: ${(props) => props.fs || '18px'};
  font-weight: normal;
  line-height: 1.4;
  text-align: ${(props) => props.txtAlign || 'left'};
`

interface Props {
  confirmText: string
  derivedAuctionInfo?: DerivedAuctionInfo
  invertPrices: boolean
  onCancelOrder: () => any
  orderData?: any
  tokens?: { auctioningToken: Maybe<Token>; biddingToken: Maybe<Token> } | null
}

const CancelModalFooter: React.FC<Props> = (props) => {
  const { confirmText, derivedAuctionInfo, invertPrices, onCancelOrder, orderData, tokens } = props
  const { chainId } = useActiveWeb3React()

  return (
    <>
      <Wrap margin={'0 0 15px 0'}>
        <Text>
          {invertPrices ? 'Min ' : 'Max '}
          {invertPrices ? tokens.auctioningToken.symbol : tokens.biddingToken.symbol} per&nbsp;
          {invertPrices ? tokens.biddingToken.symbol : tokens.auctioningToken.symbol}
        </Text>
        <Wrap columns={'1fr 52px'}>
          <Text txtAlign={'right'}>{orderData.price}</Text>
          <FieldRowTokenStyled>
            {tokens.biddingToken.address && (
              <TokenLogo
                size={'24px'}
                token={{ address: tokens.biddingToken.address, symbol: tokens.biddingToken.symbol }}
              />
            )}
          </FieldRowTokenStyled>
        </Wrap>
      </Wrap>
      <Wrap margin={'0 0 15px 0'}>
        <Text>{tokens.biddingToken.symbol} tokens sold</Text>
        <Wrap columns={'1fr 52px'}>
          <Text txtAlign={'right'}>{orderData.sellAmount}</Text>
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
                size="24px"
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
      {(derivedAuctionInfo.biddingToken.symbol === 'ETH' && chainId === 4) ||
      (derivedAuctionInfo.biddingToken.symbol === 'ETH' && chainId === 1) ||
      (derivedAuctionInfo.biddingToken.symbol === 'XDAI' && chainId === 100) ? (
        <Wrap columns={'30px 1fr'}>
          <IconWrap>
            <ErrorLock />
          </IconWrap>
          <Text fs={'14px'}>
            If you Cancel an order in {tokens.biddingToken.symbol}, you will receive back&nbsp;
            {chainId === 1 || chainId === 4 ? 'WXDAI' : 'WETH'} tokens in&nbsp;
            {getChainName(chainId)}.
          </Text>
        </Wrap>
      ) : (
        ''
      )}
      <Wrap columns={'30px 1fr'} margin={'12px 0 0 0'}>
        <IconWrap>
          <AlertIcon />
        </IconWrap>
        <Text fs={'14px'}>
          You will need to place a new order if you still want to participate in this auction.
        </Text>
      </Wrap>
      <ActionButton onClick={onCancelOrder}>{confirmText}</ActionButton>
    </>
  )
}

export default CancelModalFooter
