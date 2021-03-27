import React from 'react'
import styled from 'styled-components'

import { CloseIcon } from '../../../icons/CloseIcon'

const Wrapper = styled.div`
  align-items: center;
  display: flex;
  justify-content: space-between;
  margin-bottom: 34px;
`

const Title = styled.h2`
  color: ${({ theme }) => theme.text1};
  font-size: 24px;
  font-weight: normal;
  line-height: 1.2;
  margin: 0 auto 0 0;
`

const Close = styled.button`
  align-items: center;
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  height: 24px;
  justify-content: center;
  margin-left: auto;
  outline: none;
  padding: 0;
  width: 24px;

  &[disabled] {
    cursor: not-allowed;
    opacity: 0.5;
  }
`

interface Props {
  onClose?: () => void
  title?: string
}

export const ModalTitle: React.FC<Props> = (props) => {
  const { onClose, title, ...restProps } = props

  return (
    <Wrapper {...restProps}>
      {title && <Title>{title}</Title>}
      {onClose && (
        <Close onClick={onClose}>
          <CloseIcon />
        </Close>
      )}
    </Wrapper>
  )
}
