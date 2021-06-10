import React from 'react'
import { NavLink } from 'react-router-dom'
import styled, { css } from 'styled-components'

import * as CSS from 'csstype'
import moment from 'moment'

import { AuctionInfo } from '../../../hooks/useAllAuctionInfos'
import { getChainName } from '../../../utils/tools'
import { ChevronRight } from '../../icons/ChevronRight'
import { ChevronRightBig } from '../../icons/ChevronRightBig'
import { InfoIcon } from '../../icons/InfoIcon'
import { NetworkIcon } from '../../icons/NetworkIcon'
import { YesIcon } from '../../icons/YesIcon'
import { EmptyContentText, EmptyContentWrapper } from '../../pureStyledComponents/EmptyContent'
import { PageTitle } from '../../pureStyledComponents/PageTitle'
import DoubleLogo from '../../token/DoubleLogo'

interface WrapProps {
  margin?: any
  borders?: any
  padding?: any
  flexDir?: any
  flexWrap?: any
  alignItems?: any
  justifyCont?: any
  grow?: string
  br?: any
  fs?: string
  fw?: string
  color?: string
  maxWidth?: any
  hiddenMD?: boolean
  hiddenXL?: boolean
}

const Wrapper = styled.div<Partial<CSS.Properties & WrapProps>>`
  display: flex;
  width: ${(props) => props.width || 'auto'};
  max-width: ${(props) =>
    props.maxWidth
      ? typeof props.maxWidth !== 'string'
        ? props.maxWidth[0]
        : props.maxWidth
      : '100%'};
  flex-direction: ${(props) =>
    props.flexDir ? (typeof props.flexDir !== 'string' ? props.flexDir[0] : props.flexDir) : 'row'};
  flex-wrap: ${(props) =>
    props.flexWrap
      ? (typeof props.flexWrap === 'string' && props.flexWrap === 'row-reverse') ||
        (typeof props.flexWrap === 'string' && props.flexWrap === 'row') ||
        (typeof props.flexWrap !== 'string' && props.flexWrap[0] === 'row-reverse') ||
        (typeof props.flexWrap !== 'string' && props.flexWrap[0] === 'row')
        ? 'wrap'
        : 'nowrap'
      : props.flexDir
      ? (typeof props.flexDir === 'string' && props.flexDir === 'column') ||
        (typeof props.flexDir !== 'string' && props.flexDir[0] === 'column')
        ? 'nowrap'
        : 'wrap'
      : 'wrap'};
  align-items: ${(props) =>
    props.alignItems
      ? typeof props.alignItems !== 'string'
        ? props.alignItems[0]
        : props.alignItems
      : 'flex-start'};
  justify-content: ${(props) =>
    props.justifyCont
      ? typeof props.justifyCont !== 'string'
        ? props.justifyCont[0]
        : props.justifyCont
      : 'flex-start'};
  padding: ${(props) =>
    props.padding ? (typeof props.padding !== 'string' ? props.padding[0] : props.padding) : '0'};
  margin: ${(props) =>
    props.margin ? (typeof props.margin !== 'string' ? props.margin[0] : props.margin) : '0'};
  font-size: ${(props) => props.fs || '16px'};
  font-weight: ${(props) => props.fw || '400'};
  ${(props) =>
    props.borders
      ? typeof props.borders !== 'string'
        ? props.borders.length > 1
          ? props.borders[0].map(
              (item: any) =>
                `border-${item.side}: ${item.width ? item.width : '1px'} solid ${
                  item.color || props.theme.dropdown.item.borderColor
                };`,
            )
          : props.borders.map(
              (item: any) =>
                `border-${item.side}: ${item.width ? item.width : '1px'} solid ${
                  item.color || props.theme.dropdown.item.borderColor
                };`,
            )
        : `border: 1px solid ${props.borders || props.theme.dropdown.item.borderColor};`
      : 'border: 0;'}
  flex-grow: ${(props) => props.grow || '0'};
  border-radius: ${(props: any) =>
    props.br ? (typeof props.br !== 'string' ? props.br[0] : props.br) : '0'};
  color: ${(props: any) => props.color || props.theme.text1};
  ${(props: any) => props.hiddenMD && 'display: none;'}
  @media (min-width: ${(props) => props.theme.themeBreakPoints.xl}) {
    ${(props: any) => props.hiddenXL && 'display: none;'}
    ${(props: any) => props.hiddenMD && 'display: flex;'}
    flex-wrap: ${(props) =>
      props.flexWrap
        ? (typeof props.flexWrap === 'string' && props.flexWrap === 'row-reverse') ||
          (typeof props.flexWrap === 'string' && props.flexWrap === 'row') ||
          (typeof props.flexWrap !== 'string' && props.flexWrap[1] === 'row-reverse') ||
          (typeof props.flexWrap !== 'string' && props.flexWrap[1] === 'row')
          ? 'wrap'
          : 'nowrap'
        : props.flexDir
        ? (typeof props.flexDir === 'string' && props.flexDir === 'column') ||
          (typeof props.flexDir !== 'string' && props.flexDir[1] === 'column')
          ? 'nowrap'
          : 'wrap'
        : 'wrap'};
    align-items: ${(props) =>
      props.alignItems
        ? typeof props.alignItems !== 'string'
          ? props.alignItems[1]
          : props.alignItems
        : 'flex-start'};
    justify-content: ${(props) =>
      props.justifyCont
        ? typeof props.justifyCont !== 'string'
          ? props.justifyCont[1]
          : props.justifyCont
        : 'flex-start'};
    padding: ${(props) =>
      props.padding ? (typeof props.padding !== 'string' ? props.padding[1] : props.padding) : '0'};
    max-width: ${(props) =>
      props.maxWidth
        ? typeof props.maxWidth !== 'string'
          ? props.maxWidth[1]
          : props.maxWidth
        : '100%'};
    margin: ${(props) =>
      props.margin ? (typeof props.margin !== 'string' ? props.margin[1] : props.margin) : '0'};
    ${(props) =>
      props.borders
        ? typeof props.borders !== 'string'
          ? props.borders.length > 1
            ? props.borders[1].map(
                (item: any) =>
                  `border-${item.side}: ${item.width ? item.width : '1px'} solid ${
                    item.color || props.theme.dropdown.item.borderColor
                  };`,
              )
            : props.borders.map(
                (item: any) =>
                  `border-${item.side}: ${item.width ? item.width : '1px'} solid ${
                    item.color || props.theme.dropdown.item.borderColor
                  };`,
              )
          : `border: 1px solid ${props.borders || props.theme.dropdown.item.borderColor};`
        : 'border: 0;'}
    border-radius: ${(props: any) =>
      props.br ? (typeof props.br !== 'string' ? props.br[1] : props.br) : '0'};
  }
`

const StyledNavLink = styled(NavLink)`
  &,
  &:hover,
  &:focus {
    text-decoration: none;
    outline: none;
  }
`

const IconCSS = css`
  height: 12px;
  width: 12px;
  margin-right: 5px;

  .fill {
    fill: rgba(255, 255, 255, 0.9);
  }
`

const BottomIconNetwork = styled(NetworkIcon)`
  ${IconCSS}
`

const SectionTitle = styled(PageTitle)`
  font-size: 22px;
  margin-bottom: 14px;
`

const ChevronLeft = styled(ChevronRight)`
  transform: rotateZ(180deg);
`

const Chevron = styled(ChevronRightBig)`
  flex-shrink: 0;
  width: 11px;
`

const CheckIcon = styled(YesIcon)`
  height: 14px;
  width: 14px;
`

interface HVAuctionsProps {
  highestVolumeAuctions?: Maybe<AuctionInfo[]>
}

const HighestVolumeAuctions = ({ highestVolumeAuctions }: HVAuctionsProps) => {
  const noAuctions = !highestVolumeAuctions || highestVolumeAuctions?.length === 0

  console.log(highestVolumeAuctions)
  return (
    <Wrapper flexDir={'column'} margin={'0 0 40px 0'}>
      <SectionTitle style={{ display: 'block' }}>Highest Volume Auctions</SectionTitle>
      {noAuctions ? (
        <EmptyContentWrapper>
          <InfoIcon />
          <EmptyContentText>No auctions.</EmptyContentText>
        </EmptyContentWrapper>
      ) : (
        <Wrapper
          borders={[
            ['0'],
            [{ side: 'top' }, { side: 'left' }, { side: 'right' }, { side: 'bottom' }],
          ]}
          br={'12px '}
          flexDir={'column'}
          width={'100%'}
        >
          <Wrapper
            borders={[[{ side: 'bottom', color: 'transparent' }], [{ side: 'bottom' }]]}
            hiddenMD
            justifyCont={'flex-end'}
            width={'100%'}
          >
            <Wrapper grow={'1'} maxWidth={'15%'} padding={'10px'}>
              Sell Ammount
            </Wrapper>
            <Wrapper grow={'1'} maxWidth={'15%'} padding={'10px'}>
              Buy Ammount
            </Wrapper>
            <Wrapper grow={'1'} maxWidth={'15%'} padding={'10px'}>
              USD Volume
            </Wrapper>
            <Wrapper grow={'1'} maxWidth={'calc(15% + 30px'} padding={'10px'}>
              End Date
            </Wrapper>
          </Wrapper>
          {highestVolumeAuctions.map((auction, index) => (
            <Wrapper
              alignItems={'center'}
              borders={[
                [{ side: 'top' }, { side: 'left' }, { side: 'right' }, { side: 'bottom' }],
                [{ side: 'bottom' }],
              ]}
              br={['12px', '0']}
              key={index}
              width={'100%'}
            >
              <Wrapper alignItems={'center'} grow={'1'} justifyCont={'space-between'} width={'40%'}>
                <Wrapper maxWidth={['100%', '100px']} padding={'7px 10px'} width={'100%'}>
                  <DoubleLogo
                    auctioningToken={{
                      address: auction.addressAuctioningToken,
                      symbol: auction.symbolAuctioningToken,
                    }}
                    biddingToken={{
                      address: auction.addressBiddingToken,
                      symbol: auction.symbolBiddingToken,
                    }}
                    size="35px"
                  />
                </Wrapper>
                <Wrapper fs={'20px'} fw={'bold'} grow={'1'} padding={'7px 10px'}>
                  {auction.symbolAuctioningToken} / {auction.symbolBiddingToken}
                </Wrapper>
                <Wrapper alignItems={'center'} grow={'1'} padding={'7px 10px'}>
                  <BottomIconNetwork />
                  <Wrapper color={'rgba(255, 255, 255, 0.6)'} fs={'12px'} margin={'0 0 0 2px'}>
                    {getChainName(parseInt(auction.chainId.toString()))}
                  </Wrapper>
                </Wrapper>
              </Wrapper>
              <Wrapper
                alignItems={'center'}
                fs={'18px'}
                fw={'bold'}
                grow={'1'}
                padding={'7px 10px'}
                width={'15%'}
              >
                {auction.order.volume + ' ' + auction.symbolAuctioningToken}
              </Wrapper>
              <Wrapper
                alignItems={'center'}
                fs={'18px'}
                fw={'bold'}
                grow={'1'}
                padding={'7px 10px'}
                width={'15%'}
              >
                {auction.order.volume + ' ' + auction.symbolAuctioningToken}
              </Wrapper>
              <Wrapper
                alignItems={'center'}
                fs={'18px'}
                fw={'bold'}
                grow={'1'}
                padding={'7px 10px'}
                width={'15%'}
              >
                {'$' + auction.order.volume}
              </Wrapper>
              <Wrapper
                alignItems={'center'}
                fs={'18px'}
                fw={'bold'}
                grow={'1'}
                padding={'7px 10px'}
                width={'15%'}
              >
                {moment(new Date()).format('DD/MM/YYYY')}
              </Wrapper>
              <Wrapper
                alignItems={'center'}
                fs={'18px'}
                fw={'bold'}
                grow={'1'}
                padding={'7px 10px'}
                width={'30px'}
              >
                <StyledNavLink
                  to={`/auction?auctionId=${auction.auctionId}&chainId=${Number(
                    auction.chainId,
                  )}#topAnchor`}
                >
                  <Chevron />
                </StyledNavLink>
              </Wrapper>
            </Wrapper>
          ))}
        </Wrapper>
      )}
    </Wrapper>
  )
}

export default HighestVolumeAuctions
