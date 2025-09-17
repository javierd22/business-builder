import { DesignContent } from './types';

export function seedContentFromIdea(idea: string): DesignContent {
  // Extract brand name from idea (first 2 words or noun chunk)
  const brandName = extractBrandName(idea);
  
  // Generate tagline from idea
  const tagline = generateTagline(idea);
  
  // Generate features from idea
  const features = generateFeatures(idea);
  
  // Generate CTAs
  const ctas = ['Get Started', 'Learn More'];
  
  return {
    brandName,
    tagline,
    features,
    ctas,
  };
}

export function hydrateFromPRD(prd: string, existing: DesignContent): DesignContent {
  const updated = { ...existing };
  
  // Extract features from PRD
  const prdFeatures = extractFeaturesFromPRD(prd);
  if (prdFeatures.length > 0) {
    updated.features = prdFeatures;
  }
  
  // Extract brand name if clearly present
  const prdBrandName = extractBrandNameFromPRD(prd);
  if (prdBrandName && prdBrandName !== existing.brandName) {
    updated.brandName = prdBrandName;
  }
  
  // Extract tagline if clearly present
  const prdTagline = extractTaglineFromPRD(prd);
  if (prdTagline && prdTagline !== existing.tagline) {
    updated.tagline = prdTagline;
  }
  
  // Extract CTAs from PRD
  const prdCTAs = extractCTAsFromPRD(prd);
  if (prdCTAs.length > 0) {
    updated.ctas = prdCTAs;
  }
  
  return updated;
}

export function hydrateFromUX(ux: string, existing: DesignContent): DesignContent {
  const updated = { ...existing };
  
  // Extract FAQ from UX
  const faq = extractFAQFromUX(ux);
  if (faq.length > 0) {
    updated.faq = faq;
  }
  
  // Extract testimonials from UX
  const testimonials = extractTestimonialsFromUX(ux);
  if (testimonials.length > 0) {
    updated.testimonials = testimonials;
  }
  
  // Extract additional features from UX
  const uxFeatures = extractFeaturesFromUX(ux);
  if (uxFeatures.length > 0) {
    updated.features = [...existing.features, ...uxFeatures].slice(0, 6);
  }
  
  return updated;
}

function extractBrandName(idea: string): string {
  // Simple extraction: first 2 words or first noun phrase
  const words = idea.trim().split(/\s+/);
  
  if (words.length <= 2) {
    return words.join(' ');
  }
  
  // Look for common business name patterns
  const firstTwoWords = words.slice(0, 2).join(' ');
  
  // Check if it's a noun phrase (simple heuristic)
  if (words[0].length > 3 && !['the', 'a', 'an', 'for', 'with', 'by'].includes(words[0].toLowerCase())) {
    return firstTwoWords;
  }
  
  // Fallback to first word
  return words[0];
}

function generateTagline(idea: string): string {
  // Simple tagline generation based on idea
  const ideaLower = idea.toLowerCase();
  
  if (ideaLower.includes('ai') || ideaLower.includes('artificial intelligence')) {
    return 'Harness the power of AI to transform your business';
  }
  
  if (ideaLower.includes('app') || ideaLower.includes('mobile')) {
    return 'The mobile solution you\'ve been waiting for';
  }
  
  if (ideaLower.includes('course') || ideaLower.includes('learn')) {
    return 'Master new skills with expert guidance';
  }
  
  if (ideaLower.includes('service') || ideaLower.includes('booking')) {
    return 'Professional service when you need it most';
  }
  
  if (ideaLower.includes('design') || ideaLower.includes('creative')) {
    return 'Creative solutions that make an impact';
  }
  
  if (ideaLower.includes('food') || ideaLower.includes('restaurant')) {
    return 'Delicious food, exceptional experience';
  }
  
  if (ideaLower.includes('event') || ideaLower.includes('conference')) {
    return 'Unforgettable experiences that inspire';
  }
  
  if (ideaLower.includes('newsletter') || ideaLower.includes('blog')) {
    return 'Insights and analysis you can trust';
  }
  
  if (ideaLower.includes('real estate') || ideaLower.includes('property')) {
    return 'Your trusted partner in real estate';
  }
  
  if (ideaLower.includes('shop') || ideaLower.includes('store')) {
    return 'Quality products, exceptional service';
  }
  
  // Default tagline
  return 'Innovative solutions for modern challenges';
}

function generateFeatures(idea: string): string[] {
  const ideaLower = idea.toLowerCase();
  const features: string[] = [];
  
  // Generate features based on idea content
  if (ideaLower.includes('ai') || ideaLower.includes('artificial intelligence')) {
    features.push('AI-powered automation');
    features.push('Smart analytics and insights');
    features.push('Seamless integration');
  } else if (ideaLower.includes('app') || ideaLower.includes('mobile')) {
    features.push('Intuitive mobile interface');
    features.push('Real-time synchronization');
    features.push('Offline functionality');
  } else if (ideaLower.includes('course') || ideaLower.includes('learn')) {
    features.push('Expert-led instruction');
    features.push('Hands-on projects');
    features.push('Lifetime access');
  } else if (ideaLower.includes('service') || ideaLower.includes('booking')) {
    features.push('Easy online booking');
    features.push('Professional service');
    features.push('Satisfaction guaranteed');
  } else if (ideaLower.includes('design') || ideaLower.includes('creative')) {
    features.push('Custom creative solutions');
    features.push('Strategic thinking');
    features.push('End-to-end project management');
  } else if (ideaLower.includes('food') || ideaLower.includes('restaurant')) {
    features.push('Fresh, quality ingredients');
    features.push('Authentic flavors');
    features.push('Warm, welcoming atmosphere');
  } else if (ideaLower.includes('event') || ideaLower.includes('conference')) {
    features.push('World-class speakers');
    features.push('Networking opportunities');
    features.push('Interactive workshops');
  } else if (ideaLower.includes('newsletter') || ideaLower.includes('blog')) {
    features.push('Weekly insights');
    features.push('Exclusive content');
    features.push('Expert analysis');
  } else if (ideaLower.includes('real estate') || ideaLower.includes('property')) {
    features.push('Local market expertise');
    features.push('Personalized service');
    features.push('Full-service support');
  } else if (ideaLower.includes('shop') || ideaLower.includes('store')) {
    features.push('Curated selection');
    features.push('Fast shipping');
    features.push('Easy returns');
  } else {
    // Default features
    features.push('Innovative approach');
    features.push('User-friendly design');
    features.push('Reliable performance');
  }
  
  return features.slice(0, 3);
}

function extractFeaturesFromPRD(prd: string): string[] {
  const features: string[] = [];
  const lines = prd.split('\n');
  
  for (const line of lines) {
    const trimmed = line.trim();
    
    // Look for bullet points or numbered lists
    if (trimmed.match(/^[-*•]\s+/) || trimmed.match(/^\d+\.\s+/)) {
      const feature = trimmed.replace(/^[-*•]\s+/, '').replace(/^\d+\.\s+/, '');
      if (feature.length > 10 && feature.length < 100) {
        features.push(feature);
      }
    }
    
    // Look for "Features:" or "Key Features:" sections
    if (trimmed.toLowerCase().includes('features:') || trimmed.toLowerCase().includes('key features:')) {
      // Extract features from subsequent lines
      const startIndex = lines.indexOf(line);
      for (let i = startIndex + 1; i < Math.min(startIndex + 10, lines.length); i++) {
        const nextLine = lines[i].trim();
        if (nextLine && !nextLine.includes(':') && nextLine.length > 10 && nextLine.length < 100) {
          features.push(nextLine);
        } else if (nextLine.includes(':')) {
          break;
        }
      }
    }
  }
  
  return features.slice(0, 6);
}

function extractBrandNameFromPRD(prd: string): string | null {
  // Look for clear brand name mentions
  const lines = prd.split('\n');
  
  for (const line of lines) {
    const trimmed = line.trim();
    
    // Look for "Product Name:" or "Brand:" patterns
    if (trimmed.match(/^(product name|brand|name):\s*(.+)$/i)) {
      const match = trimmed.match(/^(product name|brand|name):\s*(.+)$/i);
      if (match && match[2]) {
        return match[2].trim();
      }
    }
    
    // Look for title patterns
    if (trimmed.match(/^#+\s+(.+)$/)) {
      const match = trimmed.match(/^#+\s+(.+)$/);
      if (match && match[1] && match[1].length < 50) {
        return match[1].trim();
      }
    }
  }
  
  return null;
}

function extractTaglineFromPRD(prd: string): string | null {
  // Look for tagline or description patterns
  const lines = prd.split('\n');
  
  for (const line of lines) {
    const trimmed = line.trim();
    
    // Look for "Tagline:" or "Description:" patterns
    if (trimmed.match(/^(tagline|description|summary):\s*(.+)$/i)) {
      const match = trimmed.match(/^(tagline|description|summary):\s*(.+)$/i);
      if (match && match[2] && match[2].length > 10 && match[2].length < 200) {
        return match[2].trim();
      }
    }
  }
  
  return null;
}

function extractCTAsFromPRD(prd: string): string[] {
  const ctas: string[] = [];
  const lines = prd.split('\n');
  
  for (const line of lines) {
    const trimmed = line.trim();
    
    // Look for CTA patterns
    if (trimmed.match(/^(cta|call to action|button):\s*(.+)$/i)) {
      const match = trimmed.match(/^(cta|call to action|button):\s*(.+)$/i);
      if (match && match[2]) {
        ctas.push(match[2].trim());
      }
    }
  }
  
  return ctas.length > 0 ? ctas : ['Get Started', 'Learn More'];
}

function extractFAQFromUX(ux: string): Array<{ q: string; a: string }> {
  const faqs: Array<{ q: string; a: string }> = [];
  const lines = ux.split('\n');
  
  let currentQ = '';
  let currentA = '';
  let inFAQ = false;
  
  for (const line of lines) {
    const trimmed = line.trim();
    
    // Look for FAQ section
    if (trimmed.toLowerCase().includes('faq') || trimmed.toLowerCase().includes('questions')) {
      inFAQ = true;
      continue;
    }
    
    if (inFAQ) {
      // Look for question patterns
      if (trimmed.match(/^q[:\s]|^question[:\s]|^\?/i)) {
        if (currentQ && currentA) {
          faqs.push({ q: currentQ, a: currentA });
        }
        currentQ = trimmed.replace(/^q[:\s]|^question[:\s]|^\?\s*/i, '');
        currentA = '';
      } else if (trimmed.match(/^a[:\s]|^answer[:\s]/i)) {
        currentA = trimmed.replace(/^a[:\s]|^answer[:\s]/i, '');
      } else if (currentQ && trimmed && !trimmed.includes(':')) {
        currentA += (currentA ? ' ' : '') + trimmed;
      }
    }
  }
  
  if (currentQ && currentA) {
    faqs.push({ q: currentQ, a: currentA });
  }
  
  return faqs.slice(0, 5);
}

function extractTestimonialsFromUX(ux: string): string[] {
  const testimonials: string[] = [];
  const lines = ux.split('\n');
  
  for (const line of lines) {
    const trimmed = line.trim();
    
    // Look for testimonial patterns
    if (trimmed.match(/^["'](.+)["']\s*[-–]\s*(.+)$/)) {
      const match = trimmed.match(/^["'](.+)["']\s*[-–]\s*(.+)$/);
      if (match && match[1] && match[1].length > 20) {
        testimonials.push(match[1]);
      }
    }
  }
  
  return testimonials.slice(0, 3);
}

function extractFeaturesFromUX(ux: string): string[] {
  const features: string[] = [];
  const lines = ux.split('\n');
  
  for (const line of lines) {
    const trimmed = line.trim();
    
    // Look for feature patterns in UX
    if (trimmed.match(/^[-*•]\s+/) || trimmed.match(/^\d+\.\s+/)) {
      const feature = trimmed.replace(/^[-*•]\s+/, '').replace(/^\d+\.\s+/, '');
      if (feature.length > 10 && feature.length < 100) {
        features.push(feature);
      }
    }
  }
  
  return features.slice(0, 3);
}
