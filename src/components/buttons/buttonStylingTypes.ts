import { AnchorHTMLAttributes, ButtonHTMLAttributes } from 'react'
import { css } from 'styled-components'

export enum ButtonType {
  primary,
  primaryInverted,
  danger,
}

export interface ButtonCommonProps {
  buttonType?: ButtonType
  theme?: any
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, ButtonCommonProps {}

export interface ButtonGroupCommonProps {
  left?: any
  right?: any
  theme?: any
  activate?: boolean
}

export interface ButtonGroupProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    ButtonGroupCommonProps {}

export interface ButtonLinkProps
  extends AnchorHTMLAttributes<HTMLAnchorElement>,
    ButtonCommonProps {}

const PrimaryCSS = css`
  background-color: ${(props) => props.theme.buttonPrimary.backgroundColor};
  border-color: ${(props) => props.theme.buttonPrimary.borderColor};
  color: ${(props) => props.theme.buttonPrimary.color};

  &:hover {
    background-color: ${(props) => props.theme.buttonPrimary.backgroundColorHover};
    border-color: ${(props) => props.theme.buttonPrimary.borderColorHover};
    color: ${(props) => props.theme.buttonPrimary.colorHover};
  }

  &[disabled],
  &[disabled]:hover {
    background-color: ${(props) => props.theme.buttonPrimary.borderColor};
    border-color: ${(props) => props.theme.buttonPrimary.borderColor};
    color: ${(props) => props.theme.buttonPrimary.color};
    cursor: not-allowed;
    opacity: 0.5;
  }
`

const PrimaryInvertedCSS = css`
  background-color: ${(props) => props.theme.buttonPrimaryInverted.backgroundColor};
  border-color: ${(props) => props.theme.buttonPrimaryInverted.borderColor};
  color: ${(props) => props.theme.buttonPrimaryInverted.color};

  &:hover {
    background-color: ${(props) => props.theme.buttonPrimaryInverted.backgroundColorHover};
    border-color: ${(props) => props.theme.buttonPrimaryInverted.borderColorHover};
    color: ${(props) => props.theme.buttonPrimaryInverted.colorHover};
  }

  &[disabled],
  &[disabled]:hover {
    background-color: ${(props) => props.theme.buttonPrimaryInverted.backgroundColor};
    border-color: ${(props) => props.theme.buttonPrimaryInverted.borderColor};
    color: ${(props) => props.theme.buttonPrimaryInverted.color};
    cursor: not-allowed;
    opacity: 0.5;
  }
`

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getButtonTypeStyles = (buttonType: ButtonType = ButtonType.primary): any => {
  if (buttonType === ButtonType.primary) {
    return PrimaryCSS
  }

  if (buttonType === ButtonType.primaryInverted) {
    return PrimaryInvertedCSS
  }

  return PrimaryCSS
}

export const ButtonCSS = css<ButtonCommonProps>`
  align-items: center;
  border-radius: 6px;
  border-style: solid;
  border-width: 1px;
  cursor: pointer;
  display: flex;
  font-size: 20px;
  font-weight: 600;
  height: 44px;
  justify-content: center;
  line-height: 1;
  outline: none;
  padding: 0 25px;
  text-align: center;
  text-decoration: none;
  transition: all 0.15s ease-out;
  user-select: none;
  white-space: nowrap;
  font-family: 'Averta', sans-serif;

  ${(props) => getButtonTypeStyles(props.buttonType)}
`
