### How to Participate as an Auctioneer using the Gnosis Safe App

#### Connect Wallet & App 

1. First, you will need to have a Gnosis Safe(https://gnosis-safe.io/) that you control deployed in Mainnet. 
2. Once you have the Gnosis Safe created, you can see the following: 

<img src="/assets/GA_SafeApp_1.png" alt="drawing" width="500"/>

3. In order to add the Gnosis Auction Safe App you need to click on the APPS section at the left-hand side of the UI:

<img src="/assets/GA_SafeApp_2.png" alt="drawing" width="500"/>

4. Once you have clicked on the image, you will be prompted to the custom apps modules, where you will have to click on the bottom “Add Custom app” 

<img src="/assets/GA_SafeApp_3.png" alt="drawing" width="500"/>

5. After you have clicked on the bottom, a popup will appear where you will have to add the following URL: https://ido-starter.staging.gnosisdev.com/: 

<img src="/assets/GA_SafeApp_4.png" alt="drawing" width="500"/>

6. After adding the link we have to click on the “Add” button.

<img src="/assets/GA_SafeApp_5.png" alt="drawing" width="500"/>

7. Once you have opened the Gnosis Auction Safe App, you can see the list of parameters you must select to launch an auction. 

#### Creating an Auction

8. The first parameter you need to enter is the token address of the token you are about to auction. This is the token that the auctioneer will auction.  

<img src="/assets/GA_SafeApp_6.png" alt="drawing" width="500"/>

<img src="/assets/GA_SafeApp_7.png" alt="drawing" width="500"/>

<img src="/assets/GA_SafeApp_8.png" alt="drawing" width="500"/>

9. The second parameter you need to enter is the token address you will accept for bidding. This is the token that the auction participants (bidders) will use to place their bids. 

<img src="/assets/GA_SafeApp_9.png" alt="drawing" width="500"/>

<img src="/assets/GA_SafeApp_10.png" alt="drawing" width="500"/>

<img src="/assets/GA_SafeApp_11.png" alt="drawing" width="500"/>

10. The third parameter you need to enter is the amount of tokens (expressed in numbers) you are about to auction. Keep in mind that the value of this parameter has to be within the amount of tokens that you hold in the Gnosis Safe. 

<img src="/assets/GA_SafeApp_12.png" alt="drawing" width="500"/>

<img src="/assets/GA_SafeApp_13.png" alt="drawing" width="500"/>

As you can see in the image below, if you try to input a value of more tokens than are held in the Gnosis Safe, the app will show a “Not enough Balance” error. 

<img src="/assets/GA_SafeApp_14.png" alt="drawing" width="500"/>

11. The fourth parameter you need to enter is the limit price you are willing to accept for the tokens you are about to auction.

<img src="/assets/GA_SafeApp_15.png" alt="drawing" width="500"/>

<img src="/assets/GA_SafeApp_16.png" alt="drawing" width="500"/>

12. The fifth parameter you need to enter is the minimal funding threshold you want to establish for your auction. This parameter will indicate to the bidders that unless the auction surpasses such threshold, there will be no auction settlement, and everyone will get their funds back. If the threshold is achieved, then all successful auction participants will receive their proceeds. 

<img src="/assets/GA_SafeApp_17.png" alt="drawing" width="500"/>

<img src="/assets/GA_SafeApp_18.png" alt="drawing" width="500"/>

13. The sixth parameter you need to enter is the Order Cancellation End Time. This parameter will fix at what specific date and time bidders will no longer be able to cancel their orders. From the auction time, until the order cancelation end time, bidders can cancel orders at any time. 

<img src="/assets/GA_SafeApp_19.png" alt="drawing" width="500"/>

<img src="/assets/GA_SafeApp_20.png" alt="drawing" width="500"/>

14. The seventh parameter you need to enter is the Auction End Time. This parameter will fix the specific date and time bidders will no longer be able to place their orders, and the auction will end.

<img src="/assets/GA_SafeApp_21.png" alt="drawing" width="500"/>

<img src="/assets/GA_SafeApp_22.png" alt="drawing" width="500"/>

15. The eighth parameter you need to enter is the minimum bidding amount per order. This parameter will establish the minimum price the auctioneers are willing to accept for their auctioned tokens. 

<img src="/assets/GA_SafeApp_23.png" alt="drawing" width="500"/>

<img src="/assets/GA_SafeApp_24.png" alt="drawing" width="500"/>

16. In the event that you would like the auction to have the possibility of being atomically closed, you will need to check on the Atomic Closure Allowance box. Allowing the auction to be closed atomically will allow the last bid to be submitted along with the price, which can lead to atomic arbitrage. 

<img src="/assets/GA_SafeApp_25.png" alt="drawing" width="500"/>

17. In case you would like to create a whitelist for the auction, you need to deploy an allow list contract. Once you have done that, you have to check in the box. The interface will prompt you to include the ninth parameter (optional), which is the contract address of the allowlist. With this contract address, auctioneers can restrict the auction participants to anyone who is included in such a list. 

<img src="/assets/GA_SafeApp_26.png" alt="drawing" width="500"/>

<img src="/assets/GA_SafeApp_27.png" alt="drawing" width="500"/>

18. The tenth parameter (Optional) you need to fill in is the signing address (Public Key) that has been used to deploy the Allow List contract that holds the addresses of the auction’s valid participants. 

<img src="/assets/GA_SafeApp_28.png" alt="drawing" width="500"/>

<img src="/assets/GA_SafeApp_29.png" alt="drawing" width="500"/>

19. Finally, you need to click on the “Build transaction” button to deploy the auction.

<img src="/assets/GA_SafeApp_30.png" alt="drawing" width="500"/>

20. After you have clicked on the “Build transaction” button, a pop up with the transaction details will appear. If you are ready to deploy the auction, you have to click on the “Submit” button to begin the execution of the transaction. 

<img src="/assets/GA_SafeApp_31.png" alt="drawing" width="500"/>

21. After clicking on the “Submit” button, metamask, or your preferred wallet of choice, will prompt you to sign the transaction. In this case since the guide is using metamask, you have to click on the “Confirm” button to execute the transaction. 

<img src="/assets/GA_SafeApp_32.png" alt="drawing" width="500"/>

22. That's it! You have successfully set up and deployed an auction using the Gnosis Safe App for Gnosis Auction. 

PS: We strongly recommend auctioneers to use the method described above instead of using the script, since we believe that the Gnosis Safe is better suited for handling large amounts of digital assets
