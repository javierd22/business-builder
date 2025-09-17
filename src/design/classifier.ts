import { Vertical } from './types';

interface ClassificationInput {
  idea: string;
  persona?: string;
  job?: string;
  meta?: Record<string, unknown>;
}

// Keyword buckets for vertical classification
const VERTICAL_KEYWORDS: Record<Vertical, string[]> = {
  b2b_saas: [
    'software', 'saas', 'platform', 'tool', 'dashboard', 'analytics', 'management',
    'automation', 'workflow', 'productivity', 'collaboration', 'integration',
    'api', 'cloud', 'subscription', 'enterprise', 'business', 'team', 'project'
  ],
  single_product: [
    'product', 'device', 'gadget', 'app', 'physical', 'hardware', 'invention',
    'innovation', 'prototype', 'manufacturing', 'retail', 'ecommerce', 'store'
  ],
  ecommerce_lite: [
    'shop', 'store', 'marketplace', 'selling', 'products', 'inventory',
    'shopping', 'buy', 'sell', 'retail', 'merchandise', 'catalog'
  ],
  local_service: [
    'service', 'local', 'booking', 'appointment', 'salon', 'studio', 'clinic',
    'repair', 'cleaning', 'maintenance', 'consultation', 'coaching', 'training',
    'delivery', 'pickup', 'on-demand', 'near me', 'in my area'
  ],
  course: [
    'course', 'learning', 'education', 'training', 'tutorial', 'lesson',
    'curriculum', 'instructor', 'student', 'teach', 'learn', 'skill',
    'certification', 'workshop', 'masterclass', 'online', 'video'
  ],
  agency: [
    'agency', 'creative', 'design', 'marketing', 'advertising', 'consulting',
    'portfolio', 'client', 'project', 'brand', 'strategy', 'campaign',
    'studio', 'freelance', 'services', 'solutions'
  ],
  newsletter: [
    'newsletter', 'blog', 'content', 'writing', 'publishing', 'subscriber',
    'email', 'news', 'updates', 'insights', 'trends', 'analysis',
    'journalism', 'media', 'publication', 'magazine'
  ],
  restaurant: [
    'restaurant', 'food', 'dining', 'cuisine', 'menu', 'chef', 'kitchen',
    'cafe', 'bar', 'bistro', 'delivery', 'takeout', 'catering', 'meal'
  ],
  real_estate: [
    'real estate', 'property', 'house', 'home', 'apartment', 'rental',
    'buying', 'selling', 'agent', 'broker', 'mortgage', 'investment',
    'listing', 'property management', 'housing'
  ],
  event: [
    'event', 'conference', 'meeting', 'workshop', 'seminar', 'ticket',
    'venue', 'speaker', 'attendee', 'registration', 'networking',
    'exhibition', 'trade show', 'festival', 'party', 'celebration'
  ]
};

export function classifyVertical(input: ClassificationInput): Vertical {
  const { idea, persona, job, meta } = input;
  
  // If meta contains vertical information from LLM, prefer it
  if (meta?.verticals && Array.isArray(meta.verticals) && meta.verticals.length > 0) {
    const llmVertical = (meta.verticals[0] as string).toLowerCase();
    const validVertical = Object.keys(VERTICAL_KEYWORDS).find(v => 
      v === llmVertical || v.replace('_', ' ') === llmVertical
    ) as Vertical;
    
    if (validVertical) {
      return validVertical;
    }
  }
  
  // Combine all text for analysis
  const textToAnalyze = [
    idea,
    persona,
    job
  ].filter(Boolean).join(' ').toLowerCase();
  
  // Score each vertical based on keyword matches
  const scores: Record<Vertical, number> = {
    b2b_saas: 0,
    single_product: 0,
    ecommerce_lite: 0,
    local_service: 0,
    course: 0,
    agency: 0,
    newsletter: 0,
    restaurant: 0,
    real_estate: 0,
    event: 0,
  };
  
  Object.entries(VERTICAL_KEYWORDS).forEach(([vertical, keywords]) => {
    keywords.forEach(keyword => {
      if (textToAnalyze.includes(keyword)) {
        scores[vertical as Vertical]++;
      }
    });
  });
  
  // Find the vertical with the highest score
  const maxScore = Math.max(...Object.values(scores));
  
  if (maxScore === 0) {
    // No keywords matched, use fallback logic
    return classifyByContext(idea, persona, job);
  }
  
  // Return the vertical with the highest score
  const bestVertical = Object.entries(scores).find(([_, score]) => score === maxScore)?.[0] as Vertical;
  
  return bestVertical || 'b2b_saas';
}

function classifyByContext(idea: string, persona?: string, job?: string): Vertical {
  const text = [idea, persona, job].filter(Boolean).join(' ').toLowerCase();
  
  // Context-based classification
  if (text.includes('book') || text.includes('course') || text.includes('learn')) {
    return 'course';
  }
  
  if (text.includes('design') || text.includes('creative') || text.includes('agency')) {
    return 'agency';
  }
  
  if (text.includes('food') || text.includes('restaurant') || text.includes('dining')) {
    return 'restaurant';
  }
  
  if (text.includes('house') || text.includes('property') || text.includes('real estate')) {
    return 'real_estate';
  }
  
  if (text.includes('event') || text.includes('conference') || text.includes('meeting')) {
    return 'event';
  }
  
  if (text.includes('newsletter') || text.includes('blog') || text.includes('content')) {
    return 'newsletter';
  }
  
  if (text.includes('service') || text.includes('booking') || text.includes('appointment')) {
    return 'local_service';
  }
  
  if (text.includes('shop') || text.includes('store') || text.includes('sell')) {
    return 'ecommerce_lite';
  }
  
  if (text.includes('product') && !text.includes('software')) {
    return 'single_product';
  }
  
  // Default to B2B SaaS for business-related ideas
  return 'b2b_saas';
}

/**
 * Suggest a vertical from PRD meta data
 * @param meta - Meta data from PRD response
 * @returns Suggested vertical or null if no valid suggestion
 */
export function suggestVerticalFromMeta(meta: Record<string, unknown>): Vertical | null {
  if (meta?.verticals?.[0]) {
    const llmVertical = meta.verticals[0].toLowerCase();
    const validVertical = Object.keys(VERTICAL_KEYWORDS).find(v => 
      v === llmVertical || v.replace('_', ' ') === llmVertical
    ) as Vertical;
    
    if (validVertical) {
      return validVertical;
    }
  }
  return null;
}
