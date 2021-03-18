#### How to Participate as an auctioneer

In order to participate as an auctioneer, it is currently needed to copy the following [repository](https://github.com/gnosis/ido-contracts). We will go through the steps on Rinkeby.

First install all dependencies, and switch the right folder by using the following commands:
```
git clone https://github.com/gnosis/ido-contracts

cd ido-contracts

yarn

yarn build
```

Do the following command in order to set the network you will use:
```
export NETWORK= 'rinkeby'
```
Select the gas price:
```
export GAS_PRICE_GWEI=9
```
Add your Infura Key:
```
export INFURA_KEY=INFURA_KEY_HERE
```
Add the private key of the address with the funds to sell:
```
export PK=PRIVATE_KEY_HERE
```
You will now need to build a command with the following components:

**&quot;--auctioning-token&quot;** refers to the token you want to sell in the auction, add the address as a string

**&quot;--bidding-token&quot;** refers to the token the bidders will use to bid on the auctioned token, add the address as a string

**&quot;--sell-amount&quot;** refers to the amount of tokens that you will sell, add amount as integer

**&quot;--min-buy-amount&quot;** refers to the minimum amount of buy tokens you are willing to accept. The minimum sell price of the auction is calculated by dividing the --sell-amount/--min-buy-amount

Example of final command to initiate the auction:
```
yarn hardhat initiateAuction --auctioning-token "0xc778417e063141139fce010982780140aa0cd5a" --bidding-token "0x5592EC0cfb4dbc12D3aB100b257153436a1f0FEa" --sell-amount 0.1 --min-buy-amount 50 --network 'rinkeby'
```
After the auction time has finished, ANY participant can settle the auction by running this command:
```
yarn hardhat clearAuction --auction_id 3 --network $ 'rinkeby'
```
Additional commands:

**&quot;--minFundingThreshold&quot;** The minimal funding threshold for executing the settlement. If funding is not reached, everyone will get back their investment. Default is 0.

**&quot;--orderCancellationPeriod&quot;** Describes how long the auction should allow to cancel orders in seconds. Default is 0.

**&quot;--duration&quot;** Describes how long the auction should last in seconds. Default is 360000 (100 hours).

**&quot;--minBuyAmountPerOrder&quot;** Describes the minimal buyAmount per order placed in the auction. This can be used in order to protect against too high gas costs for the settlement. Default is 0.01

**&quot;--isAtomicClosureAllowed&quot;** Describes whether the auction should be allowed to be closed atomically. Default is false.
