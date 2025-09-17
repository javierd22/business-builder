'use client';

export async function downloadPNG(element: HTMLElement, filename: string): Promise<void> {
  if (typeof window === 'undefined') return;
  
  try {
    // Dynamic import of html-to-image
    const { toPng } = await import('html-to-image');
    
    const dataUrl = await toPng(element, {
      quality: 1.0,
      pixelRatio: 2,
      backgroundColor: '#ffffff',
      width: element.scrollWidth,
      height: element.scrollHeight,
    });
    
    // Create and trigger download
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = `${filename}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error('Error exporting PNG:', error);
    
    // Fallback: try to install the library
    if (error.message?.includes('Cannot resolve module')) {
      alert('PNG export requires html-to-image library. Please install it with: npm install html-to-image');
    } else {
      alert('Failed to export PNG. Please try again.');
    }
  }
}

export async function downloadJPEG(element: HTMLElement, filename: string): Promise<void> {
  if (typeof window === 'undefined') return;
  
  try {
    // Dynamic import of html-to-image
    const { toJpeg } = await import('html-to-image');
    
    const dataUrl = await toJpeg(element, {
      quality: 0.9,
      pixelRatio: 2,
      backgroundColor: '#ffffff',
      width: element.scrollWidth,
      height: element.scrollHeight,
    });
    
    // Create and trigger download
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = `${filename}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error('Error exporting JPEG:', error);
    
    // Fallback: try to install the library
    if (error.message?.includes('Cannot resolve module')) {
      alert('JPEG export requires html-to-image library. Please install it with: npm install html-to-image');
    } else {
      alert('Failed to export JPEG. Please try again.');
    }
  }
}

export async function downloadSVG(element: HTMLElement, filename: string): Promise<void> {
  if (typeof window === 'undefined') return;
  
  try {
    // Dynamic import of html-to-image
    const { toSvg } = await import('html-to-image');
    
    const dataUrl = await toSvg(element, {
      pixelRatio: 2,
      backgroundColor: '#ffffff',
      width: element.scrollWidth,
      height: element.scrollHeight,
    });
    
    // Create and trigger download
    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = `${filename}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error('Error exporting SVG:', error);
    
    // Fallback: try to install the library
    if (error.message?.includes('Cannot resolve module')) {
      alert('SVG export requires html-to-image library. Please install it with: npm install html-to-image');
    } else {
      alert('Failed to export SVG. Please try again.');
    }
  }
}
