import Link from 'next/link'

export const metadata = {
  title: 'Legal - The Ship Inn Porlock Weir',
  description: 'Privacy Policy, Terms of Service, Accessibility Statement, and Cookie Policy for The Ship Inn Porlock Weir website.',
}

const legalLinks = [
  {
    title: 'Privacy Policy',
    description: 'How we collect, use, and protect your personal data under UK GDPR.',
    href: '/privacy',
  },
  {
    title: 'Terms of Service',
    description: 'Terms and conditions governing use of our website and services.',
    href: '/terms',
  },
  {
    title: 'Cookie Policy',
    description: 'Which cookies we use, why, and how to manage your preferences.',
    href: '/cookies',
  },
  {
    title: 'Accessibility Statement',
    description: 'Our digital and physical accessibility commitments and known limitations.',
    href: '/accessibility',
  },
]

export default function LegalPage() {
  return (
    <div className="min-h-screen">
      <section className="relative h-48 bg-gray-800 flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-2">Legal Information</h1>
          <p className="text-lg text-gray-300">Privacy, Terms, Cookies & Accessibility</p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-gray-600 text-lg mb-10">
            Select a document below to read our full policies.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {legalLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block p-6 border border-gray-200 rounded-xl hover:border-blue-400 hover:shadow-md transition-all group"
              >
                <h2 className="text-xl font-semibold text-gray-900 group-hover:text-blue-900 mb-2">
                  {item.title}
                </h2>
                <p className="text-gray-500 text-sm">{item.description}</p>
              </Link>
            ))}
          </div>

          <div className="mt-12 p-6 bg-gray-50 rounded-xl border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Data Privacy & Compliance</h2>
            <p className="text-gray-600 text-sm">
              For any questions regarding your data rights, or to submit an inquiry, please contact our
              Data Privacy Lead directly at{' '}
              <a href="mailto:hello@theshipinnporlockweir.co.uk" className="text-blue-700 hover:underline">
                hello@theshipinnporlockweir.co.uk
              </a>
              . We formally acknowledge all compliance submissions within 30 days.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
