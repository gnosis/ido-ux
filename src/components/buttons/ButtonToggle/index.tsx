import React from 'react'
import styled from 'styled-components'

import * as CSS from 'csstype'

import { ButtonGroupProps } from '../buttonStylingTypes'

const ButtonToggleWrap = styled.div`
  display: flex;
  align-items: center;
  border: 1px solid ${(props) => props.theme.buttonPrimary.borderColor};
  border-radius: ${({ theme }) => theme.textField.borderRadius};
`

interface BtnProps {
  activate?: boolean
}

const Wrap = styled.button<Partial<CSS.Properties & BtnProps>>`
  font-size: 13px;
  padding: 2px 6px;
  line-height: 13px;
  flex: 0 0 auto;
  max-width: 100%;
  height: 17px;
  display: flex;
  align-items: center;
  cursor: pointer;
  background-image: none;
  background-color: ${({ theme }) => theme.textField.backgroundColor};
  color: ${(props) => props.theme.buttonPrimary.borderColor};
  border: 0;
  &:not(:last-child) {
    border-top-left-radius: ${({ theme }) => theme.textField.borderRadius};
    border-bottom-left-radius: ${({ theme }) => theme.textField.borderRadius};
    border-right: 1px solid ${(props) => props.theme.buttonPrimary.borderColor};
  }
  &:last-child {
    border-top-right-radius: ${({ theme }) => theme.textField.borderRadius};
    border-bottom-right-radius: ${({ theme }) => theme.textField.borderRadius};
  }
  span {
    display: block;
    margin-left: 4px;
  }
  .fill {
    fill: ${(props) => props.theme.buttonPrimary.borderColor};
  }
  &.active {
    background-color: ${(props) => props.theme.buttonPrimary.borderColor};
    span {
      color: ${({ theme }) => theme.textField.backgroundColor};
    }
    &:not(:last-child) {
      border-top-left-radius: calc(${({ theme }) => theme.textField.borderRadius} / 2);
      border-bottom-left-radius: calc(${({ theme }) => theme.textField.borderRadius} / 2);
    }
    &:last-child {
      border-top-right-radius: calc(${({ theme }) => theme.textField.borderRadius} / 2);
      border-bottom-right-radius: calc(${({ theme }) => theme.textField.borderRadius} / 2);
    }
    .fill {
      fill: ${({ theme }) => theme.textField.backgroundColor};
    }
  }
`

export const ButtonToggle: React.FC<ButtonGroupProps> = (props: ButtonGroupProps) => {
  const { activate, left, right } = props

  return (
    <ButtonToggleWrap>
      <Wrap className={activate ? 'active' : ''} onClick={left.onClick}>
        {left.icon}
        <span>{left.label}</span>
      </Wrap>
      <Wrap className={!activate ? 'active' : ''} onClick={right.onClick}>
        {right.icon}
        <span>{right.label}</span>
      </Wrap>
    </ButtonToggleWrap>
  )
}
