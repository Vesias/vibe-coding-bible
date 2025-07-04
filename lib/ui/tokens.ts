/**
 * Vibe Coding Bible - Unified Design Token System
 * 
 * This file contains all design tokens for consistent theming across the platform.
 * Based on the new 5-token brand color system with German heritage accents.
 */

// ===== BRAND COLORS =====
export const brandColors = {
  50: 'hsl(205, 85%, 95%)',   // Ultra light - for backgrounds, subtle highlights
  300: 'hsl(205, 70%, 65%)',  // Light - for secondary elements, hover states
  500: 'hsl(200, 100%, 44%)', // Primary (#009EE0) - main brand color, primary actions
  700: 'hsl(214, 100%, 28%)', // Dark (#004A8F) - strong emphasis, dark mode primaries
  900: 'hsl(214, 100%, 12%)'  // Ultra dark (#001F3F) - text, deep backgrounds
} as const;

// ===== GERMAN HERITAGE ACCENT COLORS =====
export const accentColors = {
  red: '#DD0000',     // Error states, critical alerts, destructive actions
  gold: '#FFCE00',    // Success states, premium features, achievements
  black: '#000000',   // Pure text, maximum contrast, absolute backgrounds
  white: '#FFFFFF'    // Pure backgrounds, text on dark, absolute foregrounds
} as const;

// ===== EXTENDED PALETTE FOR DIVERSE USE CASES =====
export const extendedColors = {
  // Neutral grays for text and backgrounds
  gray: {
    50: '#F9FAFB',
    100: '#F3F4F6', 
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
    950: '#030712'
  },
  
  // Semantic colors
  semantic: {
    success: accentColors.gold,
    warning: '#F59E0B',
    error: accentColors.red,
    info: brandColors[500],
    
    // Success variations for different contexts
    successLight: '#FEF3C7',
    successDark: '#D97706',
    
    // Warning variations
    warningLight: '#FEF3C7', 
    warningDark: '#B45309',
    
    // Error variations
    errorLight: '#FEE2E2',
    errorDark: '#991B1B',
    
    // Info variations
    infoLight: brandColors[50],
    infoDark: brandColors[700]
  }
} as const;

// ===== TYPOGRAPHY SYSTEM =====
export const typography = {
  // Font families
  fontFamily: {
    sans: ['Inter', 'system-ui', 'sans-serif'],
    serif: ['Cinzel', 'Georgia', 'serif'],
    mono: ['Fira Code', 'ui-monospace', 'monospace'],
    display: ['Montserrat', 'system-ui', 'sans-serif']
  },
  
  // Font sizes with consistent scale (1.125 ratio - major second)
  fontSize: {
    xs: '0.75rem',      // 12px
    sm: '0.875rem',     // 14px
    base: '1rem',       // 16px
    lg: '1.125rem',     // 18px
    xl: '1.25rem',      // 20px
    '2xl': '1.5rem',    // 24px
    '3xl': '1.875rem',  // 30px
    '4xl': '2.25rem',   // 36px
    '5xl': '3rem',      // 48px
    '6xl': '3.75rem',   // 60px
    '7xl': '4.5rem',    // 72px
    '8xl': '6rem',      // 96px
    '9xl': '8rem'       // 128px
  },
  
  // Font weights
  fontWeight: {
    thin: '100',
    extralight: '200',
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
    black: '900'
  },
  
  // Line heights for optimal readability
  lineHeight: {
    none: '1',
    tight: '1.25',
    snug: '1.375',
    normal: '1.5',
    relaxed: '1.625',
    loose: '2'
  },
  
  // Letter spacing for improved legibility
  letterSpacing: {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0em',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em'
  }
} as const;

// ===== SPACING SYSTEM =====
export const spacing = {
  // Base spacing unit: 0.25rem (4px)
  px: '1px',
  0: '0rem',
  0.5: '0.125rem',   // 2px
  1: '0.25rem',      // 4px
  1.5: '0.375rem',   // 6px
  2: '0.5rem',       // 8px
  2.5: '0.625rem',   // 10px
  3: '0.75rem',      // 12px
  3.5: '0.875rem',   // 14px
  4: '1rem',         // 16px
  5: '1.25rem',      // 20px
  6: '1.5rem',       // 24px
  7: '1.75rem',      // 28px
  8: '2rem',         // 32px
  9: '2.25rem',      // 36px
  10: '2.5rem',      // 40px
  11: '2.75rem',     // 44px
  12: '3rem',        // 48px
  14: '3.5rem',      // 56px
  16: '4rem',        // 64px
  20: '5rem',        // 80px
  24: '6rem',        // 96px
  28: '7rem',        // 112px
  32: '8rem',        // 128px
  36: '9rem',        // 144px
  40: '10rem',       // 160px
  44: '11rem',       // 176px
  48: '12rem',       // 192px
  52: '13rem',       // 208px
  56: '14rem',       // 224px
  60: '15rem',       // 240px
  64: '16rem',       // 256px
  72: '18rem',       // 288px
  80: '20rem',       // 320px
  96: '24rem'        // 384px
} as const;

// ===== BORDER RADIUS SYSTEM =====
export const borderRadius = {
  none: '0rem',
  sm: '0.125rem',      // 2px
  base: '0.25rem',     // 4px
  md: '0.375rem',      // 6px
  lg: '0.5rem',        // 8px
  xl: '0.75rem',       // 12px
  '2xl': '1rem',       // 16px
  '3xl': '1.5rem',     // 24px
  full: '9999px'       // Perfect circle/pill
} as const;

// ===== SHADOW SYSTEM =====
export const shadows = {
  none: 'none',
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  base: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
  
  // Sacred-themed shadows with brand colors
  sacred: {
    sm: `0 2px 4px 0 ${brandColors[900]}20`,
    md: `0 4px 12px 0 ${brandColors[900]}25, 0 0 0 1px ${accentColors.gold}20`,
    lg: `0 8px 25px 0 ${brandColors[900]}30, 0 0 0 1px ${accentColors.gold}30`,
    glow: `0 0 20px ${accentColors.gold}40, 0 0 40px ${brandColors[500]}20`,
    divine: `0 0 30px ${accentColors.gold}50, 0 0 60px ${brandColors[300]}30`
  }
} as const;

// ===== ANIMATION SYSTEM =====
export const animations = {
  // Duration
  duration: {
    75: '75ms',
    100: '100ms',
    150: '150ms',
    200: '200ms',
    300: '300ms',
    500: '500ms',
    700: '700ms',
    1000: '1000ms'
  },
  
  // Timing functions (easing)
  timingFunction: {
    linear: 'linear',
    in: 'cubic-bezier(0.4, 0, 1, 1)',
    out: 'cubic-bezier(0, 0, 0.2, 1)',
    inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
    
    // Custom sacred easing functions
    sacred: 'cubic-bezier(0.4, 0, 0.2, 1)',
    divine: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    mystical: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
  }
} as const;

// ===== BREAKPOINTS FOR RESPONSIVE DESIGN =====
export const breakpoints = {
  xs: '0px',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px'
} as const;

// ===== Z-INDEX SCALE =====
export const zIndex = {
  auto: 'auto',
  0: '0',
  10: '10',
  20: '20',
  30: '30',
  40: '40',
  50: '50',
  
  // Semantic z-index values
  dropdown: '1000',
  sticky: '1020',
  fixed: '1030',
  modalBackdrop: '1040',
  modal: '1050',
  popover: '1060',
  tooltip: '1070',
  toast: '1080'
} as const;

// ===== COMPONENT-SPECIFIC TOKENS =====
export const components = {
  button: {
    height: {
      sm: spacing[8],      // 32px
      md: spacing[10],     // 40px
      lg: spacing[12],     // 48px
      xl: spacing[14]      // 56px
    },
    padding: {
      sm: `${spacing[2]} ${spacing[3]}`,    // 8px 12px
      md: `${spacing[2.5]} ${spacing[4]}`,  // 10px 16px
      lg: `${spacing[3]} ${spacing[6]}`,    // 12px 24px
      xl: `${spacing[4]} ${spacing[8]}`     // 16px 32px
    }
  },
  
  input: {
    height: {
      sm: spacing[8],      // 32px
      md: spacing[10],     // 40px
      lg: spacing[12]      // 48px
    },
    padding: {
      sm: `${spacing[2]} ${spacing[3]}`,    // 8px 12px
      md: `${spacing[2.5]} ${spacing[4]}`,  // 10px 16px
      lg: `${spacing[3]} ${spacing[4]}`     // 12px 16px
    }
  },
  
  card: {
    padding: {
      sm: spacing[4],      // 16px
      md: spacing[6],      // 24px
      lg: spacing[8]       // 32px
    },
    borderRadius: borderRadius.xl,
    shadow: shadows.md
  }
} as const;

// ===== TYPE DEFINITIONS =====
export type BrandColor = keyof typeof brandColors;
export type AccentColor = keyof typeof accentColors;
export type ExtendedColor = keyof typeof extendedColors.gray;
export type SemanticColor = keyof typeof extendedColors.semantic;
export type FontSize = keyof typeof typography.fontSize;
export type FontWeight = keyof typeof typography.fontWeight;
export type Spacing = keyof typeof spacing;
export type BorderRadius = keyof typeof borderRadius;
export type Shadow = keyof typeof shadows;
export type Breakpoint = keyof typeof breakpoints;
export type ZIndex = keyof typeof zIndex;

// ===== THEME OBJECT FOR EASY ACCESS =====
export const theme = {
  colors: {
    brand: brandColors,
    accent: accentColors,
    ...extendedColors
  },
  typography,
  spacing,
  borderRadius,
  shadows,
  animations,
  breakpoints,
  zIndex,
  components
} as const;

// ===== DEFAULT EXPORT =====
export default theme;