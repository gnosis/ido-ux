import { rgba } from 'polished'
import styled, { css } from 'styled-components'

import { Input } from '../form/NumericalInput'

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
  align-items: top;
  display: flex;
  margin-bottom: auto;
`

export const FieldRowBottom = styled.div`
  align-items: top;
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
  margin-top: auto;

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
  margin-bottom: -2px;
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
