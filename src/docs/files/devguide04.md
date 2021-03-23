#### Gnosis Auction User flow

In Gnosis Auction, there are two types of participants: one seller (EOA or smart contract), and multiple bidders (also EOAs or SCs).

#### 1. The seller sets six parameters:

- Auctioning-token:  refers to the token you want to sell in the auction, with the token address as a string.
- Bidding-token: refers to the token the bidders will use to bid on the auctioned token (e.g. USDC, ETH, or DAI), with the token address as a string. Multiple bidding tokens can be specified.
- Sell-amount: refers to the amount of tokens that you will sell, with the amount as an integer. 
- Min-buy-amount: refers to the minimum amount of buy tokens you are willing to accept. The minimum sell price of the auction is calculated by dividing the sell-amount/min-buy-amount.
- Duration: refers to how long is the auction going to last for. 
- Network: refers to the network where the auction will take place (e.g. Mainnet or xDai). 


The seller would then submit a transaction with the previous parameters and start the auction.

#### 2. Once the auctions starts, the bidders get to start placing bids by setting the following parameters and submitting a transaction:

- Approved token (if first time)
- Select amount of bid tokens willing to commit to the auction
- Select maximum price willing to pay

After submitting the transaction, the bidder’s bid will be valid, and the amount of bid tokens that he selected would be subtracted from his balance. 

#### 3. Once the auction concludes, the auctioneer submits a transaction which will calculate the closing price. Closing price is calculated using the following method:

1. Bids are gathered by the smart contract and sorted from highest to lowest price
2. The smart contract works back from the highest bid, adding each bid’s amount of tokens to buy, until the original amount to sell is reached
3. The bid that adds up the amount of tokens to sell is selected as the final closing for all participants. 
4. Participants that selected a maximum price at the final closing price or higher receive tokens, the ones that had selected a maximum price below the closing price are left out


#### 4. After the price has settled, the auctioneer will receive the proceeds of the auction, and the bidder will need to submit an additional transaction to claim the tokens he bought (or the tokens he bid with, in case his bid didn’t get filled). 

_Important: as a bidder, it is important to note that many participants might submit new bids right before the auction closes, making it difficult to predict the closing price of the auction ahead of time. This, it is important for bidders to submit their bids with the highest price they are willing to pay_



