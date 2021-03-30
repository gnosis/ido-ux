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

const Underline = styled.span`
  text-decoration: underline;
`

export const Privacy: React.FC = () => {
  return (
    <>
      <PageTitleStyled>Gnosis Auction Privacy Policy</PageTitleStyled>
      <PageTitleNote>(Last updated: March 2021)</PageTitleNote>
      <Paragraph>
        We are delighted that you have chosen to use our App and/or visit our website. We take our
        data protection responsibilities with the utmost seriousness and we have designed our
        website so that you may navigate and use it without having to provide Personal Data.
      </Paragraph>
      <Paragraph>
        This Policy sets out what Personal Data we collect, how we process it and how long we retain
        it. This Policy applies to all of our processing activities where we act as a data
        controller.
      </Paragraph>
      <Paragraph>
        In this policy, &quot;we&quot;, &quot;us&quot; and &quot;our&quot; refers to Gnosis Limited,
        a company incorporated in Gibraltar with its registered address at World Trade Center, 6
        Bayside Rd, Gibraltar. For more information about us, see the Contact Us section of this
        policy.
      </Paragraph>
      <Paragraph>
        In this Policy, &quot;personal data&quot; means any information relating to you as an
        identified or identifiable natural person (&quot;Data Subject&quot;); an identifiable
        natural person is one who can be identified, directly or indirectly, in particular by
        reference to an identifier such as a name, an online identifier or to one or more factors
        specific to your physical, physiological, genetic, mental, economic, cultural or social
        identity.
        <br />
        In this Policy, &quot;processing&quot; means any operation or set of operations which is
        performed on personal data (as defined in this Privacy Policy) or on sets of personal data,
        whether or not by automated means, such as collection, recording, organisation, structuring,
        storage, adaptation or alteration, retrieval, consultation, use, disclosure by transmission,
        dissemination or otherwise making available, alignment or combination, restriction, erasure
        or destruction.
      </Paragraph>
      <Paragraph>
        <strong>Navigating this Policy</strong>
        <br />
        If you are viewing this policy online, you can click on the below links to jump to the
        relevant section:
      </Paragraph>
      <OrderedListMultiNumber>
        <LiMultiNumber>
          <HashLink to="#section1">Your information and the Blockchain</HashLink>
        </LiMultiNumber>
        <LiMultiNumber>
          <HashLink to="#section2">How We Use Personal Data</HashLink>
        </LiMultiNumber>
        <LiMultiNumber>
          <HashLink to="#section3">Use of Third Party Applications</HashLink>
        </LiMultiNumber>
        <LiMultiNumber>
          <HashLink to="#section4">Sharing Your Personal Data</HashLink>
        </LiMultiNumber>
        <LiMultiNumber>
          <HashLink to="#section5">Transferring Your data outside of the EU</HashLink>
        </LiMultiNumber>
        <LiMultiNumber>
          <HashLink to="#section6">Existence of Automated Decision-making</HashLink>
        </LiMultiNumber>
        <LiMultiNumber>
          <HashLink to="#section7">Data Security</HashLink>
        </LiMultiNumber>
        <LiMultiNumber>
          <HashLink to="#section8">Your Rights as a Data Subject</HashLink>
        </LiMultiNumber>
        <LiMultiNumber>
          <HashLink to="#section9">Storing Personal Data</HashLink>
        </LiMultiNumber>
        <LiMultiNumber>
          <HashLink to="#section10">Changes to this Privacy Policy</HashLink>
        </LiMultiNumber>
        <LiMultiNumber>
          <HashLink to="#section11">Our details</HashLink>
        </LiMultiNumber>
      </OrderedListMultiNumber>
      <OrderedListMultiNumber>
        <LiMultiNumber>
          <LiTitleNoMarginTop id="section1">Your information and the Blockchain</LiTitleNoMarginTop>
          <Paragraph>
            Blockchain technology, also known as distributed ledger technology (or simply
            &apos;DLT&apos;), is at the core of our business. Blockchains are decentralized and made
            up of digitally recorded data in a chain of packages called &apos;blocks&apos;. The
            manner in which these blocks are linked is chronological, meaning that the data is very
            difficult to alter once recorded. Since the ledger may be distributed all over the world
            (across several &apos;nodes&apos; which usually replicate the ledger) this means there
            is no single person making decisions or otherwise administering the system (such as an
            operator of a cloud computing system), and that there is no centralized place where it
            is located either.
          </Paragraph>
          <Paragraph>
            Accordingly, by design, a blockchains records cannot be changed or deleted and are said
            to be &apos;immutable&apos;. This may affect your ability to exercise your rights such
            as your right to erasure (&apos;right to be forgotten&apos;), or your rights to object
            or restrict processing of your personal data. Data on the blockchain cannot be erased
            and cannot be changed. Although smart contracts may be used to revoke certain access
            rights, and some content may be made invisible to others, it is not deleted.
          </Paragraph>
          <Paragraph>
            In certain circumstances, in order to comply with our contractual obligations to you
            (such as delivery of tokens) it will be necessary to write certain personal data, such
            as your Ethereum or other cryptocurrency wallet address, onto the blockchain; this is
            done through a smart contract and requires you to execute such transactions using your
            wallet&apos;s private key.
          </Paragraph>
          <Paragraph>
            In most cases ultimate decisions to (i) transact on the blockchain using your Ethereum
            or other cryptocurrency wallet address, as well as (ii) share the public key relating to
            your Ethereum or other cryptocurrency wallet address with anyone (including us) rests
            with you.
          </Paragraph>
          <Paragraph>
            <Red>
              IF YOU WANT TO ENSURE YOUR PRIVACY RIGHTS ARE NOT AFFECTED IN ANY WAY, YOU SHOULD NOT
              TRANSACT ON BLOCKCHAINS AS CERTAIN RIGHTS MAY NOT BE FULLY AVAILABLE OR EXERCISABLE BY
              YOU OR US DUE TO THE TECHNOLOGICAL INFRASTRUCTURE OF THE BLOCKCHAIN. IN PARTICULAR THE
              BLOCKCHAIN IS AVAILABLE TO THE PUBLIC AND ANY PERSONAL DATA SHARED ON THE BLOCKCHAIN
              WILL BECOME PUBLICLY AVAILABLE
            </Red>
          </Paragraph>
        </LiMultiNumber>
        <LiMultiNumber>
          <LiTitle id="section2">How We Use Personal Data</LiTitle>
          <Paragraph>
            <Underline>When visiting our website</Underline>
          </Paragraph>
          <OrderedListMultiNumber style={{ marginBottom: '30px' }}>
            <LiMultiNumber>
              We may collect and process Personal Data about your use of our website. This data may
              include:
              <OrderedListMultiNumber style={{ marginBottom: '30px', marginTop: '30px' }}>
                <LiMultiNumber>the browser types and versions used;</LiMultiNumber>
                <LiMultiNumber>the operating system used by the accessing system;</LiMultiNumber>
                <LiMultiNumber>
                  the website from which an accessing system reaches our website (so-called
                  referrers);
                </LiMultiNumber>
                <LiMultiNumber>behaviour: subpage, duration, and revisit</LiMultiNumber>
                <LiMultiNumber>the date and time of access to our website,</LiMultiNumber>
                <LiMultiNumber>
                  the Internet protocol address (&quot;IP address&quot;);
                </LiMultiNumber>
                <LiMultiNumber>
                  the Internet service provider of the accessing system; and
                </LiMultiNumber>
                <LiMultiNumber>
                  any other similar data and information that may be used in the event of attacks on
                  our information technology systems.
                </LiMultiNumber>
              </OrderedListMultiNumber>
            </LiMultiNumber>
            <LiMultiNumber>
              This data may be processed in order to deliver the content of our website correctly,
              to optimize the content of our website to ensure the long-term viability of our
              information technology systems and website technology, and to provide law enforcement
              authorities with the information necessary for criminal prosecution in case of a
              cyber-attack.
            </LiMultiNumber>
            <LiMultiNumber>
              The legal basis for this processing is our legitimate business interests, namely
              monitoring and improving our website and the proper protection of our business against
              risks and your consent when agreeing to accept cookies
            </LiMultiNumber>
          </OrderedListMultiNumber>
          <Paragraph>
            <Underline>When interacting with Gnosis Auction</Underline>
          </Paragraph>
          <OrderedListMultiNumber style={{ counterReset: 'auto', marginBottom: '30px' }}>
            <LiMultiNumber>
              When interacting with Gnosis Auction, Personal Data may be collected and processed.
              The data will be stored on <Red>the Ethereum blockchain</Red>, where the following
              data will be stored:
              <OrderedListMultiNumber style={{ marginBottom: '30px', marginTop: '30px' }}>
                <LiMultiNumber>your wallet address; and</LiMultiNumber>
                <LiMultiNumber>a record of your interactions.</LiMultiNumber>
              </OrderedListMultiNumber>
            </LiMultiNumber>
            <LiMultiNumber>
              <Red>
                Given the technological design of the blockchain, as explained in section 2, this
                data will become public and it will not likely be possible to delete or change the
                data at any given time.
              </Red>
            </LiMultiNumber>
            <LiMultiNumber>
              This data may be processed in order to deliver the functionality of the product.{' '}
            </LiMultiNumber>
            <LiMultiNumber>
              The legal basis for this processing is your consent, provided by the active wallet
              connection through MetaMask or WalletConnect during the login process, but also our
              legitimate business interests, namely monitoring and improving our service.
            </LiMultiNumber>
          </OrderedListMultiNumber>
          <Paragraph>
            <Underline>Other uses of your Personal Data</Underline>
          </Paragraph>
          <OrderedListMultiNumber>
            <LiMultiNumber>
              We may process any of your Personal Data where it is necessary to establish, exercise,
              or defend legal claims. The legal basis for this processing is our legitimate
              interests, namely the protection and assertion of our legal rights, your legal rights
              and the legal rights of others.
            </LiMultiNumber>
            <LiMultiNumber>
              Further, we may process your Personal data where such processing is necessary in order
              for us to comply with a legal obligation to which we are subject. The legal basis for
              this processing is our legitimate interests, namely the protection and assertion of
              our legal rights.
            </LiMultiNumber>
          </OrderedListMultiNumber>
        </LiMultiNumber>
        <LiMultiNumber>
          <LiTitle id="section3">Use of Third Party Applications</LiTitle>
          <OrderedListMultiNumber>
            <LiMultiNumber>
              <Underline>Ethereum Blockchain</Underline>
              <OrderedListMultiNumber style={{ marginBottom: '30px', marginTop: '30px' }}>
                <LiMultiNumber>
                  When using Gnosis Auction with your wallet address, the transactions made with the
                  account will be stored on the Ethereum blockchain. Please see section 2 of this
                  Policy.
                </LiMultiNumber>
                <LiMultiNumber>
                  <Red>
                    The information will be displayed permanently and publicly; this is part of the
                    nature of the blockchain. If you are new to this field, we highly recommend
                    informing yourself about blockchain technology before using our services.{' '}
                  </Red>
                </LiMultiNumber>
              </OrderedListMultiNumber>
            </LiMultiNumber>
            <LiMultiNumber>
              <Underline>The Graph</Underline>
              <OrderedListMultiNumber style={{ marginBottom: '30px', marginTop: '30px' }}>
                <LiMultiNumber>
                  We use The Graph to index data uploaded by registered users from underlying
                  blockchains and storage networks, making the data available via their Services.
                </LiMultiNumber>
                <LiMultiNumber>
                  We use The Graph to index the following data
                  <OrderedListMultiNumber style={{ marginBottom: '30px', marginTop: '30px' }}>
                    <LiMultiNumber>Your wallet address</LiMultiNumber>
                    <LiMultiNumber>a record of your interactions</LiMultiNumber>
                  </OrderedListMultiNumber>
                </LiMultiNumber>
                <LiMultiNumber>
                  For further information and the applicable data protection provisions of the Graph
                  please visit{' '}
                  <a href="https://thegraph.com/privacy/" rel="noreferrer" target="_blank">
                    https://thegraph.com/privacy
                  </a>
                </LiMultiNumber>
              </OrderedListMultiNumber>
            </LiMultiNumber>
            <LiMultiNumber>
              <Underline>MetaMask</Underline>
              <Paragraph style={{ marginTop: '30px' }}>
                In order to interact with Gnosis Auction, you will have to connect your wallet
                through the web3 wallet provider MetaMask. When connecting with MetaMask, they may
                collect Personal Data. This may include:
              </Paragraph>
              <OrderedListMultiNumber style={{ marginBottom: '30px', marginTop: '30px' }}>
                <LiMultiNumber>Network information regarding transactions;</LiMultiNumber>
                <LiMultiNumber>
                  first wallet address created through the MetaMask plugin;
                </LiMultiNumber>
                <LiMultiNumber>
                  highest browser permissions could lead to procurements of more personal
                  information
                </LiMultiNumber>
                <LiMultiNumber>
                  interaction with the site is also documented via a MetaMask Google Analytics
                  account, and that information is processed by Google.
                </LiMultiNumber>
                <LiMultiNumber>
                  For further information and the applicable data protection provisions of MetaMask
                  please visit{' '}
                  <a href="https://metamask.io/privacy.html" rel="noreferrer" target="_blank">
                    https://metamask.io/privacy.html
                  </a>
                  .
                </LiMultiNumber>
              </OrderedListMultiNumber>
            </LiMultiNumber>
            <LiMultiNumber>
              <Underline>WalletConnect</Underline>
            </LiMultiNumber>
            <LiMultiNumber>
              <Underline>Google Analytics</Underline>
              <Paragraph style={{ marginTop: '30px' }}>
                In order to measure the traffic of Gnosis Auction, we use Google Analytics. Through
                this tool we will be collecting the following data:
              </Paragraph>
              <OrderedListMultiNumber style={{ marginBottom: '30px', marginTop: '30px' }}>
                <LiMultiNumber>IP address</LiMultiNumber>
                <LiMultiNumber>Session Times</LiMultiNumber>
                <LiMultiNumber>Referrer</LiMultiNumber>
                <LiMultiNumber>Page Views</LiMultiNumber>
                <LiMultiNumber>User Platform</LiMultiNumber>
              </OrderedListMultiNumber>
              <Paragraph>
                For further information and the applicable data protection provisions of Google
                Analytics, please visit{' '}
                <a
                  href="https://policies.google.com/privacy?hl=en_GB"
                  rel="noreferrer"
                  target="_blank"
                >
                  https://policies.google.com/privacy?hl=en_GB
                </a>
              </Paragraph>
            </LiMultiNumber>
          </OrderedListMultiNumber>
        </LiMultiNumber>
        <LiMultiNumber>
          <LiTitle id="section4">Sharing Your Personal Data</LiTitle>
          <Paragraph>
            We may pass your information to our Business Partners, administration centres, third
            party service providers, agents, subcontractors and other associated organisations for
            the purposes of completing tasks and providing our services to you.
          </Paragraph>
          <Paragraph>
            In addition, when we use any other third-party service providers, we will disclose only
            the personal information that is necessary to deliver the service required and we will
            ensure that they keep your information secure and not to use it for their own direct
            marketing purposes.
          </Paragraph>
          <Paragraph>
            In addition, we may transfer your personal information to a third party as part of a
            sale of some, or all, of our business and assets or as part of any business
            restructuring or reorganisation, or if we are under a duty to disclose or share your
            personal data in order to comply with any legal obligation. However, we will take steps
            to ensure that your privacy rights continue to be protected.
          </Paragraph>
        </LiMultiNumber>
        <LiMultiNumber>
          <LiTitle id="section5">Transferring Your data outside of the EU</LiTitle>
          <Paragraph>
            Google, as a US based company, may share your personal data within the Google Group or
            with external third parties. This may involve transferring your data outside the EEA.
            Whenever they transfer your personal data outside the EEA, they ensure a similar degree
            of protection is afforded to it
            <a
              href="https://policies.google.com/privacy?hl=en_GB#enforcement"
              rel="noreferrer"
              target="_blank"
            >
              https://policies.google.com/privacy?hl=en_GB#enforcement
            </a>
          </Paragraph>
          <Paragraph>
            When interacting with the blockchain, as explained above in this Policy, the blockchain
            is a global decentralized public network and accordingly any personal data written onto
            the blockchain may be transferred and stored across the globe.
          </Paragraph>
        </LiMultiNumber>
        <LiMultiNumber>
          <LiTitle id="section6">Existence of Automated Decision-making</LiTitle>
          <Paragraph>
            We do not use automatic decision-making or profiling when processing Personal Data.
          </Paragraph>
        </LiMultiNumber>
        <LiMultiNumber>
          <LiTitle id="section7">Data Security</LiTitle>
          <Paragraph>
            We have put in place appropriate security measures to prevent your personal data from
            being accidentally lost, used or accessed in an unauthorised way, altered or disclosed.
            In addition, we limit access to your personal data to those employees, agents,
            contractors and other third parties who have a business need to know. They will only
            process your personal data on our instructions and they are subject to a duty of
            confidentiality.
          </Paragraph>
          <Paragraph>
            We have put in place procedures to deal with any suspected personal data breach and will
            notify you and any applicable regulator of a breach where we are legally required to do
            so.
          </Paragraph>
        </LiMultiNumber>
        <LiMultiNumber>
          <LiTitle id="section8">Your Rights as a Data Subject</LiTitle>
          <Paragraph>
            You have certain rights under applicable legislation, and in particular under Regulation
            EU 2016/679 (General Data Protection Regulation or &apos;GDPR&apos;). We explain these
            below. You can find out more about the GDPR and your rights by accessing the European
            Commission&apos;s website.
          </Paragraph>
          <Paragraph>
            <Underline>Right Information and access</Underline>
          </Paragraph>
          <Paragraph>
            You have a right to be informed about the processing of your personal data (and if you
            did not give it to us, information as to the source) and this Privacy Policy intends to
            provide the information. Of course, if you have any further questions you can contact us
            on the above details.
          </Paragraph>
          <Paragraph>
            <Underline>Right to rectification</Underline>
          </Paragraph>
          <OrderedListMultiNumber style={{ marginBottom: '30px' }}>
            <LiMultiNumber>
              You have the right to have any inaccurate personal information about you rectified and
              to have any incomplete personal information about you completed. You may also request
              that we restrict the processing of that information.
            </LiMultiNumber>
            <LiMultiNumber>
              The accuracy of your information is important to us. If you do not want us to use your
              Personal Information in the manner set out in this Privacy Policy, or need to advise
              us of any changes to your personal information, or would like any more information
              about the way in which we collect and use your Personal Information, please contact us
              at the above details.
            </LiMultiNumber>
          </OrderedListMultiNumber>
          <Paragraph>
            <Underline>Right to erasure (right to be &apos;forgotten&apos;)</Underline>
          </Paragraph>
          <OrderedListMultiNumber style={{ counterReset: 'auto', marginBottom: '30px' }}>
            <LiMultiNumber>
              You have the general right to request the erasure of your personal information in the
              following circumstances:
              <OrderedListMultiNumber style={{ marginBottom: '30px', marginTop: '30px' }}>
                <LiMultiNumber>
                  the personal information is no longer necessary for the purpose for which it was
                  collected;
                </LiMultiNumber>
                <LiMultiNumber>
                  you withdraw your consent to consent based processing and no other legal
                  justification for processing applies;
                </LiMultiNumber>
                <LiMultiNumber>
                  you object to processing for direct marketing purposes;
                </LiMultiNumber>
                <LiMultiNumber>
                  we unlawfully processed your personal information; and
                </LiMultiNumber>
                <LiMultiNumber>
                  erasure is required to comply with a legal obligation that applies to us.
                </LiMultiNumber>
              </OrderedListMultiNumber>
            </LiMultiNumber>
            <LiMultiNumber>
              <Red>
                However, when interacting with the blockchain we may not be able to ensure that your
                personal data is deleted. This is because the blockchain is a public decentralized
                network and blockchain technology does not generally allow for data to be deleted
                and your right to erasure may not be able to be fully enforced. In these
                circumstances we will only be able to ensure that all personal data that is held by
                us is permanently deleted.
              </Red>
            </LiMultiNumber>
            <LiMultiNumber>
              We will proceed to comply with an erasure request without delay unless continued
              retention is necessary for:
              <OrderedListMultiNumber style={{ marginBottom: '30px', marginTop: '30px' }}>
                <LiMultiNumber>
                  Exercising the right of freedom of expression and information;
                </LiMultiNumber>
                <LiMultiNumber>
                  Complying with a legal obligation under EU or other applicable law;
                </LiMultiNumber>
                <LiMultiNumber>
                  The performance of a task carried out in the public interest;
                </LiMultiNumber>
                <LiMultiNumber>
                  Archiving purposes in the public interest, scientific or historical research
                  purposes, or statistical purposes, under certain circumstances; and/or
                </LiMultiNumber>
                <LiMultiNumber>
                  The establishment, exercise, or defence of legal claims.
                </LiMultiNumber>
              </OrderedListMultiNumber>
            </LiMultiNumber>
          </OrderedListMultiNumber>
          <Paragraph>
            <Underline>Right to restrict processing and right to object to processing</Underline>
          </Paragraph>
          <OrderedListMultiNumber style={{ counterReset: 'auto', marginBottom: '30px' }}>
            <LiMultiNumber>
              You have a right to restrict processing of your personal information, such as where:
              <OrderedListMultiNumber style={{ marginBottom: '30px', marginTop: '30px' }}>
                <LiMultiNumber>you contest the accuracy of the personal information;</LiMultiNumber>
                <LiMultiNumber>
                  where processing is unlawful you may request, instead of requesting erasure, that
                  we restrict the use of the unlawfully processed personal information;
                </LiMultiNumber>
                <LiMultiNumber>
                  we no longer need to process your personal information but need to retain your
                  information for the establishment, exercise, or defence of legal claims.{' '}
                </LiMultiNumber>
              </OrderedListMultiNumber>
            </LiMultiNumber>
            <LiMultiNumber>
              You also have the right to object to processing of your personal information under
              certain circumstances, such as where the processing is based on your consent and you
              withdraw that consent. This may impact the services we can provide and we will explain
              this to you if you decide to exercise this right.
            </LiMultiNumber>
            <LiMultiNumber>
              <Red>
                However, when interacting with the blockchain, as it is a public decentralized
                network, we will likely not be able to prevent external parties from processing any
                personal data which has been written onto the blockchain. In these circumstances we
                will use our reasonable endeavours to ensure that all processing of personal data
                held by us is restricted, notwithstanding this, your right to restrict to processing
                may not be able to be fully enforced.
              </Red>
            </LiMultiNumber>
          </OrderedListMultiNumber>
          <Paragraph>
            <Underline>Right to data portability</Underline>
          </Paragraph>
          <Paragraph>
            Where the legal basis for our processing is your consent or the processing is necessary
            for the performance of a contract to which you are party or in order to take steps at
            your request prior to entering into a contract, you have a right to receive the personal
            information you provided to us in a structured, commonly used and machine-readable
            format, or ask us to send it to another person.
          </Paragraph>
          <Paragraph>
            <Underline>Right to freedom from automated decision-making</Underline>
          </Paragraph>
          <Paragraph>
            As explained above, we do not use automated decision-making, but where any automated
            decision-making takes place, you have the right in this case to express your point of
            view and to contest the decision, as well as request that decisions based on automated
            processing concerning you or significantly affecting you and based on your personal data
            are made by natural persons, not only by computers.
          </Paragraph>
          <Paragraph>
            <Underline>Right to object to direct marketing (&apos;opting out&apos;)</Underline>
          </Paragraph>
          <OrderedListMultiNumber style={{ counterReset: 'auto', marginBottom: '30px' }}>
            <LiMultiNumber>
              You have a choice about whether or not you wish to receive information from us.
            </LiMultiNumber>
            <LiMultiNumber>
              We will not contact you for marketing purposes unless:
              <OrderedListMultiNumber style={{ marginBottom: '30px', marginTop: '30px' }}>
                <LiMultiNumber>
                  you have a business relationship with us, and we rely on our legitimate interests
                  as the lawful basis for processing (as described above)
                </LiMultiNumber>
                <LiMultiNumber>
                  you have otherwise given your prior consent (such as when you download one of our
                  guides)
                </LiMultiNumber>
              </OrderedListMultiNumber>
            </LiMultiNumber>
            <LiMultiNumber>
              You can change your marketing preferences at any time by contacting us on the above
              details. On each and every marketing communication, we will always provide the option
              for you to exercise your right to object to the processing of your personal data for
              marketing purposes (known as &apos;opting-out&apos;) by clicking on the
              &apos;unsubscribe&apos; button on our marketing emails or choosing a similar opt-out
              option on any forms we use to collect your data. You may also opt-out at any time by
              contacting us on the below details.
            </LiMultiNumber>
            <LiMultiNumber>
              Please note that any administrative or service-related communications (to offer our
              services, or notify you of an update to this Privacy Policy or applicable terms of
              business, etc.) will solely be directed at our clients or business partners, and such
              communications generally do not offer an option to unsubscribe as they are necessary
              to provide the services requested. Therefore, please be aware that your ability to
              opt-out from receiving marketing and promotional materials does not change our right
              to contact you regarding your use of our website or as part of a contractual
              relationship we may have with you.
            </LiMultiNumber>
          </OrderedListMultiNumber>
          <Paragraph>
            <Underline>Right to request access</Underline>
          </Paragraph>
          <Paragraph>
            You also have a right to access information we hold about you. We are happy to provide
            you with details of your Personal Information that we hold or process. To protect your
            personal information, we follow set storage and disclosure procedures, which mean that
            we will require proof of identity from you prior to disclosing such information. You can
            exercise this right at any time by contacting us on the above details.
          </Paragraph>
          <Paragraph>
            <Underline>Right to withdraw consent</Underline>
          </Paragraph>
          <Paragraph>
            Where the legal basis for processing your personal information is your consent, you have
            the right to withdraw that consent at any time by contacting us on the above details.
          </Paragraph>
          <Paragraph>
            <Underline>Raising a complaint about how we have handled your personal data</Underline>
          </Paragraph>
          <Paragraph>
            If you wish to raise a complaint on how we have handled your personal data, you can
            contact us as set out above and we will then investigate the matter.
          </Paragraph>
          <Paragraph>
            <Underline>Right to lodge a complaint with a relevant supervisory authority</Underline>
          </Paragraph>
          <OrderedListMultiNumber style={{ counterReset: 'auto' }}>
            <LiMultiNumber>
              If we have not responded to you within a reasonable time or if you feel that your
              complaint has not been resolved to your satisfaction, you are entitled to make a
              complaint to the Data Protection Commissioner under the Data Protection Act, which is
              presently the Gibraltar Regulatory Authority (GRA). You may contact the GRA on the
              below details:
              <Paragraph style={{ marginTop: '30px' }}>
                Gibraltar Data Protection Commissioner
                <br />
                Gibraltar Regulatory Authority
                <br />
                2nd Floor, Eurotowers 4<br />
                1 Europort Road
                <br />
                Gibraltar
                <br />
                Email: <a href="mailto:info@gra.gi">info@gra.gi</a>
                <br />
                Phone: (+350) 200 74636
                <br />
                Fax: (+350) 200 72166
                <br />
              </Paragraph>
            </LiMultiNumber>
            <LiMultiNumber>
              You also have the right to lodge a complaint with the supervisory authority in the
              country of your habitual residence, place of work, or the place where you allege an
              infringement of one or more of our rights has taken place, if that is based in the
              EEA.
            </LiMultiNumber>
          </OrderedListMultiNumber>
        </LiMultiNumber>
        <LiMultiNumber>
          <LiTitle id="section9">Storing Personal Data</LiTitle>
          <Paragraph>
            We retain your information only for as long as is necessary for the purposes for which
            we process the information as set out in this policy.
          </Paragraph>
          <Paragraph>
            However, we may retain your Personal Data for a longer period of time where such
            retention is necessary for compliance with a legal obligation to which we are subject,
            or in order to protect your vital interests or the vital interests of another natural
            person.
          </Paragraph>
        </LiMultiNumber>
        <LiMultiNumber>
          <LiTitle id="section10">Changes to this Privacy Policy</LiTitle>
          <Paragraph>
            We may make changes to this Policy from time to time. Where we do so, we will notify
            those who have a business relationship with us or who are subscribed to our emailing
            lists directly of the changes, and change the &apos;Last updated&apos; date above. We
            encourage you to review the Policy whenever you access or use our website to stay
            informed about our information practices and the choices available to you. If you do not
            agree to the revised Policy, you should discontinue your use of this website.
          </Paragraph>
        </LiMultiNumber>
        <LiMultiNumber>
          <LiTitle id="section11">Our details</LiTitle>
          <Paragraph>
            This website is owned and operated by Gnosis Limited.
            <br />
            We are registered in Gibraltar under registration number 115571, and our registered
            office is located at:
          </Paragraph>
          <Paragraph>You can contact us via:</Paragraph>
          <Paragraph>
            Gnosis Limited
            <br />
            World Trade Center
            <br />
            6 Bayside Rd,
            <br />
            GX111AA Gibraltar
          </Paragraph>
          <Paragraph>
            If you have any queries concerning your rights under this Privacy Policy, please contact
            us at <a href="mailto:dataprotection@gnosis.pm">dataprotection@gnosis.pm</a>.
          </Paragraph>
        </LiMultiNumber>
      </OrderedListMultiNumber>
    </>
  )
}
