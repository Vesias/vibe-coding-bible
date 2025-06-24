/**
 * Vibe Coding Bible - Design System TypeScript Types
 * 
 * Type definitions for the unified design token system, providing 
 * type safety and IntelliSense support throughout the application.
 */

import { theme } from './tokens';

// ===== DESIGN TOKEN TYPES =====

/** Brand color variants from the 5-token system */
export type BrandColorVariant = '50' | '300' | '500' | '700' | '900';

/** German heritage accent colors */
export type AccentColorVariant = 'red' | 'gold' | 'black' | 'white';

/** Extended gray scale variants */
export type GrayVariant = '50' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900' | '950';

/** Semantic color variants */
export type SemanticColorVariant = 
  | 'success' | 'warning' | 'error' | 'info'
  | 'successLight' | 'warningLight' | 'errorLight' | 'infoLight'
  | 'successDark' | 'warningDark' | 'errorDark' | 'infoDark';

/** Typography font families */
export type FontFamily = 'sans' | 'serif' | 'mono' | 'display';

/** Typography font sizes */
export type FontSize = 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl' | '8xl' | '9xl';

/** Typography font weights */
export type FontWeight = 'thin' | 'extralight' | 'light' | 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold' | 'black';

/** Typography line heights */
export type LineHeight = 'none' | 'tight' | 'snug' | 'normal' | 'relaxed' | 'loose';

/** Typography letter spacing */
export type LetterSpacing = 'tighter' | 'tight' | 'normal' | 'wide' | 'wider' | 'widest';

/** Spacing scale */
export type SpacingScale = 
  | 'px' | '0' | '0.5' | '1' | '1.5' | '2' | '2.5' | '3' | '3.5' | '4' | '5' | '6' | '7' | '8' | '9' | '10' 
  | '11' | '12' | '14' | '16' | '20' | '24' | '28' | '32' | '36' | '40' | '44' | '48' | '52' | '56' | '60' 
  | '64' | '72' | '80' | '96';

/** Border radius variants */
export type BorderRadiusVariant = 'none' | 'sm' | 'base' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'full';

/** Shadow variants */
export type ShadowVariant = 'none' | 'sm' | 'base' | 'md' | 'lg' | 'xl' | '2xl' | 'inner';

/** Sacred shadow variants */
export type SacredShadowVariant = 'sm' | 'md' | 'lg' | 'glow' | 'divine';

/** Animation duration */
export type AnimationDuration = '75' | '100' | '150' | '200' | '300' | '500' | '700' | '1000';

/** Animation timing functions */
export type AnimationTimingFunction = 'linear' | 'in' | 'out' | 'inOut' | 'sacred' | 'divine' | 'mystical';

/** Responsive breakpoints */
export type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

/** Z-index scale */
export type ZIndexVariant = 'auto' | '0' | '10' | '20' | '30' | '40' | '50' | 'dropdown' | 'sticky' | 'fixed' | 'modalBackdrop' | 'modal' | 'popover' | 'tooltip' | 'toast';

// ===== ICON SYSTEM TYPES =====

/** Icon size variants */
export type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl';

/** Contextual icon usage */
export type IconContext = 'navigation' | 'button' | 'form' | 'card' | 'status' | 'loading' | 'social' | 'feature';

/** Icon spacing variants */
export type IconSpacingVariant = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

/** Icon color variants */
export type IconColorVariant = 
  | 'primary' | 'primaryLight' | 'primaryDark'
  | 'success' | 'error' | 'warning' | 'info'
  | 'neutral' | 'neutralLight' | 'neutralDark'
  | 'text' | 'textLight' | 'textInverse'
  | 'hover' | 'active' | 'disabled'
  | 'online' | 'busy' | 'offline' | 'away';

/** Icon animation variants */
export type IconAnimationVariant = 
  | 'spin' | 'spinSlow' | 'pulse' | 'bounce' | 'wiggle' | 'float'
  | 'fadeIn' | 'fadeOut' | 'sacred' | 'divine' | 'mystical';

// ===== COMPONENT TYPES =====

/** Button size variants */
export type ButtonSize = 'sm' | 'md' | 'lg' | 'xl';

/** Button variant styles */
export type ButtonVariant = 'primary' | 'secondary' | 'sacred' | 'outline' | 'ghost';

/** Input size variants */
export type InputSize = 'sm' | 'md' | 'lg';

/** Input variant styles */
export type InputVariant = 'base' | 'sacred';

/** Card padding variants */
export type CardPadding = 'sm' | 'md' | 'lg' | 'xl';

/** Card variant styles */
export type CardVariant = 'base' | 'sacred' | 'divine';

/** Badge variant styles */
export type BadgeVariant = 'primary' | 'secondary' | 'success' | 'error' | 'sacred';

/** Alert variant styles */
export type AlertVariant = 'info' | 'success' | 'error' | 'warning';

// ===== UTILITY TYPES =====

/** Color resolution - resolves color tokens to actual CSS values */
export type ResolveColor<T extends string> = T extends `brand.${BrandColorVariant}` 
  ? string 
  : T extends `accent.${AccentColorVariant}`
  ? string
  : T extends `semantic.${SemanticColorVariant}`
  ? string
  : T extends `gray.${GrayVariant}`
  ? string
  : string;

/** Responsive value type for breakpoint-based properties */
export type ResponsiveValue<T> = T | Partial<Record<Breakpoint, T>>;

/** Theme configuration type (inferred from theme object) */
export type ThemeConfig = typeof theme;

// ===== STYLE PROP INTERFACES =====

/** Typography style properties */
export interface TypographyProps {
  fontFamily?: FontFamily;
  fontSize?: FontSize;
  fontWeight?: FontWeight;
  lineHeight?: LineHeight;
  letterSpacing?: LetterSpacing;
}

/** Spacing style properties */
export interface SpacingProps {
  margin?: SpacingScale;
  marginTop?: SpacingScale;
  marginRight?: SpacingScale;
  marginBottom?: SpacingScale;
  marginLeft?: SpacingScale;
  marginX?: SpacingScale;
  marginY?: SpacingScale;
  padding?: SpacingScale;
  paddingTop?: SpacingScale;
  paddingRight?: SpacingScale;
  paddingBottom?: SpacingScale;
  paddingLeft?: SpacingScale;
  paddingX?: SpacingScale;
  paddingY?: SpacingScale;
}

/** Color style properties */
export interface ColorProps {
  color?: string;
  backgroundColor?: string;
  borderColor?: string;
}

/** Border style properties */
export interface BorderProps extends ColorProps {
  borderRadius?: BorderRadiusVariant;
  borderWidth?: '0' | '1' | '2' | '4' | '8';
}

/** Shadow style properties */
export interface ShadowProps {
  shadow?: ShadowVariant;
  sacredShadow?: SacredShadowVariant;
}

/** Layout style properties */
export interface LayoutProps {
  width?: string;
  height?: string;
  maxWidth?: string;
  maxHeight?: string;
  minWidth?: string;
  minHeight?: string;
}

/** Flexbox style properties */
export interface FlexProps {
  flex?: '1' | 'auto' | 'initial' | 'none';
  flexDirection?: 'row' | 'row-reverse' | 'col' | 'col-reverse';
  flexWrap?: 'wrap' | 'wrap-reverse' | 'nowrap';
  alignItems?: 'start' | 'end' | 'center' | 'baseline' | 'stretch';
  justifyContent?: 'start' | 'end' | 'center' | 'between' | 'around' | 'evenly';
  gap?: SpacingScale;
}

/** Grid style properties */
export interface GridProps {
  gridCols?: '1' | '2' | '3' | '4' | '5' | '6' | '12';
  gridRows?: '1' | '2' | '3' | '4' | '5' | '6';
  gap?: SpacingScale;
}

/** Position style properties */
export interface PositionProps {
  position?: 'static' | 'relative' | 'absolute' | 'fixed' | 'sticky';
  top?: SpacingScale;
  right?: SpacingScale;
  bottom?: SpacingScale;
  left?: SpacingScale;
  zIndex?: ZIndexVariant;
}

/** Complete style properties interface */
export interface StyleProps extends 
  TypographyProps,
  SpacingProps,
  ColorProps,
  BorderProps,
  ShadowProps,
  LayoutProps,
  FlexProps,
  GridProps,
  PositionProps {}

// ===== COMPONENT PROP INTERFACES =====

/** Base component props that all design system components should extend */
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
  testId?: string;
}

/** Button component props */
export interface ButtonProps extends BaseComponentProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  type?: 'button' | 'submit' | 'reset';
  form?: string;
}

/** Input component props */
export interface InputProps extends BaseComponentProps {
  variant?: InputVariant;
  size?: InputSize;
  placeholder?: string;
  disabled?: boolean;
  error?: boolean;
  value?: string;
  defaultValue?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search';
  name?: string;
  id?: string;
  required?: boolean;
  autoComplete?: string;
  maxLength?: number;
  pattern?: string;
}

/** Card component props */
export interface CardProps extends BaseComponentProps {
  variant?: CardVariant;
  padding?: CardPadding;
  hover?: boolean;
  clickable?: boolean;
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
}

/** Badge component props */
export interface BadgeProps extends BaseComponentProps {
  variant?: BadgeVariant;
  icon?: React.ReactNode;
}

/** Alert component props */
export interface AlertProps extends BaseComponentProps {
  variant?: AlertVariant;
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  dismissible?: boolean;
  onDismiss?: () => void;
}

/** Icon component props */
export interface IconProps extends BaseComponentProps {
  size?: IconSize;
  color?: IconColorVariant;
  animation?: IconAnimationVariant;
  'aria-hidden'?: boolean;
  'aria-label'?: string;
  role?: 'img' | 'button' | 'status' | 'presentation';
  onClick?: (event: React.MouseEvent<HTMLElement>) => void;
}

// ===== UTILITY FUNCTION TYPES =====

/** Color utility function type */
export type ColorUtility = (colorPath: string) => string;

/** Spacing utility function type */
export type SpacingUtility = (value: SpacingScale) => string;

/** Responsive utility function type */
export type ResponsiveUtility = <T>(value: ResponsiveValue<T>) => T | Record<string, T>;

/** Theme utility function type */
export type ThemeUtility = (path: string) => any;

// ===== DEFAULT EXPORTS =====

export type {
  // Re-export main theme type
  ThemeConfig as Theme
};

// Make theme tokens available as types
export type BrandColors = typeof theme.colors.brand;
export type AccentColors = typeof theme.colors.accent;
export type Typography = typeof theme.typography;
export type Spacing = typeof theme.spacing;
export type BorderRadius = typeof theme.borderRadius;
export type Shadows = typeof theme.shadows;
export type Animations = typeof theme.animations;
export type Breakpoints = typeof theme.breakpoints;
export type ZIndex = typeof theme.zIndex;
export type Components = typeof theme.components;