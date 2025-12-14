import NewsletterForm from '@/components/NewsletterForm'

export default async function Page() {
  // Placeholder data until Outstatic is integrated
  const upcomingEvents: any[] = []
  const finalNews: any[] = []

  return (
    <div className="max-w-6xl mx-auto p-6 grid md:grid-cols-3 gap-12">
      <div className="md:col-span-2 space-y-12">
        <section>
          <h2 className="text-3xl font-bold mb-6">Upcoming Events</h2>
          {upcomingEvents.length === 0 ? <p className="text-gray-500">No upcoming events.</p> : (
            <div className="grid gap-6">
              {/* Events will be rendered here */}
            </div>
          )}
        </section>

        <section>
          <h2 className="text-3xl font-bold mb-6">Latest News</h2>
          {finalNews.length === 0 ? <p className="text-gray-500">No news updates yet.</p> : (
             <div className="grid gap-6">
              {/* News will be rendered here */}
            </div>
          )}
        </section>
      </div>

      <aside className="md:col-span-1">
        <div className="sticky top-10">
          <h3 className="text-xl font-bold mb-4">Stay in the loop</h3>
          <p className="mb-4 text-gray-600">Join our mailing list for exclusive offers and event announcements.</p>
          <NewsletterForm />
        </div>
      </aside>
    </div>
  )
}
