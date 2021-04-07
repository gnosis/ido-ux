import styled from 'styled-components'

import { BaseCard } from './BaseCard'

export const EmptyContentWrapper = styled(BaseCard)`
  align-items: center;
  display: flex;
  flex-direction: column;
  flex-grow: 0;
  font-size: 15px;
  justify-content: center;
  min-height: 250px;
  width: 100%;
`

export const EmptyContentText = styled.p`
  color: ${({ theme }) => theme.text1};
  font-size: 18px;
  font-weight: 600;
  line-height: 1.5;
  margin: 16px 0 0 0;
  text-align: center;
`
