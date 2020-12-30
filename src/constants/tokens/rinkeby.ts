import { Token, ChainId } from "@uniswap/sdk";

export default [
  new Token(
    ChainId.RINKEBY,
    "0x5592EC0cfb4dbc12D3aB100b257153436a1f0FEa",
    18,
    "DAI",
    "Dai Stablecoin",
  ),
  new Token(
    ChainId.RINKEBY,
    "0xF9bA5210F91D0474bd1e1DcDAeC4C58E359AaD85",
    18,
    "MKR",
    "Maker",
  ),
  new Token(
    ChainId.RINKEBY,
    "0x4dbcdf9b62e891a7cec5a2568c3f4faf9e8abe2b",
    6,
    "USDC",
    "USDC",
  ),
];
