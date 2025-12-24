'use client'

export default function TideTimes() {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 border-t-4 border-ship-blue-500">
      <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
        <svg className="w-6 h-6 mr-2 text-ship-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 002 2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Tide Times - Porlock Bay
      </h3>
      <div className="w-full" style={{ minHeight: '250px' }}>
        <iframe
          srcDoc={`
            <html>
              <head>
                <style>
                  body { margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; }
                  #tidewidget { width: 100% !important; border: none !important; background: transparent !important; padding: 0 !important; }
                  table { width: 100% !important; border-collapse: collapse; }
                  a { color: #0284c7; text-decoration: none; }
                  a:hover { text-decoration: underline; }
                </style>
              </head>
              <body>
                <script type="text/javascript">
                  var tt_width = '100%';
                  var tt_bgnd = 'transparent';
                  var tt_border = 'none';
                  var tt_fgcol = '#374151';
                </script>
                <script src="https://www.tidetimes.org.uk/porlock-bay-tide-times.js" type="text/javascript"></script>
              </body>
            </html>
          `}
          className="w-full border-none"
          style={{ height: '280px' }}
          title="Tide Times Porlock Bay"
        />
      </div>
      <div className="mt-4 pt-4 border-t border-gray-100">
        <a 
          href="https://www.tidetimes.org.uk/porlock-bay-tide-times" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-sm text-ship-blue-600 hover:underline flex items-center justify-center"
        >
          View full 7-day forecast →
        </a>
        <p className="text-xs text-gray-400 text-center mt-2">
          Data provided by tidetimes.org.uk
        </p>
      </div>
    </div>
  )
}
