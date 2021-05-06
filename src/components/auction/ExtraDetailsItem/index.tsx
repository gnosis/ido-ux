import { rgba } from 'polished'
import React from 'react'
import styled from 'styled-components'

import { Tooltip } from '../../common/Tooltip'
import { ExternalLink } from '../../navigation/ExternalLink'

const Wrapper = styled.div<{ showProgressColumn?: boolean }>`
  column-gap: 7px;
  display: grid;
  grid-template-columns: ${(props) => (props.showProgressColumn ? '36px 1fr' : '1fr')};
`

const Chart = styled.div``

const TextContents = styled.div``

const Value = styled.p`
  align-items: center;
  color: ${({ theme }) => theme.text1};
  display: flex;
  font-size: 15px;
  font-weight: 600;
  line-height: 1.2;
  margin: 0 0 2px;
  white-space: nowrap;
`

const ValueText = styled.span`
  margin-right: 8px;
`

const Title = styled.h4`
  align-items: center;
  color: ${({ theme }) => rgba(theme.text1, 0.9)};
  display: flex;
  font-size: 14px;
  font-weight: 400;
  line-height: 1.2;
  margin: 0;
  text-transform: capitalize;
  white-space: nowrap;
`

const TitleText = styled.span`
  margin-right: 6px;
`

const Link = styled(ExternalLink)`
  height: 14px;
  margin-top: -2px;
`

export interface Props {
  id?: string
  progress?: string
  title: string
  tooltip?: string
  url?: string
  value: string
}

export const ExtraDetailsItem: React.FC<Props> = (props) => {
  const { id, progress, title, tooltip, url, value, ...restProps } = props

  return (
    <Wrapper showProgressColumn={progress !== ''} {...restProps}>
      {progress && <Chart>{progress}</Chart>}
      <TextContents>
        <Value>
          <ValueText>{value}</ValueText>
          {url && <Link href={url} />}
        </Value>
        <Title>
          <TitleText className="text">{title}</TitleText>
          {tooltip && <Tooltip id={id} text={tooltip} />}
        </Title>
      </TextContents>
    </Wrapper>
  )
}
