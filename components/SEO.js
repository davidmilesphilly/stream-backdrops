// Add Pinterest optimization to your SEO component
// Update components/SEO.js with Pinterest-specific meta tags:

import Head from 'next/head';

export default function SEO({
  title,
  description,
  keywords = '',
  image = 'https://streambackdrops.com/images/luxury-ceo-corner-office-1.webp',
  url = 'https://streambackdrops.com',
  type = 'website',
  structuredData = null,
  // Pinterest-specific props
  pinterestDescription = null,
  showPinterestSave = true,
  articleAuthor = 'StreamBackdrops',
  price = null,
  availability = 'InStock'
}) {
  const fullTitle = title.includes('StreamBackdrops') 
    ? title 
    : `${title} - StreamBackdrops`;

  // Pinterest-optimized description (max 500 chars, keyword-rich)
  const pinterestDesc = pinterestDescription || description;

  return (
    <Head>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content="1920" />
      <meta property="og:image:height" content="1080" />
      <meta property="og:site_name" content="StreamBackdrops" />
      
      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={fullTitle} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={image} />
      <meta property="twitter:creator" content="@streambackdrops" />
      
      {/* Pinterest Rich Pins */}
      <meta property="og:type" content="article" />
      <meta property="article:author" content={articleAuthor} />
      <meta property="og:rich_attachment" content="true" />
      
      {/* Pinterest-specific meta tags */}
      <meta name="pinterest-rich-pin" content="true" />
      <meta property="og:description" content={pinterestDesc} />
      
      {/* Product Rich Pins (for premium backgrounds) */}
      {price && (
        <>
          <meta property="product:price:amount" content={price} />
          <meta property="product:price:currency" content="USD" />
          <meta property="product:availability" content={availability} />
          <meta property="product:retailer" content="StreamBackdrops" />
        </>
      )}
      
      {/* Additional SEO */}
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      <meta name="author" content="StreamBackdrops" />
      <link rel="canonical" href={url} />
      
      {/* Pinterest verification (you'll need to add your verification code) */}
      <meta name="p:domain_verify" content="YOUR_PINTEREST_VERIFICATION_CODE" />
      
      {/* Structured Data */}
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData)
          }}
        />
      )}
      
      {/* Pinterest Save Button JavaScript */}
      {showPinterestSave && (
        <script
          async
          defer
          src="//assets.pinterest.com/js/pinit.js"
        />
      )}
    </Head>
  );
}