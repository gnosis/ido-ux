import React from 'react'
import styled, { withTheme } from 'styled-components'

import ReactTooltip, { TooltipProps } from 'react-tooltip'

import { TooltipIcon } from '../../icons/TooltipIcon'

const Wrapper = styled.span`
  cursor: pointer;

  .tooltipIcon {
    .fill {
      fill: ${(props) => props.theme.colors.darkGrey};
    }
  }

  &:hover {
    .tooltipIcon {
      .fill {
        fill: ${(props) => props.theme.colors.darkerGrey};
      }
    }
  }
`

interface Props extends TooltipProps {
  className?: string
  id: string
  text: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  theme?: any
}

export const TooltipComponent: React.FC<Props> = (props) => {
  const { className, delayHide = 50, delayShow = 250, id, text, theme, ...restProps } = props
  const tooltipId = `tooltip_${id}`

  return (
    <Wrapper
      className={`tooltipComponent ${className}`}
      data-for={tooltipId}
      data-html={true}
      data-multiline={true}
      data-tip={text}
      id={id}
    >
      <TooltipIcon />
      <ReactTooltip
        arrowColor={theme.colors.darkerGrey}
        backgroundColor={theme.colors.darkerGrey}
        border={false}
        className="customTooltip"
        delayHide={delayHide}
        delayShow={delayShow}
        effect="solid"
        id={tooltipId}
        textColor="#fff"
        {...restProps}
      />
    </Wrapper>
  )
}

export const Tooltip = withTheme(TooltipComponent)
