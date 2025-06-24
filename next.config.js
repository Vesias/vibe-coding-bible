/** @type {import('next').NextConfig} */
const nextConfig = {
  // Production optimizations
  poweredByHeader: false,
  compress: true,
  generateEtags: true,
  
  // Image optimization
  images: {
    formats: ['image/avif', 'image/webp'],
    domains: [
      'localhost',
      'vibecodingbible.agentland.saarland',
      'images.unsplash.com',
      'avatars.githubusercontent.com',
      'lh3.googleusercontent.com',
      'hpguscbanxnzufjduiws.supabase.co',
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // Environment variables with safe defaults
  env: {
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || 'https://vibecodingbible.agentland.saarland',
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder_key',
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_placeholder',
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder',
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET || 'whsec_placeholder',
  },

  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), payment=()',
          },
        ],
      },
    ];
  },

  // Webpack configuration
  webpack: (config, { isServer }) => {
    // Client-side fallbacks for Node.js modules
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        os: false,
        crypto: false,
        stream: false,
        util: false,
        buffer: false,
        process: false,
      };
    }

    return config;
  },

  // Experimental features
  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
  },

  // Output configuration
  output: 'standalone',
  
  // Redirect configuration
  async redirects() {
    return [
      {
        source: '/login',
        destination: '/auth',
        permanent: false,
      },
      {
        source: '/register',
        destination: '/auth',
        permanent: false,
      },
      {
        source: '/admin/:path*',
        destination: '/dashboard/:path*',
        permanent: true,
      },
    ];
  },

  // Rewrite configuration
  async rewrites() {
    return [
      {
        source: '/sitemap.xml',
        destination: '/api/sitemap',
      },
      {
        source: '/robots.txt',
        destination: '/api/robots',
      },
    ];
  },
};

module.exports = nextConfig;