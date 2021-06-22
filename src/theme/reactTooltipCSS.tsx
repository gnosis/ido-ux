import { css } from 'styled-components'

export const reactTooltipCSS = css`
  .__react_component_tooltip.show.customTooltip {
    border-radius: 6px;
    box-shadow: 0 0 24px 0 rgba(0, 34, 73, 0.7);
    font-size: 12px;
    font-weight: normal;
    hyphens: auto;
    line-height: 1.2;
    max-width: 200px;
    opacity: 1;
    overflow-wrap: break-word;
    padding: 10px 12px;
    text-align: left;
    text-transform: none;
    white-space: normal;
    word-wrap: break-word;

    p {
      margin: 0 0 10px;

      &:last-child {
        margin-bottom: 0;
      }
    }

    > a {
      color: #fff;
      text-decoration: underline;
    }

    > a:hover {
      color: #fff;
    }

    .multi-line {
      text-align: left;
    }

    &.__react_component_tooltip.type-dark.place-top:after {
      border-top-width: 8px;
      bottom: -8px;
    }
  }
`
