import React, { Suspense } from 'react'
import { BrowserRouter, HashRouter, Route } from 'react-router-dom'

import Routes from '../components/navigation/Routes/Routes'
import { PUBLIC_URL } from '../constants/config'
import DarkModeQueryParamReader from '../theme/DarkModeQueryParamReader'

const Router: React.ComponentType = PUBLIC_URL === '.' ? HashRouter : BrowserRouter

const App: React.FC = () => {
  return (
    <Suspense fallback={null}>
      <Router>
        <Route component={DarkModeQueryParamReader} />
        <Routes />
      </Router>
    </Suspense>
  )
}

export default App
