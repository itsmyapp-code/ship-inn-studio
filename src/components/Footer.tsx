import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact us</h3>
            <div className="space-y-2 text-gray-300">
              <p>Porlock Weir</p>
              <p>Minehead, Somerset</p>
              <p>TA24 8PB</p>
              <p>Tel: 01643 863288</p>
              <p>Email: hello@theshipinnporlockweir.co.uk</p>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <div className="space-y-2">
              <Link href="/rooms" className="block text-gray-300 hover:text-white transition-colors">
                From the Cabins
              </Link>
              <Link href="/food-drink" className="block text-gray-300 hover:text-white transition-colors">
                From the Galley & Saloon
              </Link>
              <Link href="/things-to-do" className="block text-gray-300 hover:text-white transition-colors">
                Things to do
              </Link>
              <Link href="/contact" className="block text-gray-300 hover:text-white transition-colors">
                Contact us
              </Link>
            </div>
          </div>

          {/* About */}
          <div className="space-y-4 md:col-span-2">
            <h3 className="text-lg font-semibold">The Ship Inn</h3>
            <p className="text-gray-300 text-sm">
              Historic pub and B&B in the heart of Porlock Weir, offering comfortable accommodation 
              and excellent food in one of Somerset's most beautiful coastal villages.
            </p>
            <div className="flex space-x-4">
              <a href="https://www.facebook.com/profile.php?id=61581183853636" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                <span className="sr-only">Facebook</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              © 2024 The Ship Inn Porlock Weir. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link href="/legal" className="text-gray-400 hover:text-white text-sm transition-colors">
                Privacy Policy
              </Link>
              <Link href="/legal" className="text-gray-400 hover:text-white text-sm transition-colors">
                Terms of Service
              </Link>
              <Link href="/legal" className="text-gray-400 hover:text-white text-sm transition-colors">
                Accessibility
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}