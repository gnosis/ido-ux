import React, { HTMLAttributes } from 'react'
import styled from 'styled-components'

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`

const Value = styled.div<{ align?: string; noWrap?: boolean }>`
  align-items: center;
  color: ${({ theme }) => theme.text1};
  display: flex;
  flex-grow: 1;
  flex-shrink: 0;
  font-size: 18px;
  font-weight: 700;
  justify-content: ${(props) => props.align};
  line-height: 1;
  margin: 0 0 2px;
  white-space: ${(props) => (props.noWrap ? 'nowrap' : 'normal')};

  &:last-child {
    margin-bottom: 0;
  }

  > * {
    margin-right: 8px;

    &:last-child {
      margin-right: 0;
    }
  }
`

const Key = styled.div<{ align?: string }>`
  align-items: center;
  color: ${({ theme }) => theme.text1};
  display: flex;
  font-size: 16px;
  font-weight: 400;
  justify-content: ${(props) => props.align};
  line-height: 1.3;
  margin: 0;
  text-transform: capitalize;
  white-space: nowrap;

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
  noWrap: false,
}

interface Props extends HTMLAttributes<HTMLDivElement> {
  align?: string
  itemKey?: React.ReactNode | null | undefined
  itemValue: React.ReactNode
  noWrap?: boolean
}

export const KeyValue: React.FC<Props> = (props) => {
  const { align, itemKey, itemValue, noWrap, ...restProps } = props

  return (
    <Wrapper {...restProps}>
      <Value align={align} className="itemValue" noWrap={noWrap}>
        {itemValue}
      </Value>
      {itemKey && (
        <Key align={align} className="itemKey">
          {itemKey}
        </Key>
      )}
    </Wrapper>
  )
}
