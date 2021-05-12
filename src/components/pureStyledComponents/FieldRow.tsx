import { rgba } from 'polished'
import styled from 'styled-components'

import { Input } from '../form/NumericalInput'

export enum InfoTypes {
  ok = 'ok',
  error = 'error',
  info = 'info',
}

export enum InfoCategory {
  amount = 'amount',
  price = 'price',
}

export interface FieldRowInfoProps {
  text: string
  type: InfoTypes
  category: InfoCategory
}

export const FieldRowWrapper = styled.div<{ error?: boolean }>`
  border-radius: 6px;
  border: solid 1px ${({ theme }) => theme.border};
  display: flex;
  flex-direction: column;
  height: 62px;
  margin: 0 0 6px;
  padding: 6px 10px;
`

export const FieldRowTop = styled.div`
  align-items: center;
  display: flex;
  margin-bottom: auto;
`

export const FieldRowBottom = styled.div`
  align-items: flex-end;
  display: flex;
  margin-top: auto;
`

export const FieldRowLabel = styled.label`
  color: ${({ theme }) => rgba(theme.text1, 0.8)};
  font-size: 16px;
  font-weight: 600;
  line-height: 1.2;
  margin-right: auto;
  text-align: left;
`

export const FieldRowToken = styled.div`
  align-items: center;
  display: flex;
  margin-right: 12px;

  .tokenLogo {
    border-width: 1px;
    margin-right: 6px;
  }
`

export const FieldRowTokenSymbol = styled.div`
  color: ${({ theme }) => theme.text1};
  font-size: 17px;
  font-weight: 400;
  line-height: 1;
  margin-bottom: -3px;
  text-align: left;
  white-space: nowrap;
`

export const FieldRowInput = styled(Input)<{ error?: boolean }>`
  background: none;
  border: none;
  color: ${(props) => (props.error ? ({ theme }) => theme.error : ({ theme }) => theme.text1)};
  flex-grow: 1;
  font-size: 23px;
  font-weight: 400;
  height: 22px;
  line-height: 1;
  margin-left: auto;
  margin: 0 0 0 20px;
  padding: 0;
  text-align: right;
  width: auto;
  outline: none;

  &::placeholder {
    color: #bfdeff;
    font-size: 23px;
    font-style: italic;
    font-weight: 400;
  }
`

export const FieldRowPrimaryButton = styled.button`
  align-items: center;
  background-color: ${({ theme }) => theme.buttonPrimary.backgroundColor};
  border-radius: 3px;
  border: none;
  color: ${({ theme }) => theme.buttonPrimary.color};
  cursor: pointer;
  display: flex;
  font-size: 9px;
  font-weight: 600;
  height: 15px;
  justify-content: center;
  line-height: 1.2;
  padding: 0 3px;
  text-transform: uppercase;
  transition: all 0.15s ease-in;

  &:hover {
    background-color: ${({ theme }) => theme.buttonPrimary.backgroundColorHover};
    color: ${({ theme }) => theme.buttonPrimary.colorHover};
  }

  &[disabled] {
    cursor: not-allowed;
    opacity: 0.5;
  }
`

export const FieldRowPrimaryButtonText = styled.span`
  margin-left: 2px;
  padding-right: 3px;

  &:first-child {
    margin-left: 0;
    padding-left: 3px;
  }
`

export const FieldRowLineButton = styled.button`
  align-items: center;
  background-color: transparent;
  border-radius: 3px;
  border: 1px solid ${({ theme }) => theme.text1};
  color: ${({ theme }) => theme.text1};
  cursor: pointer;
  display: flex;
  font-size: 9px;
  font-weight: 600;
  height: 17px;
  justify-content: center;
  line-height: 1.2;
  padding: 0 5px;
  text-transform: uppercase;
  transition: all 0.15s ease-in;

  &:hover {
    background-color: ${({ theme }) => theme.text1};
    color: ${({ theme }) => theme.mainBackground};
  }

  &[disabled] {
    cursor: not-allowed;
    opacity: 0.5;
  }
`

export const FieldRowInfo = styled.div`
  color: ${({ theme }) => theme.text1};
  display: inline-flex;
  font-size: 13px;
  font-weight: 400;
  line-height: 1.2;
  margin-bottom: 16px;
  min-height: 15px;
  padding-top: 5px;
  text-align: left;

  > svg {
    margin: 1px 4px 0 0;
  }
`
