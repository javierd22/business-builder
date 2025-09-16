"use client";

import React, { useState, useEffect } from 'react';

export interface PromptParams {
  temperature: number;
  depth: 'brief' | 'standard' | 'deep';
  format: 'markdown' | 'bulleted';
  revision?: string;
}

interface PromptControlsProps {
  initialParams?: Partial<PromptParams>;
  showRevision?: boolean;
  onChange: (params: PromptParams) => void;
  className?: string;
}

export default function PromptControls({ 
  initialParams, 
  showRevision = false, 
  onChange,
  className = ""
}: PromptControlsProps) {
  const [params, setParams] = useState<PromptParams>({
    temperature: initialParams?.temperature ?? 0.7,
    depth: initialParams?.depth ?? 'standard',
    format: initialParams?.format ?? 'markdown',
    revision: initialParams?.revision ?? ''
  });

  useEffect(() => {
    onChange(params);
  }, [params, onChange]);

  const handleTemperatureChange = (value: number) => {
    setParams(prev => ({ ...prev, temperature: value }));
  };

  const handleDepthChange = (depth: 'brief' | 'standard' | 'deep') => {
    setParams(prev => ({ ...prev, depth }));
  };

  const handleFormatChange = (format: 'markdown' | 'bulleted') => {
    setParams(prev => ({ ...prev, format }));
  };

  const handleRevisionChange = (revision: string) => {
    setParams(prev => ({ ...prev, revision }));
  };

  return (
    <div className={`bg-gradient-to-br from-[#FBF9F4] via-[#F8F4ED] to-[#F5F0E8] border border-[#E8E9EA] rounded-xl p-4 space-y-4 ${className}`}>
      <div className="flex items-center gap-2 mb-3">
        <div className="h-1 w-1 rounded-full bg-[#F7DC6F]"></div>
        <h3 className="text-sm font-medium text-[#4A5568]">Generation Settings</h3>
      </div>

      {/* Temperature Control */}
      <div className="space-y-2">
        <label htmlFor="temperature" className="block text-sm font-medium text-[#4A5568]">
          Creativity Level: {params.temperature.toFixed(1)}
        </label>
        <div className="flex items-center gap-3">
          <span className="text-xs text-[#6B7280]">Focused</span>
          <input
            id="temperature"
            type="range"
            min="0.2"
            max="1.0"
            step="0.1"
            value={params.temperature}
            onChange={(e) => handleTemperatureChange(parseFloat(e.target.value))}
            className="flex-1 h-2 bg-[#E8E9EA] rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#F7DC6F] focus:ring-opacity-50"
            style={{
              background: `linear-gradient(to right, #E8E9EA 0%, #E8E9EA ${(params.temperature - 0.2) / 0.8 * 100}%, #F7DC6F ${(params.temperature - 0.2) / 0.8 * 100}%, #F7DC6F 100%)`
            }}
          />
          <span className="text-xs text-[#6B7280]">Creative</span>
        </div>
      </div>

      {/* Depth Control */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-[#4A5568]">
          Detail Level
        </label>
        <div className="flex gap-2">
          {(['brief', 'standard', 'deep'] as const).map((depth) => (
            <button
              key={depth}
              type="button"
              onClick={() => handleDepthChange(depth)}
              className={`px-3 py-2 text-sm font-medium rounded-lg border transition-all focus:outline-none focus:ring-2 focus:ring-[#F7DC6F] focus:ring-opacity-50 ${
                params.depth === depth
                  ? 'bg-gradient-to-r from-[#FFF4C4] via-[#FFECB3] to-[#FFE0B2] border-[#F7DC6F] text-[#8B7355] shadow-[0_2px_8px_rgba(247,220,111,0.3)]'
                  : 'bg-white border-[#E8E9EA] text-[#6B7280] hover:border-[#D1D5DB] hover:bg-[#F8F9FA]'
              }`}
            >
              {depth.charAt(0).toUpperCase() + depth.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Format Control */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-[#4A5568]">
          Output Format
        </label>
        <select
          value={params.format}
          onChange={(e) => handleFormatChange(e.target.value as 'markdown' | 'bulleted')}
          className="w-full px-3 py-2 text-sm border border-[#E8E9EA] rounded-lg bg-white text-[#4A5568] focus:outline-none focus:ring-2 focus:ring-[#F7DC6F] focus:ring-opacity-50 focus:border-[#F7DC6F]"
        >
          <option value="markdown">Markdown</option>
          <option value="bulleted">Bulleted Lists</option>
        </select>
      </div>

      {/* Revision Notes */}
      {showRevision && (
        <div className="space-y-2">
          <label htmlFor="revision" className="block text-sm font-medium text-[#4A5568]">
            Revision Notes (Optional)
          </label>
          <textarea
            id="revision"
            value={params.revision || ''}
            onChange={(e) => handleRevisionChange(e.target.value)}
            placeholder="Describe what you'd like to change or improve..."
            rows={3}
            className="w-full px-3 py-2 text-sm border border-[#E8E9EA] rounded-lg bg-white text-[#4A5568] placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#F7DC6F] focus:ring-opacity-50 focus:border-[#F7DC6F] resize-none"
          />
        </div>
      )}
    </div>
  );
}
