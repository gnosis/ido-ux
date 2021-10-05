import {
  FlattenSimpleInterpolation,
  ThemedCssFunction,
} from "styled-components";

export type Color = string;
export interface Colors {
  advancedBG: Color;
  bg1: Color;
  bg2: Color;
  bg3: Color;
  bg4: Color;
  bg5: Color;
  bg6: Color;
  bg7: Color;
  black: Color;
  blue1: Color;
  border: Color;
  buttonGradient1: Color;
  buttonGradient2: Color;
  disabled: Color;
  error: Color;
  green1: Color;
  green2: Color;
  mainBackground: Color;
  modalBG: Color;
  primary1: Color;
  primary2: Color;
  primary3: Color;
  primary4: Color;
  primary5: Color;
  primaryText1: Color;
  purple: Color;
  red1: Color;
  secondary1: Color;
  secondary2: Color;
  secondary3: Color;
  text1: Color;
  text2: Color;
  text3: Color;
  text4: Color;
  text5: Color;
  white: Color;
  yellow1: Color;
  yellow2: Color;
}

export interface Grids {
  sm: number;
  md: number;
  lg: number;
}

declare module "styled-components" {
  export interface DefaultTheme extends Colors {
    grids: Grids;
    shadow1: string;
    mediaWidth: {
      upToExtraSmall: ThemedCssFunction<DefaultTheme>;
      upToSmall: ThemedCssFunction<DefaultTheme>;
      upToMedium: ThemedCssFunction<DefaultTheme>;
      upToLarge: ThemedCssFunction<DefaultTheme>;
    };
    buttonPrimary: any;
    buttonPrimaryInverted: any;
    cards: any;
    dropdown: any;
    flexColumnNoWrap: FlattenSimpleInterpolation;
    flexRowNoWrap: FlattenSimpleInterpolation;
    fonts: any;
    header: any;
    layout: any;
    modal: any;
    paddings: any;
    textField: any;
    themeBreakPoints: any;
  }
}
