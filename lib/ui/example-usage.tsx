/**
 * Example Usage of the Vibe Coding Bible Design System
 * 
 * This file demonstrates how to use the unified design token system
 * in React components with full TypeScript support.
 */

import React from 'react';
import { 
  theme, 
  BRAND_COLORS, 
  ACCENT_COLORS,
  getColor, 
  getSpacing,
  type ButtonProps,
  type CardProps 
} from './index';

// ===== EXAMPLE BUTTON COMPONENT =====

const DesignSystemButton: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left',
  children,
  className = '',
  onClick,
  ...props
}) => {
  const baseClasses = 'btn-base transition-base focus-ring';
  const sizeClasses = `btn-${size}`;
  const variantClasses = `btn-${variant}`;
  
  const buttonClasses = [
    baseClasses,
    sizeClasses,
    variantClasses,
    loading && 'opacity-75 cursor-wait',
    disabled && 'opacity-50 cursor-not-allowed',
    className
  ].filter(Boolean).join(' ');

  return (
    <button
      className={buttonClasses}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading ? (
        <div className="animate-spin w-4 h-4 border-2 border-current border-t-transparent rounded-full" />
      ) : (
        <>
          {icon && iconPosition === 'left' && (
            <span className="icon-left">{icon}</span>
          )}
          {children}
          {icon && iconPosition === 'right' && (
            <span className="icon-right">{icon}</span>
          )}
        </>
      )}
    </button>
  );
};

// ===== EXAMPLE CARD COMPONENT =====

const DesignSystemCard: React.FC<CardProps> = ({
  variant = 'base',
  padding = 'md',
  hover = true,
  clickable = false,
  children,
  className = '',
  onClick,
  ...props
}) => {
  const baseClasses = 'card-base';
  const variantClasses = `card-${variant}`;
  const paddingClasses = `card-padding-${padding}`;
  
  const cardClasses = [
    baseClasses,
    variantClasses,
    paddingClasses,
    hover && 'hover-lift',
    clickable && 'cursor-pointer',
    className
  ].filter(Boolean).join(' ');

  return (
    <div
      className={cardClasses}
      onClick={clickable ? onClick : undefined}
      {...props}
    >
      {children}
    </div>
  );
};

// ===== EXAMPLE USAGE COMPONENT =====

export const DesignSystemExample: React.FC = () => {
  return (
    <div className="container-base section-base space-y-xl">
      {/* Typography Examples */}
      <section className="space-y-md">
        <h1 className="text-heading-1 text-sacred-gradient">
          Design System Examples
        </h1>
        <p className="text-body-large">
          This demonstrates the unified design token system with the new 5-token brand colors.
        </p>
      </section>

      {/* Color Examples */}
      <section className="space-y-md">
        <h2 className="text-heading-3">Brand Colors</h2>
        <div className="grid-base grid-cols-5 gap-4">
          {Object.entries(BRAND_COLORS).map(([key, value]) => (
            <div key={key} className="text-center space-y-sm">
              <div 
                className="w-16 h-16 rounded-lg mx-auto shadow-md"
                style={{ backgroundColor: value }}
              />
              <div>
                <p className="text-label-small">brand.{key}</p>
                <p className="text-label-small opacity-75">{value}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Accent Colors */}
      <section className="space-y-md">
        <h2 className="text-heading-3">German Heritage Accents</h2>
        <div className="grid-base grid-cols-4 gap-4">
          {Object.entries(ACCENT_COLORS).map(([key, value]) => (
            <div key={key} className="text-center space-y-sm">
              <div 
                className="w-16 h-16 rounded-lg mx-auto shadow-md"
                style={{ backgroundColor: value }}
              />
              <div>
                <p className="text-label-small">accent.{key}</p>
                <p className="text-label-small opacity-75">{value}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Button Examples */}
      <section className="space-y-md">
        <h2 className="text-heading-3">Button System</h2>
        <div className="flex-base flex-wrap gap-4">
          <DesignSystemButton variant="primary">
            Primary Button
          </DesignSystemButton>
          <DesignSystemButton variant="secondary">
            Secondary Button
          </DesignSystemButton>
          <DesignSystemButton variant="sacred">
            Sacred Button
          </DesignSystemButton>
          <DesignSystemButton variant="outline">
            Outline Button
          </DesignSystemButton>
          <DesignSystemButton variant="ghost">
            Ghost Button
          </DesignSystemButton>
        </div>
        
        {/* Button Sizes */}
        <div className="flex-base flex-wrap gap-4 items-end">
          <DesignSystemButton variant="primary" size="sm">
            Small
          </DesignSystemButton>
          <DesignSystemButton variant="primary" size="md">
            Medium
          </DesignSystemButton>
          <DesignSystemButton variant="primary" size="lg">
            Large
          </DesignSystemButton>
          <DesignSystemButton variant="primary" size="xl">
            Extra Large
          </DesignSystemButton>
        </div>
      </section>

      {/* Card Examples */}
      <section className="space-y-md">
        <h2 className="text-heading-3">Card System</h2>
        <div className="grid-base grid-cols-3 gap-6">
          <DesignSystemCard variant="base" padding="md">
            <h3 className="text-heading-6 mb-2">Base Card</h3>
            <p className="text-body">
              This is a basic card with standard styling and medium padding.
            </p>
          </DesignSystemCard>
          
          <DesignSystemCard variant="sacred" padding="lg">
            <h3 className="text-heading-6 mb-2 text-brand-gradient">Sacred Card</h3>
            <p className="text-body">
              This is a sacred card with gradient styling and large padding.
            </p>
          </DesignSystemCard>
          
          <DesignSystemCard variant="divine" padding="md">
            <h3 className="text-heading-6 mb-2 text-accent-gold">Divine Card</h3>
            <p className="text-body">
              This is a divine card with dark styling for special content.
            </p>
          </DesignSystemCard>
        </div>
      </section>

      {/* Typography Scale */}
      <section className="space-y-md">
        <h2 className="text-heading-3">Typography Scale</h2>
        <div className="space-y-sm">
          <div className="text-display-1">Display 1</div>
          <div className="text-display-2">Display 2</div>
          <h1 className="text-heading-1">Heading 1</h1>
          <h2 className="text-heading-2">Heading 2</h2>
          <h3 className="text-heading-3">Heading 3</h3>
          <h4 className="text-heading-4">Heading 4</h4>
          <h5 className="text-heading-5">Heading 5</h5>
          <h6 className="text-heading-6">Heading 6</h6>
          <p className="text-body-large">Large body text for important content</p>
          <p className="text-body">Regular body text for general content</p>
          <p className="text-body-small">Small body text for secondary information</p>
          <p className="text-label">Label text for forms and UI</p>
          <p className="text-label-small">Small label text</p>
          <code className="text-code">Code text with monospace font</code>
        </div>
      </section>

      {/* Gradient Text Examples */}
      <section className="space-y-md">
        <h2 className="text-heading-3">Gradient Text Effects</h2>
        <div className="space-y-sm">
          <h3 className="text-heading-2 text-brand-gradient">Brand Gradient</h3>
          <h3 className="text-heading-2 text-sacred-gradient">Sacred Gradient</h3>
          <h3 className="text-heading-2 text-divine-gradient">Divine Gradient</h3>
          <h3 className="text-heading-2 text-mystical-gradient">Mystical Gradient</h3>
        </div>
      </section>

      {/* Spacing Examples */}
      <section className="space-y-md">
        <h2 className="text-heading-3">Spacing System</h2>
        <div className="space-y-sm">
          <div className="flex-base gap-2">
            <div className="w-8 h-8 bg-brand-300 rounded"></div>
            <span className="text-label">Gap: 0.5rem (space-2)</span>
          </div>
          <div className="flex-base gap-4">
            <div className="w-8 h-8 bg-brand-500 rounded"></div>
            <span className="text-label">Gap: 1rem (space-4)</span>
          </div>
          <div className="flex-base gap-6">
            <div className="w-8 h-8 bg-brand-700 rounded"></div>
            <span className="text-label">Gap: 1.5rem (space-6)</span>
          </div>
          <div className="flex-base gap-8">
            <div className="w-8 h-8 bg-brand-900 rounded"></div>
            <span className="text-label">Gap: 2rem (space-8)</span>
          </div>
        </div>
      </section>

      {/* Usage with Utility Functions */}
      <section className="space-y-md">
        <h2 className="text-heading-3">Utility Functions</h2>
        <div className="grid-base grid-cols-2 gap-6">
          <div 
            className="p-4 rounded-lg text-white"
            style={{ 
              backgroundColor: getColor('brand.500'),
              padding: getSpacing('4')
            }}
          >
            <h4 className="text-heading-6 mb-2">Using getColor() & getSpacing()</h4>
            <p className="text-body-small">
              Background: {getColor('brand.500')}<br/>
              Padding: {getSpacing('4')}
            </p>
          </div>
          
          <div 
            className="p-6 rounded-xl"
            style={{ 
              backgroundColor: getColor('accent.gold'),
              color: getColor('accent.black'),
              padding: getSpacing('6')
            }}
          >
            <h4 className="text-heading-6 mb-2">German Heritage Colors</h4>
            <p className="text-body-small">
              Gold background with black text for maximum contrast and accessibility.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DesignSystemExample;