import React, { useMemo, useState } from 'react'
import styled from 'styled-components'

import { Token } from '@josojo/honeyswap-sdk'

import { getTokenDisplay } from '../../../utils'
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
  chainId: number
  info?: FieldRowInfoProps
  invertPrices: boolean
  onInvertPrices: () => void
  onUserPriceInput: (val: string, isInvertedPrice: boolean) => void
  tokens: { auctioningToken: Maybe<Token>; biddingToken: Maybe<Token> } | null
  value: string
}

const PriceInputPanel = (props: Props) => {
  const {
    chainId,
    info,
    invertPrices,
    onInvertPrices,
    onUserPriceInput,
    tokens = null,
    value,
    ...restProps
  } = props

  const [readonly, setReadonly] = useState(true)
  const error = info?.type === InfoType.error

  const { auctioningTokenDisplay, biddingTokenDisplay } = useMemo(() => {
    if (tokens && chainId && tokens.auctioningToken && tokens.biddingToken) {
      return {
        auctioningTokenDisplay: getTokenDisplay(tokens.auctioningToken, chainId),
        biddingTokenDisplay: getTokenDisplay(tokens.biddingToken, chainId),
      }
    } else {
      return { auctioningTokenDisplay: '-', biddingTokenDisplay: '-' }
    }
  }, [chainId, tokens])

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
                    ? `${auctioningTokenDisplay} per ${biddingTokenDisplay}`
                    : `${biddingTokenDisplay} per ${auctioningTokenDisplay}`}
                </FieldRowTokenSymbol>
              </FieldRowToken>
              <InvertButton onClick={onInvertPrices} title="Invert">
                <InvertIcon />
              </InvertButton>
            </>
          )}
          <FieldRowInput
            hasError={error}
            onBlur={() => setReadonly(true)}
            onFocus={() => setReadonly(false)}
            onUserSellAmountInput={(val) => {
              onUserPriceInput(val, invertPrices)
            }}
            readOnly={readonly}
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
