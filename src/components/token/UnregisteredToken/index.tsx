import React from 'react'
import styled from 'styled-components'

import ReactTooltip from 'react-tooltip'

import { IconUnregistered } from './img/IconUnregistered'

const Wrapper = styled.div<{ size: string }>`
  height: ${(props) => props.size};
  position: relative;
  width: ${(props) => props.size};
`

const Icon = styled(IconUnregistered)`
  left: 0;
  position: absolute;
  top: 0;
  z-index: 1;
`

const Badge = styled.div<{ size: string }>`
  align-items: center;
  background-color: #ff0000;
  border-radius: ${(props) => `${parseInt(props.size, 10) * 0.07}px`};
  box-shadow: 0 0 3px 0 rgba(0, 0, 0, 0.4);
  color: #fff;
  display: flex;
  font-size: ${(props) => `${parseInt(props.size, 10) * 0.13}px`};
  font-weight: 600;
  justify-content: center;
  line-height: 1.2;
  padding: 2px 3px;
  position: absolute;
  right: -8%;
  text-align: center;
  top: 6%;
  white-space: nowrap;
  z-index: 2;
`

interface Props {
  size?: string
  symbol: string
}

export const UnregisteredToken: React.FC<Props> = (props) => {
  const { size, symbol, ...restProps } = props
  const timestamp = React.useMemo(() => Date.now(), [])
  const tooltipId = `tooltip_${symbol}_${size}_${timestamp}`
  const cuttedSymbol = symbol.slice(0, 7)

  return (
    <Wrapper
      data-for={tooltipId}
      data-html={true}
      data-multiline={true}
      data-tip={`<p><strong>Unregistered token (${symbol}):</strong> This token is unrecognized, and it could even be a fake version of an existing token.</p><p>Use it at your own risk. Caution is advised.`}
      size={size}
      {...restProps}
    >
      <Icon />
      <Badge size={size}>{cuttedSymbol}</Badge>
      <ReactTooltip
        arrowColor={'#001429'}
        backgroundColor={'#001429'}
        border
        borderColor={'#174172'}
        className="customTooltip"
        delayHide={50}
        delayShow={250}
        effect="solid"
        id={tooltipId}
        textColor="#fff"
      />
    </Wrapper>
  )
}
