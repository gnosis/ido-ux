import React from 'react'
import styled from 'styled-components'

import {
  DialogContent,
  DialogContentProps,
  DialogOverlay,
  DialogOverlayProps,
  DialogProps,
} from '@reach/dialog'

const StyledDialogOverlay = styled(DialogOverlay)`
  align-items: center;
  background-color: ${({ theme }) => theme.modal.overlay.backgroundColor};
  display: flex;
  height: 100vh;
  justify-content: center;
  left: 0;
  position: fixed;
  top: 0;
  width: 100vw;
  z-index: 100000;
`

const StyledDialogContent = styled(DialogContent)`
  background-color: ${({ theme }) => theme.modal.body.backgroundColor};
  border-radius: ${({ theme }) => theme.modal.body.borderRadius};
  border-color: ${({ theme }) => theme.modal.body.borderColor};
  border-style: solid;
  border-width: 1px;
  box-shadow: ${({ theme }) => theme.modal.body.boxShadow};
  outline: none;
  padding-bottom: ${({ theme }) => theme.modal.body.paddingVertical};
  padding-left: ${({ theme }) => theme.modal.body.paddingHorizontal};
  padding-right: ${({ theme }) => theme.modal.body.paddingHorizontal};
  padding-top: ${({ theme }) => theme.modal.body.paddingVertical};
`
export const ModalBodyWrapper = styled.div``

export const DEFAULT_MODAL_OPTIONS = {
  animated: true,
  centered: true,
  closeButton: true,
}

interface Props extends DialogOverlayProps, DialogContentProps, DialogProps {
  maxHeight?: number | string | undefined
  minHeight?: number | undefined
  width?: number | undefined
}

const Modal: React.FC<Props> = (props) => {
  const {
    children,
    initialFocusRef = null,
    isOpen,
    maxHeight = 'none',
    minHeight = 0,
    onDismiss,
    width = 468,
  } = props
  return (
    <StyledDialogOverlay initialFocusRef={initialFocusRef} isOpen={isOpen} onDismiss={onDismiss}>
      <StyledDialogContent
        aria-label="dialog"
        style={{
          maxHeight: `${Number(maxHeight)}px`,
          minHeight: `${Number(minHeight)}px`,
          width: `${width}px`,
        }}
      >
        {children}
      </StyledDialogContent>
    </StyledDialogOverlay>
  )
}

export default Modal
