import React from 'react'
import styled from 'styled-components'

import Circle from '../../assets/images/blue-loader.svg'
import { Spinner } from '../../theme'

const SpinnerWrapper = styled(Spinner)<{ size: string }>`
  height: ${({ size }) => size};
  width: ${({ size }) => size};
`

export default function Loader({ size }: { size: string }) {
  return <SpinnerWrapper alt="loader" size={size} src={Circle} />
}
