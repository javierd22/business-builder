'use client';

import { FeatureGridProps } from '../types';
import { StyleVariant } from '../types';
import { getStyleTokens, getHeadingClass, getCardClass } from '../styles';

interface FeatureGridBlockProps {
  props: FeatureGridProps;
  style: StyleVariant;
}

export default function FeatureGridBlock({ props, style }: FeatureGridBlockProps) {
  const tokens = getStyleTokens(style);
  
  return (
    <section className={`${tokens.colors.background} py-16 px-4`}>
      <div className="max-w-6xl mx-auto">
        {props.title && (
          <div className="text-center mb-12">
            <h2 className={`${getHeadingClass(style, 2)} mb-4`}>
              {props.title}
            </h2>
            {props.subtitle && (
              <p className={`text-lg ${tokens.colors.text.secondary} max-w-2xl mx-auto`}>
                {props.subtitle}
              </p>
            )}
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {props.features.map((feature, index) => (
            <div key={index} className={getCardClass(style)}>
              <div className="p-6">
                {feature.icon && (
                  <div className={`w-12 h-12 ${tokens.colors.accent} rounded-lg flex items-center justify-center mb-4`}>
                    <span className="text-white text-xl">✨</span>
                  </div>
                )}
                <h3 className={`${getHeadingClass(style, 4)} mb-3`}>
                  {feature.title}
                </h3>
                <p className={`${tokens.colors.text.secondary}`}>
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
