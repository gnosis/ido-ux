import React, { HTMLAttributes } from 'react'
import styled, { css } from 'styled-components'

import { Spinner } from '../Spinner'

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

const Text = styled.p`
  color: ${({ theme }) => theme.text1};
  font-size: 22px;
  font-weight: 400;
  line-height: 1.4;
  margin: 0;
  padding: 15px 20px;
  text-align: center;
  width: 100%;
`

interface Props extends HTMLAttributes<HTMLDivElement> {
  absolute?: boolean
  message?: string
  size?: string
}

export const InlineLoading: React.FC<Props> = (props: Props) => {
  const { message, size, ...restProps } = props

  return (
    <Wrapper {...restProps}>
      <Spinner size={size} />
      {message ? <Text>{message}</Text> : null}
    </Wrapper>
  )
}
