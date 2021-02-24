import React from 'react'
import styled from 'styled-components'

const Wrapper = styled.div`
  position: relative;
  max-width: 1000px;
  width: 100%;
  height: auto;
  box-sizing: border-box;
  background: ${({ theme }) => theme.bg1};
  box-shadow: 0px 0px 1px rgba(0, 0, 0, 0.01), 0px 4px 8px rgba(0, 0, 0, 0.04),
    0px 16px 24px rgba(0, 0, 0, 0.04), 0px 24px 32px rgba(0, 0, 0, 0.01);
  border-radius: 20px;
  padding: 16px;
  display: flex;
  flex-flow: row wrap;

  > div {
    width: 100%;
  }
`

/**
 * The styled container element that wraps the content of most pages and the tabs.
 */
export default function AppBody({ children }: { children: React.ReactNode }) {
  return (
    <Wrapper>
      <>{children}</>
    </Wrapper>
  )
}
