### How to start a new auction using the Gnosis Safe App

#### Connect Wallet & App

1. First, you will need to have a [Gnosis Safe](https://gnosis-safe.io/) that you control deployed in the network of interest. We suggest everyone to try it out on Goerli.

2. Once you have the Gnosis Safe created, you can see the following:

<img src="/assets/GA_SafeApp_1.png" alt="drawing" width="500"/>

3. In order to add the Gnosis Auction Safe App you need to click on the APPS section at the left-hand side of the UI, which will prompt you to the following page:

<img src="/assets/GA_SafeApp_2.png" alt="drawing" width="500"/>

#### Creating an Auction

4. Once you have opened the Gnosis Auction Safe App, you can see the list of parameters you must select to launch an auction.

<img src="/assets/GA_SafeApp_3.png" alt="drawing" width="500"/>

(a) The first parameter you need to enter is the token address of the token you are about to auction. This is the token that the auctioneer will auction.

(b) The second parameter you need to enter is the token address you will accept for bidding. This is the token that the auction participants (bidders) will use to place their bids.

(c) The third parameter you need to enter is the amount of tokens (expressed in numbers) you are about to auction. Keep in mind that the value of this parameter has to be within the amount of tokens that you hold in the Gnosis Safe.

As you can see in the image below, if you try to input a value of more tokens than are held in the Gnosis Safe, the app will show a “Not enough Balance” error.

(d) The fourth parameter you need to enter is the limit price you are willing to accept for the tokens you are about to auction.

(e) The fifth parameter you need to enter is the minimal funding threshold you want to establish for your auction. This parameter will indicate to the bidders that unless the auction surpasses such threshold, there will be no auction settlement, and everyone will get their funds back. If the threshold is achieved, then all successful auction participants will receive their proceeds.

(f) The sixth parameter you need to enter is the Order Cancellation End Time. This parameter will fix at what specific date and time bidders will no longer be able to cancel their orders. From the auction time, until the order cancelation end time, bidders can cancel orders at any time.

(g) The seventh parameter you need to enter is the Auction End Time. This parameter will fix the specific date and time bidders will no longer be able to place their orders, and the auction will end.

(h) The eighth parameter you need to enter is the minimum bidding amount per order. This parameter will establish the minimum price the auctioneers are willing to accept for their auctioned tokens.

<img src="/assets/GA_SafeApp_4.png" alt="drawing" width="500"/>

(i) **Optional Step:** In the event that you would like the auction to have the possibility of the auction being atomically closed, you will need to check on the Atomic Closure Allowance box. Allowing the auction to be closed atomically will allow the last bid to be submitted along with the settlement transaction, which can enable atomic arbitrage.

<img src="/assets/GA_SafeApp_5.png" alt="drawing" width="500"/>

(j) **Optional Step:** In case you have curated a restricted participation list for the auction, check this box: The interface will prompt you to include the ninth parameter, which is the signing address (Public Key) that has been used to sign the contract approval message for each user to be whitelisted. When using the Allow List contract, auctioneers can restrict the auction participants to anyone who is included in such a list.

<img src="/assets/GA_SafeApp_6.png" alt="drawing" width="500"/>

5. Finally, you need to click on the “Build transaction” button to deploy the auction.

<img src="/assets/GA_SafeApp_7.png" alt="drawing" width="500"/>

6. After you have clicked on the “Build transaction” button, a pop up with the transaction details will appear. If you are ready to deploy the auction, you have to click on the “Submit” button to begin the execution of the transaction.

<img src="/assets/GA_SafeApp_8.png" alt="drawing" width="500"/>

7. After clicking on the “Submit” button, metamask, or your preferred wallet of choice, will prompt you to sign the transaction. In this case since the guide is using metamask, you have to click on the “Confirm” button to execute the transaction.

<img src="/assets/GA_SafeApp_9.png" alt="drawing" width="500"/>

8. That's it! You have successfully set up and deployed an auction using the Gnosis Safe App for Gnosis Auction. 

PS: Goerli auctions will only be shown in the staging environment: [https://ido-ux.dev.gnosisdev.com/](https://ido-ux.dev.gnosisdev.com/)

PS: We strongly recommend auctioneers to use the method described above instead of using the script, since we believe that the Gnosis Safe is better suited for handling large amounts of digital assets
