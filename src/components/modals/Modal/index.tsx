import React from 'react'
import styled from 'styled-components'

import { DialogContent, DialogOverlay } from '@reach/dialog'

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
  z-index: 100;
`

const StyledDialogContent = styled(DialogContent)<{
  maxHeight: number | string
  minHeight: number
  width: number
}>`
  background-color: ${({ theme }) => theme.modal.body.backgroundColor};
  border-radius: ${({ theme }) => theme.modal.body.borderRadius};
  border-color: ${({ theme }) => theme.modal.body.borderColor};
  border-style: solid;
  border-width: 1px;
  box-shadow: ${({ theme }) => theme.modal.body.boxShadow};
  max-height: ${(props) => (!props.maxHeight ? 'none' : `${Number(props.maxHeight)}px`)};
  min-height: ${(props) => `${Number(props.minHeight)}px`};
  padding-bottom: ${({ theme }) => theme.modal.body.paddingVertical};
  padding-left: ${({ theme }) => theme.modal.body.paddingHorizontal};
  padding-right: ${({ theme }) => theme.modal.body.paddingHorizontal};
  padding-top: ${({ theme }) => theme.modal.body.paddingVertical};
  width: ${(props) => `${props.width}px`};
`

StyledDialogContent.defaultProps = {
  maxHeight: '',
  minHeight: 0,
  width: 468,
}

export const ModalBodyWrapper = styled.div``

export const DEFAULT_MODAL_OPTIONS = {
  animated: true,
  centered: true,
  closeButton: true,
}

interface Props {
  children?: React.ReactNode
  initialFocusRef?: React.RefObject<any>
  isOpen: boolean
  maxHeight?: number | string
  minHeight?: number
  width?: number
  onDismiss: () => void
}

const Modal: React.FC<Props> = (props) => {
  const { children, initialFocusRef = null, isOpen, maxHeight, minHeight, onDismiss, width } = props
  return (
    <StyledDialogOverlay initialFocusRef={initialFocusRef} isOpen={isOpen} onDismiss={onDismiss}>
      <StyledDialogContent maxHeight={maxHeight} minHeight={minHeight} width={width}>
        {children}
      </StyledDialogContent>
    </StyledDialogOverlay>
  )
}

export default Modal
