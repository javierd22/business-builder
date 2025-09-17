'use client';

// Feature flags for conditional visibility
export const NEXT_PUBLIC_SHOW_CLARIFICATIONS = process.env.NEXT_PUBLIC_SHOW_CLARIFICATIONS === 'true' || 
  (process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_SHOW_CLARIFICATIONS !== 'false');

export const NEXT_PUBLIC_SHOW_ROADMAP = process.env.NEXT_PUBLIC_SHOW_ROADMAP === 'true' || 
  (process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_SHOW_ROADMAP !== 'false');

export const NEXT_PUBLIC_SHOW_INSTANT_PREVIEW = process.env.NEXT_PUBLIC_SHOW_INSTANT_PREVIEW === 'true' || 
  (process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_SHOW_INSTANT_PREVIEW !== 'false');

// Legacy exports for backward compatibility
export const shouldShowResearch = () => process.env.NEXT_PUBLIC_SHOW_RESEARCH === 'true' || 
  (process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_SHOW_RESEARCH !== 'false');

export const shouldShowDocLinks = () => process.env.NEXT_PUBLIC_SHOW_DOC_LINKS === 'true' || 
  (process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_SHOW_DOC_LINKS !== 'false');