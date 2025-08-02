// Update your pages/api/metadata.js to include enhanced alt text

import fs from 'fs';
import path from 'path';

// Enhanced alt text generator based on image metadata
function generateEnhancedAltText(image) {
  const { title, category, keywords = [] } = image;
  
  // Base description
  let altText = title || 'Professional virtual background';
  
  // Add category context
  const categoryContext = {
    'home-offices': 'home office virtual background perfect for remote work and video calls',
    'executive-offices': 'luxury executive office virtual background ideal for leadership meetings and professional presentations',
    'conference-rooms': 'professional conference room virtual background for team meetings and business presentations',
    'open-offices': 'modern open office virtual background for collaborative meetings and startup environments',
    'lobbies': 'professional lobby virtual background for client meetings and business calls',
    'private-offices': 'specialized private office virtual background for consultations and professional meetings'
  };
  
  // Add specific details based on keywords and category
  if (category && categoryContext[category]) {
    altText = `${title} - ${categoryContext[category]}`;
  }
  
  // Add relevant keywords naturally
  const relevantKeywords = keywords.slice(0, 3).join(', ');
  if (relevantKeywords) {
    altText += ` featuring ${relevantKeywords}`;
  }
  
  // Ensure it mentions it's for video calls/virtual meetings
  if (!altText.toLowerCase().includes('video call') && !altText.toLowerCase().includes('virtual background')) {
    altText += ' for Zoom, Teams, and professional video calls';
  }
  
  return altText;
}

// Enhanced image metadata with SEO-optimized alt text
function enhanceImageMetadata(metadata) {
  const enhanced = {};
  
  Object.entries(metadata).forEach(([key, image]) => {
    enhanced[key] = {
      ...image,
      // Enhanced alt text for SEO and accessibility
      alt: generateEnhancedAltText(image),
      // Additional SEO metadata
      imageSchema: {
        "@type": "ImageObject",
        "name": image.title,
        "description": image.description,
        "contentUrl": `https://streambackdrops.com/images/${image.filename}`,
        "license": "https://streambackdrops.com/terms",
        "acquireLicensePage": "https://streambackdrops.com/terms",
        "creditText": "StreamBackdrops",
        "creator": {
          "@type": "Organization",
          "name": "StreamBackdrops"
        },
        "keywords": image.keywords?.join(', ') || '',
        "width": "1920",
        "height": "1080"
      }
    };
  });
  
  return enhanced;
}

export default function handler(req, res) {
  try {
    // Try both locations - public folder and root data folder
    const possiblePaths = [
      path.join(process.cwd(), 'public', 'data', 'image-metadata.json'),
      path.join(process.cwd(), 'data', 'image-metadata.json')
    ];
    
    let filePath = null;
    for (const testPath of possiblePaths) {
      if (fs.existsSync(testPath)) {
        filePath = testPath;
        break;
      }
    }
    
    if (!filePath) {
      return res.status(404).json({ 
        error: 'Metadata file not found',
        searchedPaths: possiblePaths 
      });
    }

    const jsonData = fs.readFileSync(filePath, 'utf8');
    const data = JSON.parse(jsonData);
    
    // Enhance metadata with SEO-optimized alt text
    const enhancedData = enhanceImageMetadata(data);
    
    console.log(`Loaded ${Object.keys(enhancedData).length} images with enhanced metadata`);
    
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.status(200).json(enhancedData);
  } catch (error) {
    console.error('Error loading metadata:', error);
    res.status(500).json({ 
      error: 'Failed to load metadata', 
      details: error.message 
    });
  }
}