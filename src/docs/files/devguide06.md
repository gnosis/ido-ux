### How to Participate as an auctioneer

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

**&quot;--auction-end-date&quot;** determines the end date and time of the auction in Unix Timestamp format. Use [this website](https://www.epochconverter.com/) in order to convert from human date and time format to Unix Timestamp.

**&quot;--network&quot;** determines the network in which the auction will happen.

_Note: the minimum sell price that the auctioneer determines is calculated by the sell-amount/min-buy-amount ratio._

Example of final command to initiate the auction:
```
yarn hardhat initiateAuction --auctioning-token "0xc778417e063141139fce010982780140aa0cd5a" --bidding-token "0x5592EC0cfb4dbc12D3aB100b257153436a1f0FEa" --sell-amount 0.1 --min-buy-amount 50 --auction-end-date 1616497200 --network 'rinkeby'
```

### Closing an auction

After the auction time has finished, ANY participant can settle the auction by running this command:
```
yarn hardhat clearAuction --auction-id INSERT_AUCTION_ID_HERE --network $ 'rinkeby'
```
### Additional commands:

**&quot;--minFundingThreshold&quot;** The minimal funding threshold for executing the settlement. If funding is not reached, everyone will get back their investment. Default is 0.

**&quot;--orderCancellationPeriod&quot;** The unix timestamp (in seconds) until which orders can be canceled. Default is 0.

**&quot;--minBuyAmountPerOrder&quot;** Describes the minimal buyAmount per order placed in the auction. This can be used in order to protect against too high gas costs for the settlement. Default is 0.01

**&quot;--isAtomicClosureAllowed&quot;** Describes whether the auction should be allowed to be closed atomically. Default is false.

**&quot;----allow-list-manager&quot;** If whitelisting of addresses is required, then auctioneers handover their own  allowlistManager, or uses the allowListManager contract provided in this repo. You can find the deployment address in this [folder](https://github.com/gnosis/ido-contracts/blob/main/deployments/).

**&quot;--allow-list-data&quot;** If the auctioneer needs further data in his/her allow_Lst, it needs to be provided in this field. Our implementation needs the public address of the key (abi encode - e.g. 0x000…00useraddress) used for allowing address to place orders.

An example of a more complex auction:
```
yarn hardhat initiateAuction --auctioning-token "0xc778417e063141139fce010982780140aa0cd5ab" --bidding-token "0x5592ec0cfb4dbc12d3ab100b257153436a1f0fea" --sell-amount 0.5 --min-buy-amount 800 --auction-end-date 1619195139 --order-cancellation-end-date 1619195139 --allow-list-manager "0x80b8AcA4689EC911F048c4E0976892cCDE14031E" --allow-list-data "0x000000000000000000000000740a98f8f4fae0986fb3264fe4aacf94ac1ee96f"  --network rinkeby
```
