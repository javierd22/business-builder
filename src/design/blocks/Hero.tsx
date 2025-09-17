'use client';

import { HeroProps } from '../types';
import { StyleVariant } from '../types';
import { getStyleTokens, getButtonClass, getHeadingClass } from '../styles';

interface HeroBlockProps {
  props: HeroProps;
  style: StyleVariant;
}

export default function HeroBlock({ props, style }: HeroBlockProps) {
  const tokens = getStyleTokens(style);
  
  return (
    <section className={`${tokens.colors.primary} py-16 px-4`}>
      <div className="max-w-6xl mx-auto text-center">
        <h1 className={`${getHeadingClass(style, 1)} mb-6`}>
          {props.brandName}
        </h1>
        <p className={`text-xl ${tokens.colors.text.secondary} mb-8 max-w-3xl mx-auto`}>
          {props.tagline}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className={getButtonClass(style, 'lg')}>
            {props.cta}
          </button>
          {props.backgroundImage && (
            <div className="mt-8">
              <img 
                src={props.backgroundImage} 
                alt={props.brandName}
                className="max-w-full h-auto rounded-lg shadow-lg mx-auto"
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
