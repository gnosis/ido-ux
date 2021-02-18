import { InputHTMLAttributes } from 'react'
import styled, { css } from 'styled-components'

interface TexfieldCSSProps {
  error?: boolean
}

export interface TextfieldProps extends InputHTMLAttributes<HTMLInputElement>, TexfieldCSSProps {}

export const TextfieldCSS = css<TexfieldCSSProps>`
  background-color: ${(props) => props.theme.textField.backgroundColor};
  border-color: ${(props) =>
    props.error ? props.theme.textField.errorColor : props.theme.textField.borderColor};
  border-radius: ${(props) => props.theme.textField.borderRadius};
  border-style: ${(props) => props.theme.textField.borderStyle};
  border-width: ${(props) => props.theme.textField.borderWidth};
  color: ${(props) =>
    props.error ? props.theme.textField.errorColor : props.theme.textField.color};
  font-size: ${(props) => props.theme.textField.fontSize};
  font-weight: ${(props) => props.theme.textField.fontWeight};
  height: ${(props) => props.theme.textField.height};
  outline: none;
  padding: 0 ${(props) => props.theme.textField.paddingHorizontal};
  transition: border-color 0.15s linear;
  width: 100%;

  &:active,
  &:focus {
    background-color: ${(props) => props.theme.textField.backgroundColorActive};
    border-color: ${(props) =>
      props.error ? props.theme.textField.errorColor : props.theme.textField.borderColorActive};
  }

  &[disabled],
  &[disabled]:hover {
    background-color: ${(props) => props.theme.textField.backgroundColor};
    border-color: ${(props) => props.theme.textField.borderColor};
    cursor: not-allowed;
    opacity: 0.5;
  }

  &:disabled::placeholder {
    color: ${(props) => props.theme.textField.color}!important;
  }

  &::placeholder {
    color: ${(props) => props.theme.textField.colorPlaceholder};
    font-style: normal;
    opacity: 1;
  }

  &[readonly] {
    background-color: ${(props) => props.theme.textField.backgroundColor};
    border-color: ${(props) => props.theme.textField.borderColor};
    color: ${(props) => props.theme.textField.colorPlaceholder};
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
`

export const Textfield = styled.input<TextfieldProps>`
  ${TextfieldCSS}
`
