'use client';

import LZString from 'lz-string';
import { StyleVariant, Vertical, DesignContent } from '@/design/types';

export interface SharePayload {
  v: number;
  style: StyleVariant;
  vertical: Vertical;
  presetId: string;
  content: DesignContent;
}

const CURRENT_VERSION = 1;

export function encodeShareURL(payload: SharePayload): string {
  if (typeof window === 'undefined') {
    return '';
  }
  
  try {
    // Ensure version is set
    const payloadWithVersion = { ...payload, v: CURRENT_VERSION };
    
    // Compress the payload
    const compressed = LZString.compressToEncodedURIComponent(JSON.stringify(payloadWithVersion));
    
    // Build the share URL
    const baseUrl = window.location.origin;
    return `${baseUrl}/preview/share#${compressed}`;
  } catch (error) {
    console.error('Error encoding share URL:', error);
    return '';
  }
}

export function decodeShareHash(hash: string): SharePayload | null {
  if (!hash) return null;
  
  try {
    // Remove the # if present
    const cleanHash = hash.startsWith('#') ? hash.slice(1) : hash;
    
    // Decompress the payload
    const decompressed = LZString.decompressFromEncodedURIComponent(cleanHash);
    if (!decompressed) return null;
    
    // Parse the JSON
    const payload = JSON.parse(decompressed) as SharePayload;
    
    // Validate the payload structure
    if (!payload || typeof payload !== 'object') return null;
    if (payload.v !== CURRENT_VERSION) return null;
    if (!payload.style || !payload.vertical || !payload.presetId || !payload.content) return null;
    
    return payload;
  } catch (error) {
    console.error('Error decoding share hash:', error);
    return null;
  }
}

export function copyToClipboard(text: string): Promise<boolean> {
  if (typeof window === 'undefined') return Promise.resolve(false);
  
  if (navigator.clipboard && window.isSecureContext) {
    return navigator.clipboard.writeText(text).then(() => true).catch(() => false);
  } else {
    // Fallback for older browsers
    try {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const result = document.execCommand('copy');
      document.body.removeChild(textArea);
      return Promise.resolve(result);
    } catch (error) {
      console.error('Error copying to clipboard:', error);
      return Promise.resolve(false);
    }
  }
}
