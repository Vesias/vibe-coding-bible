/**
 * Vibe Coding Bible - UI Library Index
 * 
 * Central export point for the unified design system.
 * This file provides convenient access to all design tokens, types, and utilities.
 */

// ===== DESIGN TOKENS =====
export { default as theme } from './tokens';
export {
  brandColors,
  accentColors,
  extendedColors,
  typography,
  spacing,
  borderRadius,
  shadows,
  animations,
  breakpoints,
  zIndex,
  components,
  theme as designTokens
} from './tokens';

// ===== ICON SYSTEM =====
export { default as iconSystem } from './icon-sizes';
export {
  iconSizes,
  contextualIconSizes,
  iconSpacing,
  iconColors,
  iconAnimations,
  iconAccessibility,
  getResponsiveIconSize,
  getIconWithSpacing,
  getContextualIcon
} from './icon-sizes';

// ===== TYPE DEFINITIONS =====
export type {
  BrandColorVariant,
  AccentColorVariant,
  GrayVariant,
  SemanticColorVariant,
  FontFamily,
  FontSize as DesignSystemFontSize,
  FontWeight as DesignSystemFontWeight,
  LineHeight,
  LetterSpacing,
  SpacingScale,
  BorderRadiusVariant,
  ShadowVariant,
  SacredShadowVariant,
  AnimationDuration,
  AnimationTimingFunction,
  Breakpoint as DesignSystemBreakpoint,
  ZIndexVariant,
  IconSize as DesignSystemIconSize,
  IconContext,
  IconSpacingVariant,
  IconColorVariant,
  IconAnimationVariant,
  ButtonSize,
  ButtonVariant,
  InputSize,
  InputVariant,
  CardPadding,
  CardVariant,
  BadgeVariant,
  AlertVariant,
  BaseComponentProps,
  ButtonProps,
  InputProps,
  CardProps,
  BadgeProps,
  AlertProps,
  IconProps,
  TypographyProps,
  SpacingProps,
  ColorProps,
  BorderProps,
  ShadowProps,
  LayoutProps,
  FlexProps,
  GridProps,
  PositionProps,
  StyleProps,
  ThemeConfig,
  Theme,
  BrandColors,
  AccentColors,
  Typography as DesignSystemTypography,
  Spacing as DesignSystemSpacing,
  BorderRadius as DesignSystemBorderRadius,
  Shadows,
  Animations,
  Breakpoints,
  ZIndex as DesignSystemZIndex,
  Components
} from './types';

// ===== UTILITY FUNCTIONS =====

import defaultTheme from './tokens';
import defaultIconSystem from './icon-sizes';

/**
 * Get a design token value by path
 * @param path - Dot notation path to the token (e.g., 'colors.brand.500')
 * @returns The token value or undefined if not found
 */
export function getToken(path: string): any {
  return path.split('.').reduce((obj, key) => obj?.[key as keyof typeof obj], defaultTheme as any);
}

/**
 * Get a color value from the design tokens
 * @param colorPath - Path to the color (e.g., 'brand.500', 'accent.gold')
 * @returns The color value as a string
 */
export function getColor(colorPath: string): string {
  const color = getToken(`colors.${colorPath}`);
  return color || colorPath; // Fallback to the original path if not found
}

/**
 * Get a spacing value from the design tokens
 * @param spacingKey - Spacing key (e.g., '4', 'lg', 'xl')
 * @returns The spacing value as a string
 */
export function getSpacing(spacingKey: string): string {
  const spacing = getToken(`spacing.${spacingKey}`);
  return spacing || spacingKey; // Fallback to the original key if not found
}

/**
 * Get a font size value from the design tokens
 * @param sizeKey - Font size key (e.g., 'sm', 'lg', '2xl')
 * @returns The font size value as a string
 */
export function getFontSize(sizeKey: string): string {
  const fontSize = getToken(`typography.fontSize.${sizeKey}`);
  return fontSize || sizeKey; // Fallback to the original key if not found
}

/**
 * Get a shadow value from the design tokens
 * @param shadowKey - Shadow key (e.g., 'sm', 'md', 'sacred.glow')
 * @returns The shadow value as a string
 */
export function getShadow(shadowKey: string): string {
  const shadow = getToken(`shadows.${shadowKey}`);
  return shadow || shadowKey; // Fallback to the original key if not found
}

/**
 * Create a CSS custom property name from a token path
 * @param path - Token path (e.g., 'colors.brand.500')
 * @returns CSS custom property name (e.g., '--colors-brand-500')
 */
export function createCSSCustomProperty(path: string): string {
  return `--${path.replace(/\./g, '-')}`;
}

/**
 * Generate CSS custom properties from design tokens
 * @param tokens - Token object to process
 * @param prefix - Prefix for the custom properties
 * @returns Object with CSS custom property names as keys and values
 */
export function generateCSSCustomProperties(
  tokens: Record<string, any>,
  prefix: string = ''
): Record<string, string> {
  const result: Record<string, string> = {};
  
  function processTokens(obj: Record<string, any>, currentPath: string = '') {
    for (const [key, value] of Object.entries(obj)) {
      const newPath = currentPath ? `${currentPath}-${key}` : key;
      
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        processTokens(value, newPath);
      } else {
        const customPropName = prefix ? `--${prefix}-${newPath}` : `--${newPath}`;
        result[customPropName] = String(value);
      }
    }
  }
  
  processTokens(tokens);
  return result;
}

/**
 * Create responsive CSS based on breakpoints
 * @param values - Object with breakpoint keys and values
 * @param property - CSS property name
 * @returns CSS string with media queries
 */
export function createResponsiveCSS(
  values: Record<string, string>,
  property: string
): string {
  const breakpoints = defaultTheme.breakpoints;
  let css = '';
  
  for (const [breakpoint, value] of Object.entries(values)) {
    if (breakpoint === 'xs' || breakpoint === 'base') {
      css += `${property}: ${value};\n`;
    } else if (breakpoint in breakpoints) {
      css += `@media (min-width: ${breakpoints[breakpoint as keyof typeof breakpoints]}) {\n`;
      css += `  ${property}: ${value};\n`;
      css += `}\n`;
    }
  }
  
  return css;
}

/**
 * Validate if a color follows the brand guidelines
 * @param color - Color value to validate
 * @returns Boolean indicating if the color is valid
 */
export function validateBrandColor(color: string): boolean {
  const brandColors = Object.values(defaultTheme.colors.brand) as string[];
  const accentColors = Object.values(defaultTheme.colors.accent) as string[];
  const semanticColors = Object.values(defaultTheme.colors.semantic) as string[];
  
  return [...brandColors, ...accentColors, ...semanticColors].includes(color);
}

/**
 * Get the contrast ratio between two colors (simplified)
 * @param color1 - First color
 * @param color2 - Second color
 * @returns Estimated contrast ratio (simplified calculation)
 */
export function getContrastRatio(color1: string, color2: string): number {
  // This is a simplified contrast ratio calculation
  // In a real implementation, you'd want to use a proper color contrast library
  // For now, we'll return a placeholder value
  return 4.5; // WCAG AA standard
}

/**
 * Get accessible color combinations
 * @param backgroundColor - Background color
 * @returns Object with accessible text colors
 */
export function getAccessibleColors(backgroundColor: string): {
  text: string;
  textSecondary: string;
  textInverse: string;
} {
  // Simplified logic - in a real implementation, you'd calculate actual contrast ratios
  const isLight = backgroundColor.includes('50') || backgroundColor.includes('white');
  
  return {
    text: isLight ? defaultTheme.colors.accent.black : defaultTheme.colors.accent.white,
    textSecondary: isLight ? defaultTheme.colors.gray[600] : defaultTheme.colors.gray[300],
    textInverse: isLight ? defaultTheme.colors.accent.white : defaultTheme.colors.accent.black
  };
}

/**
 * Generate a complete design system CSS output
 * @returns CSS string with all design tokens as custom properties
 */
export function generateDesignSystemCSS(): string {
  const customProperties = generateCSSCustomProperties(defaultTheme, 'vibe');
  
  let css = ':root {\n';
  for (const [property, value] of Object.entries(customProperties)) {
    css += `  ${property}: ${value};\n`;
  }
  css += '}\n';
  
  return css;
}

// ===== CONSTANTS FOR EASY ACCESS =====

/** Quick access to brand colors */
export const BRAND_COLORS = defaultTheme.colors.brand;

/** Quick access to accent colors */
export const ACCENT_COLORS = defaultTheme.colors.accent;

/** Quick access to semantic colors */
export const SEMANTIC_COLORS = defaultTheme.colors.semantic;

/** Quick access to spacing scale */
export const SPACING = defaultTheme.spacing;

/** Quick access to typography scale */
export const TYPOGRAPHY = defaultTheme.typography;

/** Quick access to breakpoints */
export const BREAKPOINTS = defaultTheme.breakpoints;

/** Quick access to shadows */
export const SHADOWS = defaultTheme.shadows;

/** Quick access to animations */
export const ANIMATIONS = defaultTheme.animations;

/** Quick access to icon sizes */
export const ICON_SIZES = defaultIconSystem.sizes;

/** Quick access to icon colors */
export const ICON_COLORS = defaultIconSystem.colors;

// ===== DESIGN SYSTEM CONFIGURATION =====

/** Design system version */
export const DESIGN_SYSTEM_VERSION = '1.0.0';

/** Design system metadata */
export const DESIGN_SYSTEM_META = {
  name: 'Vibe Coding Bible Design System',
  version: DESIGN_SYSTEM_VERSION,
  description: 'Unified design token system for the Vibe Coding Bible platform',
  colors: {
    brand: Object.keys(defaultTheme.colors.brand).length,
    accent: Object.keys(defaultTheme.colors.accent).length,
    semantic: Object.keys(defaultTheme.colors.semantic).length,
    total: Object.keys(defaultTheme.colors.brand).length + 
           Object.keys(defaultTheme.colors.accent).length + 
           Object.keys(defaultTheme.colors.semantic).length
  },
  typography: {
    fontFamilies: Object.keys(defaultTheme.typography.fontFamily).length,
    fontSizes: Object.keys(defaultTheme.typography.fontSize).length,
    fontWeights: Object.keys(defaultTheme.typography.fontWeight).length
  },
  spacing: {
    tokens: Object.keys(defaultTheme.spacing).length
  },
  breakpoints: Object.keys(defaultTheme.breakpoints).length,
  shadows: Object.keys(defaultTheme.shadows).length + Object.keys(defaultTheme.shadows.sacred).length,
  animations: Object.keys(defaultTheme.animations.duration).length,
  icons: Object.keys(defaultIconSystem.sizes).length
} as const;

// ===== DEFAULT EXPORT =====
export default {
  theme: defaultTheme,
  iconSystem: defaultIconSystem,
  utils: {
    getToken,
    getColor,
    getSpacing,
    getFontSize,
    getShadow,
    createCSSCustomProperty,
    generateCSSCustomProperties,
    createResponsiveCSS,
    validateBrandColor,
    getContrastRatio,
    getAccessibleColors,
    generateDesignSystemCSS
  },
  constants: {
    BRAND_COLORS,
    ACCENT_COLORS,
    SEMANTIC_COLORS,
    SPACING,
    TYPOGRAPHY,
    BREAKPOINTS,
    SHADOWS,
    ANIMATIONS,
    ICON_SIZES,
    ICON_COLORS
  },
  meta: DESIGN_SYSTEM_META
};