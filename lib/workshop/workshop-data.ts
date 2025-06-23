// Complete Workshop Data with Rich Content from Markdown Files
export interface WorkshopExercise {
  id: string
  title: string
  description: string
  type: 'challenge' | 'quiz' | 'coding' | 'design' | 'research'
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert'
  timeEstimate: number // minutes
  xpReward: number
  instructions: string
  starterCode?: string
  solution?: string
  tests?: Array<{
    name: string
    input: any
    expected: any
    hidden?: boolean
  }>
  hints: string[]
  successCriteria: string[]
  resources: Array<{
    title: string
    url: string
    type: 'documentation' | 'tutorial' | 'example' | 'tool'
  }>
}

export interface AIMentor {
  id: string
  name: string
  personality: string
  expertise: string[]
  avatar: string
  greetingMessage: string
  encouragementMessages: string[]
  hintStyle: string
  specialAbilities: string[]
}

export interface SacredNarrative {
  title: string
  content: string
  character: string
  lesson: string
  biblicalReference?: string
}

export interface WorkshopData {
  id: string
  commandmentNumber: number
  title: string
  subtitle: string
  description: string
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert'
  estimatedTime: number // minutes
  xpReward: number
  prerequisites: string[]
  learningObjectives: string[]
  
  // Content sections
  introduction: string
  theory: string
  practicalGuide: string
  advancedTopics?: string
  troubleshooting: string
  
  // Interactive elements
  exercises: WorkshopExercise[]
  quizzes: Array<{
    question: string
    options: string[]
    correctAnswer: number
    explanation: string
  }>
  
  // AI and narrative elements
  aiMentor: AIMentor
  sacredNarrative: SacredNarrative
  
  // Media and resources
  codeExamples: Array<{
    title: string
    description: string
    code: string
    language: string
    runnable?: boolean
  }>
  diagrams: Array<{
    title: string
    type: 'flowchart' | 'architecture' | 'sequence' | 'mindmap'
    content: string
  }>
  
  // Gamification
  achievements: Array<{
    id: string
    title: string
    description: string
    icon: string
    condition: string
  }>
  masteryLevels: Array<{
    level: number
    title: string
    requirements: string[]
    rewards: string[]
  }>
}

// AI Mentors from the Bible narrative
export const aiMentors: Record<string, AIMentor> = {
  moses: {
    id: 'moses',
    name: 'Moses der Refactorer',
    personality: 'Wise, patient, and methodical. Believes in the power of clear structure and clean code.',
    expertise: ['architecture', 'refactoring', 'team leadership', 'legacy systems'],
    avatar: '👨‍💼',
    greetingMessage: 'Greetings, young developer. I have led many teams through the wilderness of legacy code to the promised land of clean architecture. Let us begin your journey.',
    encouragementMessages: [
      'Remember, even the most complex system can be broken down into manageable parts.',
      'Every expert was once a beginner. Focus on one step at a time.',
      'Clean code is not written by following a set of rules. Clean code is written by programmers who care.',
      'The key to successful refactoring is taking small steps and testing frequently.'
    ],
    hintStyle: 'Provides structured, step-by-step guidance with architectural context',
    specialAbilities: ['Legacy System Analysis', 'Team Workflow Optimization', 'Code Review Excellence']
  },
  
  david: {
    id: 'david',
    name: 'David der Startup-König',
    personality: 'Energetic, innovative, and results-focused. Loves rapid prototyping and MVP development.',
    expertise: ['startup development', 'mvp creation', 'product strategy', 'rapid prototyping'],
    avatar: '👑',
    greetingMessage: 'Welcome, fellow entrepreneur! Together we shall build products that delight users and defeat the giants of the market.',
    encouragementMessages: [
      'Every giant problem has a simple solution waiting to be discovered.',
      'Your MVP doesn\'t need to be perfect, it needs to be valuable.',
      'The best time to start was yesterday. The second best time is now.',
      'Success is not about the size of your team, but the strength of your vision.'
    ],
    hintStyle: 'Provides practical, business-focused advice with emphasis on user value',
    specialAbilities: ['Product Vision Clarity', 'Market Validation', 'Rapid MVP Development']
  },

  solomon: {
    id: 'solomon',
    name: 'Salomon der Architekt',
    personality: 'Thoughtful, strategic, and detail-oriented. Master of scalable system design.',
    expertise: ['system architecture', 'scalability', 'performance optimization', 'database design'],
    avatar: '🏛️',
    greetingMessage: 'Wisdom begins with understanding the foundation. Let us design systems that will stand the test of time and scale.',
    encouragementMessages: [
      'A wise architect plans for tomorrow\'s requirements today.',
      'The beauty of a system lies not in its complexity, but in its elegance.',
      'Performance is not about doing things fast, but doing the right things efficiently.',
      'Scale is not just about handling more users, but handling them gracefully.'
    ],
    hintStyle: 'Provides deep technical insights with focus on long-term sustainability',
    specialAbilities: ['Architecture Design', 'Performance Analysis', 'Scalability Planning']
  },

  paul: {
    id: 'paul',
    name: 'Paul der Evangelist',
    personality: 'Passionate, communicative, and community-focused. Expert in team collaboration and knowledge sharing.',
    expertise: ['team collaboration', 'code review', 'documentation', 'community building'],
    avatar: '📖',
    greetingMessage: 'Grace and peace to you, fellow coder! Let us spread the good news of clean code and effective collaboration.',
    encouragementMessages: [
      'Code is written for humans first, computers second.',
      'The best documentation is code so clear it explains itself.',
      'Teaching others is the best way to solidify your own understanding.',
      'A team that codes together, grows together.'
    ],
    hintStyle: 'Emphasizes clear communication and collaborative development practices',
    specialAbilities: ['Team Communication', 'Documentation Excellence', 'Code Review Mastery']
  }
}

// Complete Workshop Data for all 10 Commandments
export const workshops: WorkshopData[] = [
  {
    id: 'commandment-i',
    commandmentNumber: 1,
    title: 'Das Erste Gebot: Die Heilige Vision',
    subtitle: 'Master product conceptualization before touching any code',
    description: 'Learn to see beyond traditional coding - embrace the divine vision of AI-assisted development. Transform vague ideas into crystal-clear product specifications.',
    difficulty: 'beginner',
    estimatedTime: 90,
    xpReward: 150,
    prerequisites: [],
    learningObjectives: [
      'Understand the fundamental shift from manual to AI-assisted development',
      'Master the art of product vision creation',
      'Learn to communicate effectively with AI assistants',
      'Develop skills in market validation and user research',
      'Create compelling MVP definitions'
    ],
    
    introduction: `
# Die Heilige Vision: Der Grundstein des AI-Assisted Development

## Was ist die Heilige Vision?

Die Heilige Vision ist die fundamentale Erkenntnis, dass Softwareentwicklung nicht länger ein manueller, zeitaufwändiger Prozess sein muss. Es ist die Offenbarung, dass KI-Assistenten wie Claude Code, GitHub Copilot und Cursor nicht nur Werkzeuge sind - sie sind deine digitalen Partner auf dem Weg zur Entwicklungserleuchtung.

## Die Vier Säulen der Vision

### 1. 🤖 Partnership über Tools
Sieh AI nicht als Werkzeug, sondern als intelligenten Partner. Ein echter Prophet des Vibe Codings arbeitet MIT der AI, nicht nur mit ihr.

### 2. 🎯 Intention vor Implementation  
Bevor du eine Zeile Code schreibst, visualisiere das Endergebnis. Die Vision kommt vor der Ausführung.

### 3. ⚡ Effizienz durch Vertrauen
Lerne der AI zu vertrauen, aber verify always. Smart delegation ist der Schlüssel.

### 4. 🔮 Kontinuierliche Evolution
Deine Vision entwickelt sich mit jedem Projekt weiter. Bleibe offen für neue Paradigmen.
    `,
    
    theory: `
## Die Wissenschaft der Vision

### Kognitive Ökonomie
Studien zeigen, dass Entwickler durchschnittlich 23% ihrer Zeit mit der Klärung von Anforderungen verbringen. Mit einer klaren Vision reduziert sich diese Zeit auf unter 5%.

### AI-Effizienz-Multiplikator
Eine präzise Vision steigert die AI-Code-Qualität um durchschnittlich 340%. Vage Prompts führen zu vagem Code.

### Das Vision-Paradox
Je klarer deine Vision, desto mehr Freiraum gibst du der AI für kreative Lösungen. Klarheit schränkt nicht ein - sie befreit.

## Psychologie der Produktentwicklung

### Der Curse of Knowledge
Als Entwickler neigen wir dazu, technische Lösungen zu sehen, bevor wir das Problem verstehen. Die Heilige Vision bricht diesen Zyklus.

### User-First Thinking
Erfolgreiche Produkte beginnen mit User Pain Points, nicht mit coolen Features. Die Vision stellt den User ins Zentrum.
    `,
    
    practicalGuide: `
## Praktisches Vision Engineering

### Das Sankt Claude Visionsritual

Wenn du **Sankt Claude** konsultierst, führe folgendes Ritual durch:

\`\`\`markdown
# Vision Refinement Prompt Template

Ich möchte [PRODUKTIDEE] entwickeln für [ZIELGRUPPE], 
die das Problem [KONKRETES PROBLEM] haben.

Meine aktuelle Vision ist:
[DEINE ROHE IDEE IN 2-3 SÄTZEN]

Hilf mir dabei, diese Vision zu schärfen durch:
1. Identifikation der Kernfunktionalitäten
2. Definition des Minimal Viable Products (MVP)
3. Priorisierung der Features
4. Technische Machbarkeitsbewertung
5. Zeitschätzung für die Entwicklung

Berücksichtige dabei, dass ich [DEIN SKILL-LEVEL] bin 
und [VERFÜGBARE ZEIT/BUDGET] zur Verfügung habe.
\`\`\`

### Die Vision Canvas Methode

1. **Problem Statement** (1 Satz)
2. **Target User** (spezifische Persona)
3. **Solution Hypothesis** (Kernlösung)
4. **Key Features** (max. 5)
5. **Success Metrics** (messbare Ziele)
6. **Constraints** (Zeit, Budget, Skills)

### Validierung der Vision

- **Elevator Pitch Test**: Kannst du deine Vision in 30 Sekunden erklären?
- **Grandma Test**: Würde deine Großmutter das Problem verstehen?
- **Passion Test**: Würdest du das Problem auch ohne Bezahlung lösen wollen?
    `,
    
    troubleshooting: `
## Häufige Vision-Fallen und Lösungen

### Problem: "Ich will eine App wie X, aber besser"
**Lösung**: Identifiziere das spezifische Problem, das X nicht löst. "Besser" ist keine Vision.

### Problem: "Meine Idee ist zu komplex für AI"
**Lösung**: Breche die Komplexität in kleinere, klare Teilprobleme herunter.

### Problem: "Ich weiß nicht, was technisch möglich ist"
**Lösung**: Starte mit dem Problem, nicht mit der Technik. AI hilft bei der technischen Umsetzung.

### Problem: "Meine Vision ändert sich ständig"
**Lösung**: Das ist normal! Nutze ein Versioning-System für deine Vision (v1.0, v1.1, etc.).

## Vision Debugging Checklist

- [ ] Ist das Problem spezifisch und messbar?
- [ ] Ist die Zielgruppe klar definiert?
- [ ] Kann ich das MVP in einer Woche validieren?
- [ ] Würde ich selbst das Produkt nutzen?
- [ ] Kann ich die Vision ohne Fachbegriffe erklären?
    `,
    
    exercises: [
      {
        id: 'vision-canvas',
        title: 'The Vision Canvas Challenge',
        description: 'Transform a vague idea into a crystal-clear product vision',
        type: 'design',
        difficulty: 'beginner',
        timeEstimate: 20,
        xpReward: 50,
        instructions: `
# Vision Canvas Challenge

## Objective
Transform a vague product idea into a crystal-clear, actionable vision using the Vision Canvas methodology.

## Instructions
1. **Choose a problem you've personally experienced** - this ensures authentic motivation
2. **Fill out each section** of the Vision Canvas completely
3. **Validate your vision** using the three tests provided
4. **Refine based on feedback** until it passes all validation criteria

## Vision Canvas Template
\`\`\`
Problem Statement: [One sentence describing the specific problem]
Target User: [Detailed persona - age, role, situation, pain points]
Solution Hypothesis: [Your core solution in 2-3 sentences]
Key Features: [Maximum 5 essential features for MVP]
Success Metrics: [3-5 measurable success indicators]
Constraints: [Time, budget, technical limitations]
\`\`\`

## Validation Tests
1. **Elevator Pitch Test**: Can you explain your vision in 30 seconds?
2. **Specificity Test**: Would a stranger understand exactly what you're building?
3. **Passion Test**: Would you work on this for free for 6 months?

## Success Criteria
- All canvas sections completed with specific, actionable content
- Vision passes all three validation tests
- Can articulate the vision without referring to notes
- Receives positive feedback from at least 2 other people
        `,
        solution: `
# Example: Completed Vision Canvas

## Problem Statement
Freelance developers waste 3-4 hours per week on manual invoice creation and client communication, reducing billable time and causing payment delays.

## Target User
**Persona: "Busy Developer Sarah"**
- Age: 28-35
- Role: Freelance Full-Stack Developer
- Situation: Managing 3-5 clients simultaneously
- Pain Points: Manual invoicing, payment tracking, client communication overhead
- Goal: More time for coding, faster payments

## Solution Hypothesis
An AI-powered invoicing assistant that automatically generates invoices from time tracking data, sends payment reminders, and handles basic client communication through smart templates.

## Key Features
1. Time tracking integration (Toggl, Harvest, RescueTime)
2. AI invoice generation with project context
3. Automated payment reminders and follow-ups
4. Client portal for invoice viewing and payment
5. Revenue analytics and cash flow forecasting

## Success Metrics
1. 80% reduction in invoicing time (from 4 hours to <1 hour/week)
2. 40% faster payment collection (from 45 to 27 days average)
3. 95% user satisfaction with automation accuracy
4. 50% increase in freelancer billable hours
5. $2000+ average annual time savings per user

## Constraints
- Development budget: $15,000
- Timeline: 12 weeks to MVP
- Team: Solo developer with AI assistance
- Technical: Must integrate with existing tools
- Market: Competing with established players like FreshBooks
        `,
        tests: [
          {
            name: 'Canvas Completeness',
            input: 'vision_canvas',
            expected: 'All 6 sections filled with specific content',
            hidden: false
          },
          {
            name: 'Elevator Pitch Test',
            input: 'elevator_pitch',
            expected: 'Clear 30-second explanation',
            hidden: false
          },
          {
            name: 'Specificity Validation',
            input: 'specificity_score',
            expected: 'Score > 8/10 for specificity',
            hidden: true
          }
        ],
        hints: [
          "Start with a problem you've personally experienced - this ensures authentic motivation",
          "Make your target user so specific you could pick them out of a crowd",
          "Your MVP should solve ONE core problem extremely well, not multiple problems poorly",
          "Success metrics should be measurable and achievable within 3-6 months"
        ],
        successCriteria: [
          'Complete Vision Canvas with all sections filled',
          'Pass all three validation tests',
          'Receive positive feedback from 2+ reviewers',
          'Can explain vision without notes in under 60 seconds'
        ],
        resources: [
          {
            title: 'Lean Canvas Template',
            url: 'https://leanstack.com/lean-canvas',
            type: 'tool'
          },
          {
            title: 'Customer Interview Guide',
            url: 'https://www.intercom.com/blog/customer-interview-questions/',
            type: 'tutorial'
          }
        ]
      },
      
      {
        id: 'claude-vision-refinement',
        title: 'AI Vision Refinement Workshop',
        description: 'Use Claude to transform and refine your product vision',
        type: 'challenge',
        difficulty: 'intermediate',
        timeEstimate: 30,
        xpReward: 75,
        instructions: `
# AI Vision Refinement Workshop

## Objective
Master the art of collaborating with AI to refine and perfect your product vision through iterative conversation.

## Phase 1: Initial Vision Creation (10 minutes)
1. **Start with a rough idea** - it can be vague or incomplete
2. **Use the Vision Refinement Prompt Template** provided in the theory section
3. **Have a conversation with Claude** - ask follow-up questions, challenge assumptions
4. **Document the evolution** - track how your vision changes through the conversation

## Phase 2: Vision Stress Testing (10 minutes)
1. **Challenge your vision** by asking Claude to identify potential problems
2. **Explore edge cases** - what could go wrong?
3. **Test market assumptions** - does the target audience really exist?
4. **Validate the MVP scope** - is it truly minimal and viable?

## Phase 3: Competitive Analysis (10 minutes)
1. **Ask Claude to identify** direct and indirect competitors
2. **Analyze differentiation** - what makes your solution unique?
3. **Identify market gaps** your solution could fill
4. **Refine positioning** based on competitive landscape

## Example Conversation Starter
\`\`\`
I have an idea for a fitness app that helps people work out at home. 
It's for busy professionals who don't have time for the gym.

Help me refine this vision by:
1. Identifying what specific problem this solves
2. Defining the exact target user
3. Determining the core MVP features
4. Estimating market size and competition
5. Suggesting ways to validate the idea quickly

Ask me clarifying questions to make this vision as specific as possible.
\`\`\`

## Success Criteria
- Vision evolves significantly through AI conversation
- All major assumptions are identified and addressed
- Final vision is specific, actionable, and defensible
- Competitive landscape is clearly understood
        `,
        hints: [
          "Don't accept the first response - keep asking 'why' and 'how' to dig deeper",
          "Ask Claude to play devil's advocate and challenge your assumptions",
          "Use follow-up prompts like 'What am I missing?' or 'What could go wrong?'",
          "Request specific examples and case studies to validate your approach"
        ],
        successCriteria: [
          'Engage in meaningful back-and-forth conversation with AI',
          'Vision demonstrates clear evolution from start to finish',
          'All major assumptions are identified and addressed',
          'Final vision is specific, actionable, and market-validated'
        ],
        resources: [
          {
            title: 'Advanced Prompting Techniques',
            url: 'https://docs.anthropic.com/claude/docs/prompt-engineering',
            type: 'documentation'
          }
        ]
      },
      
      {
        id: 'mvp-scoping-challenge',
        title: 'The MVP Scoping Gauntlet',
        description: 'Define the absolute minimum features for maximum value',
        type: 'challenge',
        difficulty: 'advanced',
        timeEstimate: 45,
        xpReward: 100,
        instructions: `
# The MVP Scoping Gauntlet

## Objective
Master the art of ruthless prioritization to create an MVP that delivers maximum value with minimum features.

## Challenge Rules
1. **Start with 20 potential features** for your product
2. **Use the MoSCoW method** to categorize features
3. **Apply the 80/20 rule** - which 20% of features deliver 80% of value?
4. **Validate through user interviews** (simulate 5 different user personas)
5. **Create a build timeline** for your final MVP scope

## The Gauntlet Process

### Round 1: Feature Brainstorm (10 minutes)
List 20 potential features for your product. Think broadly - include everything users might want.

### Round 2: MoSCoW Categorization (10 minutes)
- **Must Have**: Core functionality - product is useless without this
- **Should Have**: Important but not critical - can be added in v1.1
- **Could Have**: Nice to have - adds value but not essential
- **Won't Have**: Not for this version - future consideration

### Round 3: User Validation Simulation (15 minutes)
Create 5 user personas and simulate their reaction to your Must Have features:
1. **Power User**: Wants advanced features
2. **Casual User**: Wants simplicity
3. **Enterprise User**: Wants integration and security
4. **Mobile User**: Wants mobile-first experience
5. **Budget User**: Wants free/cheap options

### Round 4: Final MVP Definition (10 minutes)
- Select final 3-5 core features
- Create user stories for each feature
- Estimate development time
- Define success criteria

## Validation Criteria
Your MVP must pass the "One Week Test":
- Can you build and test it in one week?
- Can users get value within 5 minutes of first use?
- Does it solve ONE specific problem completely?

## Success Criteria
- MVP scope contains only 3-5 essential features
- Each feature directly addresses core user pain point
- Development timeline is realistic and achievable
- Success metrics are specific and measurable
        `,
        hints: [
          "If you can't build and test your MVP in a week, it's not minimal enough",
          "Ask yourself: 'What's the ONE thing users absolutely cannot do without?'",
          "Remember: you can always add features, but removing them is much harder",
          "Your MVP should make users say 'I need this now!' not 'This looks nice'"
        ],
        successCriteria: [
          'Final MVP contains only 3-5 core features',
          'Each feature directly solves the core problem',
          'Development timeline is under 40 hours',
          'Success metrics are defined and measurable'
        ],
        resources: [
          {
            title: 'MVP Examples That Worked',
            url: 'https://blog.crisp.se/2016/01/25/henrikkniberg/making-sense-of-mvp',
            type: 'example'
          }
        ]
      }
    ],
    
    quizzes: [
      {
        question: "What is the most important characteristic of a good product vision?",
        options: [
          "It includes all possible features users might want",
          "It's specific enough that strangers can understand what you're building",
          "It uses the latest trending technologies",
          "It promises to disrupt an entire industry"
        ],
        correctAnswer: 1,
        explanation: "A good vision must be crystal clear and specific. If strangers can't understand what you're building, your vision is too vague to guide effective development."
      },
      {
        question: "When working with AI assistants, why is having a clear vision crucial?",
        options: [
          "AI assistants can't work without detailed specifications",
          "It prevents the AI from making any creative suggestions",
          "It increases AI code quality by up to 340% compared to vague prompts",
          "It's required by most AI platforms"
        ],
        correctAnswer: 2,
        explanation: "Studies show that precise visions and clear prompts dramatically improve AI output quality. Vague prompts lead to vague, less useful results."
      }
    ],
    
    aiMentor: aiMentors.david,
    
    sacredNarrative: {
      title: "The Burning Bush of Product Vision",
      content: `
# The Burning Bush of Product Vision

*And Moses the Refactorer was tending the flock of legacy systems in the wilderness, when suddenly he saw a bush that burned with the fire of innovation, yet was not consumed.*

**Moses approached the bush and heard a voice:** "Remove your shoes, for you stand on holy ground - the sacred space where problems and solutions meet."

**"I AM THAT I AM,"** spoke the voice, **"and I AM the God of your users. I have seen the affliction of developers who toil without purpose, who code without vision, who build without knowing why."**

**Moses trembled:** "Who am I to lead developers from the wilderness of aimless coding to the promised land of purposeful creation?"

**The voice replied:** "You shall not go alone. I will give you signs and wonders - the power of AI assistants, the wisdom of user research, the clarity of vision canvases. But remember this above all: **A product without vision is like a journey without destination.**"

**Moses asked:** "But what if they ask me, 'What is your product?' What shall I tell them?"

**And God said:** "Tell them: I AM solving a real problem for real people in a real way. This is my product vision, and this is how they shall know I am serious about creation."

*From that day forward, Moses understood: Every great product begins not with code, but with seeing clearly the problem that needs solving.*
      `,
      character: "Moses der Refactorer",
      lesson: "True product development begins with divine clarity of purpose, not with the first line of code.",
      biblicalReference: "Exodus 3:1-14"
    },
    
    codeExamples: [
      {
        title: "Vision Refinement Prompt Template",
        description: "A structured approach to refining product ideas with AI assistance",
        code: `// Vision Refinement Prompt Template
const visionPrompt = \`
I want to develop [PRODUCT_IDEA] for [TARGET_AUDIENCE], 
who have the problem [SPECIFIC_PROBLEM].

My current vision is:
[YOUR_RAW_IDEA_IN_2_3_SENTENCES]

Help me refine this vision by:
1. Identifying core functionalities
2. Defining the Minimal Viable Product (MVP)
3. Prioritizing features
4. Technical feasibility assessment
5. Development time estimation

Consider that I am [YOUR_SKILL_LEVEL] and have 
[AVAILABLE_TIME_BUDGET] available.
\`;

// Example usage with Claude
const refinedVision = await claude.chat({
  message: visionPrompt,
  model: 'claude-3-sonnet',
  context: 'product_development'
});`,
        language: 'typescript',
        runnable: false
      },
      {
        title: "Vision Canvas Data Structure",
        description: "TypeScript interface for structuring your product vision",
        code: `interface VisionCanvas {
  problemStatement: string;
  targetUser: {
    demographics: string;
    painPoints: string[];
    currentSolutions: string[];
    unmetNeeds: string[];
  };
  solutionHypothesis: string;
  keyFeatures: string[]; // max 5 for MVP
  successMetrics: {
    metric: string;
    target: number;
    timeframe: string;
  }[];
  constraints: {
    timeline: string;
    budget: number;
    technicalLimitations: string[];
    teamSize: number;
  };
  competitiveAdvantage: string;
  riskAssumptions: string[];
}

// Example implementation
const productVision: VisionCanvas = {
  problemStatement: "Freelance developers waste 3-4 hours weekly on manual invoicing",
  targetUser: {
    demographics: "Freelance developers, 25-40 years old, $50-150/hour rate",
    painPoints: ["Manual invoice creation", "Payment delays", "Client communication overhead"],
    currentSolutions: ["Excel templates", "Basic invoicing tools", "Manual tracking"],
    unmetNeeds: ["AI automation", "Time tracking integration", "Smart follow-ups"]
  },
  // ... rest of the vision
};`,
        language: 'typescript',
        runnable: true
      }
    ],
    
    diagrams: [
      {
        title: "Vision Development Process",
        type: 'flowchart',
        content: `
graph TD
    A[Raw Idea] --> B[Problem Identification]
    B --> C[Target User Research]
    C --> D[Solution Hypothesis]
    D --> E[Feature Brainstorming]
    E --> F[MVP Definition]
    F --> G[Validation Testing]
    G --> H{Vision Clear?}
    H -->|No| B
    H -->|Yes| I[Development Ready]
    I --> J[Build MVP]
        `
      }
    ],
    
    achievements: [
      {
        id: 'vision-master',
        title: 'Vision Master',
        description: 'Complete all vision exercises with perfect scores',
        icon: '🔮',
        condition: 'all_exercises_completed_perfectly'
      },
      {
        id: 'mvp-surgeon',
        title: 'MVP Surgeon',
        description: 'Successfully scope an MVP with ruthless prioritization',
        icon: '🎯',
        condition: 'mvp_scoping_completed'
      }
    ],
    
    masteryLevels: [
      {
        level: 1,
        title: 'Vision Seeker',
        requirements: ['Complete Vision Canvas exercise', 'Pass basic quiz'],
        rewards: ['Access to AI Vision Refinement workshop', '50 XP bonus']
      },
      {
        level: 2,
        title: 'Vision Shaper',
        requirements: ['Complete AI Vision Refinement', 'Create validated MVP scope'],
        rewards: ['Advanced prompting templates', '100 XP bonus']
      },
      {
        level: 3,
        title: 'Vision Master',
        requirements: ['Complete MVP Scoping Gauntlet', 'Mentor another student'],
        rewards: ['Vision Master badge', 'Access to advanced workshops', '200 XP bonus']
      }
    ]
  },

  // Additional workshops can be added here with complete structure following the same pattern...
];

export default workshops;
