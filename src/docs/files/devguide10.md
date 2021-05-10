### Numeric Example of How Gnosis Auction price finding mechanism works

Imagine that we have an Auction where the auctioneer would like to auction 15 tokens, and has established that the minimum bid has to be 0.1. Once the auction is concluded, there have been 5 different bid orders, which are ordered by price in the table below. 


| Bid Number     | Bid Size  | Bid price   |
| ------------- | ------------- | ------------- | 
| 2 | 4 | 11 |
| 3 | 3 | 2 |
| 4 | 7 | 0.5 |
| 5 | 5 | 0.3 |

In order to find out the final closing price, the smart contract has to go through the following iterations: 

** First iteration ** 

Distribute using price of 20 to the first bidder

Bidder 1 gets 2/20=0.1 tokens

Can’t distribute to bidder number two because he’s not willing to pay 20 auctioneer still has 14.9 tokens remaining

** Second iteration ** 

Distribute using price of 11 to the first two bidders

Bidder 1 gets 2/11=0.181 tokens
Bidder 2 gets 4/11=0.363 tokens

Can’t distribute to bidder number three because he’s not willing to pay 11 auctioneer still has 14.456 tokens remaining

** Third iteration ** 

Distribute using price of 2 to the first three bidders

Bidder 1 gets 2/2=1 tokens
Bidder 2 gets 4/2=2 tokens
Bidder 3 gets 3/2=1.5 tokens
Can’t distribute to bidder number four because he’s not willing to pay 2, auctioneer still has 10.5 tokens remaining

** Fourth iteration ** 

Distribute using price of 0.5 to the first four bidders

Bidder 1 gets 2/0.5=4 tokens
Bidder 2 gets 4/0.5=8 tokens
Bidder 3 gets 3/0.5=6 tokens
Bidder 4 gets 7/0.5=14 tokens

(more than) All tokens were distributed

** Final Outcome ** 

Clearing price of the auction is 0.5

Bider distribution:

Bidder 1 gets 4 tokens
Bidder 2 gets 8 tokens
Bidder 3 gets the remaining 3 tokens
Bidder 4 doesn't get any tokens
