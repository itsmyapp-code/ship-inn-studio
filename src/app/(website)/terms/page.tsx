export const metadata = {
  title: 'Terms of Service - The Ship Inn Porlock Weir',
  description: 'Terms and conditions governing use of The Ship Inn Porlock Weir website and accommodation, restaurant and pub services.',
}

export default function TermsPage() {
  return (
    <div className="min-h-screen">
      <section className="relative h-48 bg-gray-800 flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-2">Terms of Service</h1>
          <p className="text-lg text-gray-300">Last updated: July 2025</p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 prose prose-gray max-w-none">

          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing or using the website at <strong>theshipinnporlockweir.co.uk</strong> (the
            "Site"), you agree to be bound by these Terms of Service. If you do not agree to these
            terms, please do not use the Site. Your continued use of the Site following any updates
            to these terms constitutes acceptance of those changes.
          </p>

          <h2>2. User Responsibilities</h2>
          <p>You are responsible for:</p>
          <ul>
            <li>Maintaining the confidentiality of any account credentials or session tokens associated with your use of the Site</li>
            <li>All activity that occurs under your session or using your details</li>
            <li>Ensuring that any information you provide to us is accurate and up to date</li>
            <li>Using the Site only for lawful purposes and in accordance with these terms</li>
          </ul>

          <h2>3. Booking Terms</h2>
          <ul>
            <li>All reservations are subject to availability at the time of booking</li>
            <li>A deposit or full payment may be required to secure your booking — this will be stated clearly at the point of reservation</li>
            <li>Check-in time is <strong>3:00 PM</strong>. Check-out time is <strong>11:00 AM</strong></li>
            <li>Early check-in and late check-out may be available subject to availability — please contact us in advance</li>
            <li>Cancellation terms applicable to your booking will be communicated at the time of reservation. Please read these carefully before confirming</li>
            <li>Group bookings (3 or more rooms) may be subject to separate terms — please contact us directly</li>
          </ul>

          <h2>4. House Rules</h2>
          <ul>
            <li>Smoking is prohibited in all indoor areas of the property</li>
            <li>Well-behaved pets are welcome by prior arrangement — please inform us at the time of booking</li>
            <li>Guests are expected to respect the comfort and quiet of other guests. Quiet hours apply after <strong>10:00 PM</strong></li>
            <li>Any damage caused to property, fixtures or fittings during your stay will be charged to the responsible party</li>
            <li>The Ship Inn reserves the right to refuse service or accommodation to any individual whose behaviour is deemed inappropriate or disruptive</li>
          </ul>

          <h2>5. Suspension & Termination</h2>
          <p>
            We reserve the right to immediately suspend or terminate access to the Site, or to cancel a
            reservation, in the event that a user's conduct breaches these terms, violates applicable law,
            constitutes abusive or fraudulent use, or poses a security risk to our systems or other users.
          </p>

          <h2>6. Intellectual Property</h2>
          <p>
            All content on this Site — including text, photographs, graphics, logos, and design — is the
            property of The Ship Inn Porlock Weir or its licensors and is protected by UK copyright law.
            You may not reproduce, distribute, or use any content without prior written permission.
          </p>

          <h2>7. Third-Party Links</h2>
          <p>
            The Site may contain links to third-party websites (for example, booking platforms or local
            attractions). We have no control over the content of those sites and accept no responsibility
            for them or for any loss or damage arising from your use of them.
          </p>

          <h2>8. Limitation of Liability</h2>
          <p>
            While we take every reasonable care to ensure the safety and comfort of all guests, The Ship
            Inn cannot be held liable for:
          </p>
          <ul>
            <li>Personal injury, loss, or damage to personal property except where caused directly by our negligence</li>
            <li>Any loss arising from circumstances beyond our reasonable control (including but not limited to extreme weather, utility failures, or public health events)</li>
            <li>The accuracy or availability of information on third-party websites linked from our Site</li>
          </ul>
          <p>
            Nothing in these terms limits or excludes our liability for death or personal injury caused
            by our negligence, or for fraud or fraudulent misrepresentation, or for any other liability
            that cannot be excluded by law.
          </p>

          <h2>9. Governing Law</h2>
          <p>
            These terms are governed by the laws of England and Wales. Any disputes arising from your
            use of the Site or our services shall be subject to the exclusive jurisdiction of the courts
            of England and Wales.
          </p>

          <h2>10. Contact</h2>
          <p>
            For questions about these terms, contact us at{' '}
            <a href="mailto:hello@theshipinnporlockweir.co.uk">hello@theshipinnporlockweir.co.uk</a>{' '}
            or call 01643 863288.
          </p>

        </div>
      </section>

      <section className="py-10 bg-gray-50 border-t border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-600 mb-4">Questions about our terms?</p>
          <a
            href="mailto:hello@theshipinnporlockweir.co.uk"
            className="inline-block bg-blue-900 hover:bg-blue-800 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
          >
            Get in touch
          </a>
        </div>
      </section>
    </div>
  )
}
