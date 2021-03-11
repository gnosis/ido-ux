import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.div<{ disabled?: boolean }>`
  align-items: center;
  cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};
  display: flex;
  justify-content: center;
  opacity: ${(props) => (props.disabled ? '0.5' : '1')};
  pointer-events: ${(props) => (props.disabled ? 'none' : 'all')};
`

const SwitchWrapper = styled.div<{ active: boolean; small?: boolean }>`
  background-color: ${(props) => (props.active ? props.theme.primary1 : '#ccc')};
  border-radius: ${(props) => (props.small ? '15px' : '20px')};
  cursor: pointer;
  height: ${(props) => (props.small ? '16px' : '20px')};
  position: relative;
  transition: all 0.1s linear;
  width: ${(props) => (props.small ? '26px' : '36px')};
`

SwitchWrapper.defaultProps = {
  small: false,
}

const Circle = styled.div<{ active: boolean; small?: boolean }>`
  background-color: #fff;
  border-radius: 50%;
  box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.16);
  cursor: pointer;
  height: ${(props) => (props.small ? '11px' : '16px')};
  position: absolute;
  top: 2px;
  transition: all 0.1s linear;
  width: ${(props) => (props.small ? '11px' : '16px')};

  ${(props) => props.small && `left: ${props.active ? '13px' : '2px'};`}
  ${(props) => !props.small && `left: ${props.active ? '18px' : '2px'};`}
`

Circle.defaultProps = {
  small: false,
}

const Label = styled.span`
  color: ${({ theme }) => theme.text1};
  font-size: 15px;
  font-weight: 600;
  line-height: 1.2;
  margin-left: 6px;
  text-align: left;
`

interface Props {
  active: boolean
  disabled?: boolean
  label?: React.ReactNode
  onClick?: () => void
  small?: boolean
}

export const Switch: React.FC<Props> = (props) => {
  const { active = false, disabled, label, onClick, small, ...restProps } = props

  return (
    <Wrapper disabled={disabled} onClick={onClick} {...restProps}>
      <SwitchWrapper active={active} small={small}>
        <Circle active={active} small={small} />
      </SwitchWrapper>
      {label && <Label>{label}</Label>}
    </Wrapper>
  )
}
