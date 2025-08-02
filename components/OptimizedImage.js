// Enhanced OptimizedImage component with better performance

import { useState, useRef, useEffect } from 'react';

export default function OptimizedImage({ 
  image, 
  onClick, 
  className = '',
  lazy = true,
  sizes = '(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw',
  priority = false
}) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [inView, setInView] = useState(!lazy);
  const imgRef = useRef(null);
  
  // Intersection Observer for lazy loading
  useEffect(() => {
    if (!lazy || typeof window === 'undefined') return;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: '50px 0px', threshold: 0.01 }
    );
    
    if (imgRef.current) {
      observer.observe(imgRef.current);
    }
    
    return () => observer.disconnect();
  }, [lazy]);
  
  const handleImageLoad = () => {
    setImageLoaded(true);
    // Report successful image load for analytics
    if (typeof gtag !== 'undefined') {
      gtag('event', 'image_load_success', {
        event_category: 'Performance',
        event_label: image.filename,
        non_interaction: true
      });
    }
  };
  
  const handleImageError = () => {
    setImageError(true);
    // Report image load error for monitoring
    if (typeof gtag !== 'undefined') {
      gtag('event', 'image_load_error', {
        event_category: 'Performance',
        event_label: image.filename,
        non_interaction: true
      });
    }
  };
  
  // Enhanced alt text
  const altText = image.alt || `${image.title || 'Professional virtual background'} - High-quality background for video calls`;
  
  return (
    <div 
      ref={imgRef}
      className={`image-container ${className}`} 
      style={{ position: 'relative', aspectRatio: '16/9' }}
    >
      {/* Performance-optimized loading placeholder */}
      {!imageLoaded && !imageError && (
        <div 
          className="shimmer"
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
            backgroundSize: '200% 100%',
            borderRadius: '0.5rem'
          }} 
        />
      )}
      
      {/* Optimized image with performance attributes */}
      {inView && (
        <img
          src={`/images/${image.filename}`}
          alt={altText}
          title={image.title || 'Professional virtual background'}
          loading={lazy ? 'lazy' : 'eager'}
          decoding="async"
          sizes={sizes}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            cursor: onClick ? 'pointer' : 'default',
            opacity: imageLoaded ? 1 : 0,
            transition: 'opacity 0.3s ease',
            borderRadius: '0.5rem'
          }}
          className={`${className} premium-image ${imageLoaded ? 'loaded' : 'lazy'}`}
          onClick={onClick}
          onLoad={handleImageLoad}
          onError={handleImageError}
          onContextMenu={(e) => e.preventDefault()}
          // Performance attributes
          fetchPriority={priority ? 'high' : 'auto'}
          // SEO and accessibility attributes
          itemProp="image"
          data-category={image.category}
          data-keywords={image.keywords?.join(', ') || ''}
          // Performance monitoring
          data-filename={image.filename}
        />
      )}
      
      {/* Enhanced error fallback */}
      {imageError && (
        <div style={{
          position: 'absolute',
          inset: 0,
          background: '#f9fafb',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#6b7280',
          fontSize: '0.875rem',
          borderRadius: '0.5rem',
          border: '2px dashed #e5e7eb'
        }}>
          <div style={{ marginBottom: '0.5rem', fontSize: '1.5rem' }}>📷</div>
          <div>Image unavailable</div>
          <button 
            onClick={() => {
              setImageError(false);
              setImageLoaded(false);
              // Retry loading
              if (imgRef.current) {
                const img = imgRef.current.querySelector('img');
                if (img) img.src = `/images/${image.filename}?retry=${Date.now()}`;
              }
            }}
            style={{
              marginTop: '0.5rem',
              padding: '0.25rem 0.5rem',
              fontSize: '0.75rem',
              background: '#2563eb',
              color: 'white',
              border: 'none',
              borderRadius: '0.25rem',
              cursor: 'pointer'
            }}
          >
            Retry
          </button>
        </div>
      )}
      
      {/* Structured data for performance and SEO */}
      {image.imageSchema && imageLoaded && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              ...image.imageSchema,
              contentUrl: `/images/${image.filename}`,
              thumbnailUrl: `/images/${image.filename}`
            })
          }}
        />
      )}
    </div>
  );
}