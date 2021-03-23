import React, { HTMLAttributes } from 'react'
import styled, { css } from 'styled-components'

import { Spinner, SpinnerSize } from '../Spinner'

const FlexCSS = css`
  align-items: center;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  justify-content: center;
`

const AbsoluteCSS = css`
  left: 0;
  position: absolute;
  top: 0;
  z-index: 100;
`

const Wrapper = styled.div<{ absolute?: boolean }>`
  height: 100%;
  width: 100%;

  ${(props) => (props.absolute ? AbsoluteCSS : '')}
  ${(props) => (!props.absolute ? FlexCSS : '')}
`

Wrapper.defaultProps = {
  absolute: false,
}

const SpinnerWrapper = styled.div`
  align-items: center;
  display: flex;
  flex-shrink: 0;
  height: 100px;
  justify-content: center;
  width: 100%;
`

const Text = styled.p`
  color: ${({ theme }) => theme.text1};
  flex-shrink: 0;
  font-size: 22px;
  font-weight: 400;
  line-height: 1.4;
  margin: 0;
  padding-left: 20px;
  padding-right: 20px;
  padding-top: 15px;
  text-align: center;
  width: 100%;

  &:last-child {
    padding-bottom: 15px;
  }
`

const SubText = styled.p`
  color: ${({ theme }) => theme.text1};
  flex-shrink: 0;
  font-size: 20px;
  font-weight: 400;
  line-height: 1.3;
  margin: 0;
  padding-left: 20px;
  padding-right: 20px;
  text-align: center;
  width: 100%;

  &:last-child {
    padding-bottom: 15px;
  }
`

interface Props extends HTMLAttributes<HTMLDivElement> {
  absolute?: boolean
  message?: string
  subMessage?: string
  size?: SpinnerSize
}

export const InlineLoading: React.FC<Props> = (props: Props) => {
  const { message, size, subMessage, ...restProps } = props

  return (
    <Wrapper {...restProps}>
      <SpinnerWrapper>
        <Spinner size={size} />
      </SpinnerWrapper>
      {message ? <Text>{message}</Text> : null}
      {subMessage ? <SubText>{subMessage}</SubText> : null}
    </Wrapper>
  )
}
