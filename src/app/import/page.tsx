"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { addProject } from "@/lib/storage";
import { validateProjectJSON } from "@/lib/export";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/_components/ui/Card";
import { Button } from "@/app/_components/ui/Button";
// import { EmptyStates } from "@/app/_components/EmptyState";

export default function ImportPage() {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleFileSelect = async (file: File) => {
    if (!file.name.endsWith('.json')) {
      setError('Please select a valid JSON file');
      return;
    }

    setIsImporting(true);
    setError(null);
    setSuccess(null);

    try {
      const text = await file.text();
      const jsonData = JSON.parse(text);
      
      const validation = validateProjectJSON(jsonData);
      
      if (!validation.valid) {
        setError(validation.error || 'Invalid project file');
        return;
      }

      if (!validation.project) {
        setError('Failed to parse project data');
        return;
      }

      // Generate new ID to avoid conflicts
      const newProject = {
        ...validation.project,
        id: `imported_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        updatedAt: new Date().toISOString(),
      };

      addProject(newProject);
      setSuccess(`Successfully imported project: "${newProject.idea}"`);
      
      // Redirect to the project after a short delay
      setTimeout(() => {
        router.push(`/plan/review/${newProject.id}`);
      }, 2000);

    } catch (err) {
      console.error('Import error:', err);
      setError(err instanceof Error ? err.message : 'Failed to import project');
    } finally {
      setIsImporting(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FBF9F4] via-[#F8F4ED] to-[#F5F0E8] py-12">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-[#4A5568] mb-4">
            Import Project
          </h1>
          <p className="text-lg text-[#6B7280]">
            Import a previously exported project to continue working on it.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-[#4A5568]">Upload Project File</CardTitle>
            <CardDescription>
              Drag and drop a JSON file or click to browse
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div
              className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all ${
                isDragOver
                  ? 'border-[#F7DC6F] bg-gradient-to-br from-[#FFF9E6] to-[#FFF5CC]'
                  : 'border-[#E8E9EA] bg-gradient-to-br from-[#F8F9FA] via-[#F5F6F7] to-[#F1F2F4] hover:border-[#F7DC6F] hover:bg-gradient-to-br hover:from-[#FFF9E6] hover:to-[#FFF5CC]'
              }`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleFileInputChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              
              <div className="space-y-4">
                <div className="mx-auto h-16 w-16 rounded-full bg-gradient-to-br from-[#FFF4C4] via-[#FFECB3] to-[#FFE0B2] border border-[#F7DC6F] shadow-[0_2px_8px_rgba(247,220,111,0.3)] flex items-center justify-center">
                  <svg className="h-8 w-8 text-[#8B7355]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-[#4A5568] mb-2">
                    {isDragOver ? 'Drop your file here' : 'Choose a project file'}
                  </h3>
                  <p className="text-[#6B7280] mb-4">
                    Select a JSON file exported from Business Builder
                  </p>
                  
                  <Button
                    onClick={handleBrowseClick}
                    disabled={isImporting}
                    className="bg-gradient-to-r from-[#FFF4C4] via-[#FFECB3] to-[#FFE0B2] border border-[#F7DC6F] text-[#8B7355] hover:from-[#FFF9E6] hover:via-[#FFF4C4] hover:to-[#FFECB3] hover:shadow-[0_4px_12px_rgba(247,220,111,0.4)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F7DC6F] transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:transform-none"
                  >
                    {isImporting ? 'Importing...' : 'Browse Files'}
                  </Button>
                </div>
              </div>
            </div>

            {/* Error Display */}
            {error && (
              <div className="mt-6 rounded-lg border-2 border-red-200 bg-red-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">Import Error</h3>
                    <div className="mt-2 text-sm text-red-700">{error}</div>
                    <div className="mt-4">
                      <Button
                        onClick={() => setError(null)}
                        variant="ghost"
                        className="bg-red-50 px-2 py-1.5 text-sm font-medium text-red-800 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 focus:ring-offset-red-50"
                      >
                        Dismiss
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Success Display */}
            {success && (
              <div className="mt-6 rounded-lg border-2 border-green-200 bg-green-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-green-800">Import Successful</h3>
                    <div className="mt-2 text-sm text-green-700">{success}</div>
                    <div className="mt-2 text-xs text-green-600">
                      Redirecting to your project...
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Help Text */}
            <div className="mt-6 text-sm text-[#6B7280] p-4 rounded-lg bg-gradient-to-br from-[#FFF9E6] to-[#FFF5CC] border border-[#F7DC6F]">
              <h4 className="font-medium text-[#8B7355] mb-2">How to import a project:</h4>
              <ol className="list-decimal list-inside space-y-1 text-xs">
                <li>Export a project from Business Builder as JSON</li>
                <li>Drag and drop the JSON file here, or click &quot;Browse Files&quot;</li>
                <li>The project will be imported with a new ID to avoid conflicts</li>
                <li>You&apos;ll be redirected to the project automatically</li>
              </ol>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
