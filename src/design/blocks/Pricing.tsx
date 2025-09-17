'use client';

import { PricingProps } from '../types';
import { StyleVariant } from '../types';
import { getStyleTokens, getHeadingClass, getButtonClass, getCardClass } from '../styles';

interface PricingBlockProps {
  props: PricingProps;
  style: StyleVariant;
}

export default function PricingBlock({ props, style }: PricingBlockProps) {
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
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${Math.min(props.plans.length, 3)} gap-8`}>
          {props.plans.map((plan, index) => (
            <div 
              key={index} 
              className={`${getCardClass(style)} ${plan.popular ? `${tokens.colors.accent} text-white` : ''} relative`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className={`${tokens.colors.accent} text-white px-4 py-1 rounded-full text-sm font-medium`}>
                    Most Popular
                  </span>
                </div>
              )}
              <div className="p-6">
                <h3 className={`${getHeadingClass(style, 3)} mb-2 ${plan.popular ? 'text-white' : ''}`}>
                  {plan.name}
                </h3>
                <div className={`${plan.popular ? 'text-white' : tokens.colors.text.primary} mb-6`}>
                  <span className="text-4xl font-bold">{plan.price}</span>
                  {plan.price.includes('/') && (
                    <span className="text-lg opacity-75">per month</span>
                  )}
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <span className={`${plan.popular ? 'text-white' : tokens.colors.accent} mr-3`}>✓</span>
                      <span className={plan.popular ? 'text-white' : tokens.colors.text.secondary}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
                <button 
                  className={`w-full ${plan.popular ? 'bg-white text-amber-600 hover:bg-gray-100' : getButtonClass(style, 'md')}`}
                >
                  {plan.cta}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
