'use client';

import { SplitImageProps } from '../types';
import { StyleVariant } from '../types';
import { getStyleTokens, getHeadingClass, getButtonClass } from '../styles';

interface SplitImageBlockProps {
  props: SplitImageProps;
  style: StyleVariant;
}

export default function SplitImageBlock({ props, style }: SplitImageBlockProps) {
  const tokens = getStyleTokens(style);
  
  return (
    <section className={`${tokens.colors.surface} py-16 px-4`}>
      <div className="max-w-6xl mx-auto">
        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${props.reverse ? 'lg:grid-flow-col-dense' : ''}`}>
          <div className={props.reverse ? 'lg:col-start-2' : ''}>
            <h2 className={`${getHeadingClass(style, 2)} mb-6`}>
              {props.title}
            </h2>
            <p className={`text-lg ${tokens.colors.text.secondary} mb-8`}>
              {props.description}
            </p>
            {props.cta && (
              <button className={getButtonClass(style, 'md')}>
                {props.cta}
              </button>
            )}
          </div>
          <div className={props.reverse ? 'lg:col-start-1' : ''}>
            {props.image ? (
              <img 
                src={props.image} 
                alt={props.title}
                className="w-full h-auto rounded-lg shadow-lg"
              />
            ) : (
              <div className={`w-full h-64 ${tokens.colors.secondary} rounded-lg flex items-center justify-center`}>
                <span className={`${tokens.colors.text.muted} text-lg`}>Image placeholder</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
