import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`

const Value = styled.div<{ align: string }>`
  align-items: center;
  color: ${({ theme }) => theme.text1};
  display: flex;
  font-size: 20px;
  font-weight: 700;
  justify-content: ${(props) => props.align};
  line-height: 1;
  margin: 0 0 2px;

  > * {
    margin-right: 8px;

    &:last-child {
      margin-right: 0;
    }
  }
`

const Key = styled.div<{ align: string }>`
  align-items: center;
  color: ${({ theme }) => theme.text1};
  display: flex;
  font-size: 18px;
  font-weight: 400;
  justify-content: ${(props) => props.align};
  line-height: 1.3;
  margin: 0;
  text-transform: capitalize;

  > * {
    margin-right: 8px;

    &:last-child {
      margin-right: 0;
    }
  }
`

Key.defaultProps = {
  align: 'center',
}

Value.defaultProps = {
  align: 'center',
}

interface Props {
  align?: string
  itemKey: React.ReactNode
  itemValue: React.ReactNode
}

export const KeyValue: React.FC<Props> = (props) => {
  const { align, itemKey, itemValue, ...restProps } = props

  return (
    <Wrapper {...restProps}>
      <Value align={align}>{itemValue}</Value>
      <Key align={align}>{itemKey}</Key>
    </Wrapper>
  )
}
