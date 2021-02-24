import React from 'react'
import styled from 'styled-components'

import ReactTooltip, { TooltipProps } from 'react-tooltip'

import { TooltipIcon } from '../../icons/TooltipIcon'

const Wrapper = styled.span`
  cursor: pointer;

  .tooltipIcon {
    .fill {
      fill: ${({ theme }) => theme.text1};
      transition: fill 0.1s linear;
    }
  }

  &:hover {
    .fill {
      fill: ${({ theme }) => theme.primary1};
    }
  }
`

interface Props extends TooltipProps {
  className?: string
  id: string
  text: string
}

export const Tooltip: React.FC<Props> = (props) => {
  const { className, delayHide = 50, delayShow = 250, id, text, ...restProps } = props
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
        arrowColor={'#001429'}
        backgroundColor={'#001429'}
        border
        borderColor={'#174172'}
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
