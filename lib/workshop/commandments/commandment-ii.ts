import { WorkshopData } from '../types'

export const commandmentII: WorkshopData = {
  id: 'ii',
  commandmentNumber: 'II',
  title: 'Der Rechte Stack',
  subtitle: 'Sacred Technology Selection',
  sacredSymbol: '⚡',
  description: 'Choose your technology stack wisely through AI-assisted analysis and divine guidance.',
  difficulty: 'Beginner',
  totalXP: 200,
  estimatedTime: 60,
  sacredWisdom: '"Nicht jeder Hammer ist für jeden Nagel bestimmt - wähle weise deine Werkzeuge..."',
  prerequisites: ['i'],
  learningObjectives: [
    'Verstehe die Prinzipien der Stack-Selection',
    'Lerne AI-gestützte Technologie-Evaluierung',
    'Meistere moderne Development-Setups',
    'Entwickle Entscheidungsframeworks für Tech-Choices',
    'Baue zukunftssichere Architekturen'
  ],
  lessons: [
    {
      id: 'stack-philosophy',
      title: 'Die Philosophie des Rechten Stacks',
      content: `## Die Heilige Wahrheit der Technologie-Wahl

Der "rechte Stack" ist nicht der neueste oder coolste - es ist der **richtige für dein Problem**. In der Ära der AI-unterstützten Entwicklung ändern sich die Regeln fundamental.

### Die 3 Ebenen des Rechten Stacks

#### 1. **Foundation Layer** - Das Fundament
- **Sprache**: JavaScript/TypeScript, Python, oder was deine AI am besten kennt
- **Runtime**: Node.js, Python, Deno - stabil und AI-kompatibel
- **Datenbank**: PostgreSQL, MongoDB - was deine Daten am besten abbildet

#### 2. **Framework Layer** - Die Struktur  
- **Frontend**: Next.js, Svelte, Vue - was rapid prototyping ermöglicht
- **Backend**: FastAPI, Express, tRPC - was schnelle Iteration erlaubt
- **Fullstack**: Vercel, Supabase, Firebase - was deployment vereinfacht

#### 3. **AI Layer** - Die Intelligenz
- **AI Providers**: OpenAI, Anthropic, Gemini - was deine Use Cases abdeckt
- **AI Tools**: Cursor, GitHub Copilot, Codeium - was deinen Workflow beschleunigt
- **AI Frameworks**: LangChain, Vercel AI SDK - was Integration vereinfacht

## Das Gesetz der Minimalen Komplexität

**Wähle immer den einfachsten Stack, der dein Problem löst.**

Nicht: "Was ist das Beste?"
Sondern: "Was ist das Einfachste für mein Problem?"`,
      type: 'theory',
      estimatedTime: 20,
      xp: 30
    },
    {
      id: 'stack-evaluation',
      title: 'AI-gestützte Stack-Evaluierung',
      content: `## Das Sankt Claude Stack-Evaluierungs-Ritual

### Template für Stack-Entscheidungen

\`\`\`markdown
Mein Projekt: [PROJEKTBESCHREIBUNG]

Ich muss zwischen folgenden Optionen wählen:
- Option A: [STACK_A]
- Option B: [STACK_B]  
- Option C: [STACK_C]

Meine Constraints:
- Timeline: [ZEITRAHMEN]
- Team: [TEAM_GRÖSSE_UND_SKILLS]
- Budget: [BUDGET_CONSTRAINTS]
- Scale: [ERWARTETE_NUTZERZAHL]

Bewerte diese Optionen nach:
1. Learning Curve (wie schnell kann ich/wir produktiv werden?)
2. AI Support (wie gut kann AI mich dabei unterstützen?)
3. Community & Resources (wie gut ist die Dokumentation/Community?)
4. Scalability (kann es mit meinem Projekt wachsen?)
5. Deployment (wie einfach ist es zu deployen?)
\`\`\`

### Die Heiligen Fragen der Stack-Wahl

1. **"Kann ich das in einer Woche lernen?"**
   - Wenn nein: Zu komplex für den Start

2. **"Kann AI mir dabei helfen?"**
   - Wenn nein: Risiko für Stuck-Situationen

3. **"Gibt es gute Tutorials und Docs?"**
   - Wenn nein: Learning wird zum Kampf

4. **"Nutzen andere erfolgreiche Projekte das?"**
   - Wenn nein: Vielleicht zu experimentell

5. **"Kann ich das einfach deployen?"**
   - Wenn nein: Deployment wird zum Albtraum

## Stack-Archetypen für verschiedene Projekte

### The Rapid Prototype Stack
- **Frontend**: Next.js + Tailwind
- **Backend**: Vercel Functions
- **Database**: Supabase
- **AI**: Vercel AI SDK
- **Deploy**: Vercel

### The Content-Heavy Stack  
- **Frontend**: Astro + React
- **CMS**: Sanity / Contentful
- **Database**: PostgreSQL
- **Deploy**: Netlify

### The AI-First Stack
- **Frontend**: Streamlit / Gradio
- **Backend**: FastAPI
- **AI**: OpenAI + LangChain
- **Database**: Vector DB (Pinecone)
- **Deploy**: Railway / Fly.io`,
      type: 'theory',
      estimatedTime: 25,
      xp: 35
    }
  ],
  exercises: [
    {
      id: 'stack-analysis',
      title: 'Analysiere deinen idealen Stack',
      description: 'Nutze AI-gestützte Analyse um den perfekten Stack für dein Projekt zu finden.',
      instructions: [
        'Nimm deine Vision aus Commandment I',
        'Verwende das Stack-Evaluierungs-Template',
        'Führe eine ausführliche Analyse mit Claude durch',
        'Bewerte mindestens 3 verschiedene Stack-Optionen',
        'Dokumentiere deine finale Entscheidung mit Begründung'
      ],
      expectedOutput: 'Vollständige Stack-Analyse mit begründeter Technologie-Auswahl',
      hints: [
        'Sei ehrlich über deine aktuellen Skills',
        'Berücksichtige die Lernkurve für neue Technologien',
        'Frage Claude nach konkreten Vor- und Nachteilen'
      ],
      difficulty: 'easy',
      xp: 60,
      aiAssistance: true
    },
    {
      id: 'stack-setup',
      title: 'Setup deines Development-Environments',
      description: 'Baue ein vollständiges Development-Setup mit deinem gewählten Stack.',
      instructions: [
        'Installiere und konfiguriere alle Tools deines Stacks',
        'Erstelle ein "Hello World" mit allen Komponenten',
        'Setup CI/CD Pipeline für automated deployment',
        'Dokumentiere dein Setup für andere Entwickler',
        'Teste den kompletten Development-to-Production Flow'
      ],
      expectedOutput: 'Funktionierendes Development-Environment mit Deployment-Pipeline',
      hints: [
        'Nutze Docker für konsistente Environments',
        'Automatisiere wiederkehrende Tasks',
        'Verwende Environment-Variables für Configuration'
      ],
      difficulty: 'medium',
      xp: 90,
      aiAssistance: true
    }
  ],
  completionCriteria: [
    'Stack-Evaluierung mit AI durchgeführt',
    'Technologie-Entscheidung dokumentiert und begründet',
    'Development-Environment vollständig eingerichtet',
    'Hello World deployed und erreichbar',
    'Setup-Dokumentation für Team/Wiederverwendung erstellt'
  ],
  nextCommandment: 'iii'
}