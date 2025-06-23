/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
  	container: {
  		center: true,
  		padding: '2rem',
  		screens: {
  			'2xl': '1400px'
  		}
  	},
  	extend: {
  		colors: {
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			// Sacred Color Palette
  			'sacred-midnight-blue': 'hsl(var(--sacred-midnight-blue))',
  			'sacred-electric-indigo': 'hsl(var(--sacred-electric-indigo))',
  			'sacred-tech-gold': 'hsl(var(--sacred-tech-gold))',
  			'sacred-cosmic-black': 'hsl(var(--sacred-cosmic-black))',
  			'sacred-digital-white': 'hsl(var(--sacred-digital-white))',
  			'sacred-matrix-green': 'hsl(var(--sacred-matrix-green))',
  			'sacred-mystic-purple': 'hsl(var(--sacred-mystic-purple))',
  			'sacred-divine-cyan': 'hsl(var(--sacred-divine-cyan))',
  			'sacred-rose': 'hsl(var(--sacred-rose))',
  			'sacred-ethereal-mint': 'hsl(var(--sacred-ethereal-mint))',
  			'sacred-celestial-yellow': 'hsl(var(--sacred-celestial-yellow))',
  			'sacred-void-black': 'hsl(var(--sacred-void-black))',
  			'sacred-light-divine': 'hsl(var(--sacred-light-divine))',
  			// Legacy Sacred Colors for backward compatibility
  			sacred: {
  				gold: '#D4AF37',
  				blue: '#1E40AF',
  				purple: '#7C3AED',
  				silver: '#C0C0C0',
  				bronze: '#CD7F32'
  			},
  			divine: {
  				light: '#F8FAFC',
  				dark: '#0F172A'
  			},
  			vibe: {
  				primary: '#6366F1',
  				secondary: '#EC4899',
  				accent: '#10B981'
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)',
  			// Sacred golden ratio borders
  			'sacred': '0.618rem',  // Golden ratio
  			'sacred-sm': '0.382rem',
  			'sacred-lg': '1rem'
  		},
  		keyframes: {
  			// Sacred Animation Keyframes
  			'sacred-float': {
  				'0%, 100%': {
  					transform: 'translateY(0px) rotate(0deg)',
  					filter: 'brightness(1)'
  				},
  				'50%': {
  					transform: 'translateY(-8px) rotate(1deg)',
  					filter: 'brightness(1.1)'
  				}
  			},
  			'sacred-pulse': {
  				'0%, 100%': {
  					boxShadow: '0 0 10px hsla(var(--sacred-tech-gold), 0.3), 0 0 20px hsla(var(--sacred-electric-indigo), 0.2)',
  					transform: 'scale(1)'
  				},
  				'50%': {
  					boxShadow: '0 0 30px hsla(var(--sacred-tech-gold), 0.6), 0 0 60px hsla(var(--sacred-electric-indigo), 0.4)',
  					transform: 'scale(1.05)'
  				}
  			},
  			'mystical-glow': {
  				'0%, 100%': {
  					textShadow: '0 0 5px hsla(var(--sacred-electric-indigo), 0.5)'
  				},
  				'50%': {
  					textShadow: '0 0 20px hsla(var(--sacred-electric-indigo), 0.8), 0 0 30px hsla(var(--sacred-tech-gold), 0.5)'
  				}
  			},
  			'sacred-rotation': {
  				from: { transform: 'rotate(0deg)' },
  				to: { transform: 'rotate(360deg)' }
  			},
  			'divine-shimmer': {
  				'0%': { backgroundPosition: '-200% 0' },
  				'100%': { backgroundPosition: '200% 0' }
  			},
  			'sacred-breathe': {
  				'0%, 100%': {
  					transform: 'scale(1)',
  					opacity: '0.8'
  				},
  				'50%': {
  					transform: 'scale(1.05)',
  					opacity: '1'
  				}
  			},
  			'matrix-rain': {
  				'0%': { transform: 'translateY(-100%)', opacity: '0' },
  				'10%': { opacity: '1' },
  				'90%': { opacity: '1' },
  				'100%': { transform: 'translateY(100vh)', opacity: '0' }
  			},
  			// Standard UI animations
  			'accordion-down': {
  				from: {
  					height: 0
  				},
  				to: {
  					height: 'var(--radix-accordion-content-height)'
  				}
  			},
  			'accordion-up': {
  				from: {
  					height: 'var(--radix-accordion-content-height)'
  				},
  				to: {
  					height: 0
  				}
  			},
  			'fade-in': {
  				'0%': {
  					opacity: 0,
  					transform: 'translateY(10px)'
  				},
  				'100%': {
  					opacity: 1,
  					transform: 'translateY(0)'
  				}
  			},
  			'scale-in': {
  				'0%': {
  					opacity: 0,
  					transform: 'scale(0.9)'
  				},
  				'100%': {
  					opacity: 1,
  					transform: 'scale(1)'
  				}
  			},
  			'slide-in': {
  				'0%': {
  					opacity: 0,
  					transform: 'translateX(-100%)'
  				},
  				'100%': {
  					opacity: 1,
  					transform: 'translateX(0)'
  				}
  			},
  			'slide-in-right': {
  				'0%': {
  					opacity: 0,
  					transform: 'translateX(50px)'
  				},
  				'100%': {
  					opacity: 1,
  					transform: 'translateX(0)'
  				}
  			},
  			'fade-in-scale': {
  				'0%': {
  					opacity: 0,
  					transform: 'scale(0.9)'
  				},
  				'100%': {
  					opacity: 1,
  					transform: 'scale(1)'
  				}
  			},
  			'glow': {
  				'0%, 100%': {
  					boxShadow: '0 0 5px rgba(99, 102, 241, 0.5)'
  				},
  				'50%': {
  					boxShadow: '0 0 20px rgba(99, 102, 241, 0.8)'
  				}
  			}
  		},
  		animation: {
  			// Sacred Animations
  			'sacred-float': 'sacred-float 4s ease-in-out infinite',
  			'sacred-pulse': 'sacred-pulse 3s ease-in-out infinite',
  			'mystical-glow': 'mystical-glow 2s ease-in-out infinite',
  			'sacred-rotation': 'sacred-rotation 20s linear infinite',
  			'divine-shimmer': 'divine-shimmer 2s ease-in-out infinite',
  			'sacred-breathe': 'sacred-breathe 4s ease-in-out infinite',
  			'matrix-rain': 'matrix-rain 3s linear infinite',
  			// Standard UI animations
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out',
  			'fade-in': 'fade-in 0.5s ease-out',
  			'scale-in': 'scale-in 0.3s ease-out',
  			'slide-in': 'slide-in 0.4s ease-out',
  			'slide-in-right': 'slide-in-right 0.8s ease-out',
  			'fade-in-scale': 'fade-in-scale 0.5s ease-out',
  			'glow': 'glow 2s ease-in-out infinite'
  		},
  		fontFamily: {
  			sans: [
  				'Inter',
  				'system-ui',
  				'sans-serif'
  			],
  			mono: [
  				'Fira Code',
  				'JetBrains Mono',
  				'monospace'
  			],
  			sacred: [
  				'Cinzel',
  				'serif'
  			],
  			heading: [
  				'Montserrat',
  				'sans-serif'
  			]
  		},
  		typography: {
  			DEFAULT: {
  				css: {
  					maxWidth: 'none',
  					color: 'hsl(var(--foreground))',
  					h1: {
  						color: 'hsl(var(--foreground))',
  						fontFamily: 'Cinzel, serif',
  						fontWeight: '700'
  					},
  					h2: {
  						color: 'hsl(var(--foreground))',
  						fontFamily: 'Montserrat, sans-serif',
  						fontWeight: '600'
  					},
  					h3: {
  						color: 'hsl(var(--foreground))',
  						fontFamily: 'Montserrat, sans-serif',
  						fontWeight: '600'
  					},
  					h4: {
  						color: 'hsl(var(--foreground))',
  						fontFamily: 'Inter, sans-serif',
  						fontWeight: '500'
  					},
  					code: {
  						color: 'hsl(var(--sacred-matrix-green))',
  						fontFamily: 'JetBrains Mono, monospace',
  						backgroundColor: 'hsla(var(--sacred-midnight-blue), 0.1)',
  						padding: '0.125rem 0.25rem',
  						borderRadius: '0.25rem'
  					},
  					'code::before': {
  						content: '""'
  					},
  					'code::after': {
  						content: '""'
  					},
  					pre: {
  						backgroundColor: 'hsla(var(--sacred-midnight-blue), 0.9)',
  						border: '1px solid hsla(var(--sacred-matrix-green), 0.3)',
  						borderRadius: '0.5rem',
  						boxShadow: 'inset 0 2px 4px hsla(var(--sacred-midnight-blue), 0.3), 0 0 20px hsla(var(--sacred-matrix-green), 0.1)'
  					},
  					blockquote: {
  						borderLeft: '4px solid hsl(var(--sacred-tech-gold))',
  						backgroundColor: 'hsla(var(--sacred-tech-gold), 0.05)',
  						padding: '1rem',
  						borderRadius: '0.5rem',
  						fontStyle: 'italic'
  					}
  				}
  			}
  		},
  		// Sacred Design System Extensions
  		spacing: {
  			// Standard spacing scale
  			'0': '0px',
  			'px': '1px',
  			'0.5': '0.125rem', // 2px
  			'1': '0.25rem',    // 4px
  			'1.5': '0.375rem', // 6px
  			'2': '0.5rem',     // 8px
  			'2.5': '0.625rem', // 10px
  			'3': '0.75rem',    // 12px
  			'3.5': '0.875rem', // 14px
  			'4': '1rem',       // 16px
  			'5': '1.25rem',    // 20px
  			'6': '1.5rem',     // 24px
  			'7': '1.75rem',    // 28px
  			'8': '2rem',       // 32px
  			'9': '2.25rem',    // 36px
  			'10': '2.5rem',    // 40px
  			'11': '2.75rem',   // 44px
  			'12': '3rem',      // 48px
  			'14': '3.5rem',    // 56px
  			'16': '4rem',      // 64px
  			'20': '5rem',      // 80px
  			'24': '6rem',      // 96px
  			'28': '7rem',      // 112px
  			'32': '8rem',      // 128px
  			'36': '9rem',      // 144px
  			'40': '10rem',     // 160px
  			'44': '11rem',     // 176px
  			'48': '12rem',     // 192px
  			'52': '13rem',     // 208px
  			'56': '14rem',     // 224px
  			'60': '15rem',     // 240px
  			'64': '16rem',     // 256px
  			'72': '18rem',     // 288px
  			'80': '20rem',     // 320px
  			'96': '24rem',     // 384px
  			// Sacred golden ratio spacing
  			'sacred-xs': '0.25rem',   // 4px
  			'sacred-sm': '0.5rem',    // 8px
  			'sacred-md': '1rem',      // 16px
  			'sacred-lg': '1.618rem',  // ~26px (golden ratio)
  			'sacred-xl': '2.618rem',  // ~42px (golden ratio squared)
  			'sacred-2xl': '4.236rem', // ~68px
  			'sacred-3xl': '6.854rem', // ~110px
  			'sacred-4xl': '11.09rem', // ~178px
  			'sacred-5xl': '17.944rem' // ~287px
  		},
  		boxShadow: {
  			sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  			DEFAULT: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  			md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  			lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  			xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  			'2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  			inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
  			none: 'none',
  			// Sacred shadow effects
  			'sacred-glow': '0 0 20px hsla(var(--sacred-tech-gold), 0.3), 0 0 40px hsla(var(--sacred-electric-indigo), 0.2)',
  			'mystical-glow': '0 0 15px hsla(var(--sacred-electric-indigo), 0.4), 0 0 30px hsla(var(--sacred-mystic-purple), 0.3)',
  			'matrix-glow': '0 0 10px hsla(var(--sacred-matrix-green), 0.5), 0 0 20px hsla(var(--sacred-matrix-green), 0.3)',
  			'divine-soft': '0 8px 32px hsla(var(--sacred-midnight-blue), 0.3), inset 0 1px 0 hsla(var(--sacred-digital-white), 0.1)',
  			'sacred-depth': '0 20px 40px hsla(var(--sacred-midnight-blue), 0.4), 0 0 0 1px hsla(var(--sacred-tech-gold), 0.2)'
  		},
  		transitionTimingFunction: {
  			'sacred': 'cubic-bezier(0.4, 0, 0.2, 1)',
  			'divine': 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  			'mystical': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
  		},
  		transitionDuration: {
  			'75': '75ms',
  			'100': '100ms',
  			'150': '150ms',
  			'200': '200ms',
  			'300': '300ms',
  			'500': '500ms',
  			'700': '700ms',
  			'1000': '1000ms',
  			'sacred': '618ms',  // Golden ratio milliseconds
  			'divine': '1618ms' // Golden ratio * 1000
  		}
  	}
  },
  plugins: [
    require("tailwindcss-animate"),
    require("@tailwindcss/typography"),
    require("@tailwindcss/forms"),
  ],
}