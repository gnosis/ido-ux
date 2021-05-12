import { rgba } from 'polished'
import React from 'react'
import styled, { keyframes } from 'styled-components'
import { Token } from 'uniswap-xdai-sdk'

import { useActiveWeb3React } from '../../../hooks'
import { ApprovalState } from '../../../hooks/useApproveCallback'
import { ChainId, getTokenDisplay } from '../../../utils'
import { MiniInfoIcon } from '../../icons/MiniInfoIcon'
import { MiniLock } from '../../icons/MiniLock'
import { MiniSpinner } from '../../icons/MiniSpinner'
import {
  FieldRowBottom,
  FieldRowInfo,
  FieldRowInfoProps,
  FieldRowInput,
  FieldRowLabel,
  FieldRowLineButton,
  FieldRowPrimaryButton,
  FieldRowPrimaryButtonText,
  FieldRowToken,
  FieldRowTokenSymbol,
  FieldRowTop,
  FieldRowWrapper,
} from '../../pureStyledComponents/FieldRow'
import TokenLogo from '../../token/TokenLogo'

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`

const UnlockButton = styled(FieldRowPrimaryButton)<{ unlocking?: boolean }>`
  background-color: ${(props) =>
    props.unlocking ? '#008c73' : ({ theme }) => theme.buttonPrimary.backgroundColor};
  color: ${(props) => (props.unlocking ? '#fff' : ({ theme }) => theme.buttonPrimary.color)};

  &:hover {
    background-color: ${(props) =>
      props.unlocking
        ? rgba('#008c73', 0.8)
        : ({ theme }) => rgba(theme.buttonPrimary.backgroundColor, 0.8)};
    color: ${(props) => (props.unlocking ? '#fff' : ({ theme }) => theme.buttonPrimary.color)};
  }

  &[disabled] {
    background-color: ${(props) =>
      props.unlocking ? '#008c73' : ({ theme }) => theme.buttonPrimary.backgroundColor};
    opacity: 1;
  }
`

UnlockButton.defaultProps = {
  unlocking: false,
}

const SpinningLaVidaLoca = styled.span`
  animation: ${rotate} 2s linear infinite;
  flex-grow: 0;
  flex-shrink: 0;
  margin-right: 2px;
`

export interface unlockProps {
  onUnlock: () => void
  isLocked: boolean
  unlockState: ApprovalState
}

interface Props {
  chainId: ChainId
  info?: FieldRowInfoProps
  onMax?: () => void
  onUserSellAmountInput: (val: string) => void
  token: Maybe<Token>
  unlock: unlockProps
  value: string
}

const CurrencyInputPanel: React.FC<Props> = (props) => {
  const {
    chainId,
    info,
    onMax,
    onUserSellAmountInput,
    token = null,
    unlock,
    value,
    ...restProps
  } = props
  const { account } = useActiveWeb3React()
  const isUnlocking = unlock.unlockState === ApprovalState.PENDING

  return (
    <>
      <FieldRowWrapper {...restProps}>
        <FieldRowTop>
          <FieldRowLabel>Amount</FieldRowLabel>
          {onMax && account && <FieldRowLineButton onClick={onMax}>Max</FieldRowLineButton>}
        </FieldRowTop>
        <FieldRowBottom>
          {token && (
            <FieldRowToken>
              {token.address && (
                <TokenLogo size={'15px'} token={{ address: token.address, symbol: token.symbol }} />
              )}
              {token && token.symbol && (
                <FieldRowTokenSymbol>{getTokenDisplay(token, chainId)}</FieldRowTokenSymbol>
              )}
            </FieldRowToken>
          )}
          {unlock.isLocked && (
            <UnlockButton disabled={isUnlocking} onClick={unlock.onUnlock} unlocking={isUnlocking}>
              {isUnlocking ? (
                <>
                  <SpinningLaVidaLoca>
                    <MiniSpinner />
                  </SpinningLaVidaLoca>
                  <FieldRowPrimaryButtonText>Unlocking</FieldRowPrimaryButtonText>
                </>
              ) : (
                <>
                  <MiniLock />
                  <FieldRowPrimaryButtonText>Unlock</FieldRowPrimaryButtonText>
                </>
              )}
            </UnlockButton>
          )}
          <FieldRowInput
            onUserSellAmountInput={(val) => {
              onUserSellAmountInput(val)
            }}
            value={value}
          />
        </FieldRowBottom>
      </FieldRowWrapper>
      <FieldRowInfo>
        <MiniInfoIcon /> ReactTooltip is defined but never used isTokenXDAI is defined but never
        used Line 31:10: ButtonType is defined but never Line 59:7: BalanceWrapper is assigned a
        value but never usedused
      </FieldRowInfo>
    </>
  )
}

export default CurrencyInputPanel
