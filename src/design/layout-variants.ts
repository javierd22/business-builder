import { Preset, Block } from './types';

// Simple seeded random number generator
class SeededRandom {
  private seed: number;

  constructor(seed: string) {
    this.seed = this.hashString(seed);
  }

  private hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
  }

  next(): number {
    this.seed = (this.seed * 9301 + 49297) % 233280;
    return this.seed / 233280;
  }

  nextInt(min: number, max: number): number {
    return Math.floor(this.next() * (max - min + 1)) + min;
  }
}

export function shufflePreset(preset: Preset, seed: string): Preset {
  const random = new SeededRandom(seed);
  const blocks = [...preset.blocks];
  
  // Always keep Hero first and Footer last
  const heroBlock = blocks.find(block => block.type === 'Hero');
  const footerBlock = blocks.find(block => block.type === 'Footer');
  const middleBlocks = blocks.filter(block => 
    block.type !== 'Hero' && block.type !== 'Footer'
  );
  
  // Shuffle middle blocks using Fisher-Yates algorithm
  for (let i = middleBlocks.length - 1; i > 0; i--) {
    const j = random.nextInt(0, i);
    [middleBlocks[i], middleBlocks[j]] = [middleBlocks[j], middleBlocks[i]];
  }
  
  // Reconstruct the blocks array
  const shuffledBlocks: Block[] = [];
  if (heroBlock) shuffledBlocks.push(heroBlock);
  shuffledBlocks.push(...middleBlocks);
  if (footerBlock) shuffledBlocks.push(footerBlock);
  
  return {
    ...preset,
    blocks: shuffledBlocks,
  };
}

export function generateLayoutVariant(preset: Preset, seed: string, variant: 'standard' | 'featured' | 'minimal' = 'standard'): Preset {
  const shuffled = shufflePreset(preset, seed);
  
  if (variant === 'minimal') {
    // Remove some blocks for a minimal layout
    const minimalBlocks = shuffled.blocks.filter(block => 
      ['Hero', 'FeatureGrid', 'Footer'].includes(block.type)
    );
    return {
      ...shuffled,
      blocks: minimalBlocks,
    };
  }
  
  if (variant === 'featured') {
    // Add more emphasis to certain blocks
    const featuredBlocks = shuffled.blocks.map(block => {
      if (block.type === 'Testimonial') {
        return {
          ...block,
          props: {
            ...(block.props && typeof block.props === 'object' ? block.props : {}),
            title: `⭐ ${(block.props as Record<string, unknown>)?.title || 'What our customers say'}`,
          },
        };
      }
      return block;
    });
    return {
      ...shuffled,
      blocks: featuredBlocks,
    };
  }
  
  return shuffled;
}

export function getLayoutVariants(preset: Preset, seed: string): Array<{ name: string; preset: Preset }> {
  return [
    { name: 'Standard', preset: generateLayoutVariant(preset, seed, 'standard') },
    { name: 'Minimal', preset: generateLayoutVariant(preset, seed, 'minimal') },
    { name: 'Featured', preset: generateLayoutVariant(preset, seed, 'featured') },
  ];
}
