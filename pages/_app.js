// Update your pages/_app.js:

import '../styles/globals.css'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import * as gtag from '../lib/gtag'
import { reportWebVitals, preloadCriticalResources } from '../lib/performance'

export default function App({ Component, pageProps }) {
  const router = useRouter()
  
  useEffect(() => {
    const handleRouteChange = (url) => {
      gtag.pageview(url)
    }
    
    // Track page views
    router.events.on('routeChangeComplete', handleRouteChange)
    
    // Performance optimizations
    preloadCriticalResources()
    
    // Cleanup
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, [router.events])

  // Performance monitoring
  useEffect(() => {
    // Track loading performance
    if (typeof window !== 'undefined') {
      window.addEventListener('load', () => {
        // Report page load time
        const loadTime = performance.now()
        if (typeof gtag !== 'undefined') {
          gtag.event('page_load_time', {
            event_category: 'Performance',
            value: Math.round(loadTime),
            non_interaction: true
          })
        }
      })
    }
  }, [])

  return <Component {...pageProps} />
}

// Export reportWebVitals function for Next.js
export { reportWebVitals }