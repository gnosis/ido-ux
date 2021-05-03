### Private Auctions and KYC solutions

#### Private Auctions

Gnosis Auction offers a different configurable ways to restrict the access for auctions. While setting up an auction, the auctioneer can specify an external smart contract to manage the access with any arbitrary logic using `allow-list-manager` argument. This contract will then be called every time, when a users places an orders and it needs to return its approval, before an order can be placed.

Lets look into a few possible implementations for this `allow-list-manger` contract:

#### Open auction

The default behaviour will be to not specify a allow-list-manger contract at all. This means the auction will be completely open for participation and the contract `allow-list-manger` will not be called.

#### Off chain allowlist manager

This is the option that is already implemented and offered for auctioneers on our Gnosis Auction Starter safe app. The github repository for this contract can be found [here](https://github.com/gnosis/ido-contracts/blob/main/contracts/allowListExamples/AllowListOffChainManaged.sol).
Upon auction initiation, an [EOA](<https://ethdocs.org/en/latest/contracts-and-transactions/account-types-gas-and-transactions.html#:~:text=Externally%20owned%20account%20(EOAs)%3A,and%20is%20controlled%20by%20code.>) is defined as the the allowlist manager using `allow-list-data` argument. This account will then be able to provide users with signatures that will be verified onchain by the allowlist contract and will enable them to participate in the auction. In order to improve the workflow, the manager can submit the signatures to Gnosis Auction's backend using `generateSignatures` method with an additional argument `post-to-api`. This way Gnosis Auction will serve the signatures automatically to users. This approach carries few key advantages: - The whitelist can be updated at any time even while the auction is running - Gas consumption is heavily reduced

#### Static onchain whitelist

A simple allowlist manager could be developed which will include all whitelisted addresses at the time of auction initiation. This approach is less flexible and is gas inefficient but might be desireable for DAOs that don't want to delegate whitelisting authirity to an external entity.

#### Integrating identity solutions

We're looking into integrating Fractal's identity solution which should improve both bidder and auctioneer workflows. It'll allow bidders to reuse their KYC credentials for multiple auctions and allow auctioneers to easily manage the KYC data or contract with an external prvider like Fractal.
