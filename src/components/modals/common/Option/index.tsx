import React from 'react'
import styled from 'styled-components'

import { ExternalLink } from '../../../../theme'

const Wrapper = styled.button<{ active?: boolean; clickable?: boolean }>`
  align-items: center;
  background-color: transparent;
  border-radius: 12px;
  border: solid 1px ${({ theme }) => theme.primary2};
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
    background-color: #001e3c;
  }

  ${(props) => !props.clickable && `&[disabled] { opacity: 0.5; cursor: not-allowed;}`}
  ${(props) => !props.clickable && `&:hover { background-color: transparent; }`}
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
  active?: boolean
  clickable?: boolean
  text: React.ReactNode
  icon: string
  link?: Maybe<string>
  onClick?: null | (() => void)
  subText?: Maybe<React.ReactNode>
}

const Option: React.FC<Props> = (props) => {
  const {
    active = false,
    clickable = true,
    icon,
    link = null,
    onClick = null,
    subText = null,
    text,
    ...restProps
  } = props
  const content = (
    <Wrapper active={active} clickable={clickable && !active} onClick={onClick} {...restProps}>
      <IconWrapper>
        <Image alt={'Icon'} src={icon} />
      </IconWrapper>
      <TextWrapper>
        <Text>{text}</Text>
        {subText && <SubText>{subText}</SubText>}
      </TextWrapper>
    </Wrapper>
  )

  return link ? <ExternalLink href={link}>{content}</ExternalLink> : content
}

export default Option
