### FAQ

#### When does the auction end?

The auctioneer defines the duration of the auction. You can see it on the top of the auction screen. After the auction time finishes, a settlement transaction needs to be submitted.

Although we expect the auctioneer to submit the settlement transaction, anyone can submit this transaction.This will calculate the settlement price and return the proceeds to the auctioneer. After that, the bidders will be able to claim.

#### How do I claim my tokens from the auction?

Bidders: After the auction has ended, and the settlement transaction has been mined, you can click on the `claim` button on the interface.

Auctioneers: After the auction time has ended, submit the transaction to settle the auction. Find an [example of the command here](https://ido-ux.dev.gnosisdev.com/#/docs/participate-as-auctioneer#topAnchor).

#### How is the final price calculated?

1.  Bids are gathered by the smart contract and sorted from highest to lowest price

2.  The smart contract works back from the highest bid, adding each bid's amount of tokens to buy, until the original amount to sell is reached

3.  The bid that adds up the amount of tokens to sell is selected as the final closing for all participants. 

4.  Participants that selected a maximum price at the final closing price or higher receive tokens, the ones that had selected a maximum price below the closing price are left out

#### Can I know what the closing price will be?

This cannot be known before the auction closes, as it needs to take into account all bids once the auction closes. For more information on calculating the closing price, check "how is the final price calculated"

"Current Price" on the interface gives you an estimate of what the closing price might be, as it shows the current closing price of the auction if no more bids are submitted or canceled

#### How can I make sure my bid is included?

You cannot guarantee that your bid will be included in the auction. To increase your chances of being included, bidders can try to wait for the end of the auction, and bid above "Current Price" shown in the interface.

Alternatively, you can bid with a very high price (near infinite), which would signal that you are willing to participate at any price, and would have a higher chance of being included on the auction.

#### What does Current Price mean?

"Current Price" shows the current closing price of the auction if no more bids are submitted or canceled

#### I placed a bid, where is my balance?

When you place a bid, your balance of the bid token will be subtracted from the wallet so it is committed to the auction.

You can always cancel your bid (before the optional cancelation period set up by the auctioneer) and have your balance back in your wallet.

#### How many transactions does a bidder need to submit?

-   Approve the bid token (only if this wasn't done before)

-   Submit bid 

-   Claim auction proceeds/receive funds back if not included

-   Cancelation (optional)

Note: after the auction ends, bidders (anyone) can theoretically also submit the transaction for auction settlement. Nonetheless, we expect the auctioneer to carry out this process

#### The auction closed but I couldn't claim any of the auctioned tokens, what happened?

It is likely that you placed your bid price too low. Read the answer to "How is the final price calculated" to know more about what determines who is included in the auction.

#### What is the chart showing?

<img src="/assets/FAQChartImage.png" alt="drawing" width="500"/>

-   Dotted white line -> shows the Current price, which is the closing price of the auction if no more bids are submitted or canceled and the auction ends

-   Green line -> shows the price (x axis) and cumulative size (y axis) of the bids that have been placed, both expressed in the bid token

-   Red line -> shows the minimum sell price (x axis) the auctioneer is willing to accept.

-   Orange line -> shows the order that the user will submitt

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

#### Why do I need to wrap my ETH to participate?

As outlined in section "What type of tokens can be auctioned and used for bidding?", Gnosis Auction only supports ERC20 tokens and since ETH is not an ERC20, as a user, you need to wrap your ETH to participate in Auctions that accept WETH bids.

#### Can I place as many orders as I want to?

Yes, as long as you have sufficient balance of the bidding token and meet the auction minimum price you can place as many orders as you want. You can cancel orders at any time if needed. Only successful orders will account for token redemption, orders placed that were unsuccessful will not account for token redemption.

#### Who is responsible for Gnosis Auction?

Anyone can utilise Gnosis Auction to conduct a token auction subject to the laws applicable to them. Gnosis Ltd, GnosisDAO or any affiliated entity ("Gnosis") has no involvement with the auctioneer(s) or the auctions, which are independently organised by the auctioneer(s). Gnosis is only involved in developing the smart contracts that make the dapp run.
