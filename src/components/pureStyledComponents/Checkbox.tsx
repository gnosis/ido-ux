import styled, { css } from 'styled-components'

const CheckboxSelectedCSS = css`
  &:before {
    background-color: ${({ theme }) => theme.primary1};
    content: '';
    height: 8px;
    left: 1px;
    position: absolute;
    top: 1px;
    width: 8px;
  }
`

const CheckboxDisabledCSS = css`
  &,
  &:hover {
    cursor: not-allowed;
    opacity: 0.5;
  }
`

export const Checkbox = styled.div<{ checked?: boolean; disabled?: boolean }>`
  background-color: ${({ theme }) => theme.mainBackground};
  border: solid 1px ${({ theme }) => theme.primary1};
  cursor: pointer;
  flex-grow: 0;
  flex-shrink: 0;
  height: 12px;
  position: relative;
  width: 12px;

  ${(props) => props.checked && CheckboxSelectedCSS}
  ${(props) => props.disabled && CheckboxDisabledCSS}
`

Checkbox.defaultProps = {
  checked: false,
  disabled: false,
}
