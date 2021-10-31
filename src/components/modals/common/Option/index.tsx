import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.button<{ disabled?: boolean }>`
  align-items: center;
  background-color: transparent;
  border-radius: 12px;
  border: solid 1px ${({ theme }) => theme.primary2};
  cursor: pointer;
  display: flex;
  height: 54px;
  justify-content: flex-start;
  margin: 0 0 16px;
  padding: 15px 18px;
  width: 100%;

  &:last-child {
    margin-bottom: 0;
  }

  &:hover {
    background-color: ${({ theme }) => theme.bg7};
  }

  ${(props) => props.disabled && `&[disabled] { opacity: 0.5; cursor: not-allowed;}`}
  ${(props) => props.disabled && `&[disabled]:hover { background-color: transparent; }`}
`

const IconWrapper = styled.div<{ size?: number }>`
  align-items: center;
  display: flex;
  height: 28px;
  justify-content: center;
  margin-right: 12px;
  width: 28px;
`

const TextWrapper = styled.div``

const Text = styled.div`
  color: ${({ theme }) => theme.text1};
  font-size: 22px;
  font-weight: 600;
  line-height: 1.2;
  text-align: left;
`

const SubText = styled.div`
  color: ${({ theme }) => theme.text1};
  font-size: 18px;
  font-weight: 400;
  line-height: 1.2;
  text-align: left;
`

const Image = styled.img`
  display: block;
  max-width: 100%;
  max-height: 100%;
`

interface Props {
  disabled?: boolean
  icon: string
  onClick?: null | (() => void)
  subText?: Maybe<React.ReactNode>
  text: React.ReactNode
}

const Option: React.FC<Props> = (props) => {
  const { disabled = false, icon, onClick = null, subText = null, text, ...restProps } = props

  return (
    <Wrapper disabled={disabled} onClick={onClick} {...restProps}>
      <IconWrapper>
        <Image alt={'Icon'} src={icon} />
      </IconWrapper>
      <TextWrapper>
        <Text>{text}</Text>
        {subText && <SubText>{subText}</SubText>}
      </TextWrapper>
    </Wrapper>
  )
}

export default Option
