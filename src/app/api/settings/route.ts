import { NextResponse } from 'next/server';
import { getEnvConfig } from '@/lib/env';

export async function GET() {
  try {
    const config = getEnvConfig();
    
    return NextResponse.json({
      provider: config.provider,
      model: config.provider === 'anthropic' ? config.anthropicModel : config.openaiModel,
      mockMode: config.mockMode,
      showBuildInfo: config.showBuildInfo,
    });
  } catch (error) {
    console.error('Settings API error:', error);
    
    return NextResponse.json(
      { message: 'Failed to load settings' },
      { status: 500 }
    );
  }
}
