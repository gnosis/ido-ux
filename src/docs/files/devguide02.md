### How do Batch Auctions work?

1. In batch auctions, there is one auctioneer and multiple bidders.

2. The auctioneer defines the sell amount and the limit price for the auction. The sell amount is the amount of tokens the auctioneer would like to sell and the limit price is the minimum price they are willing to receive for the asset.

3. Once the auction is started by the auctioneer, bidders can participate by placing their bids, through limit orders, specifying an amount and a limit price.

4. The auction runs until a certain date. After this date the auction is over, and no more bids can be placed.

5. At the auction clearing, the auction calculates the final clearing price. This will be the price where the supply and demand curve intersect. (In the graph, it's where the red supply line meets the green demand curve, indicated by the white dashed line).


<img src="/assets/BosonScreenShot.png" alt="drawing" width="500"/>

6. This final clearing-price will be the final clearing price for **all participants**.

7. Bidders who specified a maximum price in their limit order that is greater than the final clearing price receive auctioned tokens **at the clearing price**.

8. Bidders that specified a maximum price in their limit order that is less than the final clearing price do not receive the auctioned tokens. But for sure, they can still withdraw their bidding tokens from the auction.


