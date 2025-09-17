'use client';

import { useState } from 'react';
import { FAQProps } from '../types';
import { StyleVariant } from '../types';
import { getStyleTokens, getHeadingClass, getFocusRingClass } from '../styles';

interface FAQBlockProps {
  props: FAQProps;
  style: StyleVariant;
}

export default function FAQBlock({ props, style }: FAQBlockProps) {
  const tokens = getStyleTokens(style);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  
  return (
    <section className={`${tokens.colors.background} py-16 px-4`}>
      <div className="max-w-4xl mx-auto">
        {props.title && (
          <h2 className={`${getHeadingClass(style, 2)} text-center mb-12`}>
            {props.title}
          </h2>
        )}
        <div className="space-y-4">
          {props.faqs.map((faq, index) => (
            <div key={index} className={`${tokens.colors.surface} ${tokens.border} border rounded-lg`}>
              <button
                className={`w-full px-6 py-4 text-left flex justify-between items-center ${getFocusRingClass(style)}`}
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                aria-expanded={openIndex === index}
              >
                <span className={`font-medium ${tokens.colors.text.primary}`}>
                  {faq.question}
                </span>
                <span className={`${tokens.colors.text.muted} text-xl`}>
                  {openIndex === index ? '−' : '+'}
                </span>
              </button>
              {openIndex === index && (
                <div className="px-6 pb-4">
                  <p className={`${tokens.colors.text.secondary}`}>
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
