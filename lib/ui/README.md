# Vibe Coding Bible - Unified Design System

A comprehensive, type-safe design token system for the Vibe Coding Bible platform, featuring the new 5-token brand color system with German heritage accents.

## Overview

This design system provides:
- **Unified color palette** with brand colors and semantic variants
- **Typography system** with responsive scaling and font families
- **Spacing system** with consistent scale and responsive utilities
- **Icon system** with contextual sizing and accessibility features
- **Component tokens** for buttons, cards, forms, and more
- **TypeScript support** with full type safety and IntelliSense

## Installation & Usage

### Basic Import

```typescript
import { theme, BRAND_COLORS, getColor } from '@/lib/ui';

// Access design tokens
const primaryColor = theme.colors.brand[500];
const spacing = theme.spacing[4];
const fontSize = theme.typography.fontSize.lg;
```

### Quick Access Constants

```typescript
import { 
  BRAND_COLORS, 
  ACCENT_COLORS, 
  SPACING, 
  TYPOGRAPHY 
} from '@/lib/ui';

// Use constants for common values
const primary = BRAND_COLORS[500];
const gold = ACCENT_COLORS.gold;
const mediumSpacing = SPACING[4];
```

### Utility Functions

```typescript
import { getColor, getSpacing, getFontSize } from '@/lib/ui';

// Get values using utility functions
const backgroundColor = getColor('brand.50');
const padding = getSpacing('4');
const textSize = getFontSize('lg');
```

## Design Tokens

### Brand Colors (5-Token System)

```typescript
brand: {
  50: 'hsl(205, 85%, 95%)',   // Ultra light - backgrounds, subtle highlights
  300: 'hsl(205, 70%, 65%)',  // Light - secondary elements, hover states
  500: 'hsl(200, 100%, 44%)', // Primary - main brand color (#009EE0)
  700: 'hsl(214, 100%, 28%)', // Dark - strong emphasis (#004A8F)
  900: 'hsl(214, 100%, 12%)'  // Ultra dark - text, deep backgrounds (#001F3F)
}
```

### German Heritage Accent Colors

```typescript
accent: {
  red: '#DD0000',     // Error states, critical alerts
  gold: '#FFCE00',    // Success states, premium features
  black: '#000000',   // Pure text, maximum contrast
  white: '#FFFFFF'    // Pure backgrounds, absolute foregrounds
}
```

### Semantic Colors

```typescript
semantic: {
  success: '#FFCE00',      // Success states
  warning: '#F59E0B',      // Warning states  
  error: '#DD0000',        // Error states
  info: 'hsl(200, 100%, 44%)', // Info states
  
  // Light variants for backgrounds
  successLight: '#FEF3C7',
  warningLight: '#FEF3C7',
  errorLight: '#FEE2E2',
  infoLight: 'hsl(205, 85%, 95%)',
  
  // Dark variants for borders/emphasis
  successDark: '#D97706',
  warningDark: '#B45309',
  errorDark: '#991B1B',
  infoDark: 'hsl(214, 100%, 28%)'
}
```

## Typography System

### Font Families

```typescript
fontFamily: {
  sans: ['Inter', 'system-ui', 'sans-serif'],      // Body text, UI
  serif: ['Cinzel', 'Georgia', 'serif'],           // Headings, emphasis
  mono: ['Fira Code', 'ui-monospace', 'monospace'], // Code, technical
  display: ['Montserrat', 'system-ui', 'sans-serif'] // Large display text
}
```

### Font Sizes (Responsive Scale)

```typescript
fontSize: {
  xs: '0.75rem',    // 12px - Small labels
  sm: '0.875rem',   // 14px - Secondary text
  base: '1rem',     // 16px - Body text
  lg: '1.125rem',   // 18px - Large body
  xl: '1.25rem',    // 20px - Small headings
  '2xl': '1.5rem',  // 24px - Medium headings
  '3xl': '1.875rem', // 30px - Large headings
  '4xl': '2.25rem', // 36px - Display text
  '5xl': '3rem',    // 48px - Large display
  '6xl': '3.75rem', // 60px - Hero text
  '7xl': '4.5rem',  // 72px - Large hero
  '8xl': '6rem',    // 96px - Extra large
  '9xl': '8rem'     // 128px - Maximum impact
}
```

## CSS Classes

### Typography Classes

```css
/* Display text for hero sections */
.text-display-1 { /* Responsive 2.5rem to 8rem */ }
.text-display-2 { /* Responsive 2rem to 6rem */ }

/* Heading hierarchy */
.text-heading-1 { /* Responsive 1.875rem to 4.5rem */ }
.text-heading-2 { /* Responsive 1.5rem to 3.75rem */ }
.text-heading-3 { /* Responsive 1.25rem to 3rem */ }
.text-heading-4 { /* Responsive 1.125rem to 2.25rem */ }
.text-heading-5 { /* Responsive 1rem to 1.875rem */ }
.text-heading-6 { /* Responsive 0.875rem to 1.5rem */ }

/* Body text variants */
.text-body-large { /* Responsive 1rem to 1.5rem */ }
.text-body { /* Responsive 0.875rem to 1.125rem */ }
.text-body-small { /* Responsive 0.75rem to 1rem */ }

/* Label and UI text */
.text-label-large { /* Responsive 0.875rem to 1.125rem */ }
.text-label { /* Responsive 0.75rem to 1rem */ }
.text-label-small { /* Responsive 0.625rem to 0.875rem */ }
```

### Gradient Text Effects

```css
.text-brand-gradient     /* Blue gradient */
.text-sacred-gradient    /* Gold-blue-dark gradient */
.text-divine-gradient    /* Blue-light-gold gradient */
.text-mystical-gradient  /* Dark-red-gold gradient */
```

### Button System

```css
/* Base button with sizes */
.btn-base .btn-sm .btn-md .btn-lg .btn-xl

/* Button variants */
.btn-primary    /* Primary brand button */
.btn-secondary  /* Light secondary button */
.btn-sacred     /* Gold-blue gradient button */
.btn-outline    /* Outlined button */
.btn-ghost      /* Minimal ghost button */
```

### Card System

```css
/* Card variants */
.card-base      /* Basic white card */
.card-sacred    /* Gradient sacred card */
.card-divine    /* Dark divine card */

/* Card padding */
.card-padding-sm .card-padding-md .card-padding-lg .card-padding-xl
```

### Form Elements

```css
/* Input variants */
.input-base     /* Standard input */
.input-sacred   /* Sacred gradient input */

/* Input sizes */
.input-sm .input-md .input-lg
```

### Utility Classes

```css
/* Spacing utilities */
.space-y-xs .space-y-sm .space-y-md .space-y-lg .space-y-xl .space-y-2xl
.space-x-xs .space-x-sm .space-x-md .space-x-lg .space-x-xl .space-x-2xl

/* Layout utilities */
.container-base   /* Responsive container */
.section-base     /* Responsive section padding */
.grid-base        /* Responsive grid */
.flex-base        /* Flexbox with gap */

/* Animation utilities */
.transition-base .transition-colors .transition-transform .transition-sacred
.hover-lift .hover-scale .hover-sacred

/* Focus states */
.focus-ring .focus-ring-sacred
```

## Icon System

### Icon Sizes

```typescript
iconSizes: {
  xs: '12px',    // Inline text, badges
  sm: '16px',    // Buttons, form inputs
  md: '20px',    // Default UI elements
  lg: '24px',    // Section headers
  xl: '32px',    // Hero sections
  '2xl': '40px', // Large cards
  '3xl': '48px', // Splash screens
  '4xl': '64px', // Hero graphics
  '5xl': '80px', // Large displays
  '6xl': '96px'  // Maximum impact
}
```

### Contextual Usage

```typescript
// Get appropriate icon size for context
import { getContextualIcon } from '@/lib/ui';

const buttonIconSize = getContextualIcon('button', 'md'); // 16px
const cardIconSize = getContextualIcon('card', 'lg');     // 32px
const navIconSize = getContextualIcon('navigation', 'mobile'); // 24px
```

## Tailwind Integration

The design system is fully integrated with Tailwind CSS:

```tsx
// Use design tokens in Tailwind classes
<div className="bg-brand-50 text-brand-900 p-4 rounded-lg shadow-sacred-md">
  <h1 className="text-heading-1 text-sacred-gradient">
    Vibe Coding Bible
  </h1>
  <p className="text-body text-semantic-info">
    Learn modern development practices
  </p>
</div>
```

## TypeScript Support

Full type safety with IntelliSense support:

```typescript
import type { 
  BrandColorVariant, 
  FontSize, 
  ButtonProps,
  CardProps 
} from '@/lib/ui/types';

// Type-safe component props
const Button: React.FC<ButtonProps> = ({ 
  variant = 'primary',
  size = 'md',
  children 
}) => {
  return (
    <button className={`btn-base btn-${size} btn-${variant}`}>
      {children}
    </button>
  );
};
```

## Responsive Design

All design tokens include responsive behavior:

```css
/* Typography automatically scales */
.text-heading-1 {
  font-size: clamp(1.875rem, 3vw, 4.5rem);
}

/* Spacing adjusts at breakpoints */
.section-base {
  padding: 4rem 0; /* Mobile */
}

@media (min-width: 768px) {
  .section-base {
    padding: 6rem 0; /* Tablet */
  }
}

@media (min-width: 1024px) {
  .section-base {
    padding: 8rem 0; /* Desktop */
  }
}
```

## Accessibility

The design system includes accessibility features:

- **High contrast mode** support with fallback colors
- **Reduced motion** support for animations
- **Focus states** with visible indicators
- **Color contrast** utilities for accessible combinations
- **Screen reader** support with semantic HTML

## Best Practices

### Color Usage

```typescript
// ✅ Good - Use semantic colors for states
const successColor = SEMANTIC_COLORS.success;
const errorColor = SEMANTIC_COLORS.error;

// ✅ Good - Use brand colors for branding
const primaryAction = BRAND_COLORS[500];
const subtleBackground = BRAND_COLORS[50];

// ❌ Avoid - Don't use arbitrary colors
const customBlue = '#1234AB'; // Use brand colors instead
```

### Typography

```tsx
// ✅ Good - Use semantic typography classes
<h1 className="text-heading-1">Main Title</h1>
<p className="text-body">Regular text content</p>
<span className="text-label-small">Field label</span>

// ✅ Good - Use font families appropriately
<h1 className="font-serif">Elegant heading</h1>
<code className="font-mono">Code snippet</code>
<p className="font-sans">Body text</p>
```

### Spacing

```tsx
// ✅ Good - Use consistent spacing scale
<div className="p-4 mb-6 space-y-4">
  <div className="mt-2 px-3">Content</div>
</div>

// ✅ Good - Use spacing utilities
<div className="space-y-md"> {/* Custom spacing utility */}
  <p>Paragraph one</p>
  <p>Paragraph two</p>
</div>
```

## Migration Guide

When migrating existing components:

1. **Replace custom colors** with design token values
2. **Update typography** to use the new scale and classes  
3. **Standardize spacing** using the spacing scale
4. **Add accessibility** features like focus states
5. **Test responsive** behavior across breakpoints

## Contributing

When adding new design tokens:

1. **Follow naming conventions** (semantic, not descriptive)
2. **Add TypeScript types** for new tokens
3. **Include responsive behavior** where appropriate
4. **Document usage examples** in this README
5. **Test across all components** before committing

## Support

For questions or issues with the design system:
- Check existing components for usage patterns
- Review TypeScript types for available options
- Test new implementations across breakpoints
- Ensure accessibility standards are met