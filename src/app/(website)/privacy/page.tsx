export const metadata = {
  title: 'Privacy Policy - The Ship Inn Porlock Weir',
  description: 'How The Ship Inn Porlock Weir collects, uses, and protects your personal data under UK GDPR.',
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen">
      <section className="relative h-48 bg-gray-800 flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-2">Privacy Policy</h1>
          <p className="text-lg text-gray-300">Last updated: July 2025</p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 prose prose-gray max-w-none">

          <h2>1. Who We Are</h2>
          <p>
            The Ship Inn Porlock Weir is operated by The Ship Inn (Porlock Weir) Ltd, Porlock Weir,
            Minehead, Somerset, TA24 8PB. We are the data controller for personal data collected
            through this website and in connection with our accommodation, restaurant and pub services.
          </p>
          <p>
            <strong>Data Privacy Lead:</strong> hello@theshipinnporlockweir.co.uk
          </p>

          <h2>2. What Data We Collect</h2>
          <p>We collect the following categories of personal data:</p>
          <ul>
            <li><strong>Identity data:</strong> Name, title</li>
            <li><strong>Contact data:</strong> Email address, telephone number, postal address</li>
            <li><strong>Booking data:</strong> Reservation dates, room preferences, dietary requirements, special requests</li>
            <li><strong>Technical data:</strong> IP address, browser type, device type, pages visited, time on site</li>
            <li><strong>Communication data:</strong> Records of emails, enquiries or messages sent to us</li>
          </ul>

          <h2>3. How We Use Your Data</h2>
          <table>
            <thead>
              <tr>
                <th>Purpose</th>
                <th>Legal Basis</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Processing and confirming bookings</td>
                <td>Contract performance</td>
              </tr>
              <tr>
                <td>Responding to enquiries</td>
                <td>Legitimate interest</td>
              </tr>
              <tr>
                <td>Sending booking confirmations and updates</td>
                <td>Contract performance</td>
              </tr>
              <tr>
                <td>Improving website performance</td>
                <td>Legitimate interest</td>
              </tr>
              <tr>
                <td>Fraud detection and system security</td>
                <td>Legitimate interest (no balancing test required under DUAA)</td>
              </tr>
              <tr>
                <td>Infrastructure defence and fault repair</td>
                <td>Legitimate interest (no balancing test required under DUAA)</td>
              </tr>
              <tr>
                <td>Optional analytics (with consent)</td>
                <td>Consent</td>
              </tr>
              <tr>
                <td>Complying with legal obligations</td>
                <td>Legal obligation</td>
              </tr>
            </tbody>
          </table>

          <h2>4. Cookies & Analytics</h2>
          <p>
            We use cookies for essential website function and, only with your explicit consent, for
            anonymous performance analytics. No third-party tracking or advertising cookies are loaded
            without your opt-in. See our <a href="/cookies">Cookie Policy</a> for full details.
          </p>

          <h2>5. Data Sharing</h2>
          <p>
            We do not sell your personal data. We may share it with:
          </p>
          <ul>
            <li>Payment processors, solely to complete a transaction</li>
            <li>Email delivery providers, to send booking confirmations</li>
            <li>Legal authorities, where required by law</li>
          </ul>
          <p>All third parties are contractually required to protect your data to the same standard we apply.</p>

          <h2>6. Retention</h2>
          <p>
            Booking records are retained for 7 years for tax and legal compliance purposes.
            Enquiry data is retained for 12 months unless you request earlier deletion.
            Technical log data is retained for a maximum of 90 days.
          </p>

          <h2>7. Your Rights</h2>
          <p>Under UK GDPR you have the right to:</p>
          <ul>
            <li><strong>Access</strong> — request a copy of your personal data (Subject Access Request)</li>
            <li><strong>Rectification</strong> — correct inaccurate data</li>
            <li><strong>Erasure</strong> — request deletion where there is no lawful reason to retain it</li>
            <li><strong>Restriction</strong> — limit how we process your data in certain circumstances</li>
            <li><strong>Portability</strong> — receive your data in a portable format</li>
            <li><strong>Object</strong> — object to processing based on legitimate interest</li>
            <li><strong>Withdraw consent</strong> — at any time where processing is based on consent</li>
          </ul>

          <h2>8. Subject Access Requests (SARs)</h2>
          <p>
            To exercise any of the above rights, contact our Data Privacy Lead at{' '}
            <a href="mailto:hello@theshipinnporlockweir.co.uk">hello@theshipinnporlockweir.co.uk</a>.
            We will acknowledge your request within 5 working days and respond within 30 days.
            This period may be extended by a further two months where requests are complex or numerous;
            we will notify you if this applies. We may pause the clock to verify your identity or seek
            clarification on your request.
          </p>

          <h2>9. Complaints & ICO Escalation</h2>
          <p>
            If you are unhappy with how we have handled your data, you have the right to lodge a
            complaint with the Information Commissioner's Office (ICO):
          </p>
          <ul>
            <li>Website: <a href="https://ico.org.uk/make-a-complaint/" target="_blank" rel="noopener noreferrer">ico.org.uk/make-a-complaint</a></li>
            <li>Telephone: 0303 123 1113</li>
          </ul>
          <p>We would, however, appreciate the opportunity to address your concerns directly before you escalate to the ICO.</p>

          <h2>10. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. Material changes will be notified
            via a notice on our website. The date at the top of this page shows when it was last revised.
          </p>

        </div>
      </section>

      <section className="py-10 bg-gray-50 border-t border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-600 mb-4">Questions about this policy?</p>
          <a
            href="mailto:hello@theshipinnporlockweir.co.uk"
            className="inline-block bg-blue-900 hover:bg-blue-800 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
          >
            Email our Data Privacy Lead
          </a>
        </div>
      </section>
    </div>
  )
}
