import React from 'react'
import styled from 'styled-components'

import QRCode from 'qrcode.react'

const Wrapper = styled.div`
  ${({ theme }) => theme.flexColumnNoWrap};
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  margin-bottom: 20px;
`

interface WalletConnectDataProps {
  size: number
  uri?: string
}

const WalletConnectData: React.FC<WalletConnectDataProps> = (props) => {
  const { size, uri = '', ...restProps } = props

  return (
    uri && (
      <Wrapper {...restProps}>
        <QRCode size={size} value={uri} />
      </Wrapper>
    )
  )
}

export default WalletConnectData
