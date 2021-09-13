import { InputHTMLAttributes } from 'react'
import styled, { css } from 'styled-components'

interface TexfieldCSSProps {
  error?: boolean
}

export interface TextfieldProps extends InputHTMLAttributes<HTMLInputElement>, TexfieldCSSProps {}

export const TexfieldPartsCSS = css<TexfieldCSSProps>`
  &:active,
  &:focus {
    background-color: ${({ theme }) => theme.textField.backgroundColorActive};
    border-color: ${({ theme }) =>
      (props) =>
        props.error ? theme.textField.errorColor : theme.textField.borderColorActive};
  }

  &[disabled],
  &[disabled]:hover {
    background-color: ${({ theme }) => theme.textField.backgroundColor};
    border-color: ${({ theme }) => theme.textField.borderColor};
    cursor: not-allowed;
    opacity: 0.5;
  }

  &:disabled::placeholder {
    color: ${({ theme }) => theme.textField.colorPlaceholder}!important;
  }

  &::placeholder {
    color: ${({ theme }) => theme.textField.colorPlaceholder};
    font-style: italic;
    font-weight: 400;
    opacity: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &[readonly] {
    background-color: ${({ theme }) => theme.textField.backgroundColor};
    border-color: ${({ theme }) => theme.textField.borderColor};
    color: ${({ theme }) => theme.textField.colorPlaceholder};
    cursor: default;
    font-style: italic;
  }

  &[type='number'] {
    -moz-appearance: textfield;
    ::-webkit-inner-spin-button,
    ::-webkit-outer-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
  }

  &::-webkit-search-decoration {
    -webkit-appearance: none;
  }
`

export const TextfieldCSS = css<TexfieldCSSProps>`
  background-color: ${({ theme }) => theme.textField.backgroundColor};
  border-color: ${({ theme }) =>
    (props) =>
      props.error ? theme.textField.errorColor : theme.textField.borderColor};
  border-radius: ${({ theme }) => theme.textField.borderRadius};
  border-style: ${({ theme }) => theme.textField.borderStyle};
  border-width: ${({ theme }) => theme.textField.borderWidth};
  color: ${({ theme }) =>
    (props) =>
      props.error ? theme.textField.errorColor : theme.textField.color};
  font-size: ${({ theme }) => theme.textField.fontSize};
  font-weight: ${({ theme }) => theme.textField.fontWeight};
  height: ${({ theme }) => theme.textField.height};
  outline: none;
  overflow: hidden;
  padding: 0 ${({ theme }) => theme.textField.paddingHorizontal};
  text-overflow: ellipsis;
  transition: border-color 0.15s linear;
  white-space: nowrap;
  width: 100%;

  ${TexfieldPartsCSS}
`

export const Textfield = styled.input<TextfieldProps>`
  ${TextfieldCSS}
`
