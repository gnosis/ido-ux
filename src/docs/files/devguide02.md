#### How do Batch Auctions work?

1. In batch auctions, there is one auctioneer and multiple bidders.

2. The auctioneer selects the amount of an asset they want to sell and determine the minimum price they are willing to receive for the asset/s.

3. The auction begins, and it is open for a specified duration. Bidders are free to place their bids, through limit orders, once the auction starts.

4. After the specified duration is over, the auction ends, and no more bids can be placed. 

5. The smart contract sorts bids from highest to lowest price. Bids include a limit order for the token price and the amount of tokens to sell.

6. The smart contract works backward from the highest bid, cumulatively adding each bid’s amount of tokens to sell, until the bid's sum multiplied by the price of the highest bid equals the sell amount of tokens (pre-defined by the auctioneer).

7. The price of the bid (added to all previous bids’ amount of tokens) that reaches the amount of tokens to sell is selected as the final clearing price for all participants. 

<img src="/assets/Gnosis_auction_doc_diagram_GP_auction_diagram.png" alt="drawing" width="500"/>
