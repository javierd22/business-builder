import { StyleVariant } from './types';

export interface StyleTokens {
  radius: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  shadow: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  font: {
    scale: number;
    weight: {
      normal: string;
      medium: string;
      semibold: string;
      bold: string;
    };
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    '2xl': string;
  };
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    border: string;
    text: {
      primary: string;
      secondary: string;
      muted: string;
    };
  };
}

const STYLE_TOKENS: Record<StyleVariant, StyleTokens> = {
  luxury: {
    radius: {
      sm: 'rounded-sm',
      md: 'rounded-md',
      lg: 'rounded-lg',
      xl: 'rounded-xl',
    },
    shadow: {
      sm: 'shadow-sm',
      md: 'shadow-md',
      lg: 'shadow-lg',
      xl: 'shadow-2xl',
    },
    font: {
      scale: 1.1,
      weight: {
        normal: 'font-normal',
        medium: 'font-medium',
        semibold: 'font-semibold',
        bold: 'font-bold',
      },
    },
    spacing: {
      xs: 'p-2',
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
      xl: 'p-12',
      '2xl': 'p-16',
    },
    colors: {
      primary: 'bg-amber-50',
      secondary: 'bg-amber-100',
      accent: 'bg-amber-500',
      background: 'bg-amber-50',
      surface: 'bg-white',
      border: 'border-amber-200',
      text: {
        primary: 'text-amber-900',
        secondary: 'text-amber-700',
        muted: 'text-amber-600',
      },
    },
  },
  minimal: {
    radius: {
      sm: 'rounded-none',
      md: 'rounded-sm',
      lg: 'rounded-md',
      xl: 'rounded-lg',
    },
    shadow: {
      sm: 'shadow-none',
      md: 'shadow-sm',
      lg: 'shadow-md',
      xl: 'shadow-lg',
    },
    font: {
      scale: 0.95,
      weight: {
        normal: 'font-light',
        medium: 'font-normal',
        semibold: 'font-medium',
        bold: 'font-semibold',
      },
    },
    spacing: {
      xs: 'p-1',
      sm: 'p-2',
      md: 'p-4',
      lg: 'p-6',
      xl: 'p-8',
      '2xl': 'p-12',
    },
    colors: {
      primary: 'bg-stone-50',
      secondary: 'bg-stone-100',
      accent: 'bg-amber-400',
      background: 'bg-stone-50',
      surface: 'bg-white',
      border: 'border-stone-200',
      text: {
        primary: 'text-stone-900',
        secondary: 'text-stone-600',
        muted: 'text-stone-500',
      },
    },
  },
  tech: {
    radius: {
      sm: 'rounded-md',
      md: 'rounded-lg',
      lg: 'rounded-xl',
      xl: 'rounded-2xl',
    },
    shadow: {
      sm: 'shadow-sm',
      md: 'shadow-md',
      lg: 'shadow-lg',
      xl: 'shadow-2xl',
    },
    font: {
      scale: 1.0,
      weight: {
        normal: 'font-normal',
        medium: 'font-medium',
        semibold: 'font-semibold',
        bold: 'font-bold',
      },
    },
    spacing: {
      xs: 'p-3',
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
      xl: 'p-12',
      '2xl': 'p-16',
    },
    colors: {
      primary: 'bg-slate-50',
      secondary: 'bg-slate-100',
      accent: 'bg-amber-500',
      background: 'bg-slate-50',
      surface: 'bg-white',
      border: 'border-slate-200',
      text: {
        primary: 'text-slate-900',
        secondary: 'text-slate-700',
        muted: 'text-slate-600',
      },
    },
  },
  editorial: {
    radius: {
      sm: 'rounded-sm',
      md: 'rounded-md',
      lg: 'rounded-lg',
      xl: 'rounded-xl',
    },
    shadow: {
      sm: 'shadow-sm',
      md: 'shadow-md',
      lg: 'shadow-lg',
      xl: 'shadow-2xl',
    },
    font: {
      scale: 1.05,
      weight: {
        normal: 'font-normal',
        medium: 'font-medium',
        semibold: 'font-semibold',
        bold: 'font-bold',
      },
    },
    spacing: {
      xs: 'p-2',
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
      xl: 'p-12',
      '2xl': 'p-16',
    },
    colors: {
      primary: 'bg-amber-50',
      secondary: 'bg-amber-100',
      accent: 'bg-amber-600',
      background: 'bg-amber-50',
      surface: 'bg-white',
      border: 'border-amber-300',
      text: {
        primary: 'text-amber-900',
        secondary: 'text-amber-800',
        muted: 'text-amber-700',
      },
    },
  },
};

export function getStyleTokens(variant: StyleVariant): StyleTokens {
  return STYLE_TOKENS[variant];
}

export function applyStyleTokens(classNames: string, variant: StyleVariant): string {
  const tokens = getStyleTokens(variant);
  
  // Replace common token placeholders
  return classNames
    .replace(/\bradius-sm\b/g, tokens.radius.sm)
    .replace(/\bradius-md\b/g, tokens.radius.md)
    .replace(/\bradius-lg\b/g, tokens.radius.lg)
    .replace(/\bradius-xl\b/g, tokens.radius.xl)
    .replace(/\bshadow-sm\b/g, tokens.shadow.sm)
    .replace(/\bshadow-md\b/g, tokens.shadow.md)
    .replace(/\bshadow-lg\b/g, tokens.shadow.lg)
    .replace(/\bshadow-xl\b/g, tokens.shadow.xl)
    .replace(/\btext-primary\b/g, tokens.colors.text.primary)
    .replace(/\btext-secondary\b/g, tokens.colors.text.secondary)
    .replace(/\btext-muted\b/g, tokens.colors.text.muted)
    .replace(/\bbg-primary\b/g, tokens.colors.primary)
    .replace(/\bbg-secondary\b/g, tokens.colors.secondary)
    .replace(/\bbg-accent\b/g, tokens.colors.accent)
    .replace(/\bbg-surface\b/g, tokens.colors.surface)
    .replace(/\bborder-primary\b/g, tokens.colors.border);
}

export function getFocusRingClass(variant: StyleVariant): string {
  return 'focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2';
}

export function getButtonClass(variant: StyleVariant, size: 'sm' | 'md' | 'lg' = 'md'): string {
  const tokens = getStyleTokens(variant);
  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
  };
  
  return `${tokens.colors.accent} text-white ${sizeClasses[size]} ${tokens.radius.md} hover:opacity-90 transition-opacity ${getFocusRingClass(variant)}`;
}

export function getCardClass(variant: StyleVariant): string {
  const tokens = getStyleTokens(variant);
  return `${tokens.colors.surface} border ${tokens.colors.border} ${tokens.radius.lg} ${tokens.shadow.md}`;
}

export function getHeadingClass(variant: StyleVariant, level: 1 | 2 | 3 | 4 | 5 | 6): string {
  const tokens = getStyleTokens(variant);
  const scale = tokens.font.scale;
  
  const sizeClasses = {
    1: `text-${Math.round(4 * scale)}xl`,
    2: `text-${Math.round(3 * scale)}xl`,
    3: `text-${Math.round(2 * scale)}xl`,
    4: `text-${Math.round(1.5 * scale)}xl`,
    5: `text-${Math.round(1.25 * scale)}xl`,
    6: `text-${Math.round(1.125 * scale)}xl`,
  };
  
  return `${sizeClasses[level]} ${tokens.font.weight.bold} ${tokens.colors.text.primary}`;
}
