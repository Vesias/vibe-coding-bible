# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

The Vibe Coding Bible is a German-language educational platform teaching AI-assisted development through "10 Sacred Commandments". It's built as an interactive workshop experience with a sacred/divine theme, targeting developers who want to master AI tools like Claude Code, Cursor, and GitHub Copilot.

**Live URL**: https://vibecodingbible.agentland.saarland
**Language**: German (de_DE)
**Theme**: Sacred/Divine coding methodology

## Development Commands

### Core Development
```bash
pnpm dev              # Start development server on port 3000
pnpm build            # Build for production
pnpm start            # Start production server
pnpm lint             # Run ESLint
pnpm type-check       # Run TypeScript compiler check
```

### Testing
```bash
pnpm test             # Run Jest tests
pnpm test:watch       # Run tests in watch mode
```

### Database (Supabase)
```bash
pnpm db:generate      # Generate TypeScript types from Supabase
pnpm db:push          # Push database schema changes
```

### Stripe Integration
```bash
pnpm stripe:listen    # Listen for Stripe webhooks in development
```

## Architecture Overview

### Tech Stack
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v3.4 with custom sacred design system
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth
- **Payments**: Stripe
- **Deployment**: Vercel
- **State Management**: Zustand
- **UI Components**: Radix UI + Custom Sacred Components

### Key Directories

```
app/                    # Next.js App Router pages
├── workshops/          # Dynamic workshop pages
├── auth/              # Authentication pages
├── dashboard/         # User dashboard
└── api/               # API routes

components/            # Reusable React components
├── ui/                # Base UI components (buttons, cards, etc.)
├── sacred/            # Sacred-themed components
├── workshop/          # Workshop-specific components
├── auth/              # Authentication components
└── effects/           # Visual effects and animations

lib/                   # Utility libraries
├── supabase/          # Supabase client configuration
├── workshop/          # Workshop engine and sandbox
├── auth/              # Authentication utilities
└── sacred-design/     # Sacred design system

content/               # Markdown content for workshops
supabase/             # Database migrations and setup
```

## Sacred Design System

### Color Palette
The project uses a custom "sacred" color palette defined in CSS variables:
- `--sacred-midnight-blue`: Deep blue backgrounds
- `--sacred-electric-indigo`: Accent colors
- `--sacred-tech-gold`: Primary highlights
- `--sacred-cosmic-black`: Dark elements
- `--sacred-digital-white`: Light text
- `--sacred-matrix-green`: Code/terminal elements

### Sacred Animations
Custom Tailwind animations for the sacred theme:
- `animate-sacred-float`: Floating elements
- `animate-sacred-pulse`: Pulsing glow effects
- `animate-mystical-glow`: Text glow effects
- `animate-sacred-breathe`: Gentle scaling animation

### Typography
- **Sacred headings**: Cinzel serif font (`font-sacred`)
- **Body text**: Inter sans-serif (`font-sans`)
- **Code**: JetBrains Mono (`font-mono`)

## Workshop Engine Architecture

### Core Components
- **WorkshopEngine** (`lib/workshop/engine.ts`): Manages workshop progression, code execution, and scoring
- **Sandbox** (`lib/workshop/sandbox.ts`): Secure code execution environment
- **Interactive Components**: Monaco Editor integration for code challenges

### Workshop Content Structure
```typescript
interface WorkshopContent {
  id: string
  title: string
  commandmentNumber: number // 1-10 for the sacred commandments
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  steps: WorkshopStep[]
  language: string // Default: 'javascript'
}

interface WorkshopStep {
  type: 'lesson' | 'challenge' | 'quiz' | 'project'
  content: string
  biblicalNarrative?: string // Sacred theme content
  hints: string[]
  solution?: string
  tests?: TestCase[]
  xpReward: number
}
```

## Supabase Integration

### Database Schema
Key tables:
- `workshops`: Workshop metadata
- `challenges`: Individual workshop steps
- `user_progress`: User progression tracking
- `challenge_submissions`: Code submissions and scores

### Client Configuration
- **Browser**: `lib/supabase/client.ts` - Client-side operations
- **Server**: `lib/supabase/server.ts` - Server-side operations
- **Types**: Auto-generated in `lib/database.types.ts`

### Authentication Flow
- Supabase Auth with email/password
- Shared user system with main Agentland platform
- Auth guards in `lib/auth/guards.tsx`

## Content Management

### Workshop Content
Workshop content is stored in:
- **Database**: Dynamic content (challenges, progress)
- **Markdown**: Static content in `content/` directory
- **Naming**: German titles with sacred theme (e.g., "Die Heilige Vision", "Der Rechte Stack")

### The 10 Sacred Commandments
1. **Die Heilige Vision** - Product conceptualization
2. **Der Rechte Stack** - Technology selection
3. **Die Prompt-Kunst** - AI communication mastery
4. **Multi-Context Programming** - Advanced AI workflows
5. **Die Heilige Iteration** - Continuous improvement
6. **Göttliches Debugging** - Sacred problem solving
7. **Kunst des Vertrauens** - AI-human collaboration
8. **Skalierungsstufen** - Scaling applications
9. **Zusammenarbeit Propheten** - Team collaboration
10. **Monetarisierung** - Business model implementation

## Development Patterns

### Component Conventions
- Use TypeScript interfaces for all props
- Sacred-themed components follow naming pattern: `Sacred*`, `Divine*`, `Mystical*`
- Tailwind classes with sacred color variables
- Responsive design with mobile-first approach

### Code Style
- ESLint + Prettier configuration
- TypeScript strict mode enabled
- Tailwind CSS with custom sacred design tokens
- German language for UI text and content

### Sacred UI Components
Key components in `components/ui/`:
- `sacred-card.tsx`: Sacred-themed card layouts
- `divine-loading.tsx`: Sacred loading animations
- `prophet-badge.tsx`: User achievement badges
- `sacred-progress.tsx`: Progress indicators with sacred styling

## Environment Configuration

### Required Environment Variables
```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

# Site
NEXT_PUBLIC_SITE_URL=https://vibecodingbible.agentland.saarland
```

### Vercel Configuration
- Custom domain: `vibecodingbible.agentland.saarland`
- Build command: `pnpm build`
- Output directory: `.next`
- Node.js version: 18.x

## Development Workflow

### Sacred Theme Implementation
When adding new components or pages:
1. Follow the sacred naming conventions
2. Use sacred color palette from CSS variables
3. Include appropriate sacred animations
4. Maintain German language consistency
5. Test responsive behavior across devices

### Workshop Development
When creating new workshop content:
1. Define workshop metadata in database
2. Create challenges with proper XP rewards
3. Include biblical narrative elements
4. Provide multiple hints for learners
5. Test code execution in sandbox environment

### Database Changes
1. Create migration files in `supabase/migrations/`
2. Test locally with Supabase CLI
3. Generate new TypeScript types with `pnpm db:generate`
4. Update affected components and queries

## Common Issues & Solutions

### Sacred Styling Not Applied
- Ensure CSS variables are defined in `globals.css`
- Check Tailwind config includes sacred color extensions
- Verify font loading for Cinzel and other sacred fonts

### Workshop Engine Problems
- Check Supabase connection and environment variables
- Verify user authentication state
- Ensure sandbox security configuration is correct

### German Language Support
- All user-facing text should be in German
- Use proper German typography conventions
- Test with German special characters (ä, ö, ü, ß)

## Integration Notes

### Monaco Editor
- Configured for JavaScript/TypeScript code challenges
- Integrated with workshop sandbox for code execution
- Custom theme matching sacred design system

### Stripe Integration
- Configured for German market (EUR currency)
- Webhook handling for subscription management
- Test mode configuration for development

### SEO & Meta
- German language meta tags (`lang="de"`)
- OpenGraph configuration for social sharing
- Structured data for educational content