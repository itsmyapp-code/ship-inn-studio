export const metadata = {
  title: 'Cookie Policy - The Ship Inn Porlock Weir',
  description: 'How The Ship Inn Porlock Weir uses cookies, what types are used, and how to manage your preferences.',
}

export default function CookiesPage() {
  return (
    <div className="min-h-screen">
      <section className="relative h-48 bg-gray-800 flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-2">Cookie Policy</h1>
          <p className="text-lg text-gray-300">Last updated: July 2025</p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 prose prose-gray max-w-none">

          <h2>What Are Cookies?</h2>
          <p>
            Cookies are small text files placed on your device by a website. They help websites remember
            your preferences, maintain your session, and understand how the site is being used.
            This policy explains exactly which cookies we use and why.
          </p>

          <h2>1. Necessary Cookies — Always Active</h2>
          <p>
            These cookies are essential for the website to function correctly. They cannot be switched
            off, as they are required for basic operations such as security and session validation.
            They do not collect any information that could be used to identify you or track your
            browsing outside our site.
          </p>
          <table>
            <thead>
              <tr>
                <th>Cookie Name</th>
                <th>Purpose</th>
                <th>Duration</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>cookie_consent</code></td>
                <td>Stores your cookie preference (accepted / rejected)</td>
                <td>1 year (localStorage)</td>
              </tr>
              <tr>
                <td>Session identifiers</td>
                <td>Maintains a secure browsing session</td>
                <td>Session only</td>
              </tr>
            </tbody>
          </table>

          <h2>2. Performance Cookies — Optional (Consent Required)</h2>
          <p>
            These cookies collect anonymous information about how visitors use our website — for
            example, which pages are visited most often and whether error messages appear. The
            information is aggregated and cannot be used to identify individual visitors. We use
            this data solely to improve the performance of our site.
          </p>
          <p>
            Under the Data (Use and Access) Act (DUAA), first-party anonymous performance analytics
            may be carried out under a recognised exemption, <strong>provided</strong> a clear and
            easily accessible opt-out mechanism is available. You can withdraw your consent at any
            time by clicking "Reject Non-Essential" in the cookie banner (available via the footer
            link below) or by clearing your browser storage.
          </p>
          <table>
            <thead>
              <tr>
                <th>Provider</th>
                <th>Purpose</th>
                <th>Opt-Out</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Analytics (if enabled)</td>
                <td>Anonymous page view and interaction tracking</td>
                <td>Reject via cookie banner</td>
              </tr>
            </tbody>
          </table>

          <h2>3. Marketing & Third-Party Tracking Cookies — Strictly Opt-In</h2>
          <p>
            We do <strong>not</strong> load any third-party marketing, advertising, or social media
            tracking cookies unless you have explicitly accepted them. These cookies would be used to
            build a profile of your interests and show relevant advertising elsewhere.
          </p>
          <p>
            Currently, no marketing cookies are active on this site. If this changes in future, this
            policy will be updated and your explicit consent will be sought before any such cookies
            are loaded.
          </p>

          <h2>Managing Your Cookie Preferences</h2>
          <p>You can change or withdraw your cookie preferences at any time:</p>
          <ul>
            <li>
              <strong>Via our cookie banner:</strong> If you previously made a choice, clear your
              browser&apos;s local storage for this site and reload the page — the banner will reappear.
            </li>
            <li>
              <strong>Via your browser:</strong> Most browsers allow you to block or delete cookies
              through their settings. Note that blocking necessary cookies may affect site functionality.
            </li>
          </ul>
          <p>Links to browser-specific cookie settings:</p>
          <ul>
            <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer">Google Chrome</a></li>
            <li><a href="https://support.mozilla.org/en-US/kb/cookies-information-websites-store-on-your-computer" target="_blank" rel="noopener noreferrer">Mozilla Firefox</a></li>
            <li><a href="https://support.apple.com/en-gb/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer">Apple Safari</a></li>
            <li><a href="https://support.microsoft.com/en-us/windows/delete-and-manage-cookies-168dab11-0753-043d-7c16-ede5947fc64d" target="_blank" rel="noopener noreferrer">Microsoft Edge</a></li>
          </ul>

          <h2>Contact</h2>
          <p>
            If you have any questions about our use of cookies, please contact our Data Privacy Lead
            at <a href="mailto:hello@theshipinnporlockweir.co.uk">hello@theshipinnporlockweir.co.uk</a>.
          </p>

        </div>
      </section>

      <section className="py-10 bg-gray-50 border-t border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-600 mb-4">Questions about cookies or your data preferences?</p>
          <a
            href="mailto:hello@theshipinnporlockweir.co.uk"
            className="inline-block bg-blue-900 hover:bg-blue-800 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
          >
            Contact our Data Privacy Lead
          </a>
        </div>
      </section>
    </div>
  )
}
