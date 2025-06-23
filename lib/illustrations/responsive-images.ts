/**
 * Responsive Image Optimization System
 * 
 * Handles responsive image generation, optimization, and loading
 * for all sacred illustrations in the Vibe Coding Bible.
 */

import React from 'react';
import { DesignTokens } from '../sacred-design/visual-system';

export interface ResponsiveImageConfig {
  name: string;
  category: 'commandment' | 'tool' | 'hero' | 'process' | 'geometry';
  baseWidth: number;
  baseHeight: number;
  aspectRatio: string;
  formats: ImageFormat[];
  sizes: ImageSize[];
  quality: number;
  loading: 'lazy' | 'eager';
  priority: 'high' | 'medium' | 'low';
}

export interface ImageFormat {
  format: 'webp' | 'avif' | 'png' | 'jpg';
  quality: number;
  compression: 'lossy' | 'lossless';
}

export interface ImageSize {
  width: number;
  height: number;
  descriptor: string;
  breakpoint?: string;
  usage: string;
}

export interface OptimizedImage {
  src: string;
  srcSet: string;
  sizes: string;
  alt: string;
  width: number;
  height: number;
  loading: 'lazy' | 'eager';
  decoding: 'async' | 'sync';
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Predefined image configurations for different use cases
 */
export const IMAGE_CONFIGS: Record<string, ResponsiveImageConfig> = {
  // Commandment Illustrations
  commandmentHero: {
    name: 'commandment-hero',
    category: 'commandment',
    baseWidth: 1200,
    baseHeight: 675,
    aspectRatio: '16:9',
    formats: [
      { format: 'avif', quality: 85, compression: 'lossy' },
      { format: 'webp', quality: 85, compression: 'lossy' },
      { format: 'png', quality: 95, compression: 'lossless' }
    ],
    sizes: [
      { width: 400, height: 225, descriptor: '400w', breakpoint: '(max-width: 480px)', usage: 'mobile' },
      { width: 800, height: 450, descriptor: '800w', breakpoint: '(max-width: 768px)', usage: 'tablet' },
      { width: 1200, height: 675, descriptor: '1200w', breakpoint: '(max-width: 1200px)', usage: 'desktop' },
      { width: 1600, height: 900, descriptor: '1600w', breakpoint: '(max-width: 1600px)', usage: 'large-desktop' },
      { width: 2000, height: 1125, descriptor: '2000w', usage: 'high-dpi' }
    ],
    quality: 85,
    loading: 'lazy',
    priority: 'high'
  },

  commandmentCard: {
    name: 'commandment-card',
    category: 'commandment',
    baseWidth: 600,
    baseHeight: 600,
    aspectRatio: '1:1',
    formats: [
      { format: 'avif', quality: 80, compression: 'lossy' },
      { format: 'webp', quality: 80, compression: 'lossy' },
      { format: 'png', quality: 90, compression: 'lossless' }
    ],
    sizes: [
      { width: 200, height: 200, descriptor: '200w', breakpoint: '(max-width: 480px)', usage: 'mobile-card' },
      { width: 400, height: 400, descriptor: '400w', breakpoint: '(max-width: 768px)', usage: 'tablet-card' },
      { width: 600, height: 600, descriptor: '600w', usage: 'desktop-card' }
    ],
    quality: 80,
    loading: 'lazy',
    priority: 'medium'
  },

  // Tool Mascots
  toolMascotLarge: {
    name: 'tool-mascot-large',
    category: 'tool',
    baseWidth: 400,
    baseHeight: 400,
    aspectRatio: '1:1',
    formats: [
      { format: 'avif', quality: 85, compression: 'lossy' },
      { format: 'webp', quality: 85, compression: 'lossy' },
      { format: 'png', quality: 95, compression: 'lossless' }
    ],
    sizes: [
      { width: 120, height: 120, descriptor: '120w', breakpoint: '(max-width: 480px)', usage: 'mobile-mascot' },
      { width: 200, height: 200, descriptor: '200w', breakpoint: '(max-width: 768px)', usage: 'tablet-mascot' },
      { width: 300, height: 300, descriptor: '300w', breakpoint: '(max-width: 1200px)', usage: 'desktop-mascot' },
      { width: 400, height: 400, descriptor: '400w', usage: 'hero-mascot' }
    ],
    quality: 85,
    loading: 'lazy',
    priority: 'medium'
  },

  toolMascotIcon: {
    name: 'tool-mascot-icon',
    category: 'tool',
    baseWidth: 120,
    baseHeight: 120,
    aspectRatio: '1:1',
    formats: [
      { format: 'avif', quality: 90, compression: 'lossy' },
      { format: 'webp', quality: 90, compression: 'lossy' },
      { format: 'png', quality: 100, compression: 'lossless' }
    ],
    sizes: [
      { width: 32, height: 32, descriptor: '32w', usage: 'small-icon' },
      { width: 64, height: 64, descriptor: '64w', usage: 'medium-icon' },
      { width: 120, height: 120, descriptor: '120w', usage: 'large-icon' }
    ],
    quality: 90,
    loading: 'eager',
    priority: 'high'
  },

  // Hero Images
  bookCover: {
    name: 'book-cover',
    category: 'hero',
    baseWidth: 1920,
    baseHeight: 1080,
    aspectRatio: '16:9',
    formats: [
      { format: 'avif', quality: 90, compression: 'lossy' },
      { format: 'webp', quality: 90, compression: 'lossy' },
      { format: 'jpg', quality: 95, compression: 'lossy' }
    ],
    sizes: [
      { width: 800, height: 450, descriptor: '800w', breakpoint: '(max-width: 768px)', usage: 'mobile-hero' },
      { width: 1200, height: 675, descriptor: '1200w', breakpoint: '(max-width: 1200px)', usage: 'tablet-hero' },
      { width: 1600, height: 900, descriptor: '1600w', breakpoint: '(max-width: 1600px)', usage: 'desktop-hero' },
      { width: 1920, height: 1080, descriptor: '1920w', usage: 'full-hd' },
      { width: 2560, height: 1440, descriptor: '2560w', usage: '2k-hero' }
    ],
    quality: 90,
    loading: 'eager',
    priority: 'high'
  },

  // Sacred Geometry
  geometryPattern: {
    name: 'geometry-pattern',
    category: 'geometry',
    baseWidth: 800,
    baseHeight: 800,
    aspectRatio: '1:1',
    formats: [
      { format: 'avif', quality: 85, compression: 'lossy' },
      { format: 'webp', quality: 85, compression: 'lossy' },
      { format: 'png', quality: 95, compression: 'lossless' }
    ],
    sizes: [
      { width: 200, height: 200, descriptor: '200w', usage: 'pattern-small' },
      { width: 400, height: 400, descriptor: '400w', usage: 'pattern-medium' },
      { width: 800, height: 800, descriptor: '800w', usage: 'pattern-large' }
    ],
    quality: 85,
    loading: 'lazy',
    priority: 'low'
  }
};

/**
 * Responsive Image Generator Class
 */
export class ResponsiveImageGenerator {
  
  /**
   * Generate responsive image configuration
   */
  static generateResponsiveConfig(
    imageName: string,
    configType: keyof typeof IMAGE_CONFIGS,
    overrides?: Partial<ResponsiveImageConfig>
  ): OptimizedImage {
    const config = { ...IMAGE_CONFIGS[configType], ...overrides };
    const srcSet = this.generateSrcSet(imageName, config);
    const sizes = this.generateSizes(config);
    
    return {
      src: this.getDefaultSrc(imageName, config),
      srcSet,
      sizes,
      alt: this.generateAltText(imageName, config),
      width: config.baseWidth,
      height: config.baseHeight,
      loading: config.loading,
      decoding: 'async',
      className: `responsive-image ${config.category}`,
      style: {
        aspectRatio: config.aspectRatio,
        objectFit: 'cover',
        objectPosition: 'center'
      }
    };
  }

  /**
   * Generate srcSet string for responsive images
   */
  private static generateSrcSet(imageName: string, config: ResponsiveImageConfig): string {
    const srcSetEntries: string[] = [];
    
    // For each format (modern formats first)
    config.formats.forEach(format => {
      config.sizes.forEach(size => {
        const filename = `${imageName}-${size.width}x${size.height}.${format.format}`;
        srcSetEntries.push(`/assets/illustrations/generated/${filename} ${size.descriptor}`);
      });
    });
    
    return srcSetEntries.join(', ');
  }

  /**
   * Generate sizes string for responsive images
   */
  private static generateSizes(config: ResponsiveImageConfig): string {
    const sizeEntries = config.sizes
      .filter(size => size.breakpoint)
      .map(size => `${size.breakpoint} ${size.width}px`);
    
    // Add default size
    sizeEntries.push(`${config.baseWidth}px`);
    
    return sizeEntries.join(', ');
  }

  /**
   * Get default/fallback src
   */
  private static getDefaultSrc(imageName: string, config: ResponsiveImageConfig): string {
    // Use the most compatible format and medium size
    const mediumSize = config.sizes.find(s => s.usage.includes('desktop')) || config.sizes[0];
    const fallbackFormat = config.formats.find(f => f.format === 'jpg') || 
                          config.formats.find(f => f.format === 'png') || 
                          config.formats[0];
    
    return `/assets/illustrations/generated/${imageName}-${mediumSize.width}x${mediumSize.height}.${fallbackFormat.format}`;
  }

  /**
   * Generate descriptive alt text
   */
  private static generateAltText(imageName: string, config: ResponsiveImageConfig): string {
    const nameWords = imageName.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
    
    const categoryDescriptions = {
      commandment: 'Sacred commandment illustration',
      tool: 'Sacred coding tool mascot',
      hero: 'Epic hero illustration',
      process: 'Process flow diagram',
      geometry: 'Sacred geometry pattern'
    };
    
    return `${categoryDescriptions[config.category]}: ${nameWords}`;
  }
}

/**
 * Image Loading Utilities
 */
export class ImageLoadingUtils {
  
  /**
   * Preload critical images
   */
  static preloadCriticalImages(images: string[]): void {
    images.forEach(src => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = src;
      document.head.appendChild(link);
    });
  }

  /**
   * Create blur placeholder for loading states
   */
  static generateBlurPlaceholder(width: number, height: number, color: string = DesignTokens.colors.primary.deepMidnightBlue): string {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return '';
    
    // Create gradient blur effect
    const gradient = ctx.createRadialGradient(
      width / 2, height / 2, 0,
      width / 2, height / 2, Math.max(width, height) / 2
    );
    gradient.addColorStop(0, color + '80');
    gradient.addColorStop(1, color + '20');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    
    return canvas.toDataURL();
  }

  /**
   * Lazy load images with intersection observer
   */
  static setupLazyLoading(): void {
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            if (img.dataset.src) {
              img.src = img.dataset.src;
              img.classList.remove('lazy');
              observer.unobserve(img);
            }
          }
        });
      }, {
        rootMargin: '50px 0px',
        threshold: 0.01
      });

      document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
      });
    }
  }
}

/**
 * Performance Optimization Utilities
 */
export class ImagePerformanceUtils {
  
  /**
   * Calculate optimal image dimensions based on device
   */
  static getOptimalDimensions(baseWidth: number, baseHeight: number): { width: number; height: number } {
    const devicePixelRatio = window.devicePixelRatio || 1;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    // Calculate optimal size based on viewport and pixel ratio
    const optimalWidth = Math.min(baseWidth, viewportWidth * devicePixelRatio);
    const optimalHeight = Math.min(baseHeight, viewportHeight * devicePixelRatio);
    
    return {
      width: Math.round(optimalWidth),
      height: Math.round(optimalHeight)
    };
  }

  /**
   * Check if WebP is supported
   */
  static supportsWebP(): Promise<boolean> {
    return new Promise(resolve => {
      const webP = new Image();
      webP.onload = webP.onerror = () => {
        resolve(webP.height === 2);
      };
      webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
    });
  }

  /**
   * Check if AVIF is supported
   */
  static supportsAVIF(): Promise<boolean> {
    return new Promise(resolve => {
      const avif = new Image();
      avif.onload = avif.onerror = () => {
        resolve(avif.height === 2);
      };
      avif.src = 'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbWlhZk1BMUIAAADybWV0YQAAAAAAAAAoaGRscgAAAAAAAAAAcGljdAAAAAAAAAAAAAAAAGxpYmF2aWYAAAAADnBpdG0AAAAAAAEAAAAeaWxvYwAAAABEAAABAAEAAAABAAABGgAAAB0AAAAoaWluZgAAAAAAAQAAABppbmZlAgAAAAABAABhdjAxQ29sb3IAAAAAamlwcnAAAABLaXBjbwAAABRpc3BlAAAAAAAAAAIAAAACAAAAEHBpeGkAAAAAAwgICAAAAAxhdjFDgQ0MAAAAABNjb2xybmNseAACAAIAAYAAAAAXaXBtYQAAAAAAAAABAAEEAQKDBAAAACVtZGF0EgAKCBgABogQEAwgMg8f8D///8WfhwB8+ErK42A=';
    });
  }

  /**
   * Get best supported format
   */
  static async getBestFormat(): Promise<'avif' | 'webp' | 'jpg'> {
    if (await this.supportsAVIF()) return 'avif';
    if (await this.supportsWebP()) return 'webp';
    return 'jpg';
  }
}

/**
 * React Hook for Responsive Images
 */
export function useResponsiveImage(
  imageName: string,
  configType: keyof typeof IMAGE_CONFIGS,
  overrides?: Partial<ResponsiveImageConfig>
) {
  const [imageConfig, setImageConfig] = React.useState<OptimizedImage | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    try {
      const config = ResponsiveImageGenerator.generateResponsiveConfig(
        imageName,
        configType,
        overrides
      );
      setImageConfig(config);
      setIsLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate image config');
      setIsLoading(false);
    }
  }, [imageName, configType, overrides]);

  return { imageConfig, isLoading, error };
}

export default ResponsiveImageGenerator;