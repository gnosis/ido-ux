import React from 'react'
import styled, { css } from 'styled-components'

const Wrapper = styled.div`
  align-items: center;
  display: flex;
  justify-content: space-between;
  margin: 0 0 10px;
`

export const Label = styled.label`
  color: ${({ theme }) => theme.text1};
  font-size: 18px;
  font-weight: 400;
  line-height: 1.2;
  margin: 0;
  text-align: left;
`

const ControlCSS = css`
  background: none;
  border: none;
  color: ${({ theme }) => theme.primary1};
  cursor: pointer;
  font-size: 17px;
  font-weight: 400;
  line-height: 1.2;
  margin: 0;
  outline: none;
  padding: 0;
  text-align: right;
  text-decoration: underline;

  &:hover {
    text-decoration: none;
  }
`

export const ControlA = styled.a`
  ${ControlCSS}
`

export const ControlSpan = styled.span`
  ${ControlCSS}
`

export const ControlButton = styled.button`
  ${ControlCSS}
`

interface Props {
  extraControls?: React.ReactNode
  text: string
}

export const FormLabel: React.FC<Props> = (props) => {
  const { extraControls, text, ...restProps } = props

  return (
    <Wrapper {...restProps}>
      <Label>{text}</Label>
      {extraControls && extraControls}
    </Wrapper>
  )
}
