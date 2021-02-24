import React, { useCallback } from 'react'
import { ArrowLeft } from 'react-feather'
import { Link as HistoryLink, RouteComponentProps, withRouter } from 'react-router-dom'
import styled from 'styled-components'

import useBodyKeyDown from '../../hooks/useBodyKeyDown'
import { CursorPointer } from '../../theme'
import QuestionHelper from '../QuestionHelper'
import { RowBetween } from '../Row'

const tabOrder = [
  {
    path: '/swap',
    textKey: 'Place Order',
    regex: /\/swap/,
  },
]

const Tabs = styled.div`
  ${({ theme }) => theme.flexRowNoWrap}
  align-items: center;
  border-radius: 3rem;
`

const ActiveText = styled.div`
  font-weight: 500;
  font-size: 20px;
`

const ArrowLink = styled(ArrowLeft)`
  color: ${({ theme }) => theme.text1};
`

function NavigationTabs({ history, location: { pathname } }: RouteComponentProps<unknown>) {
  const navigate = useCallback(
    (direction) => {
      const tabIndex = tabOrder.findIndex(({ regex }) => pathname.match(regex))
      history.push(tabOrder[(tabIndex + tabOrder.length + direction) % tabOrder.length].path)
    },
    [pathname, history],
  )
  const navigateRight = useCallback(() => {
    navigate(1)
  }, [navigate])
  const navigateLeft = useCallback(() => {
    navigate(-1)
  }, [navigate])

  useBodyKeyDown('ArrowRight', navigateRight)
  useBodyKeyDown('ArrowLeft', navigateLeft)

  const adding = pathname.match('/add')
  const removing = pathname.match('/remove')
  const finding = pathname.match('/find')
  const creating = pathname.match('/create')

  return (
    <>
      {adding || removing ? (
        <Tabs>
          <RowBetween style={{ padding: '1rem' }}>
            <CursorPointer onClick={() => history.push('/pool')}>
              <ArrowLink />
            </CursorPointer>
            <ActiveText>{adding ? 'Add' : 'Remove'} Liquidity</ActiveText>
            <QuestionHelper
              text={
                adding
                  ? 'When you add liquidity, you are given pool tokens representing your position. These tokens automatically earn fees proportional to your share of the pool, and can be redeemed at any time.'
                  : 'Removing pool tokens converts your position back into underlying tokens at the current rate, proportional to your share of the pool. Accrued fees are included in the amounts you receive.'
              }
            />
          </RowBetween>
        </Tabs>
      ) : finding ? (
        <Tabs>
          <RowBetween style={{ padding: '1rem' }}>
            <HistoryLink to="/pool">
              <ArrowLink />
            </HistoryLink>
            <ActiveText>Import Pool</ActiveText>
            <QuestionHelper
              text={"Use this tool to find pairs that don't automatically appear in the interface."}
            />
          </RowBetween>
        </Tabs>
      ) : creating ? (
        <Tabs>
          <RowBetween style={{ padding: '1rem' }}>
            <HistoryLink to="/pool">
              <ArrowLink />
            </HistoryLink>
            <ActiveText>Create Pool</ActiveText>
            <QuestionHelper text={'Use this interface to create a new pool.'} />
          </RowBetween>
        </Tabs>
      ) : (
        <Tabs style={{ marginBottom: '20px' }}>
          {/* {tabOrder.map(({ path, textKey, regex }) => (
            <StyledNavLink
              id={`${textKey}-nav-link`}
              key={path}
              to={path}
              isActive={(_, { pathname }) => !!pathname.match(regex)}
            >
              {t(textKey)}
            </StyledNavLink>
          ))} */}
        </Tabs>
      )}
    </>
  )
}

export default withRouter(NavigationTabs)
