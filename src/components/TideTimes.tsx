import Parser from 'rss-parser'

const parser = new Parser()

export default async function TideTimes() {
  try {
    const feed = await parser.parseURL('https://www.tidetimes.co.uk/rss/porlock-bay-tide-times')
    
    return (
      <div className="bg-white rounded-lg shadow-lg p-6 border-t-4 border-ship-blue-500">
        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
          <svg className="w-6 h-6 mr-2 text-ship-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 002 2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Tide Times - Porlock Bay
        </h3>
        <div className="space-y-4">
          {feed.items.slice(0, 4).map((item, index) => (
            <div key={index} className="border-b border-gray-100 last:border-0 pb-3 last:pb-0">
              <p className="text-base font-medium text-ship-blue-800">{item.title}</p>
              <p className="text-sm text-gray-500 mt-1">{item.contentSnippet || item.content}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 pt-4 border-t border-gray-100">
          <a 
            href="https://www.tidetimes.co.uk/porlock-bay-tide-times" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-sm text-ship-blue-600 hover:underline flex items-center justify-center"
          >
            View full 7-day forecast →
          </a>
          <p className="text-xs text-gray-400 text-center mt-2">
            Data provided by tidetimes.co.uk
          </p>
        </div>
      </div>
    )
  } catch (error) {
    console.error('Error fetching tide times:', error)
    return (
      <div className="bg-white rounded-lg shadow-lg p-6 border-t-4 border-red-500">
        <h3 className="text-xl font-bold text-gray-900 mb-2">Tide Times</h3>
        <p className="text-gray-600 text-sm">Unable to load tide times at the moment. Please check back later.</p>
        <a 
          href="https://www.tidetimes.co.uk/porlock-bay-tide-times" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-sm text-ship-blue-600 hover:underline mt-4 inline-block"
        >
          View on tidetimes.co.uk →
        </a>
      </div>
    )
  }
}
