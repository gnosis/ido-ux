#### How do Batch Auctions work?

1. In batch auctions, there is one auctioneer and multiple bidders.

2. The auctioneer selects the amount of an asset they want to sell and determine the minimum price they are willing to receive for the asset

3. The auction begins, and it is open for a specified duration. Bidders are free to place their bids, through limit orders, once the auction starts.

4. After the specified duration is over, the auction ends, and no more bids can be placed. 

5. The smart contract sorts bids from highest to lowest price. Bids include a limit order for the token price and the amount of tokens to buy.

6. The smart contract works backward from the highest bid, cumulatively adding each bid’s amount of tokens to sell, until the bid's sum multiplied by the price of the highest bid equals the sell amount of tokens (pre-defined by the auctioneer).

7. The price of the bid (added to all previous bids’ amount of tokens) that reaches the amount of tokens to sell is selected as the final clearing price for all participants. 

8. Bidders who specified a maximum price in their limit order that is equal to or greater than the final clearing price receive tokens at the clearing price. 

9. Bidders that specified a maximum price in their limit order that is less than the final clearing price do not receive the tokens being auctioned, but they can still withdraw their bidding tokens from the DEX. 

Let's take a deeper look at the example provided in the diagram below.


The following diagram shows an auction in which 14 tokens are offered at 2 blocks per share:

<img src="/assets/Gnosis_auction_doc_diagram_GP_auction_diagram.png" alt="drawing" width="500"/>

The diagram shows an example of how an auction calculates the final price:
 
- At first, the auctioneer establishes the minimum price for which they are willing to sell tokens and an amount of tokens to be auctioned. In this example the auctioneer is selling 14 tokens at a minimum price of 2 tokens (established by the first square on the X axis). 

- Once the auction begins, bidders can start placing bids, in which they specify how much of the bid token they would like to buy with and at what price.

- When the auction duration time has come to an end, the smart contract sorts the bids from highest to lowest, stopping at the price in which the cumulative volume of the bids have reached the amount the auctioneer was willing to sell, in this case 14.
    - Since we have 14 tokens to auction, the diagram shows that the highest bid price was 2 tokens at price 9, followed by 3 tokens at price 8, 5 tokens at price 7, and 4 tokens at price 6. 
    - With the last bid (4 tokens at price 6), the auctioneer has no more tokens to sell, and the auction establishes that the auctioned token final clearing price is at 6 for all participants.
    - Participants whose bid is equal to or greater than the final clearing price will receive the auctioned tokens. Participants with bids less than the final clearing price can reclaim the token balance with which they had bid. 
