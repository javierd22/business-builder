'use client';

import { LogoRowProps } from '../types';
import { StyleVariant } from '../types';
import { getStyleTokens, getHeadingClass } from '../styles';

interface LogoRowBlockProps {
  props: LogoRowProps;
  style: StyleVariant;
}

export default function LogoRowBlock({ props, style }: LogoRowBlockProps) {
  const tokens = getStyleTokens(style);
  
  return (
    <section className={`${tokens.colors.surface} py-12 px-4`}>
      <div className="max-w-6xl mx-auto">
        {props.title && (
          <h2 className={`${getHeadingClass(style, 3)} text-center mb-8 ${tokens.colors.text.secondary}`}>
            {props.title}
          </h2>
        )}
        <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
          {props.logos.map((logo, index) => (
            <div 
              key={index}
              className={`${tokens.colors.text.muted} text-lg font-medium px-4 py-2 border ${tokens.colors.border} rounded-lg`}
            >
              {logo}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
