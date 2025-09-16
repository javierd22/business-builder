/**
 * Client-side export utilities for PRD, UX, and Project data
 */

import { Project } from './storage';

/**
 * Export text content as a downloadable file
 */
function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
}

/**
 * Export PRD as Markdown file
 */
export function exportPRDAsMarkdown(prd: string, projectTitle?: string): void {
  const filename = projectTitle 
    ? `${projectTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_prd.md`
    : `prd_${new Date().toISOString().split('T')[0]}.md`;
  
  downloadFile(prd, filename, 'text/markdown');
}

/**
 * Export UX as Markdown file
 */
export function exportUXAsMarkdown(ux: string, projectTitle?: string): void {
  const filename = projectTitle 
    ? `${projectTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_ux.md`
    : `ux_${new Date().toISOString().split('T')[0]}.md`;
  
  downloadFile(ux, filename, 'text/markdown');
}

/**
 * Export PRD as PDF using browser print functionality
 */
export function exportPRDAsPDF(prd: string, projectTitle?: string): void {
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Please allow popups to export as PDF');
    return;
  }

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>${projectTitle || 'PRD'} - Business Builder</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          line-height: 1.6;
          color: #1f2937;
          max-width: 800px;
          margin: 0 auto;
          padding: 40px 20px;
        }
        h1, h2, h3, h4, h5, h6 {
          color: #1f2937;
          margin-top: 2em;
          margin-bottom: 1em;
        }
        h1 { border-bottom: 2px solid #d4af37; padding-bottom: 10px; }
        h2 { border-bottom: 1px solid #e5e7eb; padding-bottom: 5px; }
        code {
          background: #f3f4f6;
          padding: 2px 4px;
          border-radius: 3px;
          font-family: 'Monaco', 'Menlo', monospace;
        }
        pre {
          background: #f9fafb;
          padding: 15px;
          border-radius: 6px;
          border-left: 4px solid #d4af37;
          overflow-x: auto;
        }
        blockquote {
          border-left: 4px solid #d4af37;
          margin: 0;
          padding-left: 20px;
          color: #6b7280;
        }
        ul, ol {
          padding-left: 20px;
        }
        li {
          margin-bottom: 0.5em;
        }
        @media print {
          body { margin: 0; padding: 20px; }
          h1 { page-break-before: avoid; }
          h2, h3 { page-break-after: avoid; }
        }
      </style>
    </head>
    <body>
      <div id="content">${convertMarkdownToHTML(prd)}</div>
    </body>
    </html>
  `;

  printWindow.document.write(html);
  printWindow.document.close();
  printWindow.focus();
  
  // Wait for content to load, then print
  setTimeout(() => {
    printWindow.print();
    printWindow.close();
  }, 500);
}

/**
 * Export UX as PDF using browser print functionality
 */
export function exportUXAsPDF(ux: string, projectTitle?: string): void {
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Please allow popups to export as PDF');
    return;
  }

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>${projectTitle || 'UX Design'} - Business Builder</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          line-height: 1.6;
          color: #1f2937;
          max-width: 800px;
          margin: 0 auto;
          padding: 40px 20px;
        }
        h1, h2, h3, h4, h5, h6 {
          color: #1f2937;
          margin-top: 2em;
          margin-bottom: 1em;
        }
        h1 { border-bottom: 2px solid #d4af37; padding-bottom: 10px; }
        h2 { border-bottom: 1px solid #e5e7eb; padding-bottom: 5px; }
        code {
          background: #f3f4f6;
          padding: 2px 4px;
          border-radius: 3px;
          font-family: 'Monaco', 'Menlo', monospace;
        }
        pre {
          background: #f9fafb;
          padding: 15px;
          border-radius: 6px;
          border-left: 4px solid #d4af37;
          overflow-x: auto;
        }
        blockquote {
          border-left: 4px solid #d4af37;
          margin: 0;
          padding-left: 20px;
          color: #6b7280;
        }
        ul, ol {
          padding-left: 20px;
        }
        li {
          margin-bottom: 0.5em;
        }
        @media print {
          body { margin: 0; padding: 20px; }
          h1 { page-break-before: avoid; }
          h2, h3 { page-break-after: avoid; }
        }
      </style>
    </head>
    <body>
      <div id="content">${convertMarkdownToHTML(ux)}</div>
    </body>
    </html>
  `;

  printWindow.document.write(html);
  printWindow.document.close();
  printWindow.focus();
  
  // Wait for content to load, then print
  setTimeout(() => {
    printWindow.print();
    printWindow.close();
  }, 500);
}

/**
 * Export Project as JSON file
 */
export function exportProjectAsJSON(project: Project): void {
  const exportData = {
    ...project,
    exportedAt: new Date().toISOString(),
    exportedBy: 'Business Builder',
    version: '1.0.0'
  };

  const filename = `${project.idea.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_project.json`;
  downloadFile(JSON.stringify(exportData, null, 2), filename, 'application/json');
}

/**
 * Convert basic markdown to HTML for PDF export
 */
function convertMarkdownToHTML(markdown: string): string {
  return markdown
    // Headers
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    // Bold
    .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
    // Italic
    .replace(/\*(.*?)\*/gim, '<em>$1</em>')
    // Code blocks
    .replace(/```([\s\S]*?)```/gim, '<pre><code>$1</code></pre>')
    // Inline code
    .replace(/`(.*?)`/gim, '<code>$1</code>')
    // Lists
    .replace(/^\* (.*$)/gim, '<li>$1</li>')
    .replace(/^- (.*$)/gim, '<li>$1</li>')
    .replace(/^(\d+)\. (.*$)/gim, '<li>$2</li>')
    // Line breaks
    .replace(/\n\n/gim, '</p><p>')
    .replace(/\n/gim, '<br>')
    // Wrap in paragraphs
    .replace(/^(.*)$/gim, '<p>$1</p>')
    // Clean up empty paragraphs
    .replace(/<p><\/p>/gim, '')
    // Clean up list items
    .replace(/<p><li>/gim, '<li>')
    .replace(/<\/li><\/p>/gim, '</li>')
    // Wrap consecutive list items in ul
    .replace(/(<li>.*<\/li>)/gim, '<ul>$1</ul>')
    // Clean up nested ul tags
    .replace(/<ul><ul>/gim, '<ul>')
    .replace(/<\/ul><\/ul>/gim, '</ul>');
}

/**
 * Validate imported project JSON
 */
export function validateProjectJSON(jsonData: unknown): { valid: boolean; project?: Project; error?: string } {
  try {
    if (!jsonData || typeof jsonData !== 'object') {
      return { valid: false, error: 'Invalid JSON format' };
    }

    const requiredFields = ['id', 'idea', 'status', 'createdAt', 'updatedAt'];
    const missingFields = requiredFields.filter(field => !(field in jsonData));
    
    if (missingFields.length > 0) {
      return { 
        valid: false, 
        error: `Missing required fields: ${missingFields.join(', ')}` 
      };
    }

    // Validate field types
    if (typeof (jsonData as any).id !== 'string' || 
        typeof (jsonData as any).idea !== 'string' || 
        typeof (jsonData as any).status !== 'string' ||
        typeof (jsonData as any).createdAt !== 'string' ||
        typeof (jsonData as any).updatedAt !== 'string') {
      return { 
        valid: false, 
        error: 'Invalid field types in project data' 
      };
    }

    // Validate status enum
    const validStatuses = ['draft', 'planning', 'ux_design', 'deploying', 'completed', 'failed'];
    if (!validStatuses.includes((jsonData as any).status)) {
      return { 
        valid: false, 
        error: `Invalid status value: ${(jsonData as any).status}` 
      };
    }

    // Create clean project object
    const project: Project = {
      id: jsonData.id,
      idea: jsonData.idea,
      prd: jsonData.prd || undefined,
      ux: jsonData.ux || undefined,
      deploymentLink: jsonData.deploymentLink || undefined,
      status: jsonData.status,
      createdAt: jsonData.createdAt,
      updatedAt: jsonData.updatedAt,
      llm: jsonData.llm || undefined,
    };

    return { valid: true, project };
  } catch (error) {
    return { 
      valid: false, 
      error: `JSON parsing error: ${error instanceof Error ? error.message : 'Unknown error'}` 
    };
  }
}
