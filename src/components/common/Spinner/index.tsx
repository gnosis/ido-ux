import React, { HTMLAttributes } from 'react'
import styled, { keyframes } from 'styled-components'

import { Spinner as SpinnerSVG } from '../../icons/Spinner'

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`

const Wrapper = styled.div<{ size?: SpinnerSize | string | undefined }>`
  animation: ${rotate} 2s linear infinite;
  flex-grow: 0;
  flex-shrink: 0;
  height: ${(props) => props.size};
  width: ${(props) => props.size};

  svg {
    height: 100%;
    width: 100%;
  }
`

export enum SpinnerSize {
  extraSmall = '20px',
  small = '30px',
  regular = '50px',
  large = '60px',
}

Wrapper.defaultProps = {
  size: SpinnerSize.regular,
}

interface Props extends HTMLAttributes<HTMLDivElement> {
  size?: SpinnerSize | string | undefined
}

export const Spinner: React.FC<Props> = (props: Props) => {
  const { size, ...restProps } = props

  return (
    <Wrapper size={size} {...restProps}>
      <SpinnerSVG />
    </Wrapper>
  )
}
