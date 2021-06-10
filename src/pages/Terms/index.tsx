import React from 'react'
import styled from 'styled-components'

import { HashLink } from 'react-router-hash-link'

import {
  LiMultiNumber,
  LiTitle,
  LiTitleNoMarginTop,
  OrderedListMultiNumber,
} from '../../components/pureStyledComponents/Lists'
import { PageTitle } from '../../components/pureStyledComponents/PageTitle'
import { PageTitleNote } from '../../components/pureStyledComponents/PageTitleNote'
import { Paragraph } from '../../components/pureStyledComponents/Paragraph'

const PageTitleStyled = styled(PageTitle)`
  margin-bottom: 0;
`

const Red = styled.span`
  color: ${({ theme }) => theme.error};
`

const Green = styled.span`
  color: ${({ theme }) => theme.green1};
`

const Underline = styled.span`
  text-decoration: underline;
`

export const Terms: React.FC = () => {
  return (
    <>
      <PageTitleStyled>Gnosis Auction Terms &amp; Conditions</PageTitleStyled>
      <PageTitleNote>(Last updated: June 2021)</PageTitleNote>
      <Paragraph>
        Please read these Terms carefully before participating on our auction platform. These Terms
        tell you who we are, what we offer and what to do if there is a problem and other important
        information. If you think that there is a mistake in these Terms, please contact us to
        discuss at{' '}
        <a href="https://forum.gnosis.io" rel="noreferrer" target="_blank">
          forum.gnosis.io
        </a>
        .
      </Paragraph>
      <OrderedListMultiNumber>
        <LiMultiNumber>
          <LiTitleNoMarginTop>WHO WE ARE AND HOW TO CONTACT US</LiTitleNoMarginTop>
          <OrderedListMultiNumber>
            <LiMultiNumber>
              Gnosis Auction is operated by GnosisDAO <strong>(&quot;We&quot;)</strong>. We are an
              Ethereum based organisation managed by community members. To contact us, please write
              to us via the GnosisDAO subcategory of{' '}
              <a href="https://forum.gnosis.io" rel="noreferrer" target="_blank">
                forum.gnosis.io
              </a>
              .
            </LiMultiNumber>
            <LiMultiNumber>
              We use open source products and developer materials from Gnosis Limited and affiliated
              persons and entities
              <strong>(&quot;Affiliates&quot;)</strong> as well as other third parties to provide a
              Platform to the Gnosis Auction Protocol. The provision of the Platform and the
              Protocol is based solely on our independent actions.
            </LiMultiNumber>
          </OrderedListMultiNumber>
        </LiMultiNumber>
        <LiMultiNumber>
          <LiTitle>WHO YOU ARE: A BUSINESS CUSTOMER OR A CONSUMER?</LiTitle>
          <OrderedListMultiNumber>
            <LiMultiNumber>
              In some areas you will have different rights under these terms depending on whether
              you are a business or consumer.
            </LiMultiNumber>
            <LiMultiNumber>
              <span>You are a consumer if:</span>
              <OrderedListMultiNumber>
                <LiMultiNumber>You are an individual and</LiMultiNumber>
                <LiMultiNumber>
                  You are using our services from us wholly or mainly for your personal use (not for
                  use in connection with your trade, business, craft or profession).
                </LiMultiNumber>
              </OrderedListMultiNumber>
            </LiMultiNumber>
            <LiMultiNumber>Everyone else is a business customer.</LiMultiNumber>
            <LiMultiNumber>
              Provisions that only apply to consumers are in <Green>GREEN</Green> and those that
              only apply to business customers are in <Red>RED</Red>.
            </LiMultiNumber>
          </OrderedListMultiNumber>
        </LiMultiNumber>
        <LiMultiNumber>
          <LiTitleNoMarginTop>
            WE PROVIDE A PLATFORM TO INTERACTING WITH THE GNOSIS AUCTION PROTOCOL
          </LiTitleNoMarginTop>
          <OrderedListMultiNumber>
            <LiMultiNumber>
              We provide a graphical user interface (the <strong>&quot;Platform&quot;</strong>) to
              facilitate you interacting with the Gnosis Auction protocol for ERC 20 tokens (the{' '}
              <strong>&quot;Protocol&quot;</strong>).
            </LiMultiNumber>
            <LiMultiNumber>
              The Protocol was developed by Gnosis Limited and is governed by a series of smart
              contracts that allow permissionless peer-to-peer auctions between users applying a
              batch auction mechanism and without the need for intermediaries on Ethereum Mainnet,
              and Ethereum Virtual Machine compatible validation mechanisms. We are not a custodian
              or a counterparty to any transactions executed by you on the Protocol. We do not
              support any other service, particularly we do not provide any order matching,
              guaranteed prices, or similar exchange or trading platform services. We neither
              initiate or organise auctions nor do we have any involvement with the auctioneers.
            </LiMultiNumber>
          </OrderedListMultiNumber>
        </LiMultiNumber>
        <LiMultiNumber>
          <LiTitleNoMarginTop>BY USING OUR PLATFORM, YOU ACCEPT THESE TERMS</LiTitleNoMarginTop>
          <OrderedListMultiNumber>
            <LiMultiNumber>
              These are the general terms and conditions <strong>(&quot;Terms&quot;)</strong> that
              apply to the use of our Platform and the Protocol.
            </LiMultiNumber>
            <LiMultiNumber>
              By using our Platform, you confirm that you (1) accept and agree to these Terms and
              that you agree to comply with them. If you do not agree, you must not use our
              Platform.
            </LiMultiNumber>
            <LiMultiNumber>
              You are responsible for ensuring that all persons who access or use our Platform
              through your device or internet connection are aware of these Terms, and that they
              comply with them.
            </LiMultiNumber>
            <LiMultiNumber>
              We may amend these Terms at our sole discretion. We regularly do so. Every time you
              wish to use our Platform, please check these Terms to ensure you understand the terms
              that apply at that time.
            </LiMultiNumber>
            <LiMultiNumber>
              We may terminate or suspend your access to our Platform immediately, without prior
              notice or liability, if you breach any clause of the Terms. Upon termination of your
              access, your right to use the Platform will immediately cease. Clauses 7 to 25 survive
              any termination of these Terms.
            </LiMultiNumber>
            <LiMultiNumber>
              You may have been recommended to the Platform by a third party. We shall not be liable
              for any agreement or terms that may exist between you and the respective third party.
            </LiMultiNumber>
          </OrderedListMultiNumber>
        </LiMultiNumber>
        <LiMultiNumber>
          <LiTitleNoMarginTop>WHAT YOU REQUIRE TO USE OUR PLATFORM</LiTitleNoMarginTop>
          <OrderedListMultiNumber>
            <LiMultiNumber>
              Users may use our Platform to interact with the Protocol and buy ERC20 tokens offered
              by third-party auctioneers by placing your tokens into a batch auction organised by
              the third-party auctioneers and running on the Protocol.
            </LiMultiNumber>
            <LiMultiNumber>
              A detailed step-by-step guide on how to use the Platform may be found in the{' '}
              <HashLink to="/docs#topAnchor">&quot;Docs&quot; section on the Platform</HashLink>.
            </LiMultiNumber>
            <LiMultiNumber>
              <span>To use the Platform you require: </span>
              <OrderedListMultiNumber>
                <LiMultiNumber>
                  A wallet compatible with the Ethereum Blockchain or Ethereum Virtual Machine
                  compatible validation mechanisms. We currently only support MetaMask and
                  WalletConnect compatible wallets. We have not tested compatibility with any other
                  wallet.
                </LiMultiNumber>
                <LiMultiNumber>
                  An ERC 20 token to participate on the buy side of an auction. Buyers can only pay
                  with the ERC 20 token as specified by the third party auctioneer.
                </LiMultiNumber>
                <LiMultiNumber>
                  Depending on whether you interact with Gnosis Auction on Ethereum Mainnet or
                  Ethereum Virtual Machine compatible validation mechanisms, sufficient ETH or the
                  networks native crypto asset, respectively, must be in your Wallet to pay for
                  transactions fees, which are incurred through the Protocol and on the Blockchain.
                </LiMultiNumber>
              </OrderedListMultiNumber>
            </LiMultiNumber>
          </OrderedListMultiNumber>
        </LiMultiNumber>
        <LiMultiNumber>
          <LiTitleNoMarginTop>NO FEES LEVIED BY US</LiTitleNoMarginTop>
          <OrderedListMultiNumber>
            <LiMultiNumber>
              We do not currently levy any fees on users of our Platform at this moment in time, but
              this might change in the future.
            </LiMultiNumber>
            <LiMultiNumber>
              Users interacting with the Ethereum Mainnet or Ethereum Virtual Machine compatible
              validation mechanisms will incur transaction costs. Transaction costs are independent
              of the Platform and go to miners processing the transaction on the networks. We have
              no control over and do not set the transaction costs, and do not benefit from them.
              The Platform does not change the default suggestion of your wallet provider. Users may
              be able to change the default transaction fee within their wallet, depending on the
              wallet used.
            </LiMultiNumber>
          </OrderedListMultiNumber>
        </LiMultiNumber>
        <LiMultiNumber>
          <LiTitleNoMarginTop>
            WE MAY MAKE CHANGES TO OR SUSPEND OR WITHDRAW OUR PLATFORM
          </LiTitleNoMarginTop>
          <OrderedListMultiNumber>
            <LiMultiNumber>
              We may update and change our Platform from time to time. Our Platform is made
              available free of charge. We do not guarantee that our Platform will always be
              available or be uninterrupted or be free of charge. We may suspend or withdraw or
              restrict the availability of all or any part of our Platform for business, operational
              or regulatory reasons at 2-days&apos; notice or, in case of Force Majeure in
              accordance with clause 7.2, at no notice.
            </LiMultiNumber>
            <LiMultiNumber>
              <span>
                Force Majeure shall mean any event, circumstance or cause beyond our reasonable
                control, which makes the provision of our Platform impossible or onerous, including,
                without limitation:
              </span>
              <OrderedListMultiNumber>
                <LiMultiNumber>
                  acts of God, flood, storm, drought, earthquake or other natural disaster;
                </LiMultiNumber>
                <LiMultiNumber>epidemic or pandemic;</LiMultiNumber>
                <LiMultiNumber>
                  terrorist attack, civil war, civil commotion or riots, war, threat of or
                  preparation for war, armed conflict, imposition of sanctions, embargo, or breaking
                  off of diplomatic relations;
                </LiMultiNumber>
                <LiMultiNumber>nuclear, chemical or biological contamination;</LiMultiNumber>
                <LiMultiNumber>
                  any law or any action taken by a government or public authority, including without
                  limitation imposing a prohibition, or failing to grant a necessary licence or
                  consent;
                </LiMultiNumber>
                <LiMultiNumber>
                  collapse of buildings, breakdown of plant or machinery, fire, explosion or
                  accident; and
                </LiMultiNumber>
                <LiMultiNumber>strike, industrial action or lockout. </LiMultiNumber>
              </OrderedListMultiNumber>
            </LiMultiNumber>
            <LiMultiNumber>
              You are also responsible for ensuring that all persons who access our Platform through
              your internet connection are aware of these Terms and that they comply with them.
            </LiMultiNumber>
          </OrderedListMultiNumber>
        </LiMultiNumber>
        <LiMultiNumber>
          <LiTitleNoMarginTop>
            YOU ARE RESPONSIBLE TO SECURE YOUR CRYPTOGRAPHIC ASSETS, WE DO NOT TAKE CUSTODY
          </LiTitleNoMarginTop>
          <OrderedListMultiNumber>
            <LiMultiNumber>
              You must own and fully control the wallet you use in connection with our Platform.{' '}
            </LiMultiNumber>
            <LiMultiNumber>
              You are responsible for implementing all appropriate measures for securing the wallet
              you use for the Platform, including any private key(s), seed words or other
              credentials necessary to access such storage mechanism(s). By using our Platform, we
              do not gain custody of any of your private keys.
            </LiMultiNumber>
            <LiMultiNumber>
              We shall not be responsible for any security measures relating to the wallet you use
              for the Platform and exclude (to the fullest extent permitted under applicable law)
              any and all liability for any security breaches or other acts or omissions, which
              result in your loss of access or custody of any cryptographic assets stored thereon.
            </LiMultiNumber>
          </OrderedListMultiNumber>
        </LiMultiNumber>
        <LiMultiNumber>
          <LiTitleNoMarginTop>
            YOU ARE RESPONSIBLE FOR AND DETERMINE YOUR TAX LIABILITIES
          </LiTitleNoMarginTop>
          <OrderedListMultiNumber>
            <LiMultiNumber>
              You are solely responsible to determine if your use of the Platform has tax
              implications for you. By using the Platform, and to the extent permitted by law, you
              agree not to hold us liable for any tax liability associated with or arising from the
              operation of the Platform or any other action or transaction related thereto.
            </LiMultiNumber>
          </OrderedListMultiNumber>
        </LiMultiNumber>
        <LiMultiNumber>
          <LiTitleNoMarginTop>INFORMATION ON THE PLATFORM ARE NOT ADVICE</LiTitleNoMarginTop>
          <OrderedListMultiNumber>
            <LiMultiNumber>
              None of the information available on our Platform, or made otherwise available to you
              in relation to its use, constitutes any legal, tax, financial or other advice. Where
              in doubt as to the action you should take, you should consult your legal, financial,
              tax or other professional advisors.
            </LiMultiNumber>
          </OrderedListMultiNumber>
        </LiMultiNumber>
        <LiMultiNumber>
          <LiTitleNoMarginTop>OUR INTELLECTUAL PROPERTY RIGHTS ARE RESERVED</LiTitleNoMarginTop>
          <OrderedListMultiNumber>
            <LiMultiNumber>
              Subject to the application of the GNU Lesser General Public License v3.0 to the
              software code of the Platform, we are the owner or the licensee of all intellectual
              property rights of the Platform. Those works are protected by intellectual property
              laws and treaties around the world. All such rights are reserved.
            </LiMultiNumber>
            <LiMultiNumber>
              Subject to your compliance with these Terms, we grant you a limited, revocable,
              non-exclusive, non-transferable, non-sublicensable licence to access the Platform.
              This licence does not include any resale, commercial or derivative use of our
              Platform. We reserve and retain all rights not expressly granted to you in these
              Terms. The Platform may not be reproduced, sold, or otherwise exploited for any
              commercial purpose without our express prior written consent. You may not frame or
              utilize framing techniques to enclose any trademark, logo, or other proprietary
              information of us without our express prior written consent. You may not misuse the
              Platform and may only use it as permitted by law. If you breach our intellectual
              property rights in violation of these Terms, your license to use our Platform will
              automatically be revoked and terminated immediately.
            </LiMultiNumber>
          </OrderedListMultiNumber>
        </LiMultiNumber>
        <LiMultiNumber>
          <LiTitleNoMarginTop>
            WE ARE NOT RESPONSIBLE FOR BUGS AND YOU MUST NOT INTRODUCE THEM
          </LiTitleNoMarginTop>
          <OrderedListMultiNumber>
            <LiMultiNumber>
              We do not guarantee that our Platform will be secure or free from bugs or viruses.
            </LiMultiNumber>
            <LiMultiNumber>
              You are responsible for configuring your information technology and computer
              programmes to access our Platform. You should use your own virus protection software.
            </LiMultiNumber>
            <LiMultiNumber>
              You must not misuse our Platform by knowingly introducing material that is malicious
              or technologically harmful. You must not attempt to gain unauthorised access to our
              Platform, any server on which our Platform may be stored, computer or database
              connected to our Platform. You must not attack our Platform via a denial-of-service
              attack or a distributed denial-of service attack. By breaching this provision, you
              would commit a criminal offence. We will report any such breach to the relevant law
              enforcement authorities and we will cooperate with those authorities, including, where
              possible, by disclosing your identity to them. In the event of such a breach, your
              right to use our Platform will cease immediately.
            </LiMultiNumber>
          </OrderedListMultiNumber>
        </LiMultiNumber>
        <LiMultiNumber>
          <LiTitleNoMarginTop>RULES ABOUT YOU LINKING TO OUR PLATFORM</LiTitleNoMarginTop>
          <OrderedListMultiNumber>
            <LiMultiNumber>
              You may link to our Platform, provided you do so in a way that is fair and legal and
              does not damage our reputation or take advantage of it. You must not establish a link
              in such a way as to suggest any form of association, approval or endorsement on our
              part where none exists. You must not establish a link to our Platform in any website
              without the website’s authorization.
            </LiMultiNumber>
            <LiMultiNumber>
              Our interface must not be framed on any other site, nor may you create a link to any
              part of our interface other than the home page. We reserve the right to withdraw
              linking permission without notice.
            </LiMultiNumber>
            <LiMultiNumber>
              The website in which you are linking must comply in all respects with the content
              standards set out in these Terms. If you wish to link to or make any use of content on
              our interface other than that set out above, please contact us at{' '}
              <a href="https://forum.gnosis.io" rel="noreferrer" target="_blank">
                forum.gnosis.io
              </a>
              .
            </LiMultiNumber>
          </OrderedListMultiNumber>
        </LiMultiNumber>
        <LiMultiNumber>
          <LiTitleNoMarginTop>YOUR WARRANTIES AND REPRESENTATIONS TO US</LiTitleNoMarginTop>
          <OrderedListMultiNumber>
            <LiMultiNumber>
              <span>By using our Platform you hereby agree, represent and warrant that:</span>
              <OrderedListMultiNumber>
                <LiMultiNumber>
                  you have read and understood the Terms and agree to be bound by them;
                </LiMultiNumber>
                <LiMultiNumber>
                  you do not rely on, and shall have no remedies in respect of, any statement,
                  representation, assurance or warranty (whether made innocently or negligently)
                  that is not set out in these Terms;
                </LiMultiNumber>
                <LiMultiNumber>
                  you have reached the legal age of majority applicable to you and you agree to
                  provide legitimate and lawful documentation proving such status if we so request;
                </LiMultiNumber>
                <LiMultiNumber>
                  your usage of our Platform is legal under the laws of your jurisdiction or under
                  the laws of any other jurisdiction to which you may be subject;
                </LiMultiNumber>
                <LiMultiNumber>
                  you understand the functionality, usage, storage, transmission mechanisms and
                  intricacies associated with cryptographic assets (such as ETH), token storage
                  facilities (including digital token wallets), blockchain technology and
                  blockchain-based software systems;
                </LiMultiNumber>
                <LiMultiNumber>
                  you understand that transactions on the Ethereum Mainnet and Ethereum Virtual
                  Machine compatible validation mechanisms are irreversible and may not be erased
                  and that your wallet address and transaction is displayed permanently and publicly
                  and that you relinquish any right of rectification or erasure of personal data;
                </LiMultiNumber>
                <LiMultiNumber>
                  you shall comply with any applicable tax obligations in your jurisdiction arising
                  from your use of the Platform;
                </LiMultiNumber>
                <LiMultiNumber>
                  you shall not misuse or gain unauthorised access to our Platform by knowingly
                  introducing viruses, Trojan horses, worms, time-bombs, keystroke loggers, spyware,
                  adware or any other harmful programs or similar computer code designed to
                  adversely affect our Platform and that in the event you do so or otherwise attack
                  our Platform, we report any such activity to the relevant law enforcement
                  authorities;
                </LiMultiNumber>
                <LiMultiNumber>
                  you shall not access without authority, interfere with, damage or disrupt any part
                  of our Platform, any equipment or network on which our Platform is stored, any
                  software used in the provision of our Platform or any equipment or network or
                  software owned or used by any third party;
                </LiMultiNumber>
                <LiMultiNumber>
                  you shall not use our Platform for activities that are unlawful or fraudulent or
                  have such purpose or effect or otherwise support any activities that breach
                  applicable local, national or international law or regulations;
                </LiMultiNumber>
                <LiMultiNumber>
                  you shall not use our Platform to trade cryptographic assets that are proceeds of
                  criminal or fraudulent activity;
                </LiMultiNumber>
                <LiMultiNumber>
                  the Platform, Protocol and the Ethereum and Ethereum Virtual Machine compatible
                  validation mechanisms are in an early development stage and we accordingly do not
                  guarantee an error-free process and give no price or liquidity guarantee;
                </LiMultiNumber>
                <LiMultiNumber>you are using the Platform at your own risk;</LiMultiNumber>
                <LiMultiNumber>
                  the risks of using the Platform are substantial and include, but are not limited
                  to the ones set out in the <HashLink to="#appendix">APPENDIX</HashLink>, which is
                  hereby expressly incorporated into these Terms, and you are willing to accept the
                  risk of loss associated therewith.
                </LiMultiNumber>
              </OrderedListMultiNumber>
            </LiMultiNumber>
          </OrderedListMultiNumber>
        </LiMultiNumber>
        <LiMultiNumber>
          <LiTitleNoMarginTop>YOUR INDEMNIFICATION AND LIABILITY TO US</LiTitleNoMarginTop>
          <OrderedListMultiNumber>
            <LiMultiNumber>
              You agree to release and indemnify, defend and hold us and any of our Affiliates
              harmless, as well as any directors, officers, employees, contractors, shareholders and
              representatives of any of the foregoing, from and against any and all losses,
              liabilities, damages, costs claims or actions of any kind arising or resulting from
              your use of our Platform, your breach of these Terms, and any of your acts or
              omissions that infringe the rights of any person.
            </LiMultiNumber>
            <LiMultiNumber>
              We reserve the right, at our own expense, to assume exclusive defence and control of
              any matter otherwise subject to indemnification by you and, in such case, you agree to
              cooperate with us in the defence of such matter.
            </LiMultiNumber>
            <LiMultiNumber>
              The indemnity set out here is in addition to, and not in lieu of, any other remedies
              that may be available to us under applicable law.
            </LiMultiNumber>
          </OrderedListMultiNumber>
        </LiMultiNumber>
        <LiMultiNumber>
          <LiTitleNoMarginTop>OUR LIABILITY FOR LOSS SUFFERED BY YOU IS LIMITED</LiTitleNoMarginTop>
          <OrderedListMultiNumber>
            <LiMultiNumber>
              <strong>Whether you are a consumer or a business user:</strong> We do not exclude or
              limit our liability to you where it would be unlawful to do so. This includes
              liability for death or personal injury caused by our negligence or fraud.
            </LiMultiNumber>
            <LiMultiNumber>
              <Red>
                IF YOU ARE A BUSINESS USER: YOU USE THIS PLATFORM AT YOUR OWN RISK AND YOU ASSUME
                FULL RESPONSIBILITY FOR SUCH USE. WE EXCLUDE ALL IMPLIED CONDITIONS, WARRANTIES,
                REPRESENTATIONS OR OTHER TERMS THAT MAY APPLY TO OUR PLATFORM OR ANY OTHER CONTENT
                ON OUR PLATFORM. WE WILL NOT BE LIABLE TO YOU FOR ANY LOSS OR DAMAGE, WHETHER IN
                CONTRACT, TORT (INCLUDING NEGLIGENCE), BREACH OF STATUTORY DUTY, OR OTHERWISE, EVEN
                IF FORESEEABLE, ARISING UNDER OR IN CONNECTION WITH THE USE OF, OR INABILITY TO USE,
                OUR PLATFORM; OR THE USE OF OR RELIANCE ON ANY CONTENT DISPLAYED ON OUR PLATFROM. WE
                WILL NOT BE LIABLE FOR LOSS OF PROFITS, SALES, BUSINESS, OR REVENUE, BUSINESS
                INTERRUPTION, ANTICIPATED SAVINGS, BUSINESS OPPORTUNITY, GOODWILL OR REPUTATION OR
                ANY INDIRECT OR CONSEQUENTIAL LOSS OR DAMAGE.
              </Red>
            </LiMultiNumber>
            <LiMultiNumber>
              <Green>
                IF YOU ARE A CONSUMER USER: YOU USE THIS PLATFORM AT YOUR OWN RISK AND YOU ASSUME
                FULL RESPONSIBILITY FOR SUCH USE. PLEASE NOTE THAT WE ONLY PROVIDE OUR PLATFORM FOR
                DOMESTIC AND PRIVATE USE. YOU AGREE NOT TO USE OUR PLATFORM FOR ANY COMMERCIAL OR
                BUSINESS PURPOSES, AND WE HAVE NO LIABILITY TO YOU FOR ANY LOSS OF PROFIT, LOSS OF
                BUSINESS, BUSINESS INTERRUPTION, OR LOSS OF BUSINESS OPPORTUNITY. ONLY IF OUR
                PLATFORM DAMAGES A DEVICE OR DIGITAL CONTENT BELONGING TO YOU AND THIS IS CAUSED BY
                OUR FAILURE TO USE REASONABLE CARE AND SKILL, WE WILL PAY YOU COMPENSATION. SUCH
                COMPENSATION SHALL BE LIMITED TO THE AMOUNT OF FEES PAID BY YOU TO US FOR USING OUR
                PLATFORM. AT THIS POINT IN TIME, OUR SERVICES ARE FREE OF CHARGE AND ACCORDINGLY NO
                COMPENSATION WILL BE PAYABLE TO YOU. MOREOVER, WE WILL NOT BE LIABLE FOR DAMAGE THAT
                YOU COULD HAVE AVOIDED BY FOLLOWING OUR ADVICE OR FOR DAMAGE THAT WAS CAUSED BY YOU
                FAILING TO CORRECTLY FOLLOW OUR INSTRUCTIONS OR TO HAVE IN PLACE THE MINIMUM SYSTEM
                REQUIREMENTS ADVISED BY US.
              </Green>
            </LiMultiNumber>
          </OrderedListMultiNumber>
        </LiMultiNumber>
        <LiMultiNumber>
          <LiTitleNoMarginTop>HOW TO RESOLVE COMPLAINTS AND DISPUTES</LiTitleNoMarginTop>
          <OrderedListMultiNumber>
            <LiMultiNumber>
              <span>
                If an alleged breach, controversy, claim, dispute or difference arises out of or in
                connection with the present Terms between you and us (a{' '}
                <strong>&quot;Dispute&quot;</strong>), you agree to seek to resolve the matter with
                us amicably by referring the matter first to GnosisDAO subcategory of the
                gnosis.forum.io with a detailed description, the date and time the issue arose, your
                handle to contact you on and the outcome you are seeking.
              </span>
            </LiMultiNumber>
            <LiMultiNumber>
              Your right to take legal action remains unaffected by the existence or use of this
              complaints procedure.
            </LiMultiNumber>
          </OrderedListMultiNumber>
        </LiMultiNumber>
        <LiMultiNumber>
          <LiTitleNoMarginTop>DISPUTE RESOLUTION</LiTitleNoMarginTop>
          <OrderedListMultiNumber>
            <LiMultiNumber>
              YOU AGREE AND UNDERSTAND THAT BY ENTERING INTO THIS AGREEMENT, YOU EXPRESSLY WAIVE ANY
              RIGHT, IF ANY, TO A TRIAL BY JURY AND RIGHT TO PARTICIPATE IN A CLASS ACTION LAWSUIT.
            </LiMultiNumber>
            <LiMultiNumber>
              In the event a Dispute cannot be resolved amicably in accordance with clause 18, you
              must first refer the Dispute to proceedings under the International Chamber of
              Commerce (&quot;ICC&quot;) Mediation Rules, which Rules are deemed to be incorporated
              by reference into this clause 19. The place of mediation shall be London, United
              Kingdom. The language of the mediation proceedings shall be English.
            </LiMultiNumber>
            <LiMultiNumber>
              If the Dispute has not been settled pursuant to the ICC Mediation Rules within 40 days
              following the filing of a Request for Mediation in accordance with the ICC Mediation
              Rules or within such other period as the parties to the Dispute may agree in writing,
              such Dispute shall thereafter be finally settled under the Rules of Arbitration of the
              International Chamber of Commerce by three arbitrators appointed in accordance with
              the said Rules. The seat of Arbitration shall be London, United Kingdom. The governing
              law of this arbitration clause shall be the laws of England and Wales. The language of
              the arbitration shall be English. The Emergency Arbitrator Provisions shall not apply.
            </LiMultiNumber>
            <LiMultiNumber>
              If the Dispute cannot be resolved for legal reasons in accordance with the procedure
              in Clauses 19.2 and 19.3, you and we agree that the courts of England and Wales shall
              have exclusive jurisdiction to resolve the Dispute.
            </LiMultiNumber>
          </OrderedListMultiNumber>
        </LiMultiNumber>
        <LiMultiNumber>
          <LiTitleNoMarginTop>GOVERNING LAW</LiTitleNoMarginTop>
          <OrderedListMultiNumber>
            <LiMultiNumber>
              This Agreement shall be governed by and construed in accordance with the substantive
              laws of England &amp; Wales without regard to conflict of laws principles but with the
              Hague Principles on the Choice of Law in International Commercial Contracts hereby
              incorporated by reference.
            </LiMultiNumber>
          </OrderedListMultiNumber>
        </LiMultiNumber>
        <LiMultiNumber>
          <LiTitleNoMarginTop>THIRD PARTY BENEFICIARIES</LiTitleNoMarginTop>
          <OrderedListMultiNumber>
            <LiMultiNumber>
              Clauses 4 to 24 also apply to the benefit of the Affiliates and such benefit and also
              encompasses Protocol related matters in this context.
            </LiMultiNumber>
            <LiMultiNumber>
              Subject to 21.1, these terms do not give rise to any third party rights, which may be
              enforced against Us.
            </LiMultiNumber>
          </OrderedListMultiNumber>
        </LiMultiNumber>
        <LiMultiNumber>
          <LiTitleNoMarginTop>
            THE TERMS ARE OUR ENTIRE AGREEMENT WITH YOU AND WE MAY ASSIGN THE TERMS
          </LiTitleNoMarginTop>
          <OrderedListMultiNumber>
            <LiMultiNumber>
              We may assign these Terms to any of our affiliates or in connection with a merger or
              other disposition of all or substantially all of our assets.
            </LiMultiNumber>
            <LiMultiNumber>
              These Terms constitute the entire and exclusive agreement between us and you regarding
              its subject matter, and supersede and replace any previous or contemporaneous written
              or oral contract, promises, assurances, assurances, warranty, representation or
              understanding regarding its subject matter, whether written or oral. You shall have no
              claim for innocent or negligent misrepresentation or misstatement based on any
              statement in these Terms, though nothing in this clause shall limit or exclude any
              liability for fraud.
            </LiMultiNumber>
          </OrderedListMultiNumber>
        </LiMultiNumber>
        <LiMultiNumber>
          <LiTitleNoMarginTop>WE WAIVE NO RIGHTS AND DO NOT ALLOW ASSIGNMENT</LiTitleNoMarginTop>
          <OrderedListMultiNumber>
            <LiMultiNumber>
              You may not assign, transfer or delegate any of your rights or duties arising out of
              or in connection with these Terms to a third party. Any such assignment or transfer
              shall be void and shall not impose any obligation or liability on us to the assignee
              or transferee.
            </LiMultiNumber>
            <LiMultiNumber>
              Any delay or omission by us in relation to the exercise of any right granted by law or
              under these Terms shall not as a result exclude or prevent the later exercise of such
              a right.
            </LiMultiNumber>
          </OrderedListMultiNumber>
        </LiMultiNumber>
        <LiMultiNumber>
          <LiTitleNoMarginTop>PROVISIONS ARE SEVERABLE, IF FOUND INVALID</LiTitleNoMarginTop>
          <OrderedListMultiNumber>
            <LiMultiNumber>
              If any provision or part-provision of these Terms is or becomes invalid, illegal or
              unenforceable, it shall be deemed modified to the minimum extent necessary to make it
              valid, legal and enforceable. If such modification is not possible, the relevant
              provision or part-provision shall be deemed deleted. Any modification to or deletion
              of a provision or part-provision under this clause shall not affect the validity and
              enforceability of the rest of these Terms.
            </LiMultiNumber>
          </OrderedListMultiNumber>
        </LiMultiNumber>
        <Paragraph id="appendix">
          <br />
          <br />
          <strong>APPENDIX</strong>
        </Paragraph>
        <Paragraph>
          <strong>RISKS</strong>
        </Paragraph>
        <Paragraph>
          <Underline>PRICE FLUCTUATIONS</Underline>
          <br />
          ERC20 tokens are neither legal tender backed by governments nor by assets. The
          tokens&apos; value is highly volatile causing price fluctuations, as auctions typically
          run for some time and trades are not executed instantly.
        </Paragraph>
        <Paragraph>
          <Underline>REGULATORY ACTION</Underline>
          <br />
          We could be impacted by regulatory inquiries or action, which could impede or limit your
          ability to access or use the Platform.
        </Paragraph>
        <Paragraph>
          <Underline>TECHNICAL UNDERSTANDING</Underline>
          <br />
          Cryptographic assets are described in technical language requiring a comprehensive
          understanding of computer science and mathematics to appreciate the inherent risks.
        </Paragraph>
        <Paragraph>
          <Underline>
            TRANSACTIONS ON ETHEREUM MAINNET AND ETHEREUM VIRTUAL MACHINE COMPATIBLE VALIDATION
            MECHANISMS ARE IMMUTABLE AND IRREVERSIBLE
          </Underline>
          <br />
          Transactions on Ethereum Mainnet and Ethereum Virtual Machine compatible validation
          mechanisms are generally immutable and irreversible. Any transaction thereon is therefore
          irrevocable and final as soon as it is settled thereon. In the event that you send your
          tokens to sell to any other destination other than the Protocol smart contracts, such
          tokens may not be returned. We assume no responsibility and shall have no obligation to
          you if this occurs, including but not limited to any responsibility to recover, or assist
          to recover, any such tokens.
        </Paragraph>
        <Paragraph>
          <Underline>FAILURES WITHIN DATA STORAGE SYSTEMS</Underline>
          <br />
          Our Platform may in part be established on servers at data centre facilities of third
          party providers and on in a distributed systems for storing and accessing data including
          IPFS. Where centralised services may be used, we may be required to transfer our Platform
          to different facilities, and may incur service interruption in connection with such
          relocation. Data centre facilities are vulnerable to force majeure events or other
          failures. Third party providers may suffer breaches of security and others may obtain
          unauthorised access to our server data. Where content is stored via distributed systems,
          there may be interference in content addressing, content linking, indexing and discovery.
          As techniques used to obtain unauthorised access change frequently and generally are not
          recognised until used against a target, it may not be possible to anticipate these
          techniques or to implement adequate preventive measures.
        </Paragraph>
      </OrderedListMultiNumber>
    </>
  )
}

export default Terms
