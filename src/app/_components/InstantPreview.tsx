'use client';

import { useState, useEffect, useRef } from 'react';
import { classifyVertical, suggestVerticalFromMeta } from '@/design/classifier';
import { seedContentFromIdea, hydrateFromPRD, hydrateFromUX } from '@/design/content-extractor';
import { PRESETS } from '@/design/presets';
import { shufflePreset } from '@/design/layout-variants';
import DesignRenderer from '@/design/DesignRenderer';
import { downloadHTML } from '@/lib/export-html';
import { downloadPNG } from '@/lib/export-image';
import { getCached, setCached } from '@/lib/cache';
import { recordEvent } from '@/lib/observability';
import { encodeShareURL } from '@/lib/share';
import { StyleVariant, DesignContent, Vertical } from '@/design/types';
import { getButtonClass, getFocusRingClass } from '@/design/styles';

interface InstantPreviewProps {
  idea: string;
  persona?: string;
  job?: string;
}

export default function InstantPreview({ idea, persona, job }: InstantPreviewProps) {
  const [vertical, setVertical] = useState<Vertical>('b2b_saas');
  const [content, setContent] = useState<DesignContent>({ brandName: '', tagline: '', features: [], ctas: [] });
  const [style, setStyle] = useState<StyleVariant>('minimal');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [surveyResponse, setSurveyResponse] = useState<'yes' | 'no' | null>(null);
  const [surveyNotes, setSurveyNotes] = useState('');
  const [showSurvey, setShowSurvey] = useState(false);
  const [showReclassifyBanner, setShowReclassifyBanner] = useState(false);
  const [suggestedVertical, setSuggestedVertical] = useState<Vertical | null>(null);
  const [showHelp, setShowHelp] = useState(false);
  const [presetId, setPresetId] = useState<string>('');
  
  const previewRef = useRef<HTMLDivElement>(null);
  
  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      
      switch (e.key.toLowerCase()) {
        case 'r':
          e.preventDefault();
          handleRegenerateLayout();
          break;
        case 's':
          e.preventDefault();
          handleShare();
          break;
        case 'e':
          e.preventDefault();
          handleExportPNG();
          break;
        case 'h':
          e.preventDefault();
          setShowHelp(!showHelp);
          break;
      }
    };
    
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [showHelp]);
  
  // Generate initial preview
  useEffect(() => {
    if (!idea.trim()) return;
    
    setIsLoading(true);
    const startTime = Date.now();
    
    try {
      // Check cache first
      const cacheKey = {
        step: 'preview' as const,
        idea,
        persona,
        job,
        promptVersion: 'v1',
        temperature: 0.7,
        depth: 'standard',
        format: 'json',
      };
      
      const cached = getCached(cacheKey);
      if (cached) {
        const cachedData = JSON.parse(cached.text);
        setVertical(cachedData.vertical);
        setContent(cachedData.content);
        setMessage('Preview loaded from cache!');
        
        recordEvent({
          name: 'preview_cached',
          route: '/idea',
          ok: true,
          ms: Date.now() - startTime,
          meta: { vertical: cachedData.vertical, cached: true }
        });
      } else {
        // Classify vertical
        const classifiedVertical = classifyVertical({ idea, persona, job });
        setVertical(classifiedVertical);
        
        // Set preset ID
        const firstPreset = PRESETS[classifiedVertical]?.[0];
        setPresetId(firstPreset?.id || '');
        
        // Generate content
        const initialContent = seedContentFromIdea(idea);
        setContent(initialContent);
        
        // Cache the result
        const previewData = {
          vertical: classifiedVertical,
          content: initialContent,
        };
        setCached(cacheKey, JSON.stringify(previewData), {
          vertical: classifiedVertical,
          ideaLength: idea.length,
        });
        
        setMessage('Preview generated!');
        
        recordEvent({
          name: 'preview_generated',
          route: '/idea',
          ok: true,
          ms: Date.now() - startTime,
          meta: { vertical: classifiedVertical, cached: false }
        });
      }
      
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error generating preview:', error);
      setMessage('Error generating preview');
      
      recordEvent({
        name: 'preview_error',
        route: '/idea',
        ok: false,
        ms: Date.now() - startTime,
        meta: { error: error instanceof Error ? error.message : 'Unknown error' }
      });
    } finally {
      setIsLoading(false);
    }
  }, [idea, persona, job]);
  
  // Handle PRD/UX hydration and reclassify suggestions
  useEffect(() => {
    // This would be called when PRD/UX data arrives
    // For now, we'll simulate this with a timeout
    const simulatePRDArrival = () => {
      // Simulate PRD meta suggesting a different vertical
      const mockMeta = {
        verticals: ['local_service'] // This would come from actual PRD response
      };
      
      const suggested = suggestVerticalFromMeta(mockMeta);
      if (suggested && suggested !== vertical) {
        setSuggestedVertical(suggested);
        setShowReclassifyBanner(true);
        
        recordEvent({
          name: 'reclassify_suggested',
          route: '/idea',
          ok: true,
          ms: 0,
          meta: { current: vertical, suggested }
        });
      }
    };
    
    // Simulate PRD arrival after 3 seconds
    const timer = setTimeout(simulatePRDArrival, 3000);
    return () => clearTimeout(timer);
  }, [vertical]);
  
  // Get the first preset for the vertical
  const preset = PRESETS[vertical]?.[0];
  if (!preset) {
    return (
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
        <p className="text-amber-800">No preset available for this vertical.</p>
      </div>
    );
  }
  
  // Shuffle preset with idea as seed
  const shuffledPreset = shufflePreset(preset, idea);
  
  const handleStyleChange = (newStyle: StyleVariant) => {
    setStyle(newStyle);
    setMessage('Style updated!');
    
    recordEvent({
      name: 'style_changed',
      route: '/idea',
      ok: true,
      ms: 0,
      meta: { from: style, to: newStyle }
    });
    
    setTimeout(() => setMessage(''), 2000);
  };
  
  const handleRegenerateLayout = () => {
    const newSeed = `${idea}-${Date.now()}`;
    const newPreset = shufflePreset(preset, newSeed);
    setMessage('Layout regenerated!');
    
    recordEvent({
      name: 'layout_regenerated',
      route: '/idea',
      ok: true,
      ms: 0,
      meta: { vertical, seed: newSeed }
    });
    
    setTimeout(() => setMessage(''), 2000);
  };
  
  const handleRegenerateContent = () => {
    const newContent = seedContentFromIdea(idea);
    setContent(newContent);
    setMessage('Content regenerated!');
    
    recordEvent({
      name: 'content_regenerated',
      route: '/idea',
      ok: true,
      ms: 0,
      meta: { vertical, brandName: newContent.brandName }
    });
    
    setTimeout(() => setMessage(''), 2000);
  };
  
  const handleShare = async () => {
    try {
      const sharePayload = {
        v: 1,
        style,
        vertical,
        presetId,
        content,
      };
      
      const shareURL = encodeShareURL(sharePayload);
      await navigator.clipboard.writeText(shareURL);
      setMessage('Share link copied to clipboard!');
      
      recordEvent({
        name: 'share_copied',
        route: '/idea',
        ok: true,
        ms: 0,
        meta: { vertical, style, brandName: content.brandName }
      });
    } catch (error) {
      setMessage('Failed to copy share link');
      
      recordEvent({
        name: 'share_error',
        route: '/idea',
        ok: false,
        ms: 0,
        meta: { error: error instanceof Error ? error.message : 'Unknown error' }
      });
    }
    
    setTimeout(() => setMessage(''), 3000);
  };
  
  const handleReclassifyAccept = () => {
    if (suggestedVertical) {
      const oldVertical = vertical;
      setVertical(suggestedVertical);
      
      // Pick first preset for new vertical
      const newPreset = PRESETS[suggestedVertical]?.[0];
      if (newPreset) {
        setPresetId(newPreset.id);
      }
      
      setShowReclassifyBanner(false);
      setSuggestedVertical(null);
      setMessage('Layout switched to ' + suggestedVertical.replace('_', ' ') + '!');
      
      recordEvent({
        name: 'reclassify_accepted',
        route: '/idea',
        ok: true,
        ms: 0,
        meta: { from: oldVertical, to: suggestedVertical }
      });
      
      setTimeout(() => setMessage(''), 3000);
    }
  };
  
  const handleReclassifyDecline = () => {
    setShowReclassifyBanner(false);
    setSuggestedVertical(null);
    
    recordEvent({
      name: 'reclassify_declined',
      route: '/idea',
      ok: true,
      ms: 0,
      meta: { current: vertical, suggested: suggestedVertical }
    });
  };
  
  const handleExportHTML = () => {
    if (previewRef.current) {
      const startTime = Date.now();
      downloadHTML(previewRef.current, `${content.brandName}-preview`);
      setMessage('HTML exported!');
      
      recordEvent({
        name: 'export_html',
        route: '/idea',
        ok: true,
        ms: Date.now() - startTime,
        meta: { brandName: content.brandName, vertical }
      });
      
      setTimeout(() => setMessage(''), 2000);
    }
  };
  
  const handleExportPNG = async () => {
    if (previewRef.current) {
      const startTime = Date.now();
      try {
        await downloadPNG(previewRef.current, `${content.brandName}-preview`);
        setMessage('PNG exported!');
        
        recordEvent({
          name: 'export_png',
          route: '/idea',
          ok: true,
          ms: Date.now() - startTime,
          meta: { brandName: content.brandName, vertical }
        });
      } catch (error) {
        recordEvent({
          name: 'export_png_error',
          route: '/idea',
          ok: false,
          ms: Date.now() - startTime,
          meta: { error: error instanceof Error ? error.message : 'Unknown error' }
        });
      }
      
      setTimeout(() => setMessage(''), 2000);
    }
  };
  
  const handleSurveySubmit = () => {
    // Save survey response locally
    const surveyData = {
      idea,
      persona,
      job,
      response: surveyResponse,
      notes: surveyNotes,
      timestamp: new Date().toISOString(),
    };
    
    try {
      const existingSurveys = JSON.parse(localStorage.getItem('design_surveys') || '[]');
      existingSurveys.push(surveyData);
      localStorage.setItem('design_surveys', JSON.stringify(existingSurveys));
      
      recordEvent({
        name: 'design_survey_submitted',
        route: '/idea',
        ok: true,
        ms: 0,
        meta: { 
          response: surveyResponse, 
          hasNotes: !!surveyNotes,
          vertical,
          brandName: content.brandName
        }
      });
      
      setMessage('Survey submitted! Thank you.');
      setShowSurvey(false);
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error saving survey:', error);
      
      recordEvent({
        name: 'design_survey_error',
        route: '/idea',
        ok: false,
        ms: 0,
        meta: { error: error instanceof Error ? error.message : 'Unknown error' }
      });
    }
  };
  
  return (
    <div className="space-y-6">
      {/* Reclassify Banner */}
      {showReclassifyBanner && suggestedVertical && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-800 font-medium">
                We think this fits <strong>{suggestedVertical.replace('_', ' ')}</strong> better. Switch layout?
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleReclassifyAccept}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:ring-2 focus:ring-blue-500"
              >
                Switch
              </button>
              <button
                onClick={handleReclassifyDecline}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 focus:ring-2 focus:ring-gray-500"
              >
                Keep current
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Controls */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex flex-wrap gap-2">
            <label className="text-sm font-medium text-amber-800">Style:</label>
            {(['minimal', 'luxury', 'tech', 'editorial'] as StyleVariant[]).map((styleOption) => (
              <button
                key={styleOption}
                onClick={() => handleStyleChange(styleOption)}
                className={`px-3 py-1 text-sm rounded ${
                  style === styleOption
                    ? 'bg-amber-500 text-white'
                    : 'bg-white text-amber-700 hover:bg-amber-100'
                } ${getFocusRingClass(style)}`}
              >
                {styleOption.charAt(0).toUpperCase() + styleOption.slice(1)}
              </button>
            ))}
          </div>
          
          <div className="flex flex-wrap gap-2">
            <button
              onClick={handleRegenerateLayout}
              className={`px-4 py-2 text-sm ${getButtonClass(style, 'sm')}`}
              title="Regenerate layout (R)"
            >
              Regenerate Layout
            </button>
            <button
              onClick={handleRegenerateContent}
              className={`px-4 py-2 text-sm ${getButtonClass(style, 'sm')}`}
              title="Regenerate content from idea"
            >
              Regenerate Content
            </button>
            <button
              onClick={handleShare}
              className={`px-4 py-2 text-sm ${getButtonClass(style, 'sm')}`}
              title="Copy share link (S)"
            >
              Share
            </button>
            <button
              onClick={handleExportHTML}
              className={`px-4 py-2 text-sm ${getButtonClass(style, 'sm')}`}
            >
              Export HTML
            </button>
            <button
              onClick={handleExportPNG}
              className={`px-4 py-2 text-sm ${getButtonClass(style, 'sm')}`}
              title="Export as PNG (E)"
            >
              Export PNG
            </button>
            <button
              onClick={() => setShowSurvey(true)}
              className={`px-4 py-2 text-sm ${getButtonClass(style, 'sm')}`}
            >
              Feedback
            </button>
            <button
              onClick={() => setShowHelp(!showHelp)}
              className={`px-4 py-2 text-sm ${getButtonClass(style, 'sm')}`}
              title="Show keyboard shortcuts (H)"
            >
              Help
            </button>
          </div>
        </div>
        
        {/* Help Tooltip */}
        {showHelp && (
          <div className="mt-4 p-3 bg-amber-100 rounded-lg">
            <h4 className="font-medium text-amber-800 mb-2">Keyboard Shortcuts:</h4>
            <ul className="text-sm text-amber-700 space-y-1">
              <li><kbd className="px-1 py-0.5 bg-amber-200 rounded">R</kbd> - Regenerate layout</li>
              <li><kbd className="px-1 py-0.5 bg-amber-200 rounded">S</kbd> - Copy share link</li>
              <li><kbd className="px-1 py-0.5 bg-amber-200 rounded">E</kbd> - Export PNG</li>
              <li><kbd className="px-1 py-0.5 bg-amber-200 rounded">H</kbd> - Toggle this help</li>
            </ul>
          </div>
        )}
        
        {message && (
          <div className="mt-4 text-sm text-amber-700" aria-live="polite">
            {message}
          </div>
        )}
      </div>
      
      {/* Preview */}
      <div className="border border-amber-200 rounded-lg overflow-hidden">
        {isLoading ? (
          <div className="bg-amber-50 p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500 mx-auto mb-4"></div>
            <p className="text-amber-800">Generating preview...</p>
          </div>
        ) : (
          <div ref={previewRef}>
            <DesignRenderer
              preset={shuffledPreset}
              content={content}
              style={style}
            />
          </div>
        )}
      </div>
      
      {/* Survey Modal */}
      {showSurvey && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-amber-900 mb-4">
              Does this look close to what you had in mind?
            </h3>
            
            <div className="space-y-4">
              <div className="flex gap-4">
                <button
                  onClick={() => setSurveyResponse('yes')}
                  className={`px-4 py-2 rounded ${
                    surveyResponse === 'yes'
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Yes
                </button>
                <button
                  onClick={() => setSurveyResponse('no')}
                  className={`px-4 py-2 rounded ${
                    surveyResponse === 'no'
                      ? 'bg-red-500 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  No
                </button>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional notes (optional):
                </label>
                <textarea
                  value={surveyNotes}
                  onChange={(e) => setSurveyNotes(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  rows={3}
                  placeholder="What would you change or improve?"
                />
              </div>
              
              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => setShowSurvey(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSurveySubmit}
                  disabled={!surveyResponse}
                  className={`px-4 py-2 ${getButtonClass(style, 'sm')} ${
                    !surveyResponse ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
