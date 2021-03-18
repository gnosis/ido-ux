import React from 'react'
import { Redirect, Route } from 'react-router-dom'

import useIsAuctionAllowListed from '../../hooks/useIsAuctionAllowListed'
import { InlineLoading } from '../common/InlineLoading'
import { SpinnerSize } from '../common/Spinner'

type ProtectedRouteProps = React.ComponentProps<typeof Route>

const ProtectedRoute = ({ component: Component, ...rest }: ProtectedRouteProps) => {
  const { isAuctionAllowListed, loading } = useIsAuctionAllowListed()

  const render = React.useCallback(
    (props) => {
      if (loading) {
        return <InlineLoading message="Loading..." size={SpinnerSize.small} />
      }
      if (isAuctionAllowListed) {
        return <Component {...rest} {...props} />
      }
      return <Redirect to="/not-allowed" />
    },
    [loading, isAuctionAllowListed, Component, rest],
  )

  return <Route {...rest} render={render} />
}

export default ProtectedRoute
