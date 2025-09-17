'use client';

import React, { useState } from 'react';

interface DiffViewProps {
  leftText: string;
  rightText: string;
  className?: string;
}

interface DiffLine {
  type: 'equal' | 'added' | 'removed';
  content: string;
}

/**
 * Simple word-level diff algorithm
 * Compares two texts and returns diff lines
 */
function createDiff(leftText: string, rightText: string): DiffLine[] {
  const leftWords = leftText.split(/(\s+)/);
  const rightWords = rightText.split(/(\s+)/);
  
  const diff: DiffLine[] = [];
  let leftIndex = 0;
  let rightIndex = 0;
  
  while (leftIndex < leftWords.length || rightIndex < rightWords.length) {
    if (leftIndex >= leftWords.length) {
      // Only right words remain
      diff.push({ type: 'added', content: rightWords[rightIndex] });
      rightIndex++;
    } else if (rightIndex >= rightWords.length) {
      // Only left words remain
      diff.push({ type: 'removed', content: leftWords[leftIndex] });
      leftIndex++;
    } else if (leftWords[leftIndex] === rightWords[rightIndex]) {
      // Words match
      diff.push({ type: 'equal', content: leftWords[leftIndex] });
      leftIndex++;
      rightIndex++;
    } else {
      // Words don't match - look ahead to find next match
      let leftLookahead = leftIndex + 1;
      let rightLookahead = rightIndex + 1;
      let foundMatch = false;
      
      // Look ahead up to 5 words to find a match
      while (leftLookahead < leftWords.length && leftLookahead - leftIndex <= 5) {
        rightLookahead = rightIndex + 1;
        while (rightLookahead < rightWords.length && rightLookahead - rightIndex <= 5) {
          if (leftWords[leftLookahead] === rightWords[rightLookahead]) {
            foundMatch = true;
            break;
          }
          rightLookahead++;
        }
        if (foundMatch) break;
        leftLookahead++;
      }
      
      if (foundMatch) {
        // Add removed words from left
        for (let i = leftIndex; i < leftLookahead; i++) {
          diff.push({ type: 'removed', content: leftWords[i] });
        }
        // Add added words from right
        for (let i = rightIndex; i < rightLookahead; i++) {
          diff.push({ type: 'added', content: rightWords[i] });
        }
        leftIndex = leftLookahead;
        rightIndex = rightLookahead;
      } else {
        // No match found, treat as different words
        diff.push({ type: 'removed', content: leftWords[leftIndex] });
        diff.push({ type: 'added', content: rightWords[rightIndex] });
        leftIndex++;
        rightIndex++;
      }
    }
  }
  
  return diff;
}

export default function DiffView({ leftText, rightText, className = '' }: DiffViewProps) {
  const [reducedMotion, setReducedMotion] = useState(false);
  
  React.useEffect(() => {
    // Check for reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);
    
    const handleChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handleChange);
    
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);
  
  const diff = createDiff(leftText, rightText);
  
  return (
    <div className={`diff-view ${className}`}>
      <div 
        className="whitespace-pre-wrap font-mono text-sm leading-relaxed"
        role="region"
        aria-label="Text diff comparison"
      >
        {diff.map((line, index) => (
          <span
            key={index}
            className={`
              inline-block
              ${line.type === 'added' 
                ? 'bg-emerald-100 text-emerald-800 border-l-2 border-emerald-400 px-1' 
                : line.type === 'removed' 
                ? 'bg-red-100 text-red-800 border-l-2 border-red-400 px-1' 
                : 'text-[#4A5568]'
              }
              ${!reducedMotion ? 'transition-colors duration-150' : ''}
            `}
          >
            {line.content}
          </span>
        ))}
      </div>
      
      {/* Legend */}
      <div className="mt-4 flex items-center gap-4 text-xs text-[#6B7280]">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-emerald-100 border border-emerald-400"></div>
          <span>Added</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-red-100 border border-red-400"></div>
          <span>Removed</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 bg-transparent border border-[#E8E9EA]"></div>
          <span>Unchanged</span>
        </div>
      </div>
    </div>
  );
}
