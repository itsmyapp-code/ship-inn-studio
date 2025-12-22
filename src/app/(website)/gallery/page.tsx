
import ImageGallery from '@/components/ImageGallery'

export const metadata = {
  title: 'Gallery - The Ship Inn Porlock Weir',
  description: 'Explore our photo gallery showcasing The Ship Inn, our comfortable rooms, delicious food, and the beautiful Porlock Weir location.',
}

export default function GalleryPage() {
  // All actual images from your uploaded files
  const allImages = [
    // Exterior Images
    {
      src: '/images/exterior/ship-inn-front-view.png',
      alt: 'The Ship Inn - Front View',
      category: 'Exterior',
      caption: 'The historic Ship Inn welcomes you to Porlock Weir'
    },
    {
      src: '/images/exterior/shipinn-003.jpg',
      alt: 'The Ship Inn - Exterior View',
      category: 'Exterior',
      caption: 'The Ship Inn at Porlock Weir'
    },
    {
      src: '/images/exterior/shipinn-017.jpg',
      alt: 'The Ship Inn - Another View',
      category: 'Exterior',
      caption: 'Beautiful exterior of The Ship Inn'
    },
    
    // Room Images  
    {
      src: '/images/rooms/harbour-room-bed01.png',
      alt: 'The Harbour Room - Comfortable King-size Bed',
      category: 'Rooms',
      caption: 'Spacious Harbour Room with king-size bed and harbour views'
    },
    {
      src: '/images/rooms/harbour-room-bed02.png',
      alt: 'The Harbour Room - Alternative View',
      category: 'Rooms',
      caption: 'Another angle of our most popular room'
    },
    
    // Interior Images
    {
      src: '/images/interior/bar-area.png',
      alt: 'The Ship Inn Bar Area',
      category: 'Interior',
      caption: 'Traditional bar area with maritime charm and local ales'
    },
    
    // Location Images
    {
      src: '/images/location/porlock-weir-harbour.png',
      alt: 'Porlock Weir Harbour',
      category: 'Location',
      caption: 'Beautiful Porlock Weir harbour, just steps from our door'
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
            Pictures can only tell part of the story. Book your stay to experience The Ship Inn's unique charm yourself.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="bg-white hover:bg-gray-100 text-ship-blue-600 px-8 py-3 rounded-lg font-semibold transition-colors"
            >
              Book Your Stay
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
