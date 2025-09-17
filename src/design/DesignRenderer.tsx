'use client';

import { forwardRef } from 'react';
import { Preset, DesignContent, StyleVariant, Block } from './types';
import HeroBlock from './blocks/Hero';
import LogoRowBlock from './blocks/LogoRow';
import FeatureGridBlock from './blocks/FeatureGrid';
import SplitImageBlock from './blocks/SplitImage';
import PricingBlock from './blocks/Pricing';
import TestimonialBlock from './blocks/Testimonial';
import FAQBlock from './blocks/FAQ';
import FooterBlock from './blocks/Footer';

interface DesignRendererProps {
  preset: Preset;
  content: Partial<DesignContent>;
  style: StyleVariant;
}

const DesignRenderer = forwardRef<HTMLDivElement, DesignRendererProps>(
  ({ preset, content, style }, ref) => {
    const renderBlock = (block: Block<unknown>, index: number) => {
      const props = { ...(block.props && typeof block.props === 'object' ? block.props : {}) } as Record<string, unknown>;
      
      // Replace placeholders with actual content
      Object.keys(props).forEach(key => {
        if (typeof props[key] === 'string') {
          props[key] = replacePlaceholders(props[key], content);
        } else if (Array.isArray(props[key])) {
          props[key] = (props[key] as unknown[]).map((item: unknown) => {
            if (typeof item === 'string') {
              return replacePlaceholders(item, content);
            } else if (typeof item === 'object' && item !== null) {
              return replaceObjectPlaceholders(item as Record<string, unknown>, content);
            }
            return item;
          });
        } else if (typeof props[key] === 'object' && props[key] !== null) {
          props[key] = replaceObjectPlaceholders(props[key] as Record<string, unknown>, content);
        }
      });

      switch (block.type) {
        case 'Hero':
          return <HeroBlock key={index} props={props as never} style={style} />;
        case 'LogoRow':
          return <LogoRowBlock key={index} props={props as never} style={style} />;
        case 'FeatureGrid':
          return <FeatureGridBlock key={index} props={props as never} style={style} />;
        case 'SplitImage':
          return <SplitImageBlock key={index} props={props as never} style={style} />;
        case 'Pricing':
          return <PricingBlock key={index} props={props as never} style={style} />;
        case 'Testimonial':
          return <TestimonialBlock key={index} props={props as never} style={style} />;
        case 'FAQ':
          return <FAQBlock key={index} props={props as never} style={style} />;
        case 'Footer':
          return <FooterBlock key={index} props={props as never} style={style} />;
        default:
          return null;
      }
    };

    return (
      <div ref={ref} className="min-h-screen">
        {preset.blocks.map((block, index) => renderBlock(block, index))}
      </div>
    );
  }
);

DesignRenderer.displayName = 'DesignRenderer';

function replacePlaceholders(text: string, content: Partial<DesignContent>): string {
  return text
    .replace(/\{\{brandName\}\}/g, content.brandName || 'Your Brand')
    .replace(/\{\{tagline\}\}/g, content.tagline || 'Your amazing tagline')
    .replace(/\{\{ctas\.0\}\}/g, content.ctas?.[0] || 'Get Started')
    .replace(/\{\{ctas\.1\}\}/g, content.ctas?.[1] || 'Learn More')
    .replace(/\{\{features\.0\}\}/g, content.features?.[0] || 'Amazing Feature 1')
    .replace(/\{\{features\.1\}\}/g, content.features?.[1] || 'Amazing Feature 2')
    .replace(/\{\{features\.2\}\}/g, content.features?.[2] || 'Amazing Feature 3')
    .replace(/\{\{faq\.0\.q\}\}/g, content.faq?.[0]?.q || 'What is this?')
    .replace(/\{\{faq\.0\.a\}\}/g, content.faq?.[0]?.a || 'This is a great solution for your needs.')
    .replace(/\{\{faq\.1\.q\}\}/g, content.faq?.[1]?.q || 'How does it work?')
    .replace(/\{\{faq\.1\.a\}\}/g, content.faq?.[1]?.a || 'It works by providing excellent value.')
    .replace(/\{\{faq\.2\.q\}\}/g, content.faq?.[2]?.q || 'Is it worth it?')
    .replace(/\{\{faq\.2\.a\}\}/g, content.faq?.[2]?.a || 'Absolutely! You\'ll love the results.');
}

function replaceObjectPlaceholders(obj: Record<string, unknown>, content: Partial<DesignContent>): Record<string, unknown> {
  const result = { ...obj };
  
  Object.keys(result).forEach(key => {
    if (typeof result[key] === 'string') {
      result[key] = replacePlaceholders(result[key], content);
    } else if (Array.isArray(result[key])) {
      result[key] = (result[key] as unknown[]).map((item: unknown) => {
        if (typeof item === 'string') {
          return replacePlaceholders(item, content);
        } else if (typeof item === 'object' && item !== null) {
          return replaceObjectPlaceholders(item as Record<string, unknown>, content);
        }
        return item;
      });
    } else if (typeof result[key] === 'object' && result[key] !== null) {
      result[key] = replaceObjectPlaceholders(result[key] as Record<string, unknown>, content);
    }
  });
  
  return result;
}

export default DesignRenderer;
