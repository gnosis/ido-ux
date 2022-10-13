### Private Auctions and KYC solutions

Gnosis Auction offers different options to restrict the access to auctions. While setting up an auction, the auctioneer can specify an external smart contract to manage the access with any arbitrary logic using `allow-list-manager` argument. This contract will then be called every time users are placing orders. The order placement will only succeed if and only if the allow-list-manager contract returns its approval.

Let's look into a few possible implementations for this `allow-list-manger` contract:

#### Open auction

The default behavior is not to set an allow-list-manger contract at all. This means the auction will be completely open for participation and the contract `allow-list-manger` will not be called.

#### Offchain allow-list manager and KYC

This option is useful to implement KYC requirements. This option allows the auctioneer to specify an [EOA](<https://ethdocs.org/en/latest/contracts-and-transactions/account-types-gas-and-transactions.html#:~:text=Externally%20owned%20account%20(EOAs)%3A,and%20is%20controlled%20by%20code.>) account to manage the participation. This EOA account will be able to allow particular addresses to place an order by creating a signed message for these addresses. Upon order-placement, the user needs to provide this signed message as a parameter to the order placement transaction and the `allow-list-contract` will check this signature for validity.
This mechanism carries few key advantages:

1. The allow-list can be updated at any time, even while the auction is running
2. Gas consumption is heavily reduced
3. Supported by Gnosis Auction Starter safe app.

The github repository for this audited contract can be found [here](https://github.com/gnosis/ido-contracts/blob/main/contracts/allowListExamples/AllowListOffChainManaged.sol).

**Setup:**

If KYC is required for your sale, then you have to work with different KYC providers like [Fractal](https://www.trustfractal.com/) or [Fireblocks](https://www.fireblocks.com/). 

Fractal provides both the KYC service and an implementation of the `allow-list-contract` that you can use. For Fractal's KYC service, contact them [here](https://web.fractal.id/). 

Fractal offers auctioneers two web3 solutions for verifying credentials - [Credentials API](https://docs.developer.fractal.id/fractal-credentials-api) and [DID Registry](https://docs.developer.fractal.id/fractal-did-registry). Both provide on-chain credential verification. You can see a summary of these products and their pros/cons [here](https://fractal.notion.site/Fractal-Product-Overview-2c63841aebaf4000b96f1c44c1680ad1).

With Credentials API, your dApp sends a signed proof it has received from Fractal as part of the user transaction. Fractal has provided an example `allow-list-manager` (see it [here](https://gist.github.com/pkoch/dca4dff50b01fcac47010a326125d255)) for integrating their Credentials Proof with your auction. For DID Registry, the `allow-list-manager` calls Fractal's smart contract (DID Registry) to verify the credential of a wallet address. Fractal has provided an example `allow-list-manager` (see it [here](https://gist.github.com/pkoch/b0e9d31b2a2a7d83693d982110ede0e9)) for integrating their DID Registry with your auction. 

Alternatively, either Fireblocks or Fractal can provide you a list of addresses that have successfully completed the KYC process and you can implement it yourself by following the allow-listing steps below.

1. Upon auction initiation, the auctioneer must specify the designated EOA in the [Gnosis Auction Starter safe app](/#/docs/starting-an-auction-with-safe). You can do this in the following field:
   <img src="/assets/SignerAddress.png" alt="drawing" width="500"/>

Once the auction was successfully initiated, all participants will see only the following screen in the interface:
<img src="/assets/PrivateAuction.png" alt="drawing" width="250"/>

2. The signed messages for the users can be created by running this [generateSignatures](https://github.com/gnosis/ido-contracts#allow-listing-generating-signatures) hardhat-script by referencing the list of allow-listed addresses. It should be run with the additional argument `post-to-api`, such that the signatures are uploaded to the GnosisDAO backend. From there, Gnosis Auction will serve the signatures automatically to users once they connect to the UI.
3. Visit your auction on [gnosis-auction.eth.link](https://gnosis-auction.eth.link) and connect to the site with one allow-listed address. Now, this account should no longer see the private auction warning but will be able to place an order.

#### Static on-chain whitelist

A simple allowlist manager could be developed which will include all allow-listed addresses at the time of auction initiation. This approach is less flexible and is gas inefficient but might be desireable for DAOs that don't want to delegate allow-listing authority to an external entity.

#### Integrating identity wallet solutions

Another solution would be to write an `allow-list contract` that checks the KYC level of identity wallets and allows owners to participate only if the KYC level satisfies specific criteria.
