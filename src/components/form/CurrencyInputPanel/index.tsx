import { darken } from 'polished'
import React, { useContext } from 'react'
import styled, { ThemeContext } from 'styled-components'
import { Pair, Token } from 'uniswap-xdai-sdk'

import { useTranslation } from 'react-i18next'

import { useActiveWeb3React } from '../../hooks'
import { useTokenBalance } from '../../state/wallet/hooks'
import { CursorPointer, TYPE } from '../../theme'
import DoubleLogo from '../DoubleLogo'
import { Input as NumericalInput } from '../NumericalInput'
import { RowBetween } from '../Row'
import TokenLogo from '../TokenLogo'

const InputRow = styled.div<{ selected: boolean }>`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: center;
  padding: ${({ selected }) =>
    selected ? '0.75rem 0.5rem 0.75rem 1rem' : '0.75rem 0.75rem 0.75rem 1rem'};
`

const CurrencySelect = styled.button<{ selected: boolean }>`
  align-items: center;
  height: 2.2rem;
  font-size: 20px;
  font-weight: 500;
  background-color: ${({ selected, theme }) => (selected ? theme.bg1 : theme.primary1)};
  color: ${({ selected, theme }) => (selected ? theme.text1 : theme.white)};
  border-radius: 12px;
  box-shadow: ${({ selected }) => (selected ? 'none' : '0px 6px 10px rgba(0, 0, 0, 0.075)')};
  outline: none;
  cursor: pointer;
  user-select: none;
  border: none;
  padding: 0 0.5rem;

  :focus,
  :hover {
    background-color: ${({ selected, theme }) =>
      selected ? theme.bg2 : darken(0.05, theme.primary1)};
  }
`

const LabelRow = styled.div`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: center;
  color: ${({ theme }) => theme.text1};
  font-size: 0.75rem;
  line-height: 1rem;
  padding: 0.75rem 1rem 0 1rem;
  height: 20px;
  span:hover {
    cursor: pointer;
    color: ${({ theme }) => darken(0.2, theme.text2)};
  }
`

const Aligner = styled.span`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const InputPanel = styled.div<{ hideInput?: boolean }>`
  ${({ theme }) => theme.flexColumnNoWrap}
  position: relative;
  border-radius: ${({ hideInput }) => (hideInput ? '8px' : '20px')};
  background-color: ${({ theme }) => theme.bg2};
  z-index: 1;
`

const Container = styled.div<{ hideInput: boolean }>`
  border-radius: ${({ hideInput }) => (hideInput ? '8px' : '20px')};
  border: 1px solid ${({ theme }) => theme.bg2};
  background-color: ${({ theme }) => theme.bg1};
`

const StyledTokenName = styled.span<{ active?: boolean }>`
  ${({ active }) => (active ? '  margin: 0 0.25rem 0 0.75rem;' : '  margin: 0 0.25rem 0 0.25rem;')}
  font-size:  ${({ active }) => (active ? '20px' : '16px')};
`

const StyledBalanceMax = styled.button`
  height: 28px;
  background-color: ${({ theme }) => theme.primary5};
  border: 1px solid ${({ theme }) => theme.primary5};
  border-radius: 0.5rem;
  font-size: 0.875rem;

  font-weight: 500;
  cursor: pointer;
  margin-right: 0.5rem;
  color: ${({ theme }) => theme.primaryText1};
  :hover {
    border: 1px solid ${({ theme }) => theme.primary1};
  }
  :focus {
    border: 1px solid ${({ theme }) => theme.primary1};
    outline: none;
  }

  ${({ theme }) => theme.mediaWidth.upToExtraSmall`
    margin-right: 0.5rem;
  `};
`

interface CurrencyInputPanelProps {
  value: string
  onUserSellAmountInput: (val: string) => void
  onMax?: () => void
  showMaxButton: boolean
  label?: string
  onTokenSelection?: (tokenAddress: string) => void
  token?: Maybe<Token>
  disableTokenSelect?: boolean
  hideBalance?: boolean
  isExchange?: boolean
  pair?: Maybe<Pair>
  hideInput?: boolean
  showSendWithSwap?: boolean
  otherSelectedTokenAddress?: Maybe<string>
  id: string
}

export default function CurrencyInputPanel({
  disableTokenSelect = false,
  hideBalance = false,
  hideInput = false,
  id,
  isExchange = false,
  label = 'Input',
  onMax,
  onUserSellAmountInput,
  pair = null,
  showMaxButton, // used for double token logo
  token = null,
  value,
}: CurrencyInputPanelProps) {
  const { t } = useTranslation()

  const { account } = useActiveWeb3React()
  const userTokenBalance = useTokenBalance(account, token)
  const theme = useContext(ThemeContext)

  return (
    <InputPanel id={id}>
      <Container hideInput={hideInput}>
        {!hideInput && (
          <LabelRow>
            <RowBetween>
              <TYPE.body color={theme.text2} fontSize={14} fontWeight={500}>
                {label}
              </TYPE.body>
              {account && (
                <CursorPointer>
                  <TYPE.body
                    color={theme.text2}
                    fontSize={14}
                    fontWeight={500}
                    onClick={onMax}
                    style={{ display: 'inline' }}
                  >
                    {!hideBalance && !!token && userTokenBalance
                      ? 'Balance: ' + userTokenBalance?.toSignificant(6)
                      : ' -'}
                  </TYPE.body>
                </CursorPointer>
              )}
            </RowBetween>
          </LabelRow>
        )}
        <InputRow
          selected={disableTokenSelect}
          style={hideInput ? { padding: '0', borderRadius: '8px' } : {}}
        >
          {!hideInput && (
            <>
              <NumericalInput
                className="token-amount-input"
                onUserSellAmountInput={(val) => {
                  onUserSellAmountInput(val)
                }}
                value={value}
              />
              {account && !!token?.address && showMaxButton && label !== 'To' && (
                <StyledBalanceMax onClick={onMax}>MAX</StyledBalanceMax>
              )}
            </>
          )}
          <CurrencySelect className="open-currency-select-button" selected={!!token}>
            <Aligner>
              {isExchange ? (
                <DoubleLogo
                  a0={pair?.token0.address}
                  a1={pair?.token1.address}
                  margin={true}
                  size={24}
                />
              ) : token?.address ? (
                <TokenLogo address={token?.address} size={'24px'} />
              ) : null}
              {isExchange ? (
                <StyledTokenName className="pair-name-container">
                  {pair?.token0.symbol}:{pair?.token1.symbol}
                </StyledTokenName>
              ) : (
                <StyledTokenName
                  active={Boolean(token && token.symbol)}
                  className="token-symbol-container"
                >
                  {(token && token.symbol && token.symbol.length > 20
                    ? token.symbol.slice(0, 4) +
                      '...' +
                      token.symbol.slice(token.symbol.length - 5, token.symbol.length)
                    : token?.symbol) || t('selectToken')}
                </StyledTokenName>
              )}
              {!disableTokenSelect}
            </Aligner>
          </CurrencySelect>
        </InputRow>
      </Container>
    </InputPanel>
  )
}
