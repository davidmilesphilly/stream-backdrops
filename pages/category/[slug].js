import { useState, useMemo, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Footer from '../../components/Footer';
import SEO from '../../components/SEO';
import OptimizedImage from '../../components/OptimizedImage';

export default function CategoryPage() {
  const router = useRouter();
  const { slug } = router.query;
  
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageMetadata, setImageMetadata] = useState({});
  const [loading, setLoading] = useState(true);

  // Load metadata on client side
  useEffect(() => {
    async function loadMetadata() {
      try {
        const response = await fetch('/api/metadata');
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Successfully loaded metadata:', Object.keys(data).length, 'images');
        setImageMetadata(data);
      } catch (error) {
        console.error('Failed to load metadata:', error);
        setImageMetadata({});
      } finally {
        setLoading(false);
      }
    }
    loadMetadata();
  }, []);

  const categoryInfo = {
    'home-offices': {
      name: 'Home Offices',
      description: 'Professional home office backgrounds perfect for remote work and video calls'
    },
    'executive-offices': {
      name: 'Executive Offices', 
      description: 'Luxury executive office backgrounds for leadership meetings and professional calls'
    },
    'conference-rooms': {
      name: 'Conference Rooms',
      description: 'Professional meeting room backgrounds for team calls and presentations'
    },
    'open-offices': {
      name: 'Open Offices',
      description: 'Modern open workspace backgrounds for collaborative video calls'
    },
    'lobbies': {
      name: 'Lobbies',
      description: 'Professional lobby backgrounds for client meetings and business calls'
    },
    'private-offices': {
      name: 'Private Offices',
      description: 'Specialized private office backgrounds for professional consultations and meetings'
    },
    'premium-4k': {
      name: 'Premium 4K',
      description: 'Ultra high-quality 4K virtual backgrounds with premium materials and luxury details',
      isPremium: true
    }
  };

  const categoryImages = useMemo(() => {
    if (!slug || !imageMetadata || loading) return [];
    
    return Object.entries(imageMetadata)
      .filter(([_, data]) => data && data.category === slug)
      .map(([key, data]) => ({ key, ...data }));
  }, [slug, imageMetadata, loading]);

  const handlePremiumPurchase = (image) => {
    // Redirect to Gumroad product
    const gumroadUrl = `https://gumroad.com/l/${image.gumroadPermalink}`;
    window.open(gumroadUrl, '_blank');
  };

  const handleDownload = async (image) => {
    // Track download event for analytics
    if (typeof gtag !== 'undefined') {
      gtag('event', 'download', {
        event_category: 'engagement',
        event_label: image.title || image.filename,
        value: image.isPremium ? 1 : 0
      });
    }

    if (image.isPremium) {
      handlePremiumPurchase(image);
      return;
    }

    // Free download logic
    try {
      const response = await fetch(`/images/${image.filename}`);
      const blob = await response.blob();
      
      const img = new Image();
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      const loadImage = new Promise((resolve, reject) => {
        img.onload = () => {
          canvas.width = img.naturalWidth;
          canvas.height = img.naturalHeight;
          ctx.drawImage(img, 0, 0);
          
          canvas.toBlob((pngBlob) => {
            if (pngBlob) {
              const url = URL.createObjectURL(pngBlob);
              const link = document.createElement('a');
              link.href = url;
              link.download = image.filename.replace('.webp', '.png');
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
              URL.revokeObjectURL(url);
              resolve();
            } else {
              reject(new Error('Failed to convert to PNG'));
            }
          }, 'image/png', 1.0);
        };
        
        img.onerror = () => reject(new Error('Failed to load image'));
      });
      
      img.src = URL.createObjectURL(blob);
      await loadImage;
      
    } catch (error) {
      console.error('PNG conversion failed:', error);
      const link = document.createElement('a');
      link.href = `/images/${image.filename}`;
      link.download = image.filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // Show loading while router and data load
  if (!router.isReady || loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div>Loading...</div>
      </div>
    );
  }

  // Show 404 if invalid slug
  if (!categoryInfo[slug]) {
    return (
      <div style={{textAlign: 'center', padding: '4rem 2rem'}}>
        <h1>Category Not Found</h1>
        <p>The category you're looking for doesn't exist.</p>
        <Link href="/" style={{color: '#2563eb', textDecoration: 'none'}}>
          ← Back to Home
        </Link>
      </div>
    );
  }

  const category = categoryInfo[slug];
  const categoryImage = categoryImages.length > 0 
    ? `https://streambackdrops.com/images/${categoryImages[0].filename}`
    : 'https://streambackdrops.com/images/luxury-ceo-corner-office-1.webp';

  // Enhanced meta descriptions for each category
  const seoDescriptions = {
    'home-offices': 'Download free professional home office virtual backgrounds for Zoom, Teams, and video calls. High-quality backgrounds perfect for remote work and working from home.',
    'executive-offices': 'Premium executive office virtual backgrounds for leadership meetings. Professional luxury office backgrounds that project authority and success in video calls.',
    'conference-rooms': 'Professional conference room virtual backgrounds for team meetings and presentations. Modern meeting room backgrounds for Zoom, Teams, and business calls.',
    'open-offices': 'Modern open office virtual backgrounds for collaborative video calls. Contemporary workspace backgrounds perfect for team meetings and startup environments.',
    'lobbies': 'Professional lobby and reception virtual backgrounds for client meetings. Elegant entrance and waiting area backgrounds for business video calls.',
    'private-offices': 'Specialized private office virtual backgrounds for consultations and professional meetings. Medical, legal, and therapy office backgrounds for confidential calls.'
  };

  const seoKeywords = {
    'home-offices': 'home office virtual background, remote work background, work from home zoom background, professional home office, virtual office background',
    'executive-offices': 'executive office background, luxury office virtual background, CEO office background, leadership meeting background, professional executive',
    'conference-rooms': 'conference room background, meeting room virtual background, team meeting background, presentation background, business meeting',
    'open-offices': 'open office background, modern workspace background, collaborative office, startup office background, contemporary workspace',
    'lobbies': 'lobby background, reception background, business lobby, professional entrance, waiting room background',
    'private-offices': 'private office background, consultation room background, medical office background, therapy office, professional consultation'
  };

  // Structured data for category pages
  const categoryStructuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": `${category.name} Virtual Backgrounds`,
    "description": category.description,
    "url": `https://streambackdrops.com/category/${slug}`,
    "mainEntity": {
      "@type": "ImageGallery",
      "name": `${category.name} Background Collection`,
      "description": `Professional ${category.name.toLowerCase()} virtual backgrounds for video calls`,
      "numberOfItems": categoryImages.length
    },
    "breadcrumb": {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://streambackdrops.com"
        },
        {
          "@type": "ListItem", 
          "position": 2,
          "name": category.name,
          "item": `https://streambackdrops.com/category/${slug}`
        }
      ]
    }
  };

  return (
    <>
      <SEO
        title={`${category.name} Virtual Backgrounds - Free Professional Downloads`}
        description={seoDescriptions[slug] || category.description}
        keywords={seoKeywords[slug] || ''}
        image={categoryImage}
        url={`https://streambackdrops.com/category/${slug}`}
        type="website"
        structuredData={categoryStructuredData}
      />

      <div style={{minHeight: '100vh', background: '#f9fafb'}}>
        <header style={{background: 'white', borderBottom: '1px solid #e5e7eb', padding: '1rem 0'}}>
          <div className="container">
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem'}}>
              <Link href="/" style={{fontSize: '1.5rem', fontWeight: 'bold', color: '#111827', textDecoration: 'none'}}>
                Stream<span style={{color: '#2563eb'}}>Backdrops</span>
              </Link>
            </div>
            
            <nav className="category-nav">
              {Object.entries(categoryInfo).map(([key, info]) => (
                <Link
                  key={key}
                  href={`/category/${key}`}
                  className={key === slug ? 'active' : ''}
                  style={{
                    fontSize: '1rem',
                    fontWeight: '600',
                    color: key === slug ? '#2563eb' : '#6b7280',
                    textDecoration: 'none',
                    padding: '0.5rem 1rem',
                    borderRadius: '0.5rem',
                    transition: 'all 0.2s ease',
                    position: 'relative',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {info.name}
                  {info.isPremium && (
                    <span style={{
                      background: '#fbbf24',
                      color: '#92400e',
                      fontSize: '0.75rem',
                      fontWeight: 'bold',
                      padding: '0.125rem 0.375rem',
                      borderRadius: '0.75rem',
                      marginLeft: '0.5rem'
                    }}>
                      PREMIUM
                    </span>
                  )}
                </Link>
              ))}
            </nav>
          </div>
        </header>

        <div className="orientation-warning">
          💡 <strong>Tip:</strong> These backgrounds work best in landscape mode for video calls
        </div>

        <section style={{
          background: category.isPremium ? 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)' : '#2563eb', 
          color: 'white', 
          padding: '4rem 0', 
          textAlign: 'center'
        }}>
          <div className="container">
            <h1 style={{fontSize: '3rem', fontWeight: 'bold', marginBottom: '1rem', color: 'white'}}>
              {category.name}
              {category.isPremium && (
                <span style={{
                  background: 'rgba(255,255,255,0.2)',
                  padding: '0.5rem 1rem',
                  borderRadius: '1rem',
                  fontSize: '1rem',
                  marginLeft: '1rem',
                  display: 'inline-block'
                }}>
                  4K QUALITY
                </span>
              )}
            </h1>
            <p style={{fontSize: '1.2rem', marginBottom: '0.5rem'}}>
              {category.description}
            </p>
            {category.isPremium ? (
              <p style={{opacity: 0.9, fontSize: '1.1rem'}}>
                Ultra high-definition backgrounds • Professional quality • Starting at $5.99
              </p>
            ) : (
              <p style={{opacity: 0.9}}>
                Professional backgrounds available
              </p>
            )}
          </div>
        </section>

        <section style={{padding: '3rem 0'}}>
          <div className="container">
            {categoryImages.length === 0 ? (
              <div style={{textAlign: 'center', padding: '3rem 0'}}>
                <p style={{color: '#6b7280', fontSize: '1.1rem'}}>No backgrounds found.</p>
              </div>
            ) : (
              <div className="image-grid">
                {categoryImages.map((image, index) => (
                  <article 
                    key={image.key} 
                    className="image-card" 
                    style={{
                      background: 'white',
                      borderRadius: '0.75rem',
                      boxShadow: '0 8px 20px rgba(0,0,0,0.12)',
                      overflow: 'hidden',
                      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                      position: 'relative'
                    }}
                    itemScope
                    itemType="https://schema.org/ImageObject"
                  >
                    {image.isPremium && (
                      <div style={{
                        position: 'absolute',
                        top: '1rem',
                        right: '1rem',
                        background: 'linear-gradient(45deg, #fbbf24, #f59e0b)',
                        color: '#92400e',
                        padding: '0.375rem 0.75rem',
                        borderRadius: '1rem',
                        fontSize: '0.875rem',
                        fontWeight: 'bold',
                        zIndex: 10
                      }}>
                        PREMIUM 4K
                      </div>
                    )}
                    
                    <div style={{position: 'relative', aspectRatio: '16/9', overflow: 'hidden'}}>
                      <OptimizedImage
                        image={image}
                        onClick={() => setSelectedImage(image)}
                        lazy={index > 6}
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        priority={index < 3}
                      />
                      
                      <div style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'rgba(0,0,0,0.7)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '1rem',
                        opacity: 0,
                        transition: 'opacity 0.3s ease'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.opacity = 1}
                      onMouseLeave={(e) => e.currentTarget.style.opacity = 0}
                      >
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedImage(image);
                          }}
                          style={{
                            background: 'rgba(255,255,255,0.9)',
                            color: '#111827',
                            padding: '0.75rem 1.5rem',
                            border: 'none',
                            borderRadius: '0.5rem',
                            fontSize: '1rem',
                            fontWeight: '600',
                            cursor: 'pointer'
                          }}
                          aria-label={`Preview ${image.title}`}
                        >
                          Preview
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDownload(image);
                          }}
                          style={{
                            background: image.isPremium ? '#fbbf24' : '#2563eb',
                            color: image.isPremium ? '#92400e' : 'white',
                            padding: '0.75rem 1.5rem',
                            border: 'none',
                            borderRadius: '0.5rem',
                            fontSize: '1rem',
                            fontWeight: '600',
                            cursor: 'pointer'
                          }}
                          aria-label={`Download ${image.title}`}
                        >
                          {image.isPremium ? `Buy $${image.price || '5.99'}` : 'Download'}
                        </button>
                      </div>
                    </div>

                    <div style={{padding: '1.5rem'}} itemProp="description">
                      <div style={{display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.5rem'}}>
                        <h3 
                          style={{fontWeight: '600', color: '#111827', fontSize: '1.1rem', flex: 1}}
                          itemProp="name"
                        >
                          {image.title || 'Virtual Background'}
                        </h3>
                        {image.resolution && (
                          <span style={{
                            background: '#f3f4f6',
                            color: '#374151',
                            padding: '0.25rem 0.5rem',
                            borderRadius: '0.25rem',
                            fontSize: '0.75rem',
                            fontWeight: '600'
                          }}>
                            {image.resolution}
                          </span>
                        )}
                      </div>
                      <p style={{color: '#6b7280', fontSize: '0.95rem', marginBottom: '0.75rem'}}>
                        {image.description || 'Professional virtual background'}
                      </p>
                      <div style={{display: 'flex', flexWrap: 'wrap', gap: '0.25rem'}}>
                        {(image.keywords || []).slice(0, 3).map(keyword => (
                          <span 
                            key={keyword} 
                            style={{
                              background: '#f3f4f6',
                              color: '#374151',
                              padding: '0.25rem 0.5rem',
                              borderRadius: '0.25rem',
                              fontSize: '0.75rem'
                            }}
                            itemProp="keywords"
                          >
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <meta itemProp="contentUrl" content={`https://streambackdrops.com/images/${image.filename}`} />
                    <meta itemProp="license" content="https://streambackdrops.com/terms" />
                    <meta itemProp="acquireLicensePage" content="https://streambackdrops.com/terms" />
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>

        {selectedImage && (
          <div className="modal" onClick={() => setSelectedImage(null)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '1rem',
                borderBottom: '1px solid #e5e7eb'
              }}>
                <div style={{display: 'flex', alignItems: 'center', gap: '1rem'}}>
                  <h3 style={{fontSize: '1.1rem', fontWeight: '600', color: '#111827', margin: 0}}>
                    {selectedImage.title || 'Virtual Background'}
                  </h3>
                  {selectedImage.isPremium && (
                    <span style={{
                      background: '#fbbf24',
                      color: '#92400e',
                      padding: '0.25rem 0.75rem',
                      borderRadius: '1rem',
                      fontSize: '0.75rem',
                      fontWeight: 'bold'
                    }}>
                      PREMIUM 4K
                    </span>
                  )}
                </div>
                <button
                  onClick={() => setSelectedImage(null)}
                  style={{
                    background: 'none',
                    border: 'none',
                    fontSize: '1.5rem',
                    color: '#6b7280',
                    cursor: 'pointer',
                    padding: '0.25rem'
                  }}
                >
                  ✕
                </button>
              </div>
              
              <div style={{padding: '1rem'}}>
                <div style={{marginBottom: '1rem'}}>
                  <img
                    src={`/images/${selectedImage.filename}`}
                    alt={selectedImage.alt || 'Virtual background'}
                    style={{
                      width: '100%',
                      height: 'auto',
                      maxHeight: '60vh',
                      objectFit: 'contain',
                      borderRadius: '0.5rem',
                      userSelect: 'none',
                      WebkitUserDrag: 'none'
                    }}
                    onContextMenu={(e) => e.preventDefault()}
                  />
                </div>
                
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '1rem'
                }}>
                  <div style={{flex: 1}}>
                    <p style={{color: '#6b7280', marginBottom: '0.5rem', fontSize: '0.9rem'}}>
                      {selectedImage.description || 'Professional virtual background'}
                    </p>
                    <div style={{display: 'flex', flexWrap: 'wrap', gap: '0.25rem'}}>
                      {(selectedImage.keywords || []).map(keyword => (
                        <span key={keyword} style={{
                          background: '#f3f4f6',
                          color: '#374151',
                          padding: '0.25rem 0.5rem',
                          borderRadius: '0.25rem',
                          fontSize: '0.75rem'
                        }}>
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={() => handleDownload(selectedImage)}
                    style={{
                      background: selectedImage.isPremium ? '#fbbf24' : '#2563eb',
                      color: selectedImage.isPremium ? '#92400e' : 'white',
                      padding: '0.75rem 2rem',
                      border: 'none',
                      borderRadius: '0.5rem',
                      fontSize: '1rem',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    {selectedImage.isPremium ? `Buy for $${selectedImage.price || '5.99'}` : 'Download'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </>
  );
}