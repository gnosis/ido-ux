### FAQ

#### When does the auction end?

The auction will always end at the predefined time set by the auctioneer. Each auction page has a countdown until the auction ending (timer in the orange circle).

#### How is the final price calculated?

The final clearing price will be the price where the supply and demand curve intersect. (In the graph, it's where the red supply line meets the green demand curve, indicated by the white dashed line).

<img src="/assets/BosonScreenShot.png" alt="drawing" width="500"/>

#### I was bidding X tokens, how many can I claim?
If the final clearing price was higher than your limit order price, you will receive back your funds using for bidding. Otherwise, you will receive the `bidding amount * clearing price` auctioned tokens.


**Here is one example:**

There is an auction ETH for DAI
- You place a limit order of 1000 DAI with a limit price of 4000 DAI per ETH
- If the clearing price ends up being 5000 DAI per ETH, you will receive your 1000 DAI back
- If the clearing price ends up being 3000 DAI per ETH, you will receive 1000* 1/3000 ETH = 1/3 ETH


#### How do I claim my tokens from the auction?

Bidders: After the auction has ended, and the settlement transaction has been mined, you can click on the `claim` button on the interface.

Auctioneers: After the auction time has ended, submit the transaction to settle the auction. Find an [example of the command here](https://ido-ux.dev.gnosisdev.com/#/docs/participate-as-auctioneer#topAnchor).



#### Can I know what the closing price will be?

This cannot be known before the auction closes, as it needs to take into account all bids. For more information on calculating the closing price, check "How is the final price calculated".

"Current Price" on the interface gives you an estimate of what the closing price might be, as it shows the current closing price of the auction if no more bids are submitted or cancelled.

#### How can I make sure my bid is included?

You cannot guarantee that your bid will be included in the auction. Though you can bid with a very high price, which is very likely higher than the closing price. Then your bid will be - very likely - above the final clearing price and hence you will get the tokens at the clearing price. This is called non-competitive price bidding.

Alternatively, bidders can try to wait shortly before the end of the auction when its easier to estimate the final clearing price. Then they can bid higher than their estimated clearing price.

#### What does Current Price mean?

"Current Price" shows the current closing price of the auction if no more bids are submitted or cancelled.

#### I placed a bid, where is my balance?

When you place a bid, your balance of the bid token will be subtracted from the wallet so it is committed to the auction.

You can always cancel your bid (before the optional cancellation period set up by the auctioneer) and have your balance back in your wallet.

#### How many transactions does a bidder need to submit?

- Approve the bid token (only if this wasn't done before)

- Submit bid

- Claim auction proceeds/receive funds back if not included

- Cancellation (optional)

Note: after the auction ends, bidders (anyone) can theoretically also submit the transaction for auction settlement. Nonetheless, we expect the auctioneer to carry out this process.

#### The auction closed but I couldn't claim any of the auctioned tokens, what happened?

It is likely that you placed your bid price too low. Read the answer to "How is the final price calculated" to know more about what determines who is included in the auction.

#### What is the chart showing?

<img src="/assets/BosonScreenShot.png" alt="drawing" width="500"/>


- Dotted white line -> shows the "Current price", which is the closing price of the auction if no more bids are submitted or cancelled and the auction ends

- Green line -> shows cumulative tokens (y axis) of the bids that have been placed over the price (x axis), both expressed in the bid token

- Red line -> shows the sell supply from the auctioneer (y axis) in bidding tokens over the price (x axis). The auctioneer is selling a predefined amount of tokens, but they will raise linearly more bidding tokens, if the price increases. As an example: If the auctioneer sells 1 ETH for USDC, at a price of 2000, they will get 2000 USD, but at a price of 4000, they will receive 4000 USDC.

- Orange line -> shows the order that the user will submit.

#### What is the settlement transaction?

The settlement transaction refers to a transaction that needs to be executed after the auction ends in order to:

a) distribute the proceeds to the auctioneer

b) make claiming available for users.

Although this transaction can be submitted by anyone, we expect the auctioneer to take care of this step. An example of the command can be found in the "How to Participate as an Auctioneer" section.

#### Can I get my tokens back if my bid is not successful?

Yes, as outlined in question "The auction closed but I couldn't claim any of the auctioned tokens, what happened?", you can claim the total balance of the tokens you used for bidding.

Please note the ether (gas) spent to submit the bid order cannot be claimed as it is not related to the Gnosis Auction.

#### What type of tokens can be auctioned and used for bidding?

Currently, only ERC20 tokens can be auctioned and used for bidding. Gnosis Auction does not support ERC721 (NFTs) or any other token type.

#### Can I place as many orders as I want to?

Yes, as long as you have sufficient balance of the bidding token and meet the auction minimum price you can place as many orders as you want. You can cancel orders at any time if needed. Only successful orders will account for token redemption, orders placed that were unsuccessful will not account for token redemption.

#### Who is responsible for Gnosis Auction?

Anyone can utilise Gnosis Auction to conduct a token auction subject to the laws applicable to them. Gnosis Ltd, GnosisDAO or any affiliated entity ("Gnosis") has no involvement with the auctioneer(s) or the auctions, which are independently organized by the auctioneer(s). Gnosis is only involved in developing the smart contracts that make the dapp run.

#### Can I subscribe to get a notification for new auctions?

The [gnosis-auction](https://twitter.com/GnosisAuction) twitter account will tweet automatically about new auctions.
