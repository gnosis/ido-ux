import React from 'react'
import styled from 'styled-components'

import {
  LiMultiNumber,
  LiTitle,
  LiTitleNoMarginTop,
  OrderedListMultiNumber,
} from '../../components/pureStyledComponents/Lists'
import { PageTitle } from '../../components/pureStyledComponents/PageTitle'
import { PageTitleNote } from '../../components/pureStyledComponents/PageTitleNote'
import { Paragraph } from '../../components/pureStyledComponents/Paragraph'
import { TableWrapper } from '../../components/pureStyledComponents/TableWrapper'

const PageTitleStyled = styled(PageTitle)`
  margin-bottom: 0;
`

const TableWrapperStyled = styled(TableWrapper)`
  margin-bottom: 40px;
`

const StripedTable = styled.table`
  border-collapse: separate;
  border-radius: 4px;
  border-spacing: 0;
  border: 1px solid ${({ theme }) => theme.border};
  min-width: 100%;
`
const THead = styled.thead``

const TBody = styled.tbody``

const TR = styled.tr`
  &:nth-child(odd) {
    td {
      background-color: rgba(0, 0, 0, 0.15);
    }
  }

  &:last-child {
    td {
      border-bottom: none;
    }
  }
`

const TH = styled.th`
  border-bottom: 1px solid ${({ theme }) => theme.border};
  border-right: 1px solid ${({ theme }) => theme.border};
  color: ${({ theme }) => theme.text1};
  font-size: 14px;
  font-weight: 600;
  line-height: 1.2;
  padding: 15px;
  text-align: left;
  text-transform: uppercase;
  vertical-align: middle;
  white-space: nowrap;

  &:last-child {
    border-right: none;
  }
`

const TD = styled.td`
  border-bottom: 1px solid ${({ theme }) => theme.border};
  border-right: 1px solid ${({ theme }) => theme.border};
  color: ${({ theme }) => theme.text1};
  font-size: 15px;
  font-weight: 400;
  line-height: 1.2;
  padding: 15px;
  text-align: left;
  vertical-align: top;

  &:last-child {
    border-right: none;
  }
`

export const Cookies: React.FC = () => {
  return (
    <>
      <PageTitleStyled>Gnosis Auction Cookie Policy</PageTitleStyled>
      <PageTitleNote>(Last updated: March 2021)</PageTitleNote>
      <Paragraph>
        As described in our Privacy Policy, for general web-browsing of this website, your personal
        data is not revealed to us, although certain statistical information is available to us via
        our internet service provider as well as through the use of special tracking technologies.
        Such information tells us about the pages you are clicking on or the hardware you are using,
        but not your name, age, address or anything we can use to identify you personally.
      </Paragraph>
      <Paragraph>
        This Cookie Policy sets out some further detail on how and why we use these technologies on
        our website. The terms &quot;we&quot;, &quot;us&quot;, and &quot;our&quot; includes Gnosis
        Limited and our affiliates. The terms &quot;you&quot; and &quot;your&quot; includes our
        clients, business partners and users of this website. By using our website, you consent to
        storage and access to cookies and other technologies on your device, in accordance with this
        Cookie Policy.
      </Paragraph>
      <OrderedListMultiNumber>
        <LiMultiNumber>
          <LiTitleNoMarginTop>What are cookies?</LiTitleNoMarginTop>
          <OrderedListMultiNumber>
            <LiMultiNumber>
              Cookies are a feature of web browser software that allows web servers to recognize the
              computer or device used to access a website. A cookie is a small text file that a
              website saves on your computer or mobile device when you visit the site. It enables
              the website to remember your actions and preferences (such as login, language, font
              size and other display preferences) over a period of time, so you don&apos;t have to
              keep re-entering them whenever you come back to the site or browse from one page to
              another.
            </LiMultiNumber>
          </OrderedListMultiNumber>
        </LiMultiNumber>
        <LiMultiNumber>
          <LiTitle>What are the different types of cookies?</LiTitle>
          <OrderedListMultiNumber>
            <LiMultiNumber>
              A cookie can be classified by its lifespan and the domain to which it belongs.
            </LiMultiNumber>
            <LiMultiNumber>
              By lifespan, a cookie is either:
              <OrderedListMultiNumber style={{ marginBottom: '30px', marginTop: '30px' }}>
                <LiMultiNumber>
                  a session cookie which is erased when the user closes the browser; or
                </LiMultiNumber>
                <LiMultiNumber>
                  persistent cookie which is saved to the hard drive and remains on the user&apos;s
                  computer/device for a pre-defined period of time.
                </LiMultiNumber>
              </OrderedListMultiNumber>
            </LiMultiNumber>
            <LiMultiNumber>
              As for the domain to which it belongs, cookies are either:
              <OrderedListMultiNumber style={{ marginBottom: '30px', marginTop: '30px' }}>
                <LiMultiNumber>
                  first-party cookies which are set by the web server of the visited page and share
                  the same domain (i.e. set by us); or
                </LiMultiNumber>
                <LiMultiNumber>
                  third-party cookies stored by a different domain to the visited page&apos;s
                  domain.
                </LiMultiNumber>
              </OrderedListMultiNumber>
            </LiMultiNumber>
          </OrderedListMultiNumber>
        </LiMultiNumber>
        <LiMultiNumber>
          <LiTitle>What cookies do we use and why?</LiTitle>
          <OrderedListMultiNumber>
            <LiMultiNumber>
              third-party cookies stored by a different domain to the visited page&apos;s domain.
            </LiMultiNumber>
            <LiMultiNumber>
              We do not use cookies set by ourselves via our web developers (first-party cookies).
              We only have those set by others (third-party cookies).
            </LiMultiNumber>
            <LiMultiNumber>
              Cookies are also sometimes classified by reference to their purpose. We use the
              following cookies for the following purposes:
              <OrderedListMultiNumber style={{ marginBottom: '30px', marginTop: '30px' }}>
                <LiMultiNumber>
                  Analytical/performance cookies: They allow us to recognize and count the number of
                  visitors and to see how visitors move around our website when they are using it,
                  as well as dates and times they visit. This helps us to improve the way our
                  website works, for example, by ensuring that users are finding what they are
                  looking for easily.
                </LiMultiNumber>
                <LiMultiNumber>
                  Targeting cookies: These cookies record your visit to our website, the pages you
                  have visited and the links you have followed, as well as time spent on our
                  website, and the websites visited just before and just after our website. We will
                  use this information to make our website and the advertising displayed on it more
                  relevant to your interests. We may also share this information with third parties
                  for this purpose.
                </LiMultiNumber>
              </OrderedListMultiNumber>
            </LiMultiNumber>
            <LiMultiNumber>
              In general, we use cookies and other technologies (such as web server logs) on our
              website to enhance your experience and to collect information about how our website is
              used. This information is put together (&apos;aggregated&apos;) and provides general
              and not individually specific information. None of this information is therefore
              associated with you as an individual and the cookie-related information is not used to
              identify you personally. It is therefore anonymized and &apos;de-identified&apos;. The
              pattern data is fully under our control and these cookies are not used for any purpose
              other than those described here.
            </LiMultiNumber>
            <LiMultiNumber>
              We will retain and evaluate information on your recent visits to our website and how
              you move around different sections of our website for analytics purposes to understand
              how people use our website so that we can make it more intuitive. The information also
              helps us to understand which parts of this website are most popular and generally to
              assess user behaviour and characteristics to measure interest in and use of the
              various areas of our website. This then allows us to improve our website and the way
              we market our business.
            </LiMultiNumber>
            <LiMultiNumber>
              This information may also be used to help us to improve, administer and diagnose
              problems with our server and website. The information also helps us monitor traffic on
              our website so that we can manage our website&apos;s capacity and efficiency.
            </LiMultiNumber>
          </OrderedListMultiNumber>
        </LiMultiNumber>
        <LiMultiNumber>
          <LiTitle>Other Technologies</LiTitle>
          <OrderedListMultiNumber>
            <LiMultiNumber>
              We may allow others to provide analytics services and serve advertisements on our
              behalf. In addition to the uses of cookies described above, these entities may use
              other methods, such as the technologies described below, to collect information about
              your use of our website and other websites and online services.
            </LiMultiNumber>
            <LiMultiNumber>
              Pixels tags. Pixel tags (which are also called clear GIFs, web beacons, or pixels),
              are small pieces of code that can be embedded on websites and emails. Pixels tags may
              be used to learn how you interact with our website pages and emails, and this
              information helps us, and our partners provide you with a more tailored experience.
            </LiMultiNumber>
            <LiMultiNumber>
              Device Identifiers. A device identifier is a unique label can be used to identify a
              mobile device. Device identifiers may be used to track, analyze and improve the
              performance of the website and ads delivered.
            </LiMultiNumber>
          </OrderedListMultiNumber>
        </LiMultiNumber>
        <LiMultiNumber>
          <LiTitle>
            What data are collected by cookies and other technologies on our website?
          </LiTitle>
          <OrderedListMultiNumber>
            <LiMultiNumber>
              This information may include:
              <OrderedListMultiNumber style={{ marginBottom: '30px', marginTop: '30px' }}>
                <LiMultiNumber>
                  the IP and logical address of the server you are using (but the last digits are
                  anonymized so we cannot identify you).
                </LiMultiNumber>
                <LiMultiNumber>
                  the top level domain name from which you access the internet (for example .ie,
                  .com, etc)
                </LiMultiNumber>
                <LiMultiNumber>the type of browser you are using,</LiMultiNumber>
                <LiMultiNumber>the date and time you access our website</LiMultiNumber>
                <LiMultiNumber>the internet address linking to our website</LiMultiNumber>
              </OrderedListMultiNumber>
            </LiMultiNumber>
            <LiMultiNumber>
              This website also uses cookies to:
              <OrderedListMultiNumber style={{ marginBottom: '30px', marginTop: '30px' }}>
                <LiMultiNumber>
                  remember you and your actions while navigating between pages;
                </LiMultiNumber>
                <LiMultiNumber>
                  remember if you have agreed (or not) to our use of cookies on our website;
                </LiMultiNumber>
                <LiMultiNumber>ensure the security of the website;</LiMultiNumber>
                <LiMultiNumber>
                  monitor and improve the performance of servers hosting the site;
                </LiMultiNumber>
                <LiMultiNumber>distinguish users and sessions;</LiMultiNumber>
                <LiMultiNumber>
                  Improving the speed of the site when you access content repeatedly;
                </LiMultiNumber>
                <LiMultiNumber>determine new sessions and visits;</LiMultiNumber>
                <LiMultiNumber>
                  show the traffic source or campaign that explains how you may have reached our
                  website; and
                </LiMultiNumber>
                <LiMultiNumber>
                  allow us to store any customization preferences where our website allows this.
                </LiMultiNumber>
              </OrderedListMultiNumber>
            </LiMultiNumber>
            <LiMultiNumber>
              We may also use other services, such as Google Analytics (described below) or other
              third-party cookies, to assist with analyzing performance on our website. As part of
              providing these services, these service providers may use cookies and the technologies
              described below to collect and store information about your device, such as time of
              visit, pages visited, time spent on each page of our website, links clicked and
              conversion information, IP address, browser, mobile network information, and type of
              operating system used.
            </LiMultiNumber>
          </OrderedListMultiNumber>
        </LiMultiNumber>
        <LiMultiNumber>
          <LiTitle>Google Analytics Cookies</LiTitle>
          <OrderedListMultiNumber>
            <LiMultiNumber>
              This website uses{' '}
              <a
                href="https://marketingplatform.google.com/about/analytics/"
                rel="noreferrer"
                target="_blank"
              >
                Google Analytics
              </a>
              , a web analytics service provided by Google, Inc. (&quot;Google&quot;).
            </LiMultiNumber>
            <LiMultiNumber>
              We use Google Analytics to track your preferences and also to identify popular
              sections of our website. Use of Google Analytics in this way, enables us to adapt the
              content of our website more specifically to your needs and thereby improve what we can
              offer to you.
            </LiMultiNumber>
            <LiMultiNumber>
              Google will use this information for the purpose of evaluating your use of our
              website, compiling reports on website activity for website operators and providing
              other services relating to website activity and internet usage. Google may also
              transfer this information to third parties where required to do so by law, or where
              such third parties process the information on Google&apos;s behalf. Google will not
              associate your IP address with any other data held by Google.
            </LiMultiNumber>
            <LiMultiNumber>
              In particular Google Analytics tells us
              <OrderedListMultiNumber style={{ marginBottom: '30px', marginTop: '30px' }}>
                <LiMultiNumber>your IP address (last 3 digits are masked);</LiMultiNumber>
                <LiMultiNumber>the number of pages visited;</LiMultiNumber>
                <LiMultiNumber>the time and duration of the visit;</LiMultiNumber>
                <LiMultiNumber>your location;</LiMultiNumber>
                <LiMultiNumber>the website you came from (if any);</LiMultiNumber>
                <LiMultiNumber>
                  the type of hardware you use (i.e. whether you are browsing from a desktop or a
                  mobile device);
                </LiMultiNumber>
                <LiMultiNumber>the software used (type of browser); and</LiMultiNumber>
                <LiMultiNumber>your general interaction with our website. </LiMultiNumber>
              </OrderedListMultiNumber>
            </LiMultiNumber>
            <LiMultiNumber>
              As stated above, cookie-related information is not used to identify you personally,
              and what is compiled is only aggregate data that tells us, for example, what countries
              we are most popular in, but not that you live in a particular country or your precise
              location when you visited our website (this is because we have only half the
              information- we know the country the person is browsing from, but not the name of
              person who is browsing). In such an example Google will analyze the number of users
              for us, but the relevant cookies do not reveal their identities.
            </LiMultiNumber>
            <LiMultiNumber>
              By using this website, you consent to the processing of data about you by Google in
              the manner and for the purposes set out above. Google Analytics, its purpose and
              function is further explained on the{' '}
              <a
                href="https://marketingplatform.google.com/about/analytics/"
                rel="noreferrer"
                target="_blank"
              >
                Google Analytics website
              </a>
              .
            </LiMultiNumber>
            <LiMultiNumber>
              For more information about Google Analytics cookies, please see Google&apos;s help
              pages and privacy policy:{' '}
              <a href="https://policies.google.com/privacy?hl=en" rel="noreferrer" target="_blank">
                Google&apos;s Privacy Policy
              </a>{' '}
              and{' '}
              <a
                href="https://developers.google.com/analytics/devguides/collection/analyticsjs/cookie-usage"
                rel="noreferrer"
                target="_blank"
              >
                Google Analytics Help pages
              </a>
              . For further information about the use of these cookies by Google{' '}
              <a
                href="https://support.google.com/analytics/answer/6004245"
                rel="noreferrer"
                target="_blank"
              >
                click here.
              </a>
            </LiMultiNumber>
          </OrderedListMultiNumber>
        </LiMultiNumber>
        <LiMultiNumber>
          <LiTitle>
            What if you don&apos;t agree to us monitoring your use of our website (even we
            don&apos;t collect your personal data)?
          </LiTitle>
          <OrderedListMultiNumber>
            <LiMultiNumber>
              Enabling these cookies is not strictly necessary for our website to work but it will
              provide you with a better browsing experience. You can delete or block the cookies we
              set, but if you do that, some features of this website may not work as intended.
            </LiMultiNumber>
            <LiMultiNumber>
              Most browsers are initially set to accept cookies. If you prefer, you can set your
              browser to refuse cookies and control and/or delete cookies as you wish - for details,
              see{' '}
              <a href="https://aboutcookies.org" rel="noreferrer" target="_blank">
                aboutcookies.org
              </a>
              . You can delete all cookies that are already on your device and you can set most
              browsers to prevent them from being placed. You should be aware that if you do this,
              you may have to manually adjust some preferences every time you visit an Internet site
              and some services and functionalities may not work if you do not accept the cookies
              they send.
            </LiMultiNumber>
            <LiMultiNumber>
              Advertisers and business partners that you access on or through our website may also
              send you cookies. We do not control any cookies outside of our website.
            </LiMultiNumber>
            <LiMultiNumber>
              If you have any further questions regarding disabling cookies you should consult with
              your preferred browser&apos;s provider or manufacturer.
            </LiMultiNumber>
            <LiMultiNumber>
              In order to implement your objection it may be necessary to install an opt-out cookie
              on your browser. This cookie will only indicate that you have opted out. It is
              important to note, that for technical reasons, the opt-out cookie will only affect the
              browser from which you actively object from. If you delete the cookies in your browser
              or use a different end device or browser, you will need to opt out again.
            </LiMultiNumber>
            <LiMultiNumber>
              To opt out of being tracked by Google Analytics across all websites, Google have
              developed the Google Analytics opt-out browser add-on. If you would like to opt out of
              Google Analytics, you have the option of downloading and installing this browser
              add-on which can be found under the link:{' '}
              <a href="http://tools.google.com/dlpage/gaoptout" rel="noreferrer" target="_blank">
                http://tools.google.com/dlpage/gaoptout
              </a>
              .
            </LiMultiNumber>
          </OrderedListMultiNumber>
        </LiMultiNumber>
        <LiMultiNumber>
          <LiTitle>Revisions to this Cookie Policy</LiTitle>
          <OrderedListMultiNumber>
            <LiMultiNumber>
              On this website, you can always view the latest version of our Privacy Policy and our
              Cookie Policy. We may modify this Cookie Policy from time to time. If we make changes
              to this Cookie Policy, we will provide notice of such changes, such as by sending an
              email notification, providing notice through our website or updating the &apos;Last
              Updated&apos; date at the beginning of this Cookie Policy. The amended Cookie Policy
              will be effective immediately after the date it is posted. By continuing to access or
              use our website after the effective date, you confirm your acceptance of the revised
              Cookie Policy and all of the terms incorporated therein by reference. We encourage you
              to review our Privacy Policy and our Cookie Policy whenever you access or use our
              website to stay informed about our information practices and the choices available to
              you.
            </LiMultiNumber>
            <LiMultiNumber>
              If you do not accept changes which are made to this Cookie Policy, or take any
              measures described above to opt-out by removing or rejecting cookies, you may continue
              to use this website but accept that it may not display and/or function as intended by
              us. Any social media channels connected to Gnosis Limited and third party applications
              will be subject to the privacy and cookie policies and practices of the relevant
              platform providers which, unless otherwise indicated, are not affiliated or associated
              with Gnosis Limited. Your exercise of any rights to opt-out may also impact how our
              information and content is displayed and/or accessible to you on this website and on
              other websites.
            </LiMultiNumber>
          </OrderedListMultiNumber>
        </LiMultiNumber>
      </OrderedListMultiNumber>
      <Paragraph>
        <strong>APPENDIX</strong>
      </Paragraph>
      <Paragraph>
        <i>Table: Overview of cookies placed and the consequences if the cookies are not placed</i>
      </Paragraph>
      <TableWrapperStyled>
        <StripedTable>
          <THead>
            <TR>
              <TH>
                Name of
                <br />
                cookie
              </TH>
              <TH>Purpose(s) of cookie</TH>
              <TH>
                Storage period
                <br />
                of cookie
              </TH>
              <TH>
                Consequences if cookie
                <br />
                is not accepted
              </TH>
            </TR>
          </THead>
          <TBody>
            <TR>
              <TD>__utma</TD>
              <TD>
                Used to distinguish users and sessions. The cookie is created when the javascript
                library executes and no existing __utma cookies exists. The cookie is updated every
                time data is sent to Google Analytics.
              </TD>
              <TD>2 years from set/update</TD>
              <TD>User activity won&apos;t be tracked</TD>
            </TR>
            <TR>
              <TD>__utmt</TD>
              <TD>Used to throttle request rate.</TD>
              <TD>10 minutes</TD>
              <TD>User activity won&apos;t be tracked</TD>
            </TR>
            <TR>
              <TD>__utmb</TD>
              <TD>
                Used to determine new sessions/visits. The cookie is created when the javascript
                library executes and no existing __utmb cookies exists. The cookie is updated every
                time data is sent to Google Analytics.
              </TD>
              <TD>30 mins from set/update</TD>
              <TD>User activity won&apos;t be tracked</TD>
            </TR>
            <TR>
              <TD>__utmv</TD>
              <TD>
                Used to store visitor-level custom variable data. This cookie is created when a
                developer uses the _setCustomVar method with a visitor level custom variable. This
                cookie was also used for the deprecated _setVar method. The cookie is updated every
                time data is sent to Google Analytics.
              </TD>
              <TD>2 years from set/update</TD>
              <TD>User activity won&apos;t be tracked</TD>
            </TR>
            <TR>
              <TD>__utmc</TD>
              <TD>
                Historically, this cookie operated in conjunction with the __utmb cookie to
                determine whether the user was in a new session/visit.
              </TD>
              <TD>End of browser session</TD>
              <TD>User activity won&apos;t be tracked</TD>
            </TR>
          </TBody>
        </StripedTable>
      </TableWrapperStyled>
    </>
  )
}
