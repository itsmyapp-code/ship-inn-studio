
import ImageGallery from '@/components/ImageGallery'
import Image from 'next/image'
import { getPageData } from '@/lib/outstatic'
import { getDocuments } from 'outstatic/server'

export const metadata = {
  title: 'Gallery - The Ship Inn Porlock Weir',
  description: 'Explore our photo gallery showcasing The Ship Inn, our comfortable rooms, delicious food, and the beautiful Porlock Weir location.',
}

export default function GalleryPage() {
  // Fetch all images from the Outstatic gallery collection, including the markdown body content
  const documents = getDocuments('gallery', ['title', 'coverImage', 'category', 'description', 'status', 'content'])
  
  // Array to hold all flattened images
  const allImages: { src: string; alt: string; category: string; caption: string }[] = []

  // Helper to normalize user-typed categories from the CMS text box
  const normalizeCategory = (cat: string) => {
    if (!cat) return 'Other'
    const lower = cat.trim().toLowerCase()
    if (lower.includes('food') || lower.includes('drink')) return 'Food & Drink'
    if (lower.includes('exterior') || lower.includes('outside')) return 'Exterior'
    if (lower.includes('interior') || lower.includes('inside') || lower.includes('bar')) return 'Interior'
    if (lower.includes('room') || lower.includes('cabin')) return 'Rooms'
    if (lower.includes('surround') || lower.includes('location')) return 'Surroundings'
    
    // Capitalize first letters for anything else they type
    return cat.trim().split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ')
  }

  // Helper to ensure URLs have exactly one leading slash (fixes Outstatic's double slash bug)
  const formatUrl = (url: string) => url.replace(/^\/+/, '/');

  // Filter for published documents and extract images
  documents.filter(doc => doc.status === 'published').forEach(doc => {
    const category = normalizeCategory(doc.category as string)
    
    // 1. Add the main cover image if it exists
    if (doc.coverImage) {
      allImages.push({
        src: formatUrl(doc.coverImage),
        alt: doc.title || '',
        category: category,
        caption: doc.description || ''
      })
    }
    
    // 2. Extract any additional images dropped into the markdown content body
    if (doc.content) {
      const imageRegex = /!\[(.*?)\]\((.*?)\)/g;
      let match;
      while ((match = imageRegex.exec(doc.content)) !== null) {
        const altText = match[1] || doc.title || '';
        const srcUrl = match[2];
        
        // Prevent duplicating the coverImage if they accidentally inserted it into the body too
        if (srcUrl !== doc.coverImage) {
          allImages.push({
            src: formatUrl(srcUrl),
            alt: altText,
            category: category,
            caption: doc.description || ''
          });
        }
      }
    }
  })

  const pageData = getPageData('gallery')
  const heroImage = pageData?.coverImage
  const heroAlt = pageData?.heroAlt || 'The Ship Inn Bar Area'

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-64 bg-ship-green-600 flex items-center justify-center overflow-hidden">
        {heroImage && (
          <>
            <Image
              src={heroImage}
              alt={heroAlt}
              fill
              priority
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/40"></div>
          </>
        )}
        <div className="relative z-10 text-center text-white">
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
              src="/images/ship-inn-front-view.png"
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
