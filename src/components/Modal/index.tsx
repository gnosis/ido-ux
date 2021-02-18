import { transparentize } from 'polished'
import React from 'react'
import styled, { css } from 'styled-components'

import { DialogContent, DialogOverlay } from '@reach/dialog'
import { isMobile } from 'react-device-detect'
import { animated, useSpring, useTransition } from 'react-spring'
import { Spring } from 'react-spring/renderprops'
import '@reach/dialog/styles.css'
import { useGesture } from 'react-use-gesture'

const AnimatedDialogOverlay = animated(DialogOverlay)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const StyledDialogOverlay = styled(({ mobile, ...rest }) => <AnimatedDialogOverlay {...rest} />)<{
  mobile: boolean
}>`
  &[data-reach-dialog-overlay] {
    z-index: 2;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: transparent;

    ${({ mobile }) =>
      mobile &&
      css`
        align-items: flex-end;
      `}

    &::after {
      content: '';
      background-color: ${({ theme }) => theme.modalBG};
      opacity: 0.5;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      position: fixed;
      z-index: -1;
    }
  }
`

// destructure to not pass custom props to Dialog DOM element
const StyledDialogContent = styled(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ({ isOpen, maxHeight, minHeight, mobile, ...rest }) => (
    <DialogContent aria-label="content" {...rest} />
  ),
)`
  &[data-reach-dialog-content] {
    margin: 0 0 2rem 0;
    border: 1px solid ${({ theme }) => theme.bg1};
    background-color: ${({ theme }) => theme.bg1};
    box-shadow: 0 4px 8px 0 ${({ theme }) => transparentize(0.95, theme.shadow1)};
    padding: 0px;
    width: 50vw;

    max-width: 420px;
    ${({ maxHeight }) =>
      maxHeight &&
      css`
        max-height: ${maxHeight}vh;
      `}
    ${({ minHeight }) =>
      minHeight &&
      css`
        min-height: ${minHeight}vh;
      `}
    display: flex;
    border-radius: 20px;
    ${({ theme }) => theme.mediaWidth.upToMedium`
      width: 65vw;
      max-height: 65vh;
      margin: 0;
    `}
    ${({ mobile, theme }) => theme.mediaWidth.upToSmall`
      width:  85vw;
      max-height: 66vh;
      ${
        mobile &&
        css`
          width: 100vw;
          border-radius: 20px;
          border-bottom-left-radius: 0;
          border-bottom-right-radius: 0;
        `
      }
    `}
  }
`

const HiddenCloseButton = styled.button`
  margin: 0;
  padding: 0;
  width: 0;
  height: 0;
  border: none;
`

export const DEFAULT_MODAL_OPTIONS = {
  centered: true,
  animated: true,
  closeButton: true,
}

export const ModalBodyWrapper = styled.div`
  padding: 0.5rem 1.5rem;

  div > p {
    font-size: inherit;
    color: inherit;
    padding: 0;
  }
`
interface ModalProps {
  isOpen: boolean
  onDismiss: () => void
  minHeight?: number | false
  maxHeight?: number
  initialFocusRef?: React.RefObject<any>
  children?: React.ReactNode
}

export default function Modal({
  children,
  initialFocusRef = null,
  isOpen,
  maxHeight = 50,
  minHeight = false,
  onDismiss,
}: ModalProps) {
  const transitions = useTransition(isOpen, null, {
    config: { duration: 200 },
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
  })

  const [{ xy }, set] = useSpring(() => ({ xy: [0, 0] }))
  const bind = useGesture({
    onDrag: (state) => {
      let velocity = state.velocity
      if (velocity < 1) {
        velocity = 1
      }
      if (velocity > 8) {
        velocity = 8
      }
      set({
        xy: state.down ? state.movement : [0, 0],
        config: { mass: 1, tension: 210, friction: 20 },
      })
      if (velocity > 3 && state.direction[1] > 0) {
        onDismiss()
      }
    },
  })

  if (isMobile) {
    return (
      <>
        {transitions.map(
          ({ item, key, props }) =>
            item && (
              <StyledDialogOverlay
                initialFocusRef={initialFocusRef}
                key={key}
                mobile={true}
                onDismiss={onDismiss}
                style={props}
              >
                <Spring // animation for entrance and exit
                  from={{
                    transform: isOpen ? 'translateY(200px)' : 'translateY(100px)',
                  }}
                  to={{
                    transform: isOpen ? 'translateY(0px)' : 'translateY(200px)',
                  }}
                >
                  {(props) => (
                    <animated.div
                      {...bind()}
                      style={{
                        transform: (xy as any).interpolate(
                          (x, y) => `translate3d(${0}px,${y > 0 ? y : 0}px,0)`,
                        ),
                      }}
                    >
                      <StyledDialogContent
                        ariaLabel="test"
                        hidden={true}
                        maxHeight={maxHeight}
                        minHeight={minHeight}
                        mobile={isMobile}
                        style={props}
                      >
                        <HiddenCloseButton onClick={onDismiss} />
                        {children}
                      </StyledDialogContent>
                    </animated.div>
                  )}
                </Spring>
              </StyledDialogOverlay>
            ),
        )}
      </>
    )
  } else {
    return (
      <>
        {transitions.map(
          ({ item, key, props }) =>
            item && (
              <StyledDialogOverlay
                initialFocusRef={initialFocusRef}
                key={key}
                mobile={false}
                onDismiss={onDismiss}
                style={props}
              >
                <StyledDialogContent
                  hidden={true}
                  isOpen={isOpen}
                  maxHeight={maxHeight}
                  minHeight={minHeight}
                >
                  <HiddenCloseButton onClick={onDismiss} />
                  {children}
                </StyledDialogContent>
              </StyledDialogOverlay>
            ),
        )}
      </>
    )
  }
}
