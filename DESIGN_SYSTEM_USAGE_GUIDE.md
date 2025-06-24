# 🎨 VIBE CODING BIBLE - DESIGN SYSTEM USAGE GUIDE

## 🚀 Quick Start

Welcome to the **unified design system** for Vibe Coding Bible! This guide will help you build consistent, accessible, and performant UI components.

---

## 🎯 Core Principles

1. **Consistency First** - Use design tokens, not hardcoded values
2. **Accessibility By Default** - WCAG 2.1 AA compliance built-in
3. **Performance Optimized** - CSS variables and efficient loading
4. **Developer Friendly** - Clear APIs and comprehensive documentation

---

## 🎨 COLOR SYSTEM

### Primary Brand Colors

```tsx
// ✅ DO: Use CSS variables via Tailwind classes
<div className="bg-brand-primary-50 text-brand-primary-600">
  Content with brand colors
</div>

// ❌ DON'T: Use hardcoded colors
<div style={{ backgroundColor: '#eff6ff', color: '#2563eb' }}>
  Hardcoded colors - avoid this!
</div>
```

### Available Color Palettes

#### Brand Colors
- `brand-primary-{50,100,600,700,800}` - Primary blue palette
- `brand-secondary-{100,600,700}` - Secondary indigo palette

#### Semantic Colors  
- `semantic-success` / `semantic-success-light` - Success states
- `semantic-warning` / `semantic-warning-light` - Warning states
- `semantic-error` / `semantic-error-light` - Error states
- `semantic-info` / `semantic-info-light` - Info states

#### Neutral Colors
- `neutral-{50,100,200,300,400,500,600,700,800,900}` - Gray palette

### Text Colors

```tsx
// Headings
<h1 className="text-neutral-800">Main Heading</h1>

// Body text
<p className="text-neutral-600">Body text content</p>

// Interactive text
<a href="#" className="text-brand-primary-600 hover:text-brand-primary-700">
  Link text
</a>

// Gradient text effects
<h2 className="text-brand-gradient">
  Gradient heading
</h2>
```

---

## 🔤 TYPOGRAPHY

### Font Loading (Optimized)

The design system uses Next.js font optimization for better performance:

```tsx
// ✅ Fonts are pre-optimized in layout.tsx
// No additional imports needed!

// Available font families:
// --font-inter (default)
// --font-cinzel (headings)
// --font-fira-code (code)
// --font-montserrat (display)
```

### Typography Classes

```tsx
// Display text (hero sections)
<h1 className="text-display-1 font-montserrat font-bold">
  Hero Title
</h1>

// Headings
<h2 className="text-heading-1 font-cinzel font-semibold">
  Sacred Heading
</h2>

// Body text
<p className="text-body-large font-inter">
  Large body text for important content
</p>

<p className="text-body font-inter">
  Regular body text
</p>

// Code text
<code className="text-code font-fira-code">
  const magic = true;
</code>
```

### Responsive Typography

```tsx
// ✅ Typography automatically scales on mobile
<h1 className="text-heading-1">
  {/* Automatically: 1.875rem on mobile, 4.5rem on desktop */}
  Responsive Heading
</h1>

// Custom responsive text
<p className="text-base md:text-lg lg:text-xl">
  Custom responsive text
</p>
```

---

## 🔘 BUTTON SYSTEM

### Basic Usage

```tsx
import { Button } from '@/components/ui/button'

// Primary actions
<Button variant="default" size="lg">
  Primary Action
</Button>

// Secondary actions  
<Button variant="secondary" size="md">
  Secondary Action
</Button>

// Destructive actions
<Button variant="destructive" size="sm">
  Delete Item
</Button>
```

### Sacred/Themed Variants

```tsx
// Sacred themed buttons (no inline styles needed!)
<Button variant="sacred" size="lg">
  Sacred Action
</Button>

<Button variant="divine" size="md">
  Divine Action
</Button>

<Button variant="mystical" size="sm">
  Mystical Action
</Button>

<Button variant="matrix" size="md">
  Matrix Action
</Button>
```

### Button Sizes

```tsx
// Available sizes
<Button size="sm">Small</Button>     // 32px height
<Button size="md">Medium</Button>    // 40px height  
<Button size="lg">Large</Button>     // 48px height
<Button size="xl">Extra Large</Button> // 56px height
```

### Sacred Button Presets

```tsx
import { SacredButton, DivineButton, MysticalButton } from '@/components/ui/button'

// Pre-configured sacred buttons
<SacredButton size="lg">
  Begin Sacred Journey
</SacredButton>

<DivineButton size="md">
  Divine Wisdom
</DivineButton>

<MysticalButton size="sm">
  Mystical Powers
</MysticalButton>
```

---

## 🃏 CARD SYSTEM

### Basic Cards

```tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

<Card className="prophet-card">
  <CardHeader>
    <CardTitle className="commandment-header">
      Card Title
    </CardTitle>
  </CardHeader>
  <CardContent>
    <p className="text-neutral-600">Card content goes here</p>
  </CardContent>
</Card>
```

### Sacred Cards

```tsx
// Sacred themed cards
<Card className="sacred-card">
  <CardContent className="p-6">
    <h3 className="text-heading-3 text-brand-gradient mb-4">
      Sacred Content
    </h3>
    <p className="text-neutral-600">
      Content with sacred styling
    </p>
  </CardContent>
</Card>

// Divine cards
<Card className="divine-card">
  <CardContent className="p-6">
    <h3 className="text-heading-3 text-white mb-4">
      Divine Content
    </h3>
    <p className="text-neutral-300">
      Content with divine styling
    </p>
  </CardContent>
</Card>
```

---

## 🎭 GRADIENTS & EFFECTS

### Background Gradients

```tsx
// Brand gradients
<div className="bg-brand-gradient p-8 text-white">
  Primary brand gradient
</div>

<div className="bg-brand-secondary-gradient p-8 text-white">
  Secondary brand gradient
</div>

<div className="bg-neutral-gradient p-8 text-white">
  Neutral gradient
</div>

<div className="bg-matrix-gradient p-8 text-semantic-success">
  Matrix-style gradient
</div>
```

### Text Gradients

```tsx
// Text with gradient effects
<h2 className="text-brand-gradient text-4xl font-bold">
  Gradient Text
</h2>

<h3 className="text-professional text-2xl">
  Professional gradient
</h3>
```

### Shadow Effects

```tsx
// Brand shadows
<div className="shadow-brand-md p-6 bg-white rounded-lg">
  Medium brand shadow
</div>

<div className="shadow-brand-glow p-6 bg-white rounded-lg">
  Glowing effect
</div>

<div className="shadow-matrix-glow p-6 bg-neutral-800 rounded-lg">
  Matrix glow effect
</div>
```

---

## 🎨 LAYOUT SYSTEM

### Container Sizes

```tsx
// Responsive containers
<div className="container mx-auto px-4">
  {/* Max-width: 1280px with responsive padding */}
  Main content container
</div>

// Custom containers
<div className="max-w-4xl mx-auto px-6">
  Narrower content container
</div>
```

### Grid System

```tsx
// Responsive grid
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  <div>Grid item 1</div>
  <div>Grid item 2</div>
  <div>Grid item 3</div>
</div>

// Sacred grid with design system spacing
<div className="sacred-grid sacred-grid-3">
  <div className="prophet-card">Item 1</div>
  <div className="prophet-card">Item 2</div>
  <div className="prophet-card">Item 3</div>
</div>
```

### Spacing System

```tsx
// Using standardized spacing
<div className="p-6 mb-8">           // padding: 24px, margin-bottom: 32px
<div className="px-4 py-2">          // horizontal: 16px, vertical: 8px
<div className="space-y-4">          // vertical spacing between children: 16px

// Sacred spacing (based on golden ratio)
<div className="p-sacred-md mb-sacred-lg">
  Content with sacred proportions
</div>
```

---

## ♿ ACCESSIBILITY FEATURES

### Focus Management

```tsx
// Enhanced focus indicators (automatic)
<Button className="focus-ring">
  Accessible button
</Button>

<input className="focus-ring w-full p-3 border rounded" />

// Sacred focus styles
<Button variant="sacred" className="focus-ring-sacred">
  Sacred button with enhanced focus
</Button>
```

### ARIA Support

```tsx
// Built-in ARIA support
<Button 
  aria-label="Delete item permanently"
  aria-describedby="delete-help"
>
  Delete
</Button>
<div id="delete-help" className="sr-only">
  This action cannot be undone
</div>

// Screen reader only content
<span className="sr-only">Screen reader content</span>
```

### Semantic HTML

```tsx
// Use semantic HTML elements
<nav aria-label="Main navigation">
  <ul role="menubar">
    <li role="none">
      <a href="/" role="menuitem">Home</a>
    </li>
  </ul>
</nav>

<main>
  <article>
    <header>
      <h1>Article title</h1>
    </header>
    <section>
      Article content
    </section>
  </article>
</main>
```

---

## 🌙 DARK MODE

### Automatic Dark Mode Support

```tsx
// Colors automatically adapt to dark mode
<div className="bg-background text-foreground">
  {/* Light: bg-brand-primary-50 text-neutral-800 */}
  {/* Dark: bg-neutral-800 text-white */}
  Adaptive content
</div>

<Card className="bg-card text-card-foreground">
  {/* Automatically switches between light/dark */}
  Card content
</Card>
```

### Dark Mode Specific Styles

```tsx
// Conditional dark mode styling
<div className="bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white">
  Explicit dark mode styles
</div>
```

---

## 📱 RESPONSIVE DESIGN

### Breakpoint System

```tsx
// Mobile-first responsive design
<div className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl">
  Responsive text sizing
</div>

// Hide/show at different breakpoints
<div className="hidden md:block">Desktop only</div>
<div className="block md:hidden">Mobile only</div>

// Responsive grid
<div className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
  Responsive grid columns
</div>
```

### Mobile Optimization

```tsx
// Touch-friendly targets (44px minimum)
<Button size="lg" className="min-h-[44px] min-w-[44px]">
  Mobile Friendly
</Button>

// Responsive padding
<div className="p-4 md:p-6 lg:p-8">
  Responsive padding
</div>
```

---

## 🔧 MIGRATION GUIDE

### From Legacy Sacred Classes

```tsx
// ❌ OLD: Legacy sacred classes
<div className="sacred-gradient sacred-text divine-glow">
  Legacy styling
</div>

// ✅ NEW: Unified design system
<div className="bg-brand-gradient text-brand-gradient shadow-brand-glow">
  Modern styling
</div>
```

### From Hardcoded Colors

```tsx
// ❌ OLD: Hardcoded colors
<div style={{ 
  backgroundColor: '#2563eb',
  color: '#ffffff',
  boxShadow: '0 0 20px rgba(37, 99, 235, 0.3)'
}}>
  Hardcoded styling
</div>

// ✅ NEW: Design system classes
<div className="bg-brand-primary-600 text-white shadow-brand-glow">
  Design system styling
</div>
```

### From Inline Styles

```tsx
// ❌ OLD: Inline styles
<button 
  style={{
    background: 'linear-gradient(135deg, #2563eb, #4f46e5)',
    color: 'white',
    padding: '12px 24px',
    borderRadius: '8px'
  }}
>
  Inline styles
</button>

// ✅ NEW: Component system
<Button variant="sacred" size="lg">
  Component system
</Button>
```

---

## 🚨 COMMON MISTAKES

### ❌ What NOT to Do

```tsx
// Don't use hardcoded colors
<div style={{ color: '#2563eb' }}>Hardcoded color</div>

// Don't mix design systems
<div className="sacred-gradient bg-blue-500">Mixed systems</div>

// Don't ignore accessibility
<button>No ARIA labels</button>

// Don't use inline styles for theming
<div style={{ background: 'linear-gradient(...)' }}>Inline gradient</div>
```

### ✅ Best Practices

```tsx
// Use design system tokens
<div className="text-brand-primary-600">Design system color</div>

// Consistent component APIs
<Button variant="sacred" size="lg">Consistent API</Button>

// Proper accessibility
<button aria-label="Close dialog" aria-describedby="help-text">
  Close
</button>

// CSS classes for theming
<div className="bg-brand-gradient">CSS class gradient</div>
```

---

## 🎯 COMPONENT CHECKLIST

Before creating a new component, ensure:

- [ ] **Colors**: Uses CSS variables/design tokens
- [ ] **Typography**: Uses typography scale
- [ ] **Spacing**: Uses standardized spacing
- [ ] **Accessibility**: WCAG 2.1 AA compliant
- [ ] **Responsive**: Works on all screen sizes
- [ ] **Dark Mode**: Supports theme switching
- [ ] **Performance**: No unnecessary re-renders
- [ ] **API**: Consistent with other components

---

## 📚 RESOURCES

### Documentation
- [Design System Audit Report](./DESIGN_SYSTEM_AUDIT_REPORT.md)
- [Validation Report](./DESIGN_SYSTEM_VALIDATION_REPORT.md)
- [Component Documentation](./components/ui/README.md)

### Tools
- **Tailwind CSS Classes**: All design tokens available as utilities
- **CSS Variables**: Direct access to design tokens
- **TypeScript Types**: Type-safe design token usage

### Support
- Check existing components before creating new ones
- Follow the established patterns and APIs
- Ensure accessibility compliance
- Test across devices and themes

---

**🎨 Happy Building with the Vibe Coding Bible Design System!** ✨

*Remember: Consistency is key, accessibility is mandatory, and performance matters.*