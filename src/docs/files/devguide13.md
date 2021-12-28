### How to settle an auction 

After the auction time has finished, the auction waits in a state that is called: **'Awaiting Settlement'**. 
ANY participant can settle the auction by running the following commands:

First, one needs to clone and prepare the repo:

```
git clone https://github.com/gnosis/ido-contracts
cd ido-contracts
yarn
yarn build
```

Now, one can run the script settling the auction:

```
export NETWORK=<Your Network>
export GAS_PRICE_GWEI=<Your gas price>
export INFURA_KEY=<Your infura key>
export PK=<Your private key>
yarn hardhat clearAuction --auction-id INSERT_AUCTION_ID_HERE --network $NETWORK
```

The command will run the on-chain price calculation and settle the auction with the calculated price. Usually, the auctioneer themselves will run the scripts and hence pay the gas for settling the auctions.
