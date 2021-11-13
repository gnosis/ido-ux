import { rgba } from 'polished'
import React, { useState } from 'react'
import styled, { keyframes } from 'styled-components'

import { Token } from '@josojo/honeyswap-sdk'
import ReactTooltip from 'react-tooltip'

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
  InfoType,
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
  height: 17px;

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

const Balance = styled.div<{ disabled?: boolean }>`
  color: ${({ theme }) => theme.text1};
  font-size: 14px;
  font-weight: 400;
  line-height: 1.2;
  margin: 0 8px 0 0;
  ${(props) => props.disabled && 'opacity: 0.7;'}
`

const Wrap = styled.div`
  display: flex;
  flex-grow: 1;
  align-items: center;
`

Balance.defaultProps = {
  disabled: false,
}

interface unlockProps {
  isLocked: boolean
  onUnlock: () => void
  unlockState: ApprovalState
}

interface wrapProps {
  isWrappable: boolean
  onClick: () => void
}

interface Props {
  balance?: string
  chainId: ChainId
  info?: FieldRowInfoProps
  onMax?: () => void
  onUserSellAmountInput: (val: string) => void
  token: Maybe<Token>
  unlock: unlockProps
  wrap: wrapProps
  value: string
}

const AmountInputPanel: React.FC<Props> = (props) => {
  const {
    balance,
    chainId,
    info,
    onMax,
    onUserSellAmountInput,
    token = null,
    unlock,
    value,
    wrap,
    ...restProps
  } = props
  const [readonly, setReadonly] = useState(true)
  const { account } = useActiveWeb3React()
  const isUnlocking = unlock.unlockState === ApprovalState.PENDING
  const error = info?.type === InfoType.error
  const dataTip =
    chainId == 100
      ? `Unwrap WXDAI to XDAI on Honeyswap`
      : chainId == 137
      ? `Unwrap WMATIC to MATIC on Quickswap`
      : `Unwrap WETH to ETH on Uniswap`

  return (
    <>
      <FieldRowWrapper error={error} {...restProps}>
        <FieldRowTop>
          <FieldRowLabel>Amount</FieldRowLabel>
          <Balance disabled={!account}>
            Balance: {balance === '0' || !account ? '0.00' : balance}
          </Balance>
          <FieldRowLineButton disabled={!onMax || !account} onClick={onMax}>
            Max
          </FieldRowLineButton>
        </FieldRowTop>
        <FieldRowBottom>
          <Wrap>
            {token && (
              <FieldRowToken>
                {token.address && (
                  <TokenLogo
                    size={'16px'}
                    token={{ address: token.address, symbol: token.symbol }}
                  />
                )}
                {token && token.symbol && (
                  <FieldRowTokenSymbol>{getTokenDisplay(token, chainId)}</FieldRowTokenSymbol>
                )}
              </FieldRowToken>
            )}
            {unlock.isLocked && (
              <UnlockButton
                disabled={isUnlocking}
                onClick={unlock.onUnlock}
                unlocking={isUnlocking}
              >
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
            {wrap.isWrappable && (
              <FieldRowPrimaryButton
                className={`tooltipComponent`}
                data-for={'wrap_button'}
                data-html={true}
                data-multiline={true}
                data-tip={dataTip}
                onClick={wrap.onClick}
              >
                <ReactTooltip
                  arrowColor={'#001429'}
                  backgroundColor={'#001429'}
                  border
                  borderColor={'#174172'}
                  className="customTooltip"
                  delayHide={50}
                  delayShow={250}
                  effect="solid"
                  id={'wrap_button'}
                  textColor="#fff"
                />
                <FieldRowPrimaryButtonText>Unwrap</FieldRowPrimaryButtonText>
              </FieldRowPrimaryButton>
            )}
          </Wrap>
          <FieldRowInput
            disabled={!account}
            hasError={error}
            onBlur={() => setReadonly(true)}
            onFocus={() => setReadonly(false)}
            onUserSellAmountInput={(val) => {
              onUserSellAmountInput(val)
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

export default AmountInputPanel
