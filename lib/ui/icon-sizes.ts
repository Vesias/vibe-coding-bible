/**
 * Vibe Coding Bible - Icon Sizing System
 * 
 * Consistent icon sizes throughout the application for better visual hierarchy
 * and improved user experience.
 */

// ===== ICON SIZE CONSTANTS =====
export const iconSizes = {
  // Extra small icons - for inline text, badges, small indicators
  xs: '12px',
  
  // Small icons - for buttons, form inputs, navigation items  
  sm: '16px',
  
  // Medium icons - default size for most UI elements
  md: '20px',
  
  // Large icons - for section headers, prominent actions
  lg: '24px',
  
  // Extra large icons - for hero sections, feature highlights
  xl: '32px',
  
  // 2X Large icons - for major section dividers, large cards
  '2xl': '40px',
  
  // 3X Large icons - for splash screens, main features
  '3xl': '48px',
  
  // 4X Large icons - for hero graphics, main branding
  '4xl': '64px',
  
  // 5X Large icons - for large displays, promotional graphics
  '5xl': '80px',
  
  // 6X Large icons - for maximum impact, main hero elements
  '6xl': '96px'
} as const;

// ===== CONTEXTUAL ICON SIZES =====
export const contextualIconSizes = {
  // Navigation icons
  navigation: {
    mobile: iconSizes.lg,     // 24px - touch-friendly
    desktop: iconSizes.md     // 20px - compact
  },
  
  // Button icons
  button: {
    sm: iconSizes.xs,         // 12px - small buttons
    md: iconSizes.sm,         // 16px - default buttons  
    lg: iconSizes.md,         // 20px - large buttons
    xl: iconSizes.lg          // 24px - hero buttons
  },
  
  // Form field icons
  form: {
    sm: iconSizes.sm,         // 16px - compact forms
    md: iconSizes.md,         // 20px - standard forms
    lg: iconSizes.lg          // 24px - large forms
  },
  
  // Card icons
  card: {
    sm: iconSizes.md,         // 20px - small cards
    md: iconSizes.lg,         // 24px - medium cards
    lg: iconSizes.xl          // 32px - large cards
  },
  
  // Status indicators
  status: {
    sm: iconSizes.xs,         // 12px - inline status
    md: iconSizes.sm,         // 16px - standard status
    lg: iconSizes.md          // 20px - prominent status
  },
  
  // Loading spinners
  loading: {
    sm: iconSizes.sm,         // 16px - inline loading
    md: iconSizes.md,         // 20px - button loading
    lg: iconSizes.lg,         // 24px - section loading
    xl: iconSizes.xl          // 32px - page loading
  },
  
  // Social media icons
  social: {
    sm: iconSizes.md,         // 20px - compact social
    md: iconSizes.lg,         // 24px - standard social
    lg: iconSizes.xl          // 32px - prominent social
  },
  
  // Tool/feature icons
  feature: {
    sm: iconSizes.lg,         // 24px - list features
    md: iconSizes.xl,         // 32px - card features
    lg: iconSizes['2xl'],     // 40px - hero features
    xl: iconSizes['3xl']      // 48px - main features
  }
} as const;

// ===== ICON SPACING SYSTEM =====
export const iconSpacing = {
  // Margin around icons
  margin: {
    xs: '2px',
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px'
  },
  
  // Padding inside icon containers
  padding: {
    xs: '4px',
    sm: '6px', 
    md: '8px',
    lg: '12px',
    xl: '16px'
  },
  
  // Gap between icon and text
  gap: {
    xs: '4px',
    sm: '6px',
    md: '8px',
    lg: '12px',
    xl: '16px'
  }
} as const;

// ===== ICON COLORS FROM DESIGN TOKENS =====
export const iconColors = {
  // Primary brand colors
  primary: 'hsl(200, 100%, 44%)',      // brand.500
  primaryLight: 'hsl(205, 70%, 65%)',  // brand.300
  primaryDark: 'hsl(214, 100%, 28%)',  // brand.700
  
  // Accent colors
  success: '#FFCE00',                   // accent.gold
  error: '#DD0000',                     // accent.red
  warning: '#F59E0B',                   // extended warning
  info: 'hsl(200, 100%, 44%)',         // brand.500
  
  // Neutral colors
  neutral: '#6B7280',                   // gray.500
  neutralLight: '#9CA3AF',              // gray.400  
  neutralDark: '#374151',               // gray.700
  
  // Text colors
  text: '#000000',                      // accent.black
  textLight: '#6B7280',                 // gray.500
  textInverse: '#FFFFFF',               // accent.white
  
  // Interactive states
  hover: 'hsl(205, 70%, 65%)',          // brand.300
  active: 'hsl(214, 100%, 28%)',        // brand.700
  disabled: '#D1D5DB',                  // gray.300
  
  // Semantic states
  online: '#10B981',                    // green for online status
  busy: '#F59E0B',                      // amber for busy status
  offline: '#6B7280',                   // gray for offline status
  away: '#EF4444'                       // red for away status
} as const;

// ===== ICON ANIMATION CLASSES =====
export const iconAnimations = {
  // Rotation animations
  spin: 'animate-spin',                 // 360° rotation
  spinSlow: 'animate-spin-slow',        // Slow 360° rotation
  
  // Scale animations  
  pulse: 'animate-pulse',               // Subtle scale pulse
  bounce: 'animate-bounce',             // Bouncing effect
  
  // Movement animations
  wiggle: 'animate-wiggle',             // Side-to-side wiggle
  float: 'animate-float',               // Up and down float
  
  // Fade animations
  fadeIn: 'animate-fadeIn',             // Fade in effect
  fadeOut: 'animate-fadeOut',           // Fade out effect
  
  // Sacred/themed animations
  sacred: 'animate-sacred-pulse',       // Custom sacred pulse
  divine: 'animate-divine-glow',        // Custom divine glow
  mystical: 'animate-mystical-float'    // Custom mystical float
} as const;

// ===== ICON ACCESSIBILITY =====
export const iconAccessibility = {
  // ARIA attributes for different icon contexts
  decorative: {
    'aria-hidden': 'true',
    role: 'presentation'
  },
  
  informative: {
    role: 'img',
    'aria-label': '{{description}}'     // Replace with actual description
  },
  
  interactive: {
    role: 'button',
    'aria-label': '{{action}}',         // Replace with actual action
    tabIndex: 0
  },
  
  status: {
    role: 'status',
    'aria-live': 'polite',
    'aria-label': '{{status}}'          // Replace with actual status
  }
} as const;

// ===== TYPE DEFINITIONS =====
export type IconSize = keyof typeof iconSizes;
export type ContextualIconSize = keyof typeof contextualIconSizes;
export type IconSpacing = keyof typeof iconSpacing;
export type IconColor = keyof typeof iconColors;
export type IconAnimation = keyof typeof iconAnimations;

// ===== UTILITY FUNCTIONS =====

/**
 * Get responsive icon size based on screen size
 */
export const getResponsiveIconSize = (
  mobile: IconSize,
  tablet: IconSize = mobile,
  desktop: IconSize = tablet
) => ({
  mobile: iconSizes[mobile],
  tablet: iconSizes[tablet], 
  desktop: iconSizes[desktop]
});

/**
 * Get icon size with spacing
 */
export const getIconWithSpacing = (
  size: IconSize,
  spacing: keyof typeof iconSpacing.margin = 'md'
) => ({
  size: iconSizes[size],
  margin: iconSpacing.margin[spacing]
});

/**
 * Get contextual icon configuration
 */
export const getContextualIcon = (
  context: keyof typeof contextualIconSizes,
  variant: string = 'md'
) => {
  const contextConfig = contextualIconSizes[context];
  if (typeof contextConfig === 'object' && variant in contextConfig) {
    return (contextConfig as any)[variant];
  }
  return iconSizes.md; // fallback
};

// ===== DEFAULT EXPORT =====
export default {
  sizes: iconSizes,
  contextual: contextualIconSizes,
  spacing: iconSpacing,
  colors: iconColors,
  animations: iconAnimations,
  accessibility: iconAccessibility,
  utils: {
    getResponsiveIconSize,
    getIconWithSpacing,
    getContextualIcon
  }
};