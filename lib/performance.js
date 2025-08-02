// Create this new file: lib/performance.js

export function reportWebVitals(metric) {
  // Log performance metrics to console in development
  if (process.env.NODE_ENV === 'development') {
    console.log(`Performance Metric - ${metric.name}:`, metric.value);
  }

  // Send to Google Analytics if available
  if (typeof gtag !== 'undefined') {
    gtag('event', metric.name, {
      event_category: 'Web Vitals',
      event_label: metric.id,
      value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
      non_interaction: true,
    });
  }

  // You can also send to other analytics services here
  // Example: send to your own analytics endpoint
  // fetch('/api/analytics', {
  //   method: 'POST',
  //   body: JSON.stringify(metric),
  //   headers: { 'Content-Type': 'application/json' }
  // });
}

// Preload critical resources
export function preloadCriticalResources() {
  // Preload critical images
  const criticalImages = [
    '/images/luxury-ceo-corner-office-1.webp',
    '/images/scandinavian-minimalist-home-office-1.webp',
    '/images/modern-glass-conference-room-1.webp',
  ];

  criticalImages.forEach(src => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = src;
    link.type = 'image/webp';
    document.head.appendChild(link);
  });
}

// Lazy load non-critical resources
export function lazyLoadResources() {
  // Defer non-critical scripts
  const deferredScripts = document.querySelectorAll('script[data-defer]');
  deferredScripts.forEach(script => {
    const newScript = document.createElement('script');
    newScript.src = script.dataset.src;
    newScript.async = true;
    document.head.appendChild(newScript);
  });
}

// Optimize images with intersection observer
export function optimizeImageLoading() {
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.classList.remove('lazy');
            img.classList.add('loaded');
            observer.unobserve(img);
          }
        }
      });
    }, {
      rootMargin: '50px 0px',
      threshold: 0.01
    });

    // Observe all lazy images
    document.querySelectorAll('img[data-src]').forEach(img => {
      imageObserver.observe(img);
    });
  }
}

// Memory cleanup
export function cleanupResources() {
  // Remove unused event listeners
  // Clear intervals/timeouts
  // Cleanup any observers
  window.addEventListener('beforeunload', () => {
    // Cleanup code here
  });
}