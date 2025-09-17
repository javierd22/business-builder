'use client';

import { FooterProps } from '../types';
import { StyleVariant } from '../types';
import { getStyleTokens, getHeadingClass } from '../styles';

interface FooterBlockProps {
  props: FooterProps;
  style: StyleVariant;
}

export default function FooterBlock({ props, style }: FooterBlockProps) {
  const tokens = getStyleTokens(style);
  
  return (
    <footer className={`${tokens.colors.secondary} py-12 px-4`}>
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <h3 className={`${getHeadingClass(style, 3)} mb-4`}>
              {props.brandName}
            </h3>
            <p className={`${tokens.colors.text.secondary} text-sm`}>
              Building something amazing together.
            </p>
          </div>
          
          {props.links.map((linkGroup, index) => (
            <div key={index}>
              <h4 className={`font-semibold ${tokens.colors.text.primary} mb-4`}>
                {linkGroup.title}
              </h4>
              <ul className="space-y-2">
                {linkGroup.items.map((item, itemIndex) => (
                  <li key={itemIndex}>
                    <a 
                      href={item.href}
                      className={`${tokens.colors.text.secondary} hover:${tokens.colors.text.primary} text-sm transition-colors`}
                    >
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        {props.social && (
          <div className="mt-8 pt-8 border-t border-amber-200">
            <div className="flex justify-center space-x-6">
              {props.social.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className={`${tokens.colors.text.secondary} hover:${tokens.colors.text.primary} transition-colors`}
                >
                  {social.platform}
                </a>
              ))}
            </div>
          </div>
        )}
        
        <div className="mt-8 pt-8 border-t border-amber-200 text-center">
          <p className={`${tokens.colors.text.muted} text-sm`}>
            © 2024 {props.brandName}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
