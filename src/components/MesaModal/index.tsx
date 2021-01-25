// file copied from gnosis/dex-react
import React from "react";
import { createGlobalStyle } from "styled-components";
import Modali, {
  ModalHook,
  ModalOptions,
  ModalProps,
  toggleModaliComponent,
  useModali,
} from "modali";

const MODALI_OVERLAY_COLOUR = "#2f3e4e80";

const ModaliGlobalStyle = createGlobalStyle` 
/* Hack to fix Modali screen flash */
  .modali-overlay {
    display: none
  }

  .modali-wrapper::before {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    content: "";
    background-color: var(--color-background-opaque-grey, ${MODALI_OVERLAY_COLOUR});
  }

  /* Hack to not darken view further when two modali are open */
  .modali-wrapper:nth-last-of-type(n+3)::before {
    display: none;
  }
  /* End hack */
  
  .modali-open .modali-overlay {
    background-color: ${({ theme }) => theme.bg1};
    opacity: 1;
  }
  
  .modali-open .modali-wrapper-centered .modali {
    // todo get proper --colo-background-pageWrapper  
    background: ${({ theme }) => theme.bg1};
    box-shadow: 0 .2rem .4rem 0 rgba(0,0,0,0.14);
    border-radius: .6rem;
    border: 0;
    margin: 0 auto;
    
    .modali-header {
      height: 5.6rem;
      padding: 0 1.6rem;
      box-sizing: border-box;
      letter-spacing: 0;
      font-size: 1.6rem;
      text-align: left;
      color: ${({ theme }) => theme.text1};
      margin: 0;
      display: flex;
      align-items: center;
      font-family: var(--font-default);
      font-weight: var(--font-weight-regular);
      border-bottom: 0.1rem solid var(--color-background-banner);
    }
    
    .modali-header .modali-title {
      font-size: inherit;
      font-weight: inherit;
      line-height: 1;
    }
    
    .modali-header .modali-close-button {
      background: transparent;
      font-size: 4rem;
      line-height: 1;
      color: ${({ theme }) => theme.text3};
      font-weight: normal;
      opacity: .5;
      padding: 0;
      margin: auto 0 auto auto;
      
        &:hover {
          opacity: 1;
        }
    }
    
    .modali-body {
      font-size: 1.4rem;
      line-height: 1.3;
      background: ${({ theme }) => theme.bg1};
      color: var(--color-text-primary);
    }
    
    .modali-footer {
      margin: 1.6rem auto 0;
      height: 5.6rem;
      border-top: 0.1rem solid var(--color-background-banner);
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 1.6rem;
      box-sizing: border-box;

      /* .modali-button.modali-button-default, .modali-button.modali-button-cancel {
        margin: 0;
        border-radius: 0.6rem;
        outline: 0;
        height: 3.6rem;
        box-sizing: border-box;
        letter-spacing: 0.03rem;
        display: flex;
        align-items: center;
        justify-content: center;
        text-decoration: none;
        text-transform: uppercase;
        color: var(--color-text-CTA);
        font-weight: var(--font-weight-bold);
        font-size: 1.4rem;
        
        &:hover {
          background-color: var(--color-background-button-hover);
          color: var(--color-text-button-hover);
        }
      } */
      
      .modali-button.modali-button-default {
        border-radius: 0.6rem;
        min-width: 14rem;
        padding: 0 1.6rem;
      }

      .modali-button.modali-button-cancel {
        background: transparent;
        color: var(--color-text-active);
      }
    }
  }
  
  /* Heavier specification of the selector to ensure override from global.ts
  Ideally take out the modali default injected styles and only load from our end. */
  body.modali-open .modali.modali-size-large {
    width: 80vw;
    max-width: initial;
    min-width: initial;
    max-height: 100%;
      @media (min-width: 500px) {
          min-width: initial !important;
      }
  }
  
  body.modali-open .modali-wrapper-centered {
    top: 0 !important;
  }
  
  body.modali-open .modali-body-style {
    padding: 0;
  }
`;

const Modal: React.FC<Modali.ModalProps> = (props) => (
  <>
    <ModaliGlobalStyle />
    <Modali.Modal {...props} />
  </>
);

// To import default Modali and not change much code elsewhere
const StyledModali = { ...Modali, Modal };

export {
  StyledModali as default,
  ModalHook,
  ModalOptions,
  ModalProps,
  toggleModaliComponent as toggleModal,
  useModali as useModal,
};
