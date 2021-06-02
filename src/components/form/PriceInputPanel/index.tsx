import React from 'react'
import styled from 'styled-components'
import { Token } from 'uniswap-xdai-sdk'

import { Tooltip } from '../../common/Tooltip'
import { InvertIcon } from '../../icons/InvertIcon'
import { MiniInfoIcon } from '../../icons/MiniInfoIcon'
import {
  FieldRowBottom,
  FieldRowInfo,
  FieldRowInfoProps,
  FieldRowInput,
  FieldRowLabel,
  FieldRowLineButton,
  FieldRowToken,
  FieldRowTokenSymbol,
  FieldRowTop,
  FieldRowWrapper,
  InfoType,
} from '../../pureStyledComponents/FieldRow'
import DoubleLogo from '../../token/DoubleLogo'

const FieldRowLabelStyled = styled(FieldRowLabel)`
  align-items: center;
  display: flex;
`

const FieldRowLabelStyledText = styled.span`
  margin-right: 5px;
`

const DoubleLogoStyled = styled(DoubleLogo)`
  margin-right: 6px;
`

const InvertButton = styled(FieldRowLineButton)`
  flex-shrink: 0;
  height: 16px;
`

interface Props {
  info?: FieldRowInfoProps
  invertPrices: boolean
  onInvertPrices: () => void
  onUserPriceInput: (val: string, isInvertedPrice: boolean) => void
  tokens: { auctioningToken: Maybe<Token>; biddingToken: Maybe<Token> } | null
  value: string
}

const PriceInputPanel = (props: Props) => {
  const {
    info,
    invertPrices,
    onInvertPrices,
    onUserPriceInput,
    tokens = null,
    value,
    ...restProps
  } = props
  const error = info?.type === InfoType.error

  return (
    <>
      <FieldRowWrapper error={error} {...restProps}>
        <FieldRowTop>
          <FieldRowLabelStyled>
            <FieldRowLabelStyledText>
              {invertPrices ? 'Min Bidding Price' : 'Max Bidding Price'}
            </FieldRowLabelStyledText>
            <Tooltip
              text={invertPrices ? 'Min Bidding Price tooltip' : 'Max Bidding Price tooltip'}
            />
          </FieldRowLabelStyled>
        </FieldRowTop>
        <FieldRowBottom>
          {tokens && (
            <>
              <FieldRowToken>
                {invertPrices ? (
                  <DoubleLogoStyled
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
                  <DoubleLogoStyled
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
                <FieldRowTokenSymbol>
                  {invertPrices
                    ? `${tokens.auctioningToken.symbol} per ${tokens.biddingToken.symbol}`
                    : `${tokens.biddingToken.symbol} per ${tokens.auctioningToken.symbol}`}
                </FieldRowTokenSymbol>
              </FieldRowToken>
              <InvertButton onClick={onInvertPrices} title="Invert">
                <InvertIcon />
              </InvertButton>
            </>
          )}
          <FieldRowInput
            hasError={error}
            onUserSellAmountInput={(val) => {
              onUserPriceInput(val, invertPrices)
            }}
            value={value}
          />
        </FieldRowBottom>
      </FieldRowWrapper>
      <FieldRowInfo infoType={info?.type}>
        {info ? (
          <>
            <MiniInfoIcon /> {info.text}
          </>
        ) : (
          <>&nbsp;</>
        )}
      </FieldRowInfo>
    </>
  )
}

export default PriceInputPanel
