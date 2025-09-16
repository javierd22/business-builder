/**
 * Security utilities for content validation and PII detection
 */

export interface SecurityResult {
  hasPII: boolean;
  hasProfanity: boolean;
  reasons: string[];
}

export interface ValidationOptions {
  minChars?: number;
  maxChars?: number;
}

/**
 * Detect potential PII in text
 */
export function detectPII(text: string): SecurityResult {
  const reasons: string[] = [];
  let hasPII = false;

  // Email patterns
  const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
  if (emailRegex.test(text)) {
    hasPII = true;
    reasons.push('Email addresses detected');
  }

  // Phone number patterns (US format)
  const phoneRegex = /\b(?:\+?1[-.\s]?)?\(?[0-9]{3}\)?[-.\s]?[0-9]{3}[-.\s]?[0-9]{4}\b/g;
  if (phoneRegex.test(text)) {
    hasPII = true;
    reasons.push('Phone numbers detected');
  }

  // SSN patterns (US format)
  const ssnRegex = /\b\d{3}-?\d{2}-?\d{4}\b/g;
  if (ssnRegex.test(text)) {
    hasPII = true;
    reasons.push('SSN patterns detected');
  }

  // Credit card patterns (basic)
  const ccRegex = /\b\d{4}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4}\b/g;
  if (ccRegex.test(text)) {
    hasPII = true;
    reasons.push('Credit card patterns detected');
  }

  // Address patterns (basic)
  const addressRegex = /\b\d+\s+[A-Za-z\s]+(?:Street|St|Avenue|Ave|Road|Rd|Drive|Dr|Lane|Ln|Boulevard|Blvd|Way|Place|Pl)\b/gi;
  if (addressRegex.test(text)) {
    hasPII = true;
    reasons.push('Street addresses detected');
  }

  return { hasPII, hasProfanity: false, reasons };
}

/**
 * Detect profanity in text (basic implementation)
 */
export function detectProfanity(text: string): SecurityResult {
  const reasons: string[] = [];
  let hasProfanity = false;

  // Basic profanity filter (case-insensitive)
  const profanityWords = [
    'damn', 'hell', 'crap', 'stupid', 'idiot', 'moron',
    'hate', 'kill', 'die', 'death', 'murder', 'violence'
  ];

  const lowerText = text.toLowerCase();
  const foundWords = profanityWords.filter(word => 
    lowerText.includes(word.toLowerCase())
  );

  if (foundWords.length > 0) {
    hasProfanity = true;
    reasons.push(`Inappropriate language detected: ${foundWords.join(', ')}`);
  }

  return { hasPII: false, hasProfanity, reasons };
}

/**
 * Redact sensitive information from text
 */
export function redact(text: string): string {
  let redacted = text;

  // Redact emails
  redacted = redacted.replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, '[EMAIL]');

  // Redact phone numbers
  redacted = redacted.replace(/\b(?:\+?1[-.\s]?)?\(?[0-9]{3}\)?[-.\s]?[0-9]{3}[-.\s]?[0-9]{4}\b/g, '[PHONE]');

  // Redact SSNs
  redacted = redacted.replace(/\b\d{3}-?\d{2}-?\d{4}\b/g, '[SSN]');

  // Redact credit cards
  redacted = redacted.replace(/\b\d{4}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4}\b/g, '[CARD]');

  return redacted;
}

/**
 * Validate input text for length and content
 */
export function validateInput(text: string, options: ValidationOptions = {}): SecurityResult {
  const { minChars = 10, maxChars = 10000 } = options;
  const reasons: string[] = [];
  let hasPII = false;
  let hasProfanity = false;

  // Length validation
  if (text.length < minChars) {
    reasons.push(`Text too short (minimum ${minChars} characters)`);
  }
  if (text.length > maxChars) {
    reasons.push(`Text too long (maximum ${maxChars} characters)`);
  }

  // PII detection
  const piiResult = detectPII(text);
  if (piiResult.hasPII) {
    hasPII = true;
    reasons.push(...piiResult.reasons);
  }

  // Profanity detection
  const profanityResult = detectProfanity(text);
  if (profanityResult.hasProfanity) {
    hasProfanity = true;
    reasons.push(...profanityResult.reasons);
  }

  return { hasPII, hasProfanity, reasons };
}

/**
 * Determine if content should be blocked from LLM processing
 */
export function shouldBlockForLLM(text: string): { blocked: boolean; reasons: string[] } {
  const validation = validateInput(text, { minChars: 10, maxChars: 10000 });
  
  // Block if PII or severe profanity detected
  const blocked = validation.hasPII || validation.hasProfanity;
  
  return {
    blocked,
    reasons: validation.reasons
  };
}
