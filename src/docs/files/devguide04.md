### Gnosis Auction user flow

In Gnosis Auction, there are two types of participants: one seller and multiple bidders.

#### 1. Seller: Starting an auction

Starting an auction is a permissionless process. Each auction can be configured individually.
There are two options to start an auction on most networks:
Checkout the [UI guide](/#/docs/starting-an-auction-with-safe) or the [script guide](/#/docs/participate-as-auctioneer).

#### 2. Bidders: Placing orders

Once the auctions starts, the bidders get to start placing bids. They need to:

- Approved token (if first time)
- Select amount of bid tokens willing to commit to the auction
- Select maximum price willing to pay
- Send the order placement transaction

After submitting the transaction, the bidder’s bid will be valid, and the amount of bid tokens that they selected would be subtracted from his balance.

Check the more [detailed guide](/docs/participate-as-a-bidder#topAnchor).

_Important: as a bidder, it is important to note that many participants might submit new bids right before the auction closes, making it difficult to predict the closing price of the auction ahead of time. This, it is important for bidders to submit their bids with the highest price they are comfortable to pay for the asset_

#### 3. Auctioneer: On-chain price calculation

It's the auctioneers duty to finish the auction by sending the transaction that calculates the price of the auction on-chain. Though it's also a permissionless process and everyone can do it.

Check out the [guide](https://github.com/gnosis/ido-contracts#settle-auctionss) for doing the price calculation.

#### 4. Bidders: Claiming

After the price has settled, the auctioneer will receive the proceeds of the auction. In contrast, the bidder will need to submit an additional transaction to claim their auction proceeds.
