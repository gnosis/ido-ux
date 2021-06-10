import React from 'react'
import styled from 'styled-components'

import { HashLink } from 'react-router-hash-link'

import { FeaturedAuctions } from '../../components/auctions/FeaturedAuctions'
import HighestVolumeAuctions from '../../components/auctions/HighestVolumeAuctions'
import { ButtonCSS } from '../../components/buttons/buttonStylingTypes'
import { Send } from '../../components/icons/Send'
import { useAllAuctionInfo } from '../../hooks/useAllAuctionInfos'
import { useInterestingAuctionInfo } from '../../hooks/useInterestingAuctionDetails'
import { useSetNoDefaultNetworkId } from '../../state/orderPlacement/hooks'
import AuctionsIcon from './img/eth.svg'
import Shape1 from './img/shape-1.svg'
import Shape2 from './img/shape-2.svg'
import Shape3 from './img/shape-3.svg'

const Welcome = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0 0 50px;

  @media (min-width: ${({ theme }) => theme.themeBreakPoints.md}) {
    flex-direction: row;
    padding-top: 25px;
  }
`

const WelcomeTextBlock = styled.div`
  margin-bottom: 30px;
  padding: 0 25px 0 0;

  @media (min-width: ${({ theme }) => theme.themeBreakPoints.md}) {
    margin-bottom: 0;
  }
`

const WelcomeTitle = styled.h1`
  color: ${({ theme }) => theme.text1};
  font-size: 42px;
  font-weight: 700;
  line-height: 1.3;
  margin: 0 0 40px;
  text-align: center;

  @media (min-width: ${({ theme }) => theme.themeBreakPoints.md}) {
    text-align: left;
  }
`

const WelcomeText = styled.p`
  color: ${({ theme }) => theme.text1};
  font-size: 24px;
  font-weight: 400;
  line-height: 1.5;
  margin: 0;
  text-align: center;

  @media (min-width: ${({ theme }) => theme.themeBreakPoints.md}) {
    text-align: left;
  }
`

const AuctionsBlock = styled.div`
  align-items: center;
  border-radius: 12px;
  border: solid 1px ${({ theme }) => theme.border};
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: 0 auto;
  max-width: 100%;
  min-height: 340px;
  padding: 20px;
  width: 340px;

  @media (min-width: ${({ theme }) => theme.themeBreakPoints.md}) {
    margin: 0 0 0 auto;
  }
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
  &.featuredAuctions {
    margin-bottom: 50px;

    @media (min-width: ${({ theme }) => theme.themeBreakPoints.md}) {
      margin-bottom: 120px;
    }
  }
`

const BlockGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  margin-bottom: 50px;

  @media (min-width: ${({ theme }) => theme.themeBreakPoints.md}) {
    grid-template-columns: 1fr 1fr;
    margin-bottom: 120px;
    padding: 0 50px;
  }
`

const TextBlock = styled.div`
  order: 1;

  @media (min-width: ${({ theme }) => theme.themeBreakPoints.md}) {
    order: unset;
  }
`

const SubTitle = styled.h2`
  color: ${({ theme }) => theme.primary1};
  font-size: 40px;
  font-weight: 700;
  line-height: 1.2;
  margin: 0 0 30px;
  text-align: center;

  @media (min-width: ${({ theme }) => theme.themeBreakPoints.md}) {
    text-align: left;
  }
`

const Text = styled.p`
  color: ${({ theme }) => theme.text1};
  font-size: 24px;
  font-weight: normal;
  line-height: 1.5;
  margin: 0;
  opacity: 0.8;
  text-align: center;

  @media (min-width: ${({ theme }) => theme.themeBreakPoints.md}) {
    text-align: left;
  }
`

const ImageBlock = styled.div<{ align: string }>`
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
  order: 0;

  @media (min-width: ${({ theme }) => theme.themeBreakPoints.md}) {
    ${(props) => props.align === 'left' && 'padding-left: 60px; justify-content: flex-start;'}
    ${(props) => props.align === 'right' && 'padding-right: 60px; justify-content: flex-end;'}
    margin-bottom: 0;
  }
`

const AuctionsButton = styled(HashLink)`
  ${ButtonCSS}
  height: 52px;
`

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  padding: 0 0 30px;
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
  const featuredAuctions = useInterestingAuctionInfo()

  useSetNoDefaultNetworkId()

  return (
    <>
      <Welcome>
        <WelcomeTextBlock>
          <WelcomeTitle>
            The fairest mechanism
            <br />
            <TextGradient>to launch assets on Ethereum</TextGradient>
          </WelcomeTitle>
          <WelcomeText>
            Gnosis Auction is a platform for conducting
            <br /> fair, transparent, and decentralized token price discovery.
          </WelcomeText>
        </WelcomeTextBlock>
        <AuctionsBlock>
          <AuctionsImage alt="" src={AuctionsIcon} />
          {allAuctions && allAuctions.length > 0 && (
            <AuctionsText>
              {
                allAuctions.filter(
                  (auction) => new Date(auction.endTimeTimestamp * 1000) > new Date(),
                ).length
              }{' '}
              active auctions
            </AuctionsText>
          )}
          <AuctionsButton to="/overview#topAnchor">
            <SendIcon />
            View Auctions
          </AuctionsButton>
        </AuctionsBlock>
      </Welcome>
      {featuredAuctions && (
        <Featured className="featuredAuctions" featuredAuctions={featuredAuctions} />
      )}
      <HighestVolumeAuctions highestVolumeAuctions={featuredAuctions} />
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
            Bidders can easily participate in auctions by just determining two parameters, amount
            &amp; price, while auctioneers can start an auction by using the Gnosis Safe App or by
            running a simple script.
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
