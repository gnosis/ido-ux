import React from 'react'
import styled from 'styled-components'

import { HashLink } from 'react-router-hash-link'

import { FeaturedAuctions } from '../../components/auctions/FeaturedAuctions'
import { ButtonCSS } from '../../components/buttons/buttonStylingTypes'
import { InlineLoading } from '../../components/common/InlineLoading'
import { SpinnerSize } from '../../components/common/Spinner'
import { Send } from '../../components/icons/Send'
import { useAllAuctionInfo } from '../../hooks/useAllAuctionInfos'
import AuctionsIcon from './img/eth.svg'
import Shape1 from './img/shape-1.svg'
import Shape2 from './img/shape-2.svg'
import Shape3 from './img/shape-3.svg'

const Welcome = styled.div`
  display: flex;
  margin: 0 0 60px;
  padding: 50px 0 0 0;
`

const WelcomeTextBlock = styled.div`
  padding: 0 25px 0 0;
`

const WelcomeTitle = styled.h1`
  color: ${({ theme }) => theme.text1};
  font-size: 42px;
  font-weight: 700;
  line-height: 1.3;
  margin: 0 0 40px;
`

const WelcomeText = styled.p`
  color: ${({ theme }) => theme.text1};
  font-size: 24px;
  font-weight: 400;
  line-height: 1.5;
  margin: 0;
`

const AuctionsBlock = styled.div`
  align-items: center;
  border-radius: 12px;
  border: solid 1px ${({ theme }) => theme.border};
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: 0 0 0 auto;
  max-width: 100%;
  min-height: 340px;
  padding: 25px;
  width: 400px;
`

const AuctionsImage = styled.img`
  display: block;
  margin-bottom: 45px;
`

const AuctionsText = styled.p`
  color: ${({ theme }) => theme.text1};
  font-size: 21px;
  font-weight: normal;
  line-height: 1.2;
  margin: 0 0 25px;
  text-align: center;
`

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

const AuctionsButton = styled(HashLink)`
  ${ButtonCSS}
  height: 52px;
`

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  padding: 0 0 100px;
`

const SendIcon = styled(Send)`
  margin: 0 8px 0 0;
`

const TextGradient = styled.span`
  -webkit-background-clip: text;
  background-clip: text;
  background-image: linear-gradient(to right, #e8663d 0%, #05896f 54%, #349ebd);
  color: transparent;
`

export const Landing: React.FC = () => {
  const allAuctions = useAllAuctionInfo()

  return (
    <>
      <Welcome>
        <WelcomeTextBlock>
          <WelcomeTitle>
            The most fair mechanism
            <br />
            <TextGradient>to launch assets on Ethereum</TextGradient>
          </WelcomeTitle>
          <WelcomeText>
            Gnosis Auction is a protocol that enables
            <br /> anyone to auction-off assets with fair pricing.
          </WelcomeText>
        </WelcomeTextBlock>
        <AuctionsBlock>
          {allAuctions === undefined || allAuctions === null ? (
            <InlineLoading message="Loading..." size={SpinnerSize.small} />
          ) : (
            <>
              <AuctionsImage alt="" src={AuctionsIcon} />
              {allAuctions && allAuctions.length > 0 && (
                <AuctionsText>{allAuctions.length} active auctions</AuctionsText>
              )}
              <AuctionsButton to="/overview#topAnchor">
                <SendIcon />
                View Auctions
              </AuctionsButton>
            </>
          )}
        </AuctionsBlock>
      </Welcome>
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
      <ButtonWrapper>
        <AuctionsButton to="/overview#topAnchor">
          <SendIcon />
          View Auctions
        </AuctionsButton>
      </ButtonWrapper>
    </>
  )
}
