import React from 'react'
import styled from 'styled-components'

import { FeaturedAuctions } from '../../components/auctions/FeaturedAuctions'
import Shape1 from './img/shape-1.svg'
import Shape2 from './img/shape-2.svg'
import Shape3 from './img/shape-3.svg'

const Featured = styled(FeaturedAuctions)`
  margin-bottom: 120px;
`

const BlockGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  margin: 0 0 120px;
  padding: 0 50px;
`

const TextBlock = styled.div``

const SubTitle = styled.h2`
  color: ${({ theme }) => theme.primary1};
  font-size: 40px;
  font-weight: 700;
  line-height: 1.2;
  margin: 0 0 30px;
  text-align: left;
`

const Text = styled.p`
  color: ${({ theme }) => theme.text1};
  font-size: 24px;
  font-weight: normal;
  line-height: 1.5;
  margin: 0;
  opacity: 0.8;
  text-align: left;
`

const ImageBlock = styled.div<{ align: string }>`
  ${(props) => props.align === 'left' && 'padding-left: 60px; justify-content: flex-start;'}
  ${(props) => props.align === 'right' && 'padding-right: 60px; justify-content: flex-end;'}
  display: flex;
`

export const Landing: React.FC = () => {
  return (
    <>
      <Featured />
      <BlockGrid>
        <TextBlock>
          <SubTitle>Best Price Discovery</SubTitle>
          <Text>
            Batch auctions set the price exactly where supply and demand meet. This ensures the same
            fair price for all participants.
          </Text>
        </TextBlock>
        <ImageBlock align="left">
          <img alt="" src={Shape1} />
        </ImageBlock>
      </BlockGrid>
      <BlockGrid>
        <ImageBlock align="right">
          <img alt="" src={Shape2} />
        </ImageBlock>
        <TextBlock>
          <SubTitle>Fair And Resistant</SubTitle>
          <Text>
            Avoid gas wars and other forms of manipulation. Willingness to pay determines final
            prices and timed batches protect the users from frontrunning.
          </Text>
        </TextBlock>
      </BlockGrid>
      <BlockGrid>
        <TextBlock>
          <SubTitle>Easy to use</SubTitle>
          <Text>
            Bidders can easily participate in auctions by just determining two parameters, (amount
            &amp; price), while auctioneers can start an auction running a simple script.
          </Text>
        </TextBlock>
        <ImageBlock align="left">
          <img alt="" src={Shape3} />
        </ImageBlock>
      </BlockGrid>
    </>
  )
}
