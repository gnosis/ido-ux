import React from 'react'
import styled from 'styled-components'

import { PageTitle } from '../../components/pureStyledComponents/PageTitle'
import { PageTitleNote } from '../../components/pureStyledComponents/PageTitleNote'
import { Paragraph } from '../../components/pureStyledComponents/Paragraph'

const PageTitleStyled = styled(PageTitle)`
  margin-bottom: 0;
`

export const Licenses: React.FC = () => {
  return (
    <>
      <PageTitleStyled>Licenses</PageTitleStyled>
      <PageTitleNote>(Last updated: Date)</PageTitleNote>
      <Paragraph>Contents</Paragraph>
    </>
  )
}
