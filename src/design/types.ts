export type StyleVariant = 'luxury' | 'minimal' | 'tech' | 'editorial';

export type Vertical = 
  | 'b2b_saas' 
  | 'single_product' 
  | 'ecommerce_lite' 
  | 'local_service' 
  | 'course' 
  | 'agency' 
  | 'newsletter' 
  | 'restaurant' 
  | 'real_estate' 
  | 'event';

export type BlockType = 
  | 'Hero' 
  | 'LogoRow' 
  | 'FeatureGrid' 
  | 'SplitImage' 
  | 'Pricing' 
  | 'Testimonial' 
  | 'FAQ' 
  | 'Footer';

export interface Block<T = unknown> {
  type: BlockType;
  props: T;
}

export interface Preset {
  id: string;
  name: string;
  verticals: Vertical[];
  blocks: Block[];
}

export interface DesignContent {
  brandName: string;
  tagline: string;
  features: string[];
  ctas: string[];
  faq?: Array<{ q: string; a: string }>;
  testimonials?: string[];
  images?: string[];
}

// Block-specific prop types
export interface HeroProps {
  brandName: string;
  tagline: string;
  cta: string;
  backgroundImage?: string;
}

export interface LogoRowProps {
  logos: string[];
  title?: string;
}

export interface FeatureGridProps {
  features: Array<{
    title: string;
    description: string;
    icon?: string;
  }>;
  title?: string;
  subtitle?: string;
}

export interface SplitImageProps {
  title: string;
  description: string;
  image?: string;
  reverse?: boolean;
  cta?: string;
}

export interface PricingProps {
  plans: Array<{
    name: string;
    price: string;
    features: string[];
    cta: string;
    popular?: boolean;
  }>;
  title?: string;
  subtitle?: string;
}

export interface TestimonialProps {
  testimonials: Array<{
    quote: string;
    author: string;
    role?: string;
    company?: string;
    avatar?: string;
  }>;
  title?: string;
}

export interface FAQProps {
  faqs: Array<{
    question: string;
    answer: string;
  }>;
  title?: string;
}

export interface FooterProps {
  brandName: string;
  links: Array<{
    title: string;
    items: Array<{
      label: string;
      href: string;
    }>;
  }>;
  social?: Array<{
    platform: string;
    href: string;
  }>;
}
