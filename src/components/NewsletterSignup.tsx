export default function NewsletterSignup() {
  return (
    <section className="py-16 bg-gradient-to-r from-blue-600 to-blue-800">
      <div className="max-w-4xl mx-auto text-center px-6">
        <h2 className="text-3xl font-bold text-white mb-4">
          Stay Connected with The Ship Inn
        </h2>
        <p className="text-xl text-blue-100 mb-8">
          Get the latest news, special offers, and events delivered to your inbox
        </p>
        
        <form className="max-w-md mx-auto">
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="email"
              placeholder="Enter your email address"
              required
              className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              type="submit"
              className="bg-yellow-400 hover:bg-yellow-500 text-blue-900 px-8 py-3 rounded-lg font-bold transition-colors duration-200 whitespace-nowrap"
            >
              Subscribe
            </button>
          </div>
          <p className="text-blue-200 text-sm mt-4">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </form>
      </div>
    </section>
  )
}