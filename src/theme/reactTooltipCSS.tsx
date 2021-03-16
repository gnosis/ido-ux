import { css } from 'styled-components'

export const reactTooltipCSS = css`
  .__react_component_tooltip.show.outcomeTooltip {
    margin-left: -6px;
  }
  .__react_component_tooltip.show.customTooltip {
    border-radius: 6px;
    box-shadow: 0 0 24px 0 rgba(0, 34, 73, 0.7);
    font-size: 12px;
    line-height: 1.3;
    max-width: 220px;
    opacity: 1;
    padding: 10px 12px;
    text-align: left;
    white-space: normal;

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
