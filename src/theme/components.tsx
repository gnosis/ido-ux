import { darken } from 'polished'
import React, { HTMLProps, useCallback } from 'react'
import { X } from 'react-feather'
import { Link } from 'react-router-dom'
import styled from 'styled-components'

import { outboundLink } from 'react-ga'

import { getLogger } from '../utils/logger'

const logger = getLogger('theme/components')

export const Button = styled.button.attrs<{ warning: boolean }, { backgroundColor: string }>(
  ({ theme, warning }) => ({
    backgroundColor: warning ? theme.red1 : theme.primary1,
  }),
)`
  padding: 1rem 2rem 1rem 2rem;
  border-radius: 3rem;
  cursor: pointer;
  user-select: none;
  font-size: 1rem;
  border: none;
  outline: none;
  background-color: ${({ backgroundColor }) => backgroundColor};
  color: ${({ theme }) => theme.white};
  width: 100%;

  :hover,
  :focus {
    background-color: ${({ backgroundColor }) => darken(0.05, backgroundColor)};
  }

  :active {
    background-color: ${({ backgroundColor }) => darken(0.1, backgroundColor)};
  }

  :disabled {
    background-color: ${({ theme }) => theme.bg1};
    color: ${({ theme }) => theme.text4};
    cursor: auto;
  }
`

export const CloseIcon = styled(X)<{ onClick: () => void }>`
  cursor: pointer;
`

// A button that triggers some onClick result, but looks like a link.
export const LinkStyledButton = styled.button`
  border: none;
  text-decoration: none;
  background: none;

  cursor: pointer;
  color: ${({ theme }) => theme.primary1};
  font-weight: 500;

  :hover {
    text-decoration: underline;
  }

  :focus {
    outline: none;
    text-decoration: underline;
  }

  :active {
    text-decoration: none;
  }
`

// An internal link from the react-router-dom library that is correctly styled
export const StyledInternalLink = styled(Link)`
  text-decoration: none;
  cursor: pointer;
  color: ${({ theme }) => theme.primary1};
  font-weight: 500;

  :hover {
    text-decoration: underline;
  }

  :focus {
    outline: none;
    text-decoration: underline;
  }

  :active {
    text-decoration: none;
  }
`

const StyledLink = styled.a`
  text-decoration: none;
  cursor: pointer;
  color: ${({ theme }) => theme.text1};
  font-weight: normal;

  :hover {
    text-decoration: underline;
  }

  :focus {
    outline: none;
    text-decoration: underline;
  }

  :active {
    text-decoration: none;
  }
`

/**
 * Outbound link that handles firing google analytics events
 */
export function ExternalLink({
  href,
  rel = 'noopener noreferrer',
  target = '_blank',
  ...rest
}: Omit<HTMLProps<HTMLAnchorElement>, 'as' | 'ref' | 'onClick'> & {
  href: string
}) {
  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLAnchorElement>) => {
      // don't prevent default, don't redirect if it's a new tab
      if (target === '_blank' || event.ctrlKey || event.metaKey) {
        outboundLink({ label: href }, () => {
          logger.debug('Fired outbound link event', href)
        })
      } else {
        event.preventDefault()
        // send a ReactGA event and then trigger a location change
        outboundLink({ label: href }, () => {
          window.location.href = href
        })
      }
    },
    [href, target],
  )
  return <StyledLink href={href} onClick={handleClick} rel={rel} target={target} {...rest} />
}

export const CursorPointer = styled.div`
  :hover {
    cursor: pointer;
  }
`
