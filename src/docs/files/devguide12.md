### Vested tokens auction

#### Introduction

Gnosis Auction offers a unique method to sell vested tokens. Vested tokens allow projects and investors to align incentives over a longer period and hence are a great bootstrapping tool for new projects.

Vested tokens implementations are not trivial, as the vesting period can be bypassed if the sell is not done properly. E.g., if the vested token distribution allows smart contract addresses to participate, any claim on future vested tokens can be tokenized with special smart contract. These tokenized claims would then allow everyone to trade the vested tokens immediately. Gnosis Auction has a unique feature that allows the auctioneer to allowlist only EOA account, which can not tokenize any future claims in a trustless setup. This ensures that the vested tokens sold can not be made liquid without any further trust assumptions.

#### Vested token contracts

The vested token contract with the best fit for the gnosis auction platform is an ERC20 token with a disabled `transfer` function during the vesting period for all addresses, but a few exceptions. The exceptions needed to do a successful auctions are the auctioneer and the gnosis auction contract.

In this setup, every users can use bidding tokens - e.g. USDC - to bid in the auction for the vesting tokens and then later claim the bought vested tokens into their wallet. But no investor will be able to move the vested tokens out of their wallet during the vesting period. If each participating wallet is only a EAO account, the claimed vested tokens can not be tokenized in a trustless manner.

Further additions like linear vesting schedules can also be applied.

An example of a vested token can be found [here](https://etherscan.io/address/0x0C033bb39e67eB598D399C06A8A519498dA1Cec9#code) with its associated [auction](https://gnosis-auction.eth.link/#/auction?auctionId=34&chainId=1#topAnchor).

#### Procedure to start an auction for vested tokens

1. Deploy your vesting token
2. Declare the necessary exceptions for the transfer-restrictions: Auctioneer + Gnosis auction contract
3. Start a [new private auction](/#/docs/starting-an-auction-with-safe) via the auction-starter app on the gnosis-safe interface
4. Only allowlist participants that are EAO accounts (and, if it applies, satisfy the needed kyc-level)
