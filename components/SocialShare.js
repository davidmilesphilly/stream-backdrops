// Create this new file: components/SocialShare.js

import { useState } from 'react';

export default function SocialShare({ 
  url, 
  title, 
  description, 
  image,
  hashtags = ['virtualbackground', 'remotework', 'zoom', 'videocalls'],
  showLabels = true,
  size = 'medium' // small, medium, large
}) {
  const [copied, setCopied] = useState(false);
  
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const encodedDescription = encodeURIComponent(description);
  const encodedImage = encodeURIComponent(image);
  const hashtagString = hashtags.join(',');
  
  // Optimized Pinterest description for better engagement
  const pinterestDescription = `${description} Perfect for professional video calls, remote work, and online meetings. Download free virtual backgrounds at StreamBackdrops! #VirtualBackground #RemoteWork #ProfessionalMeeting`;
  
  const shareLinks = {
    pinterest: `https://pinterest.com/pin/create/button/?url=${encodedUrl}&media=${encodedImage}&description=${encodeURIComponent(pinterestDescription)}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}&hashtags=${hashtagString}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    reddit: `https://reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`,
    whatsapp: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
    email: `mailto:?subject=${encodedTitle}&body=${encodedDescription}%0A%0A${url}`
  };
  
  const handleShare = (platform) => {
    // Track social share events
    if (typeof gtag !== 'undefined') {
      gtag('event', 'share', {
        event_category: 'Social',
        event_label: platform,
        value: 1
      });
    }
    
    window.open(shareLinks[platform], '_blank', 'width=600,height=400');
  };
  
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      
      // Track copy event
      if (typeof gtag !== 'undefined') {
        gtag('event', 'copy_link', {
          event_category: 'Social',
          event_label: 'clipboard',
          value: 1
        });
      }
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };
  
  const buttonSize = {
    small: '32px',
    medium: '40px', 
    large: '48px'
  };
  
  const iconSize = {
    small: '16px',
    medium: '20px',
    large: '24px'
  };
  
  const SocialButton = ({ platform, onClick, children, color, label }) => (
    <button
      onClick={onClick}
      style={{
        width: buttonSize[size],
        height: buttonSize[size],
        borderRadius: '50%',
        border: 'none',
        background: color,
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        fontSize: iconSize[size]
      }}
      onMouseEnter={(e) => {
        e.target.style.transform = 'scale(1.1)';
        e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
      }}
      onMouseLeave={(e) => {
        e.target.style.transform = 'scale(1)';
        e.target.style.boxShadow = 'none';
      }}
      title={`Share on ${label}`}
      aria-label={`Share on ${label}`}
    >
      {children}
    </button>
  );
  
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      flexWrap: 'wrap'
    }}>
      {showLabels && (
        <span style={{
          fontSize: '0.875rem',
          fontWeight: '500',
          color: '#6b7280'
        }}>
          Share:
        </span>
      )}
      
      {/* Pinterest - Most important for virtual backgrounds */}
      <SocialButton
        platform="pinterest"
        onClick={() => handleShare('pinterest')}
        color="#E60023"
        label="Pinterest"
      >
        📌
      </SocialButton>
      
      {/* Twitter */}
      <SocialButton
        platform="twitter"
        onClick={() => handleShare('twitter')}
        color="#1DA1F2"
        label="Twitter"
      >
        🐦
      </SocialButton>
      
      {/* LinkedIn */}
      <SocialButton
        platform="linkedin"
        onClick={() => handleShare('linkedin')}
        color="#0077B5"
        label="LinkedIn"
      >
        💼
      </SocialButton>
      
      {/* Facebook */}
      <SocialButton
        platform="facebook"
        onClick={() => handleShare('facebook')}
        color="#1877F2"
        label="Facebook"
      >
        📘
      </SocialButton>
      
      {/* WhatsApp */}
      <SocialButton
        platform="whatsapp"
        onClick={() => handleShare('whatsapp')}
        color="#25D366"
        label="WhatsApp"
      >
        💬
      </SocialButton>
      
      {/* Copy Link */}
      <button
        onClick={copyToClipboard}
        style={{
          width: buttonSize[size],
          height: buttonSize[size],
          borderRadius: '50%',
          border: '2px solid #e5e7eb',
          background: copied ? '#10b981' : 'white',
          color: copied ? 'white' : '#6b7280',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          fontSize: iconSize[size]
        }}
        title={copied ? 'Copied!' : 'Copy link'}
        aria-label={copied ? 'Link copied' : 'Copy link'}
      >
        {copied ? '✓' : '🔗'}
      </button>
      
      {copied && (
        <span style={{
          fontSize: '0.75rem',
          color: '#10b981',
          fontWeight: '500'
        }}>
          Copied!
        </span>
      )}
    </div>
  );
}