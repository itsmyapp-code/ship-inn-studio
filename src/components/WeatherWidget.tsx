'use client'

import { useEffect } from 'react'

export default function WeatherWidget() {
  useEffect(() => {
    // This function is the same as the one provided in the script tag
    const loadWidget = () => {
      const d = document
      const s = 'script'
      const id = 'weatherwidget-io-js'
      
      if (!d.getElementById(id)) {
        const js = d.createElement(s) as HTMLScriptElement
        js.id = id
        js.src = 'https://weatherwidget.io/js/widget.min.js'
        const fjs = d.getElementsByTagName(s)[0]
        if (fjs && fjs.parentNode) {
          fjs.parentNode.insertBefore(js, fjs)
        } else {
          d.head.appendChild(js)
        }
      } else {
        // If script is already loaded, we might need to re-initialize
        // The weatherwidget.io script usually handles this automatically if it's already in the DOM
        // but sometimes we need to trigger it if the component re-mounts
        if ((window as any).__weatherwidget_init) {
          (window as any).__weatherwidget_init()
        }
      }
    }

    loadWidget()
  }, [])

  return (
    <div className="weather-widget-container mb-6">
      <a 
        className="weatherwidget-io" 
        href="https://forecast7.com/en/51d22n3d63/porlock-weir/" 
        data-label_1="PORLOCK WEIR" 
        data-label_2="WEATHER" 
        data-theme="original"
      >
        PORLOCK WEIR WEATHER
      </a>
    </div>
  )
}
