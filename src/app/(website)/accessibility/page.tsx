export const metadata = {
  title: 'Accessibility Statement - The Ship Inn Porlock Weir',
  description: 'Our commitment to digital and physical accessibility at The Ship Inn Porlock Weir.',
}

export default function AccessibilityPage() {
  return (
    <div className="min-h-screen">
      <section className="relative h-48 bg-gray-800 flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-2">Accessibility Statement</h1>
          <p className="text-lg text-gray-300">Last updated: July 2025</p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 prose prose-gray max-w-none">

          <h2>Our Commitment</h2>
          <p>
            The Ship Inn Porlock Weir is committed to ensuring that our website is accessible to as
            many people as possible. We aim to conform to the{' '}
            <strong>Web Content Accessibility Guidelines (WCAG) 2.1 Level AA</strong> standard.
            This statement applies to the website at <strong>theshipinnporlockweir.co.uk</strong>.
          </p>

          <h2>Digital Accessibility — What We Have Done</h2>
          <ul>
            <li><strong>Keyboard navigation:</strong> All interactive elements (links, buttons, form fields) are accessible via keyboard tabbing in a logical order</li>
            <li><strong>Colour contrast:</strong> Text and interactive elements meet or exceed the WCAG 2.1 Level AA minimum contrast ratio of 4.5:1</li>
            <li><strong>Semantic HTML:</strong> We use a clear heading hierarchy (H1 → H2 → H3) and appropriate HTML5 landmark elements (<code>nav</code>, <code>main</code>, <code>footer</code>, etc.) to assist screen readers</li>
            <li><strong>Image alt text:</strong> All meaningful images have descriptive alt text; decorative images are marked as presentational</li>
            <li><strong>ARIA labels:</strong> Interactive controls that lack visible text labels include <code>aria-label</code> attributes for screen reader users</li>
            <li><strong>Responsive design:</strong> The site adapts to all screen sizes including text resizing up to 200% without loss of functionality</li>
            <li><strong>Focus indicators:</strong> Visible focus styles are applied to all focusable elements</li>
            <li><strong>Form labels:</strong> All form inputs have associated labels and error messages are clearly communicated</li>
          </ul>

          <h2>Known Limitations</h2>
          <p>
            We are continually working to improve accessibility. Currently known limitations include:
          </p>
          <ul>
            <li>Some older PDF menus may not be fully accessible to screen readers — we are working to provide accessible alternatives</li>
            <li>Third-party embedded maps may not be fully keyboard operable — address and directions text is provided as an alternative</li>
          </ul>
          <p>
            If you encounter any accessibility issue not listed here, please contact us so we can address it.
          </p>

          <h2>Physical Accessibility — The Ship Inn</h2>
          <p>
            The Ship Inn is a historic building and some areas present physical constraints. However,
            we are committed to making your visit as comfortable as possible:
          </p>
          <ul>
            <li>Step-free access to the ground floor restaurant, bar, and outdoor terrace</li>
            <li>Accessible toilet facilities on the ground floor</li>
            <li>A ground floor bedroom is available (subject to availability — please request at time of booking)</li>
            <li>Staff are trained to assist guests with mobility needs and are happy to help</li>
            <li>The historic nature of the building means some upper floor areas are only accessible via stairs — please contact us in advance to discuss your specific requirements</li>
          </ul>

          <h2>Reporting Accessibility Problems</h2>
          <p>
            If you experience any difficulty accessing any part of our website or have suggestions for
            improvement, we want to know. Please contact us:
          </p>
          <ul>
            <li>
              <strong>Email:</strong>{' '}
              <a href="mailto:hello@theshipinnporlockweir.co.uk">hello@theshipinnporlockweir.co.uk</a>
            </li>
            <li>
              <strong>Telephone:</strong> 01643 863288
            </li>
          </ul>
          <p>We aim to respond to accessibility feedback within 5 working days.</p>

          <h2>Enforcement</h2>
          <p>
            If you are not satisfied with our response, you can contact the{' '}
            <a href="https://www.equalityhumanrights.com/en/contact-us" target="_blank" rel="noopener noreferrer">
              Equality and Human Rights Commission (EHRC)
            </a>{' '}
            if you live in England, Scotland or Wales.
          </p>

          <h2>Technical Specification</h2>
          <p>
            This website relies on the following technologies for conformance with WCAG 2.1 Level AA:
          </p>
          <ul>
            <li>HTML5</li>
            <li>CSS3</li>
            <li>JavaScript (React/Next.js)</li>
          </ul>

        </div>
      </section>

      <section className="py-10 bg-gray-50 border-t border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-600 mb-4">Found an accessibility issue? Please let us know.</p>
          <a
            href="mailto:hello@theshipinnporlockweir.co.uk"
            className="inline-block bg-blue-900 hover:bg-blue-800 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
          >
            Report an accessibility issue
          </a>
        </div>
      </section>
    </div>
  )
}
