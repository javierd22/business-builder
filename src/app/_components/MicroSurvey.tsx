'use client';

import React, { useState } from 'react';
import { Button } from './ui/Button';
import { Textarea } from './ui/Textarea';
import type { AssumptionId } from '@/lib/assumptions';

export interface MicroSurveyProps {
  assumptionId: AssumptionId;
  question: string;
  options: string[];
  onSubmit: (result: { choice: string; note?: string }) => void;
  variant?: 'inline' | 'box';
  className?: string;
}

export default function MicroSurvey({ 
  assumptionId, 
  question, 
  options, 
  onSubmit, 
  variant = 'box',
  className = "" 
}: MicroSurveyProps) {
  const [selectedChoice, setSelectedChoice] = useState<string>('');
  const [note, setNote] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!selectedChoice || isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 200)); // Brief delay for UX
      onSubmit({ choice: selectedChoice, note: note.trim() || undefined });
      setIsSubmitted(true);
    } catch (error) {
      console.warn('Survey submission failed:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className={`p-4 bg-emerald-50 border border-emerald-200 rounded-lg ${className}`} role="status" aria-live="polite">
        <p className="text-sm text-emerald-800 font-medium">✓ Thank you for your feedback!</p>
      </div>
    );
  }

  const containerClass = variant === 'inline' 
    ? `p-3 bg-[#FBF9F4] border border-[#D4B886] rounded-md ${className}`
    : `p-4 bg-[#FBF9F4] border border-[#C0A062] rounded-lg shadow-sm ${className}`;

  return (
    <div className={containerClass}>
      <div className="space-y-3">
        <p className="text-sm font-medium text-[#8B6914]" id={`survey-question-${assumptionId}`}>
          {question}
        </p>
        
        <div className="space-y-2" role="radiogroup" aria-labelledby={`survey-question-${assumptionId}`}>
          {options.map((option, index) => (
            <label key={option} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name={`survey-${assumptionId}`}
                value={option}
                checked={selectedChoice === option}
                onChange={(e) => setSelectedChoice(e.target.value)}
                className="w-4 h-4 text-[#D4AF37] bg-white border-2 border-[#C0A062] focus:ring-2 focus:ring-[#D4AF37] focus:ring-offset-2 rounded"
                aria-describedby={selectedChoice === option ? `option-${index}-desc` : undefined}
              />
              <span className="text-sm text-[#8B6914] select-none">{option}</span>
            </label>
          ))}
        </div>
        
        <div className="space-y-2">
          <label htmlFor={`survey-note-${assumptionId}`} className="block text-xs text-[#8B6914] font-medium">
            What&apos;s missing? (optional)
          </label>
          <Textarea
            id={`survey-note-${assumptionId}`}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Any additional thoughts..."
            rows={2}
            className="text-xs"
          />
        </div>
        
        <div className="flex justify-end">
          <Button
            onClick={handleSubmit}
            disabled={!selectedChoice || isSubmitting}
            size="sm"
            className="bg-[#D4AF37] hover:bg-[#B8941F] text-white font-medium focus:ring-2 focus:ring-[#D4AF37] focus:ring-offset-2"
          >
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </Button>
        </div>
      </div>
    </div>
  );
}
