'use client';

import { TestimonialProps } from '../types';
import { StyleVariant } from '../types';
import { getStyleTokens, getHeadingClass, getCardClass } from '../styles';

interface TestimonialBlockProps {
  props: TestimonialProps;
  style: StyleVariant;
}

export default function TestimonialBlock({ props, style }: TestimonialBlockProps) {
  const tokens = getStyleTokens(style);
  
  return (
    <section className={`${tokens.colors.surface} py-16 px-4`}>
      <div className="max-w-6xl mx-auto">
        {props.title && (
          <h2 className={`${getHeadingClass(style, 2)} text-center mb-12`}>
            {props.title}
          </h2>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {props.testimonials.map((testimonial, index) => (
            <div key={index} className={getCardClass(style)}>
              <div className="p-6">
                <blockquote className={`text-lg ${tokens.colors.text.secondary} mb-6 italic`}>
                  &ldquo;{testimonial.quote}&rdquo;
                </blockquote>
                <div className="flex items-center">
                  {testimonial.avatar ? (
                    <img 
                      src={testimonial.avatar} 
                      alt={testimonial.author}
                      className="w-12 h-12 rounded-full mr-4"
                    />
                  ) : (
                    <div className={`w-12 h-12 ${tokens.colors.accent} rounded-full flex items-center justify-center mr-4`}>
                      <span className="text-white font-semibold">
                        {testimonial.author.charAt(0)}
                      </span>
                    </div>
                  )}
                  <div>
                    <div className={`font-semibold ${tokens.colors.text.primary}`}>
                      {testimonial.author}
                    </div>
                    {testimonial.role && (
                      <div className={`text-sm ${tokens.colors.text.muted}`}>
                        {testimonial.role}
                        {testimonial.company && ` at ${testimonial.company}`}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
