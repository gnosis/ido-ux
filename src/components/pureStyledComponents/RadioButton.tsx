import styled, { css } from 'styled-components'

const RadioButtonSelectedCSS = css`
  &:before {
    background-color: ${(props) => props.theme.colors.primary};
    border-radius: 50%;
    content: '';
    height: 8px;
    left: 1px;
    position: absolute;
    top: 1px;
    width: 8px;
  }
`

export const RadioButton = styled.div<{ checked?: boolean }>`
  background-color: #fff;
  border-radius: 50%;
  border: solid 1px ${(props) => props.theme.colors.primary};
  flex-grow: 0;
  flex-shrink: 0;
  height: 12px;
  position: relative;
  width: 12px;

  ${(props) => props.checked && RadioButtonSelectedCSS}
`
