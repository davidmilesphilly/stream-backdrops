// Create this new file: components/OptimizedImage.js

import { useState } from 'react';

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
  
  const handleImageLoad = () => {
    setImageLoaded(true);
  };
  
  const handleImageError = () => {
    setImageError(true);
  };
  
  // Fallback alt text if not provided
  const altText = image.alt || `${image.title || 'Professional virtual background'} - High-quality background for video calls`;
  
  return (
    <div className={`image-container ${className}`} style={{ position: 'relative', aspectRatio: '16/9' }}>
      {/* Loading placeholder */}
      {!imageLoaded && !imageError && (
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
          backgroundSize: '200% 100%',
          animation: 'shimmer 1.5s infinite'
        }} />
      )}
      
      {/* Actual image */}
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
          transition: 'opacity 0.3s ease'
        }}
        className={`${className} premium-image`}
        onClick={onClick}
        onLoad={handleImageLoad}
        onError={handleImageError}
        onContextMenu={(e) => e.preventDefault()}
        // Additional SEO attributes
        itemProp="image"
        data-category={image.category}
        data-keywords={image.keywords?.join(', ') || ''}
      />
      
      {/* Error fallback */}
      {imageError && (
        <div style={{
          position: 'absolute',
          inset: 0,
          background: '#f3f4f6',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#6b7280',
          fontSize: '0.875rem'
        }}>
          Unable to load image
        </div>
      )}
      
      {/* Structured data for image */}
      {image.imageSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(image.imageSchema)
          }}
        />
      )}
    </div>
  );
}