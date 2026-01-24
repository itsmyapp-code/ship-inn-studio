
import ImageGallery from '@/components/ImageGallery'

export const metadata = {
  title: 'Gallery - The Ship Inn Porlock Weir',
  description: 'Explore our photo gallery showcasing The Ship Inn, our comfortable rooms, delicious food, and the beautiful Porlock Weir location.',
}

export default function GalleryPage() {
  // All actual images from your uploaded files
  const allImages = [
    // Exterior
    {
      src: '/images/exterior/shipinn-011.webp',
      alt: 'The Ship Inn - Day View',
      category: 'Exterior',
      caption: 'The historic Ship Inn by day'
    },
    {
      src: '/images/exterior/shipinn-012.webp',
      alt: 'The Ship Inn - Side View',
      category: 'Exterior',
      caption: 'The Ship Inn at Porlock Weir'
    },

    // Food & Drink
    {
      src: '/images/interior/shipinn-207.webp',
      alt: 'Delicious Dish',
      category: 'Food & Drink',
      caption: 'Seasonal dishes prepared with local ingredients'
    },
    {
      src: '/images/interior/shipinn-213.webp',
      alt: 'Food Detail',
      category: 'Food & Drink',
      caption: 'Culinary delights at The Ship Inn'
    },
    {
      src: '/images/interior/shipinn-216.webp',
      alt: 'Bar Selection',
      category: 'Food & Drink',
      caption: 'A wide selection of drinks'
    },
    {
      src: '/images/interior/shipinn-250.webp',
      alt: 'Fresh Food',
      category: 'Food & Drink',
      caption: 'Freshly prepared food'
    },

    // Atmosphere
    {
      src: '/images/interior/shipinn-238.webp',
      alt: 'Restaurant Atmosphere',
      category: 'Atmosphere',
      caption: 'Warm and welcoming dining area'
    },
    {
      src: '/images/interior/shipinn-223.webp',
      alt: 'Cozy Corner',
      category: 'Atmosphere',
      caption: 'Relax in our cozy corners'
    },
    {
      src: '/images/interior/shipinn-204.webp',
      alt: 'Fireplace',
      category: 'Atmosphere',
      caption: 'Atmospheric setting'
    },

    // Rooms (Keeping existing rooms as they are valuable content)
    {
      src: '/images/rooms/shipinn-029.webp',
      alt: 'Guest Room 1',
      category: 'Rooms',
      caption: 'Comfortable and beautifully appointed guest rooms'
    },
    {
      src: '/images/rooms/shipinn-035.webp',
      alt: 'Guest Room 2',
      category: 'Rooms',
      caption: 'Relaxing spaces for your stay'
    },
    {
      src: '/images/rooms/shipinn-051.webp',
      alt: 'Guest Room 3',
      category: 'Rooms',
      caption: 'Traditional charm with modern comfort'
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-64 bg-ship-green-600 flex items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Gallery</h1>
          <p className="text-xl">Discover The Ship Inn through our photo collection</p>
        </div>
      </section>

      {/* Featured Image - Using actual Ship Inn front view */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">The Ship Inn Porlock Weir</h2>
            <p className="text-lg text-gray-600">Historic charm meets modern comfort</p>
          </div>
          <div className="relative">
            <img
              src="/images/exterior/ship-inn-front-view.png"
              alt="The Ship Inn Porlock Weir"
              className="w-full h-96 object-cover rounded-lg mb-8"
            />
          </div>
          <p className="text-center text-gray-600">
            Our historic inn sits at the heart of Porlock Weir, just steps from the harbour and coastal paths
          </p>
        </div>
      </section>

      {/* Main Gallery */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Photo Gallery</h2>
            <p className="text-lg text-gray-600">Browse our collection of images showcasing The Ship Inn experience</p>
          </div>

          <ImageGallery images={allImages} />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-ship-blue-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-4">Experience It In Person</h2>
          <p className="text-xl text-blue-100 mb-8">
            Pictures can only tell part of the story. Visit us to experience The Ship Inn's unique charm yourself.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="bg-white hover:bg-gray-100 text-ship-blue-600 px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Contact us
            </a>
            <a
              href="/rooms"
              className="bg-transparent border-2 border-white hover:bg-white hover:text-ship-blue-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              From the Cabins
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
