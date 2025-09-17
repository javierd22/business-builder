import { Preset, Vertical, Block, HeroProps, LogoRowProps, FeatureGridProps, SplitImageProps, PricingProps, TestimonialProps, FAQProps, FooterProps } from '../types';

const PRESETS: Record<Vertical, Preset[]> = {
  b2b_saas: [
    {
      id: 'b2b_saas_standard',
      name: 'Standard SaaS',
      verticals: ['b2b_saas'],
      blocks: [
        {
          type: 'Hero',
          props: {
            brandName: '{{brandName}}',
            tagline: '{{tagline}}',
            cta: '{{ctas.0}}',
          } as HeroProps,
        },
        {
          type: 'LogoRow',
          props: {
            logos: ['Company 1', 'Company 2', 'Company 3', 'Company 4'],
            title: 'Trusted by leading companies',
          } as LogoRowProps,
        },
        {
          type: 'FeatureGrid',
          props: {
            title: 'Everything you need to succeed',
            subtitle: 'Powerful features designed for modern teams',
            features: [
              { title: '{{features.0}}', description: 'Streamline your workflow with our intuitive interface' },
              { title: '{{features.1}}', description: 'Scale effortlessly as your business grows' },
              { title: '{{features.2}}', description: 'Get insights that drive real results' },
            ],
          } as FeatureGridProps,
        },
        {
          type: 'Pricing',
          props: {
            title: 'Simple, transparent pricing',
            subtitle: 'Choose the plan that fits your needs',
            plans: [
              {
                name: 'Starter',
                price: '$29/mo',
                features: ['Up to 5 users', 'Basic features', 'Email support'],
                cta: 'Start Free Trial',
              },
              {
                name: 'Professional',
                price: '$99/mo',
                features: ['Up to 25 users', 'Advanced features', 'Priority support'],
                cta: 'Start Free Trial',
                popular: true,
              },
              {
                name: 'Enterprise',
                price: 'Custom',
                features: ['Unlimited users', 'All features', 'Dedicated support'],
                cta: 'Contact Sales',
              },
            ],
          } as PricingProps,
        },
        {
          type: 'Testimonial',
          props: {
            title: 'What our customers say',
            testimonials: [
              {
                quote: 'This tool has transformed how we work. The ROI was immediate.',
                author: 'Sarah Johnson',
                role: 'CEO',
                company: 'TechCorp',
              },
              {
                quote: 'Finally, a solution that actually works for our team size.',
                author: 'Mike Chen',
                role: 'CTO',
                company: 'StartupXYZ',
              },
            ],
          } as TestimonialProps,
        },
        {
          type: 'FAQ',
          props: {
            title: 'Frequently Asked Questions',
            faqs: [
              { question: '{{faq.0.q}}', answer: '{{faq.0.a}}' },
              { question: '{{faq.1.q}}', answer: '{{faq.1.a}}' },
              { question: '{{faq.2.q}}', answer: '{{faq.2.a}}' },
            ],
          } as FAQProps,
        },
        {
          type: 'Footer',
          props: {
            brandName: '{{brandName}}',
            links: [
              {
                title: 'Product',
                items: [
                  { label: 'Features', href: '#features' },
                  { label: 'Pricing', href: '#pricing' },
                  { label: 'Integrations', href: '#integrations' },
                ],
              },
              {
                title: 'Company',
                items: [
                  { label: 'About', href: '#about' },
                  { label: 'Blog', href: '#blog' },
                  { label: 'Careers', href: '#careers' },
                ],
              },
              {
                title: 'Support',
                items: [
                  { label: 'Help Center', href: '#help' },
                  { label: 'Contact', href: '#contact' },
                  { label: 'Status', href: '#status' },
                ],
              },
            ],
          } as FooterProps,
        },
      ],
    },
  ],
  single_product: [
    {
      id: 'single_product_standard',
      name: 'Single Product',
      verticals: ['single_product'],
      blocks: [
        {
          type: 'Hero',
          props: {
            brandName: '{{brandName}}',
            tagline: '{{tagline}}',
            cta: '{{ctas.0}}',
          } as HeroProps,
        },
        {
          type: 'FeatureGrid',
          props: {
            title: 'Why choose {{brandName}}?',
            subtitle: 'The perfect solution for your needs',
            features: [
              { title: '{{features.0}}', description: 'Experience the difference quality makes' },
              { title: '{{features.1}}', description: 'Built to last with premium materials' },
              { title: '{{features.2}}', description: 'Designed with your success in mind' },
            ],
          } as FeatureGridProps,
        },
        {
          type: 'Pricing',
          props: {
            title: 'Simple pricing',
            subtitle: 'One product, one price',
            plans: [
              {
                name: '{{brandName}}',
                price: '$99',
                features: ['{{features.0}}', '{{features.1}}', '{{features.2}}', '30-day guarantee'],
                cta: 'Order Now',
                popular: true,
              },
            ],
          } as PricingProps,
        },
        {
          type: 'Testimonial',
          props: {
            title: 'Customer reviews',
            testimonials: [
              {
                quote: 'This product exceeded all my expectations. Highly recommended!',
                author: 'Alex Thompson',
                role: 'Customer',
              },
              {
                quote: 'Best purchase I\'ve made this year. Worth every penny.',
                author: 'Maria Garcia',
                role: 'Customer',
              },
            ],
          } as TestimonialProps,
        },
        {
          type: 'Footer',
          props: {
            brandName: '{{brandName}}',
            links: [
              {
                title: 'Product',
                items: [
                  { label: 'Features', href: '#features' },
                  { label: 'Specifications', href: '#specs' },
                  { label: 'Reviews', href: '#reviews' },
                ],
              },
              {
                title: 'Support',
                items: [
                  { label: 'Shipping', href: '#shipping' },
                  { label: 'Returns', href: '#returns' },
                  { label: 'Contact', href: '#contact' },
                ],
              },
            ],
          } as FooterProps,
        },
      ],
    },
  ],
  local_service: [
    {
      id: 'local_service_standard',
      name: 'Local Service',
      verticals: ['local_service'],
      blocks: [
        {
          type: 'Hero',
          props: {
            brandName: '{{brandName}}',
            tagline: '{{tagline}}',
            cta: '{{ctas.0}}',
          } as HeroProps,
        },
        {
          type: 'FeatureGrid',
          props: {
            title: 'Our services',
            subtitle: 'Professional {{brandName}} in your area',
            features: [
              { title: '{{features.0}}', description: 'Expert service with local knowledge' },
              { title: '{{features.1}}', description: 'Flexible scheduling to fit your needs' },
              { title: '{{features.2}}', description: 'Satisfaction guaranteed or your money back' },
            ],
          } as FeatureGridProps,
        },
        {
          type: 'Testimonial',
          props: {
            title: 'What our customers say',
            testimonials: [
              {
                quote: 'Professional, reliable, and reasonably priced. Will definitely use again.',
                author: 'John Smith',
                role: 'Homeowner',
              },
              {
                quote: 'They showed up on time and did excellent work. Highly recommend!',
                author: 'Lisa Brown',
                role: 'Business Owner',
              },
            ],
          } as TestimonialProps,
        },
        {
          type: 'FAQ',
          props: {
            title: 'Common Questions',
            faqs: [
              { question: '{{faq.0.q}}', answer: '{{faq.0.a}}' },
              { question: '{{faq.1.q}}', answer: '{{faq.1.a}}' },
              { question: '{{faq.2.q}}', answer: '{{faq.2.a}}' },
            ],
          } as FAQProps,
        },
        {
          type: 'Footer',
          props: {
            brandName: '{{brandName}}',
            links: [
              {
                title: 'Services',
                items: [
                  { label: 'What We Do', href: '#services' },
                  { label: 'Areas We Serve', href: '#areas' },
                  { label: 'Get Quote', href: '#quote' },
                ],
              },
              {
                title: 'Contact',
                items: [
                  { label: 'Phone', href: 'tel:+1234567890' },
                  { label: 'Email', href: 'mailto:info@example.com' },
                  { label: 'Address', href: '#address' },
                ],
              },
            ],
          } as FooterProps,
        },
      ],
    },
  ],
  agency: [
    {
      id: 'agency_standard',
      name: 'Creative Agency',
      verticals: ['agency'],
      blocks: [
        {
          type: 'Hero',
          props: {
            brandName: '{{brandName}}',
            tagline: '{{tagline}}',
            cta: '{{ctas.0}}',
          } as HeroProps,
        },
        {
          type: 'LogoRow',
          props: {
            logos: ['Client 1', 'Client 2', 'Client 3', 'Client 4'],
            title: 'Trusted by innovative brands',
          } as LogoRowProps,
        },
        {
          type: 'FeatureGrid',
          props: {
            title: 'Our expertise',
            subtitle: 'Creative solutions that drive results',
            features: [
              { title: '{{features.0}}', description: 'Strategic thinking meets creative execution' },
              { title: '{{features.1}}', description: 'Data-driven insights for better outcomes' },
              { title: '{{features.2}}', description: 'End-to-end project management' },
            ],
          } as FeatureGridProps,
        },
        {
          type: 'Testimonial',
          props: {
            title: 'Client success stories',
            testimonials: [
              {
                quote: 'They transformed our brand and helped us reach new heights.',
                author: 'Jennifer Lee',
                role: 'Marketing Director',
                company: 'InnovateCorp',
              },
              {
                quote: 'Professional, creative, and results-oriented. Exactly what we needed.',
                author: 'David Wilson',
                role: 'CEO',
                company: 'TechStart',
              },
            ],
          } as TestimonialProps,
        },
        {
          type: 'Footer',
          props: {
            brandName: '{{brandName}}',
            links: [
              {
                title: 'Services',
                items: [
                  { label: 'Branding', href: '#branding' },
                  { label: 'Web Design', href: '#web' },
                  { label: 'Marketing', href: '#marketing' },
                ],
              },
              {
                title: 'Work',
                items: [
                  { label: 'Portfolio', href: '#portfolio' },
                  { label: 'Case Studies', href: '#cases' },
                  { label: 'Process', href: '#process' },
                ],
              },
            ],
          } as FooterProps,
        },
      ],
    },
  ],
  course: [
    {
      id: 'course_standard',
      name: 'Online Course',
      verticals: ['course'],
      blocks: [
        {
          type: 'Hero',
          props: {
            brandName: '{{brandName}}',
            tagline: '{{tagline}}',
            cta: '{{ctas.0}}',
          } as HeroProps,
        },
        {
          type: 'FeatureGrid',
          props: {
            title: 'What you\'ll learn',
            subtitle: 'Comprehensive curriculum designed for success',
            features: [
              { title: '{{features.0}}', description: 'Master the fundamentals with expert guidance' },
              { title: '{{features.1}}', description: 'Hands-on projects and real-world applications' },
              { title: '{{features.2}}', description: 'Lifetime access to all materials and updates' },
            ],
          } as FeatureGridProps,
        },
        {
          type: 'Pricing',
          props: {
            title: 'Choose your learning path',
            subtitle: 'Flexible options for every budget',
            plans: [
              {
                name: 'Self-Paced',
                price: '$97',
                features: ['Lifetime access', 'All video lessons', 'Downloadable resources'],
                cta: 'Enroll Now',
              },
              {
                name: 'With Support',
                price: '$197',
                features: ['Everything in Self-Paced', '1-on-1 coaching calls', 'Private community'],
                cta: 'Enroll Now',
                popular: true,
              },
            ],
          } as PricingProps,
        },
        {
          type: 'Testimonial',
          props: {
            title: 'Student success stories',
            testimonials: [
              {
                quote: 'This course changed my career. The instructor is amazing!',
                author: 'Sarah Martinez',
                role: 'Student',
              },
              {
                quote: 'Worth every penny. I learned more in 6 weeks than in 6 months on my own.',
                author: 'Tom Anderson',
                role: 'Student',
              },
            ],
          } as TestimonialProps,
        },
        {
          type: 'Footer',
          props: {
            brandName: '{{brandName}}',
            links: [
              {
                title: 'Course',
                items: [
                  { label: 'Curriculum', href: '#curriculum' },
                  { label: 'Instructor', href: '#instructor' },
                  { label: 'FAQ', href: '#faq' },
                ],
              },
              {
                title: 'Support',
                items: [
                  { label: 'Help Center', href: '#help' },
                  { label: 'Contact', href: '#contact' },
                  { label: 'Refund Policy', href: '#refunds' },
                ],
              },
            ],
          } as FooterProps,
        },
      ],
    },
  ],
  newsletter: [
    {
      id: 'newsletter_standard',
      name: 'Newsletter',
      verticals: ['newsletter'],
      blocks: [
        {
          type: 'Hero',
          props: {
            brandName: '{{brandName}}',
            tagline: '{{tagline}}',
            cta: '{{ctas.0}}',
          } as HeroProps,
        },
        {
          type: 'FeatureGrid',
          props: {
            title: 'What you\'ll get',
            subtitle: 'Valuable insights delivered to your inbox',
            features: [
              { title: '{{features.0}}', description: 'Weekly insights and analysis' },
              { title: '{{features.1}}', description: 'Exclusive content not available elsewhere' },
              { title: '{{features.2}}', description: 'Join thousands of like-minded readers' },
            ],
          } as FeatureGridProps,
        },
        {
          type: 'Testimonial',
          props: {
            title: 'What readers say',
            testimonials: [
              {
                quote: 'This newsletter is my go-to source for industry insights. Highly recommended!',
                author: 'Alex Chen',
                role: 'Reader',
              },
              {
                quote: 'Always relevant and well-written. I look forward to every issue.',
                author: 'Maria Rodriguez',
                role: 'Reader',
              },
            ],
          } as TestimonialProps,
        },
        {
          type: 'Footer',
          props: {
            brandName: '{{brandName}}',
            links: [
              {
                title: 'Newsletter',
                items: [
                  { label: 'Archive', href: '#archive' },
                  { label: 'Subscribe', href: '#subscribe' },
                  { label: 'Unsubscribe', href: '#unsubscribe' },
                ],
              },
              {
                title: 'About',
                items: [
                  { label: 'Author', href: '#author' },
                  { label: 'Mission', href: '#mission' },
                  { label: 'Contact', href: '#contact' },
                ],
              },
            ],
          } as FooterProps,
        },
      ],
    },
  ],
  ecommerce_lite: [
    {
      id: 'ecommerce_lite_standard',
      name: 'E-commerce Lite',
      verticals: ['ecommerce_lite'],
      blocks: [
        {
          type: 'Hero',
          props: {
            brandName: '{{brandName}}',
            tagline: '{{tagline}}',
            cta: '{{ctas.0}}',
          } as HeroProps,
        },
        {
          type: 'FeatureGrid',
          props: {
            title: 'Why shop with us',
            subtitle: 'Quality products, exceptional service',
            features: [
              { title: '{{features.0}}', description: 'Carefully curated selection' },
              { title: '{{features.1}}', description: 'Fast and reliable shipping' },
              { title: '{{features.2}}', description: 'Easy returns and exchanges' },
            ],
          } as FeatureGridProps,
        },
        {
          type: 'SplitImage',
          props: {
            title: 'Featured Products',
            description: 'Discover our most popular items, handpicked for quality and style.',
            cta: 'Shop Now',
            reverse: false,
          } as SplitImageProps,
        },
        {
          type: 'Pricing',
          props: {
            title: 'Simple pricing',
            subtitle: 'No hidden fees, no surprises',
            plans: [
              {
                name: 'Free Shipping',
                price: 'On orders over $50',
                features: ['Free standard shipping', 'No minimum order', 'Track your package'],
                cta: 'Shop Now',
                popular: true,
              },
              {
                name: 'Express Delivery',
                price: '$9.99',
                features: ['Next-day delivery', 'Priority support', 'Free returns'],
                cta: 'Upgrade',
              },
            ],
          } as PricingProps,
        },
        {
          type: 'Testimonial',
          props: {
            title: 'Customer reviews',
            testimonials: [
              {
                quote: 'Great products and even better customer service. Will definitely order again!',
                author: 'Jessica Taylor',
                role: 'Customer',
              },
              {
                quote: 'Fast shipping and exactly as described. Highly recommend!',
                author: 'Michael Johnson',
                role: 'Customer',
              },
            ],
          } as TestimonialProps,
        },
        {
          type: 'Footer',
          props: {
            brandName: '{{brandName}}',
            links: [
              {
                title: 'Shop',
                items: [
                  { label: 'All Products', href: '#products' },
                  { label: 'Categories', href: '#categories' },
                  { label: 'Sale', href: '#sale' },
                ],
              },
              {
                title: 'Customer Service',
                items: [
                  { label: 'Shipping Info', href: '#shipping' },
                  { label: 'Returns', href: '#returns' },
                  { label: 'Contact', href: '#contact' },
                ],
              },
            ],
          } as FooterProps,
        },
      ],
    },
  ],
  restaurant: [
    {
      id: 'restaurant_standard',
      name: 'Restaurant',
      verticals: ['restaurant'],
      blocks: [
        {
          type: 'Hero',
          props: {
            brandName: '{{brandName}}',
            tagline: '{{tagline}}',
            cta: '{{ctas.0}}',
          } as HeroProps,
        },
        {
          type: 'FeatureGrid',
          props: {
            title: 'Our specialties',
            subtitle: 'Fresh ingredients, authentic flavors',
            features: [
              { title: '{{features.0}}', description: 'Made fresh daily with local ingredients' },
              { title: '{{features.1}}', description: 'Family recipes passed down through generations' },
              { title: '{{features.2}}', description: 'Warm, welcoming atmosphere for all occasions' },
            ],
          } as FeatureGridProps,
        },
        {
          type: 'SplitImage',
          props: {
            title: 'Signature Dishes',
            description: 'Experience our most beloved creations, crafted with passion and the finest ingredients.',
            cta: 'View Menu',
            reverse: true,
          } as SplitImageProps,
        },
        {
          type: 'Pricing',
          props: {
            title: 'Dining options',
            subtitle: 'Choose your perfect dining experience',
            plans: [
              {
                name: 'Dine In',
                price: 'Full Service',
                features: ['Complete menu', 'Table service', 'Full bar', 'Reservations available'],
                cta: 'Make Reservation',
                popular: true,
              },
              {
                name: 'Takeout',
                price: 'Quick & Easy',
                features: ['Online ordering', 'Curbside pickup', 'Fast preparation', 'Same great taste'],
                cta: 'Order Now',
              },
            ],
          } as PricingProps,
        },
        {
          type: 'Testimonial',
          props: {
            title: 'What diners say',
            testimonials: [
              {
                quote: 'The best meal I\'ve had in months. The flavors are incredible!',
                author: 'Robert Kim',
                role: 'Diner',
              },
              {
                quote: 'Great food, great service, great atmosphere. We\'ll be back soon!',
                author: 'Amanda White',
                role: 'Diner',
              },
            ],
          } as TestimonialProps,
        },
        {
          type: 'FAQ',
          props: {
            title: 'Frequently Asked Questions',
            faqs: [
              { question: '{{faq.0.q}}', answer: '{{faq.0.a}}' },
              { question: '{{faq.1.q}}', answer: '{{faq.1.a}}' },
              { question: '{{faq.2.q}}', answer: '{{faq.2.a}}' },
            ],
          } as FAQProps,
        },
        {
          type: 'Footer',
          props: {
            brandName: '{{brandName}}',
            links: [
              {
                title: 'Menu',
                items: [
                  { label: 'Appetizers', href: '#appetizers' },
                  { label: 'Main Courses', href: '#mains' },
                  { label: 'Desserts', href: '#desserts' },
                ],
              },
              {
                title: 'Visit Us',
                items: [
                  { label: 'Hours', href: '#hours' },
                  { label: 'Location', href: '#location' },
                  { label: 'Reservations', href: '#reservations' },
                ],
              },
            ],
          } as FooterProps,
        },
      ],
    },
  ],
  real_estate: [
    {
      id: 'real_estate_standard',
      name: 'Real Estate',
      verticals: ['real_estate'],
      blocks: [
        {
          type: 'Hero',
          props: {
            brandName: '{{brandName}}',
            tagline: '{{tagline}}',
            cta: '{{ctas.0}}',
          } as HeroProps,
        },
        {
          type: 'LogoRow',
          props: {
            logos: ['Zillow', 'Realtor.com', 'Redfin', 'Trulia'],
            title: 'Trusted by leading platforms',
          } as LogoRowProps,
        },
        {
          type: 'FeatureGrid',
          props: {
            title: 'Our services',
            subtitle: 'Expert guidance for your real estate needs',
            features: [
              { title: '{{features.0}}', description: 'Local market expertise and insights' },
              { title: '{{features.1}}', description: 'Personalized service tailored to your goals' },
              { title: '{{features.2}}', description: 'Full-service support from start to finish' },
            ],
          } as FeatureGridProps,
        },
        {
          type: 'SplitImage',
          props: {
            title: 'Featured Properties',
            description: 'Discover your perfect home with our curated selection of premium properties.',
            cta: 'View Listings',
            reverse: false,
          } as SplitImageProps,
        },
        {
          type: 'Pricing',
          props: {
            title: 'Service packages',
            subtitle: 'Choose the level of support that fits your needs',
            plans: [
              {
                name: 'Full Service',
                price: '6% Commission',
                features: ['Complete marketing', 'Professional photos', 'Open houses', 'Negotiation support'],
                cta: 'Get Started',
                popular: true,
              },
              {
                name: 'Flat Fee',
                price: '$2,500',
                features: ['MLS listing', 'Basic marketing', 'Contract support', 'No commission'],
                cta: 'Learn More',
              },
            ],
          } as PricingProps,
        },
        {
          type: 'Testimonial',
          props: {
            title: 'Client testimonials',
            testimonials: [
              {
                quote: 'They helped us find our dream home in record time. Professional and knowledgeable.',
                author: 'Jennifer Davis',
                role: 'Home Buyer',
              },
              {
                quote: 'Sold our house for more than we expected. Highly recommend their services.',
                author: 'Mark Thompson',
                role: 'Home Seller',
              },
            ],
          } as TestimonialProps,
        },
        {
          type: 'Footer',
          props: {
            brandName: '{{brandName}}',
            links: [
              {
                title: 'Services',
                items: [
                  { label: 'Buying', href: '#buying' },
                  { label: 'Selling', href: '#selling' },
                  { label: 'Renting', href: '#renting' },
                ],
              },
              {
                title: 'Resources',
                items: [
                  { label: 'Market Reports', href: '#reports' },
                  { label: 'Home Valuation', href: '#valuation' },
                  { label: 'Contact', href: '#contact' },
                ],
              },
            ],
          } as FooterProps,
        },
      ],
    },
  ],
  event: [
    {
      id: 'event_standard',
      name: 'Event',
      verticals: ['event'],
      blocks: [
        {
          type: 'Hero',
          props: {
            brandName: '{{brandName}}',
            tagline: '{{tagline}}',
            cta: '{{ctas.0}}',
          } as HeroProps,
        },
        {
          type: 'FeatureGrid',
          props: {
            title: 'Event highlights',
            subtitle: 'An unforgettable experience awaits',
            features: [
              { title: '{{features.0}}', description: 'World-class speakers and presenters' },
              { title: '{{features.1}}', description: 'Networking opportunities with industry leaders' },
              { title: '{{features.2}}', description: 'Hands-on workshops and interactive sessions' },
            ],
          } as FeatureGridProps,
        },
        {
          type: 'SplitImage',
          props: {
            title: 'Event Venue',
            description: 'Join us at a premier location with state-of-the-art facilities and comfortable seating.',
            cta: 'View Venue',
            reverse: true,
          } as SplitImageProps,
        },
        {
          type: 'Pricing',
          props: {
            title: 'Ticket options',
            subtitle: 'Choose the experience that fits your needs',
            plans: [
              {
                name: 'General Admission',
                price: '$99',
                features: ['Full event access', 'Lunch included', 'Networking reception'],
                cta: 'Buy Tickets',
              },
              {
                name: 'VIP',
                price: '$199',
                features: ['Everything in General', 'VIP seating', 'Meet & greet', 'Exclusive materials'],
                cta: 'Buy Tickets',
                popular: true,
              },
            ],
          } as PricingProps,
        },
        {
          type: 'Testimonial',
          props: {
            title: 'What attendees say',
            testimonials: [
              {
                quote: 'One of the best events I\'ve attended. Learned so much and met amazing people.',
                author: 'Sarah Wilson',
                role: 'Attendee',
              },
              {
                quote: 'Well organized, great content, and excellent networking opportunities.',
                author: 'David Lee',
                role: 'Attendee',
              },
            ],
          } as TestimonialProps,
        },
        {
          type: 'FAQ',
          props: {
            title: 'Frequently Asked Questions',
            faqs: [
              { question: '{{faq.0.q}}', answer: '{{faq.0.a}}' },
              { question: '{{faq.1.q}}', answer: '{{faq.1.a}}' },
              { question: '{{faq.2.q}}', answer: '{{faq.2.a}}' },
            ],
          } as FAQProps,
        },
        {
          type: 'Footer',
          props: {
            brandName: '{{brandName}}',
            links: [
              {
                title: 'Event',
                items: [
                  { label: 'Schedule', href: '#schedule' },
                  { label: 'Speakers', href: '#speakers' },
                  { label: 'Venue', href: '#venue' },
                ],
              },
              {
                title: 'Tickets',
                items: [
                  { label: 'Buy Tickets', href: '#tickets' },
                  { label: 'Group Rates', href: '#groups' },
                  { label: 'Refund Policy', href: '#refunds' },
                ],
              },
            ],
          } as FooterProps,
        },
      ],
    },
  ],
};

export { PRESETS };
