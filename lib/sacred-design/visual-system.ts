/**
 * Sacred Design System for the Vibe Coding Bible
 * 
 * This file contains all design tokens, typography scales, spacing systems,
 * and visual guidelines that maintain consistency across all illustrations
 * and design components.
 */

/**
 * Color Palette - Sacred Tech Colors
 */
export const DesignTokens = {
  colors: {
    // New Unified Brand Palette
    brand: {
      gold: '#FFCE00',
      '500': '#009EE0',
      '700': '#004A8F',
    },
    
    // Legacy Primary Palette (updated)
    primary: {
      deepMidnightBlue: '#0A1128',
      electricIndigo: '#009EE0', // Updated to new brand blue
      techGold: '#FFCE00', // Updated to new brand gold
    },
    
    // Secondary Palette
    secondary: {
      cosmicBlack: '#121212',
      digitalWhite: '#F8F9FA',
      matrixGreen: '#00FF41',
    },
    
    // Extended Mystical Palette (updated)
    mystical: {
      mysticPurple: '#004A8F', // Updated to brand-700
      divineCyan: '#009EE0', // Updated to brand-500
      sacredRose: '#DD0000', // Updated to accent-red
      etherealMint: '#10B981',
      celestialYellow: '#FFCE00', // Updated to brand-gold
      voidBlack: '#000000',
      lightDivine: '#FFFFFF',
    },
    
    // Accent Colors
    accent: {
      red: '#DD0000',
    },
    
    // Gradient Definitions (updated to new brand)
    gradients: {
      brandPrimary: 'linear-gradient(135deg, #FFCE00 0%, #009EE0 100%)',
      brandTriple: 'linear-gradient(90deg, #FFCE00 0%, #009EE0 50%, #004A8F 100%)',
      mysticNight: 'linear-gradient(135deg, #0A1128 0%, #121212 100%)',
      divineLighting: 'radial-gradient(circle, #FFCE00 0%, #009EE0 50%, #0A1128 100%)',
      matrixFlow: 'linear-gradient(90deg, #00FF41 0%, #009EE0 100%)',
      sacredAura: 'conic-gradient(from 0deg, #FFCE00, #009EE0, #00FF41, #FFCE00)',
      
      // Legacy gradients (updated)
      techGoldToIndigo: 'linear-gradient(135deg, #FFCE00 0%, #009EE0 100%)',
    },
    
    // Semantic Colors (updated)
    semantic: {
      success: '#10B981',
      error: '#DD0000', // Updated to accent-red
      warning: '#FFCE00', // Updated to brand-gold
      info: '#009EE0', // Updated to brand-500
    }
  },

  /**
   * Typography System
   */
  typography: {
    fonts: {
      heading: {
        family: 'Cinzel, serif',
        weights: [400, 600, 700],
        usage: 'Commandment titles, chapter headings, sacred proclamations'
      },
      subheading: {
        family: 'Montserrat, sans-serif',
        weights: [400, 600, 700, 800],
        usage: 'Section headers, tool names, important callouts'
      },
      body: {
        family: 'Inter, sans-serif',
        weights: [300, 400, 500, 600],
        usage: 'Main content, descriptions, explanations'
      },
      code: {
        family: 'JetBrains Mono, monospace',
        weights: [400, 500, 700],
        usage: 'Code examples, prompts, technical content'
      }
    },
    
    scales: {
      // Modular scale based on golden ratio (1.618)
      sizes: {
        xs: '0.75rem',    // 12px
        sm: '0.875rem',   // 14px
        base: '1rem',     // 16px
        lg: '1.125rem',   // 18px
        xl: '1.25rem',    // 20px
        '2xl': '1.5rem',  // 24px
        '3xl': '1.875rem', // 30px
        '4xl': '2.25rem',  // 36px
        '5xl': '3rem',     // 48px
        '6xl': '3.75rem',  // 60px
        '7xl': '4.5rem',   // 72px
        '8xl': '6rem',     // 96px
        '9xl': '8rem',     // 128px
      },
      
      lineHeights: {
        tight: 1.25,
        snug: 1.375,
        normal: 1.5,
        relaxed: 1.625,
        loose: 2,
      }
    }
  },

  /**
   * Spacing System - Based on sacred proportions
   */
  spacing: {
    // Base unit: 8px (perfect square for digital harmony)
    base: 8,
    
    // Golden ratio-based spacing scale
    scale: {
      xs: '0.25rem',   // 4px
      sm: '0.5rem',    // 8px
      md: '1rem',      // 16px
      lg: '1.618rem',  // ~26px (golden ratio)
      xl: '2.618rem',  // ~42px (golden ratio squared)
      '2xl': '4.236rem', // ~68px
      '3xl': '6.854rem', // ~110px
      '4xl': '11.09rem', // ~178px
      '5xl': '17.944rem' // ~287px
    },
    
    // Sacred geometry proportions
    sacred: {
      fibonacci: [8, 13, 21, 34, 55, 89, 144, 233],
      goldenRatio: 1.618,
      silverRatio: 2.414,
      phi: 1.618033988749,
    }
  },

  /**
   * Sacred Geometry Patterns
   */
  geometry: {
    patterns: {
      flowerOfLife: {
        radius: 50,
        strokeWidth: 1.5,
        opacity: 0.6,
        color: '#6610F2'
      },
      
      goldenSpiral: {
        initialRadius: 5,
        growthFactor: 1.618,
        strokeWidth: 2,
        opacity: 0.8,
        color: '#F9A826'
      },
      
      metatronsCube: {
        radius: 60,
        strokeWidth: 1,
        opacity: 0.5,
        color: '#00FF41'
      },
      
      vesicaPiscis: {
        radius: 40,
        overlap: 0.5,
        strokeWidth: 1.5,
        opacity: 0.7,
        color: '#6610F2'
      }
    },
    
    proportions: {
      golden: 1.618,
      silver: 2.414,
      bronze: 3.303,
      paper: 1.414,
      pentagon: 1.176,
    }
  },

  /**
   * Animation & Effects
   */
  effects: {
    shadows: {
      divine: '0 0 20px rgba(249, 168, 38, 0.3)',
      mystical: '0 0 30px rgba(102, 16, 242, 0.4)',
      matrix: '0 0 15px rgba(0, 255, 65, 0.5)',
      depth: '0 10px 25px rgba(10, 17, 40, 0.3)',
    },
    
    glows: {
      techGold: 'drop-shadow(0 0 10px #F9A82660)',
      electricIndigo: 'drop-shadow(0 0 15px #6610F260)',
      matrixGreen: 'drop-shadow(0 0 8px #00FF4160)',
      divine: 'drop-shadow(0 0 20px #F9A82640)',
    },
    
    animations: {
      durations: {
        fast: '0.15s',
        normal: '0.3s',
        slow: '0.5s',
        sacred: '1.618s', // Golden ratio seconds
      },
      
      easings: {
        divine: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        mystical: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        natural: 'cubic-bezier(0.4, 0, 0.2, 1)',
      }
    }
  },

  /**
   * Layout & Grid System
   */
  layout: {
    // Based on golden rectangle proportions
    breakpoints: {
      xs: '480px',
      sm: '768px',
      md: '1024px',
      lg: '1440px',
      xl: '1920px',
    },
    
    containers: {
      xs: '100%',
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
    },
    
    grid: {
      columns: 12,
      gutter: '1.618rem', // Golden ratio
    },
    
    aspectRatios: {
      golden: '1.618:1',
      video: '16:9',
      square: '1:1',
      portrait: '3:4',
      ultrawide: '21:9',
    }
  },

  /**
   * Component-Specific Tokens
   */
  components: {
    commandmentCard: {
      padding: '2.618rem',
      borderRadius: '0.618rem',
      backdrop: 'rgba(10, 17, 40, 0.8)',
      border: '1px solid rgba(102, 16, 242, 0.3)',
      minHeight: '21rem', // Fibonacci number
    },
    
    toolMascot: {
      size: {
        small: '3rem',
        medium: '5rem',
        large: '8rem',
        hero: '13rem', // Fibonacci numbers
      },
      hoverScale: 1.05,
      glowIntensity: 0.6,
    },
    
    sacredGeometry: {
      strokeWidth: 1.5,
      opacity: 0.6,
      animationDuration: '3.236s', // Golden ratio * 2
    },
    
    codeBlock: {
      padding: '1.618rem',
      borderRadius: '0.5rem',
      background: 'rgba(18, 18, 18, 0.9)',
      border: '1px solid rgba(0, 255, 65, 0.2)',
      fontFamily: 'JetBrains Mono',
    }
  },

  /**
   * Accessibility & Readability
   */
  accessibility: {
    contrast: {
      minimum: 4.5,
      enhanced: 7,
    },
    
    focusStyles: {
      outline: '2px solid #F9A826',
      outlineOffset: '2px',
      borderRadius: '0.25rem',
    },
    
    textSizes: {
      minimum: '16px',
      comfortable: '18px',
      large: '20px',
    }
  }
};

/**
 * Utility Functions for Design System
 */
export class DesignUtils {
  
  /**
   * Calculate golden ratio proportions
   */
  static goldenRatio(value: number, inverse: boolean = false): number {
    const phi = DesignTokens.spacing.sacred.phi;
    return inverse ? value / phi : value * phi;
  }
  
  /**
   * Generate color with opacity
   */
  static colorWithOpacity(color: string, opacity: number): string {
    // Convert hex to rgba
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  }
  
  /**
   * Get responsive spacing based on screen size
   */
  static responsiveSpacing(base: string, multiplier: number = 1): {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  } {
    const baseValue = parseFloat(base);
    return {
      xs: `${baseValue * 0.75 * multiplier}rem`,
      sm: `${baseValue * 0.875 * multiplier}rem`,
      md: `${baseValue * multiplier}rem`,
      lg: `${baseValue * 1.25 * multiplier}rem`,
      xl: `${baseValue * 1.5 * multiplier}rem`,
    };
  }
  
  /**
   * Generate sacred geometry coordinates
   */
  static generateCirclePoints(count: number, radius: number, centerX: number = 0, centerY: number = 0): Array<{x: number, y: number}> {
    const points = [];
    for (let i = 0; i < count; i++) {
      const angle = (i * 2 * Math.PI) / count;
      points.push({
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle)
      });
    }
    return points;
  }
  
  /**
   * Calculate Fibonacci sequence
   */
  static fibonacci(n: number): number[] {
    if (n <= 0) return [];
    if (n === 1) return [1];
    
    const sequence = [1, 1];
    for (let i = 2; i < n; i++) {
      sequence[i] = sequence[i - 1] + sequence[i - 2];
    }
    return sequence;
  }
}

export default DesignTokens;