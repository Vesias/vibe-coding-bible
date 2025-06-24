import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./styles/**/*.css",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        // ===== AGENTLAND-ALIGNED COLOR SYSTEM =====
        agentland: {
          // Primary blue palette
          'blue-50': '#eff6ff',
          'blue-600': '#2563eb',
          // Secondary indigo palette
          'indigo-100': '#e0e7ff',
          'indigo-600': '#4f46e5',
          // Neutral grays
          'gray-600': '#4b5563',
          'gray-800': '#1f2937',
          'white': '#ffffff'
        },
        
        // ===== UPDATED BRAND COLOR SYSTEM =====
        brand: {
          // Primary: AgentLand Blue
          50: '#eff6ff',   // Ultra light background
          600: '#2563eb',  // Primary interactive
          // Secondary: AgentLand Indigo
          'indigo-100': '#e0e7ff', // Secondary background
          'indigo-600': '#4f46e5', // Secondary interactive
          // Text colors
          'text-primary': '#1f2937',  // Gray-800 for headings
          'text-secondary': '#4b5563', // Gray-600 for body
        },
        
        // ===== SEMANTIC COLORS (Updated) =====
        accent: {
          red: '#DD0000',     // Error states (keep existing)
          green: '#22c55e',   // Success states
          blue: '#2563eb',    // Primary CTA
          indigo: '#4f46e5',  // Secondary CTA
        },
        
        // ===== SEMANTIC COLORS (AgentLand-aligned) =====
        semantic: {
          success: '#22c55e',    // Green for success
          warning: '#F59E0B',    // Keep existing warning
          error: '#DD0000',      // Keep existing error
          info: '#2563eb',       // Blue-600 for info
          
          // Light variants
          successLight: '#dcfce7', // Green-100
          warningLight: '#fef3c7', // Yellow-100
          errorLight: '#fee2e2',   // Red-100
          infoLight: '#eff6ff',    // Blue-50
          
          // Dark variants
          successDark: '#166534',  // Green-800
          warningDark: '#92400e',  // Yellow-800
          errorDark: '#991b1b',    // Red-800
          infoDark: '#1e40af'      // Blue-800
        },
        
        // Standard Tailwind colors (kept for compatibility)
        slate: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617'
        },
        // Standard Tailwind colors updated for AgentLand alignment
        blue: {
          50: '#eff6ff',   // AgentLand primary background
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb', // AgentLand primary
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#172554'
        },
        indigo: {
          50: '#eef2ff',
          100: '#e0e7ff', // AgentLand secondary background
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5', // AgentLand secondary
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
          950: '#1e1b4b'
        },
        gray: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563', // AgentLand body text
          700: '#374151',
          800: '#1f2937', // AgentLand headings
          900: '#111827',
          950: '#030712'
        },
        orange: {
          50: '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
          950: '#431407'
        },
        green: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          950: '#052e16'
        },
        yellow: {
          50: '#fefce8',
          100: '#fef9c3',
          200: '#fef08a',
          300: '#fde047',
          400: '#facc15',
          500: '#eab308',
          600: '#ca8a04',
          700: '#a16207',
          800: '#854d0e',
          900: '#713f12',
          950: '#422006'
        },
        red: {
          50: '#fef2f2',
          100: '#fee2e2',
          200: '#fecaca',
          300: '#fca5a5',
          400: '#f87171',
          500: '#ef4444',
          600: '#dc2626',
          700: '#b91c1c',
          800: '#991b1b',
          900: '#7f1d1d',
          950: '#450a0a'
        },
        black: '#000000',
        white: '#ffffff',
        // shadcn/ui colors
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accentShadcn: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      
      // ===== DESIGN SYSTEM EXTENSIONS =====
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Cinzel', 'Georgia', 'serif'],
        mono: ['Fira Code', 'ui-monospace', 'monospace'],
        display: ['Montserrat', 'system-ui', 'sans-serif']
      },
      
      fontSize: {
        'xs': '0.75rem',      // 12px
        'sm': '0.875rem',     // 14px
        'base': '1rem',       // 16px
        'lg': '1.125rem',     // 18px
        'xl': '1.25rem',      // 20px
        '2xl': '1.5rem',      // 24px
        '3xl': '1.875rem',    // 30px
        '4xl': '2.25rem',     // 36px
        '5xl': '3rem',        // 48px
        '6xl': '3.75rem',     // 60px
        '7xl': '4.5rem',      // 72px
        '8xl': '6rem',        // 96px
        '9xl': '8rem'         // 128px
      },
      
      spacing: {
        '0.5': '0.125rem',
        '1.5': '0.375rem',
        '2.5': '0.625rem',
        '3.5': '0.875rem',
        '18': '4.5rem',
        '88': '22rem',
        '100': '25rem',
        '104': '26rem',
        '108': '27rem',
        '112': '28rem',
        '116': '29rem',
        '120': '30rem'
      },
      
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        
        // Design system additions
        none: '0rem',
        xs: '0.125rem',      // 2px
        base: '0.25rem',     // 4px
        '3xl': '1.5rem',     // 24px
      },
      
      boxShadow: {
        'sacred-sm': '0 2px 4px 0 hsl(214, 100%, 12% / 0.2)',
        'sacred-md': '0 4px 12px 0 hsl(214, 100%, 12% / 0.25), 0 0 0 1px #FFCE00 / 0.2',
        'sacred-lg': '0 8px 25px 0 hsl(214, 100%, 12% / 0.3), 0 0 0 1px #FFCE00 / 0.3',
        'sacred-glow': '0 0 20px #FFCE00 / 0.4, 0 0 40px hsl(200, 100%, 44%) / 0.2',
        'sacred-divine': '0 0 30px #FFCE00 / 0.5, 0 0 60px hsl(205, 70%, 65%) / 0.3'
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        
        // ===== DESIGN SYSTEM ANIMATIONS =====
        "sacred-pulse": {
          "0%, 100%": { 
            transform: "scale(1)",
            opacity: "0.8",
            boxShadow: "0 0 10px #FFCE00 / 0.3"
          },
          "50%": { 
            transform: "scale(1.05)",
            opacity: "1",
            boxShadow: "0 0 30px #FFCE00 / 0.6, 0 0 60px hsl(200, 100%, 44%) / 0.4"
          }
        },
        
        "divine-float": {
          "0%, 100%": { 
            transform: "translateY(0px) rotate(0deg)",
            filter: "brightness(1)"
          },
          "50%": { 
            transform: "translateY(-8px) rotate(1deg)",
            filter: "brightness(1.1)"
          }
        },
        
        "mystical-glow": {
          "0%, 100%": {
            textShadow: "0 0 5px hsl(200, 100%, 44%) / 0.5"
          },
          "50%": {
            textShadow: "0 0 20px hsl(200, 100%, 44%) / 0.8, 0 0 30px #FFCE00 / 0.5"
          }
        },
        
        "sacred-breathe": {
          "0%, 100%": { 
            transform: "scale(1)",
            opacity: "0.8"
          },
          "50%": { 
            transform: "scale(1.05)",
            opacity: "1"
          }
        },
        
        "divine-shimmer": {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" }
        }
      },
      
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        
        // ===== DESIGN SYSTEM ANIMATIONS =====
        "sacred-pulse": "sacred-pulse 3s ease-in-out infinite",
        "divine-float": "divine-float 4s ease-in-out infinite", 
        "mystical-glow": "mystical-glow 2s ease-in-out infinite",
        "sacred-breathe": "sacred-breathe 4s ease-in-out infinite",
        "divine-shimmer": "divine-shimmer 2s ease-in-out infinite",
        "spin-slow": "spin 3s linear infinite"
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    require("@tailwindcss/typography"),
    require("@tailwindcss/forms"),
  ],
};

export default config;