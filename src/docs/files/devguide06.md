### How to start an auction via scripts

This guide will first list all the parameters in order to run an auction, and then go through an example of setting up an auction on the Goerli testnet.

### Required Parameters

All auctions need to include the following parameters:

**&quot;--auctioning-token&quot;** refers to the token you want to sell in the auction, add the address as a string

**&quot;--bidding-token&quot;** refers to the token the bidders will use to bid on the auctioned token, add the address as a string

**&quot;--sell-amount&quot;** refers to the amount of tokens that you will sell, add amount as integer

**&quot;--min-buy-amount&quot;** refers to the minimum amount of buy tokens you are willing to accept. The minimum sell price of the auction is calculated by dividing the --min-buy-amount/--sell-amount

**&quot;--auction-end-date&quot;** determines the end date and time of the auction in Unix Timestamp format. Use [this website](https://www.epochconverter.com/) in order to convert from human date and time format to Unix Timestamp.

**&quot;--network&quot;** determines the network in which the auction will happen.

### Additional Parameters

Additionally, Auctioneers can further customize the auction by using the following optional parameters:

**&quot;--min-funding-threshold&quot;** The minimal funding threshold for executing the settlement. If funding is not reached, everyone will get back their investment. Default is 0.

**&quot;--order-cancellation-end-date&quot;** The unix timestamp (in seconds) until which orders can be canceled. Default is 0.

**&quot;--min-buy-amount-per-order&quot;** Describes the minimal buyAmount per order placed in the auction. Auctioneers can define if there is minimum order size in their auction. Default is 0.01

**&quot;--is-atomic-closure-allowed&quot;** This parameter enables users to close the auction atomically and submit a final bid by calling the `settleAuctionAtomically` function in the smart contract once the `auction-end-date` has been reached. The auctioneer determines whether this parameter is on or off by specifying True or False.

**&quot;--allow-list-manager&quot;** If an Allow-Listing should be applied for the auction -- only approved addresses are allowed to participate, the auctioneer can provide their own allowlistManager contract, or use the AllowListOffChainManaged.json file provided in [this repo](https://github.com/gnosis/ido-contracts/tree/main/deployments) to enable this funcitonality. The command needs to be followed by the contract address of the allowlistManager contract being used.

**&quot;--allow-list-data&quot;** If the auctioneer needs further data in his/her allowList, the data needs to be provided in this field. Our implementation needs the public address of the key (abi encode - e.g. 0x000…00useraddress) used for allowing addresses to place orders.

### Example

In order to participate as an auctioneer, it is currently needed to copy the following [repository](https://github.com/gnosis/ido-contracts).

First install all dependencies, and switch the right folder by using the following commands:

```
git clone https://github.com/gnosis/ido-contracts

cd ido-contracts

yarn

yarn build
```

Do the following command in order to set the network you will use:

```
export NETWORK= goerli
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

Example of final command to initiate the auction:

```
yarn hardhat initiateAuction --auctioning-token "0xc778417e063141139fce010982780140aa0cd5a" --bidding-token "0x5592EC0cfb4dbc12D3aB100b257153436a1f0FEa" --sell-amount 0.1 --min-buy-amount 50 --auction-end-date 1616497200 --network goerli
```

An example of a more complex auction with allow-listing would be:

```
yarn hardhat initiateAuction --auctioning-token "0xc778417e063141139fce010982780140aa0cd5ab" --bidding-token "0x5592ec0cfb4dbc12d3ab100b257153436a1f0fea" --sell-amount 0.5 --min-buy-amount 800 --auction-end-date 1619195139 --order-cancellation-end-date 1619195139 --allow-list-manager "0x80b8AcA4689EC911F048c4E0976892cCDE14031E" --allow-list-data "0x000000000000000000000000740a98f8f4fae0986fb3264fe4aacf94ac1ee96f"  --network goerli
```

### Closing an auction

After the auction time has finished, ANY participant can settle the auction by running this command:

```
yarn hardhat clearAuction --auction-id INSERT_AUCTION_ID_HERE --network goerli
```

### Allow-Listing: Generating signatures

Signatures for an auction with participation restriction can be created like that:

1. Create a file: `your_address_inputs.txt` with comma separated addresses that should be allow-listed for the auction
2. Initiate the auction and with the allow-listing option and a `signer address`, remember your auctionId
3. Run the following script:

```
export NETWORK=<Your Network>
export INFURA_KEY=<Your infura key>
export PK=<Your private key _for the signer address_. The address for this key is not required to hold any ETH>
yarn hardhat generateSignatures --auction-id "Your auctionId" --file-with-address "./your_address_inputs.txt" --network $NETWORK
```

The generated signatures can be directly uploaded to the backend by adding the flag `--post-to-api` to the previous command. Uploading signatures allows all authorized users to create orders from the web interface without the extra friction of managing a signature.
