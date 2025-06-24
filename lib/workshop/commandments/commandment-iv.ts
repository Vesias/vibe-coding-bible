import { WorkshopData } from '../types'

export const commandmentIV: WorkshopData = {
  id: 'iv',
  commandmentNumber: 'IV',
  title: 'Multi-Context Programming',
  subtitle: 'Advanced AI Workflow Orchestration',
  sacredSymbol: '🔄',
  description: 'Master complex multi-file, multi-context development workflows with AI assistance. Learn to orchestrate large-scale projects.',
  difficulty: 'Advanced',
  totalXP: 350,
  estimatedTime: 90,
  sacredWisdom: '"Der wahre Meister jongliert nicht nur mit Code, sondern mit ganzen Welten aus Kontext..."',
  prerequisites: ['i', 'ii', 'iii'],
  learningObjectives: [
    'Verstehe Multi-Context Architecture',
    'Implementiere Project State Management',
    'Meistere Cross-File Dependencies',
    'Entwickle Context Switching Strategien',
    'Optimiere Large Codebase Navigation'
  ],
  lessons: [
    {
      id: 'multi-context-intro',
      title: 'Einführung in Multi-Context Programming',
      content: `# Multi-Context Programming: Die nächste Stufe

## Was ist Multi-Context Programming?

Multi-Context Programming bedeutet, mit der KI an komplexen Projekten zu arbeiten, die über mehrere Dateien, Module und Kontexte verteilt sind. Es ist die Kunst, den Überblick zu behalten und konsistente Entwicklung zu gewährleisten.

## Die Herausforderungen

### 1. Context Window Limitations
- Begrenzte Token-Anzahl pro Anfrage
- Wichtige Informationen können "vergessen" werden
- Komplexe Abhängigkeiten schwer zu übertragen

### 2. Consistency Challenges
- Naming Conventions über Files hinweg
- API-Design Konsistenz
- Architekturelle Entscheidungen

### 3. State Management
- Welche Files wurden geändert?
- Welche Dependencies sind betroffen?
- Wo steht das Projekt aktuell?

## Die Lösungsstrategien

### 1. Project State Documentation
Immer aktueller Überblick über:
- Projektstruktur und Architektur
- Aktuelle Arbeitsfortschritte
- Nächste geplante Schritte
- Bekannte Issues und TODOs

### 2. Context Handoff Patterns
Strukturierte Übergabe zwischen Sessions:
- Zusammenfassung der letzten Session
- Aktuelle Code-State
- Nächste Aufgaben
- Relevante Dateien und Dependencies

### 3. Modular Development Approach
- Klare Trennung von Concerns
- Well-defined Interfaces
- Minimale Coupling zwischen Modulen
- Testbare, unabhängige Komponenten

## Multi-Context Workflow Template

\`\`\`markdown
## PROJECT STATE SNAPSHOT

### Projekt Übersicht:
- Name: [PROJECT_NAME]
- Tech Stack: [TECHNOLOGIES]
- Architektur: [ARCHITECTURE_PATTERN]

### Aktuelle Session:
- Ziel: [SESSION_GOAL]
- Betroffene Files: [FILE_LIST]
- Abhängigkeiten: [DEPENDENCIES]

### Letzter Stand:
- ✅ Abgeschlossen: [COMPLETED_TASKS]
- 🔄 In Arbeit: [CURRENT_TASKS]
- ⏳ Geplant: [PLANNED_TASKS]

### Context for AI:
[RELEVANT_CODE_SNIPPETS_OR_REFERENCES]
\`\`\``,
      type: 'theory',
      estimatedTime: 25,
      xp: 60
    },
    {
      id: 'context-switching',
      title: 'Effective Context Switching Strategies',
      content: `# Context Switching Mastery

## The Challenge of Context Switching

In komplexen Projekten musst du ständig zwischen verschiedenen Kontexten wechseln:
- Frontend ↔ Backend
- Database ↔ API ↔ UI
- Testing ↔ Implementation ↔ Documentation

## Session Transition Templates

### 1. Session Handoff Template
\`\`\`markdown
## SESSION HANDOFF

### Was wurde erreicht:
- [SPECIFIC_ACCOMPLISHMENTS]
- [FILES_MODIFIED]
- [NEW_FEATURES_IMPLEMENTED]

### Aktueller Zustand:
- Tests: [PASSING/FAILING_STATUS]
- Build: [BUILD_STATUS]
- Key Issues: [OPEN_ISSUES]

### Nächste Session Vorbereitung:
- Priorität 1: [NEXT_TASK]
- Benötigte Files: [FILE_LIST]
- Kontext: [CONTEXT_SUMMARY]
\`\`\`

### 2. Cross-Module Context Template
\`\`\`markdown
## CROSS-MODULE WORK

### Module 1: [MODULE_NAME]
- Zweck: [PURPOSE]
- Interface: [PUBLIC_API]
- Status: [CURRENT_STATUS]

### Module 2: [MODULE_NAME]
- Zweck: [PURPOSE]
- Interface: [PUBLIC_API]
- Status: [CURRENT_STATUS]

### Integration Points:
- Data Flow: [MODULE_1] → [MODULE_2]
- Dependencies: [DEPENDENCY_LIST]
- Shared Types: [TYPE_DEFINITIONS]
\`\`\`

### 3. Architecture Decision Context
\`\`\`markdown
## ARCHITECTURE CONTEXT

### Current Pattern:
[DESCRIBE_CURRENT_ARCHITECTURE]

### Decision Point:
[SPECIFIC_DECISION_NEEDED]

### Options Considered:
1. Option A: [PROS/CONS]
2. Option B: [PROS/CONS]
3. Option C: [PROS/CONS]

### Chosen Approach:
[SELECTED_OPTION] because [REASONING]
\`\`\`

## Context Preservation Techniques

### 1. Living Documentation
- README with current state
- CHANGELOG with recent modifications  
- TODO.md with prioritized tasks
- ARCHITECTURE.md with system overview

### 2. Code Comments as Context
\`\`\`typescript
/**
 * CONTEXT: This component handles user authentication
 * DEPENDS ON: AuthService, UserStore
 * USED BY: LoginPage, SignupPage, ProtectedRoute
 * 
 * RECENT CHANGES:
 * - Added OAuth support (2024-01-15)
 * - Fixed token refresh bug (2024-01-12)
 * 
 * TODO:
 * - Add MFA support
 * - Implement session persistence
 */
export class AuthManager {
  // implementation
}
\`\`\`

### 3. Git Commit Strategy
\`\`\`bash
# Descriptive commits that provide context
git commit -m "feat(auth): add OAuth integration

- Implement Google OAuth flow
- Update AuthService interface
- Add OAuth button to LoginPage
- Tests: auth.test.ts updated

Next: Implement GitHub OAuth"
\`\`\``,
      type: 'practice',
      estimatedTime: 35,
      xp: 70
    },
    {
      id: 'large-codebase-navigation',
      title: 'Large Codebase Navigation and Management',
      content: `# Navigating Large Codebases with AI

## The Scaling Challenge

Wenn Projekte wachsen, wird Navigation zur Herausforderung:
- 100+ Dateien
- Komplexe Ordnerstrukturen  
- Verschachtelte Dependencies
- Multiple Entwickler/Teams

## Codebase Mapping Strategies

### 1. Hierarchical Code Organization
\`\`\`
src/
├── core/           # Business logic
│   ├── entities/   # Domain models
│   ├── services/   # Business services
│   └── types/      # Type definitions
├── infrastructure/ # External concerns
│   ├── api/        # HTTP layer
│   ├── database/   # Data persistence
│   └── auth/       # Authentication
├── presentation/   # UI layer
│   ├── components/ # Reusable UI
│   ├── pages/      # Route components
│   └── hooks/      # Custom hooks
└── shared/         # Cross-cutting
    ├── utils/      # Helper functions
    ├── constants/  # App constants
    └── types/      # Shared types
\`\`\`

### 2. Dependency Mapping
\`\`\`markdown
## MODULE DEPENDENCY MAP

### Core Dependencies (Bottom Layer):
- entities/ (no dependencies)
- types/ (no dependencies)
- utils/ (no dependencies)

### Service Layer:
- services/ → entities/, types/
- core/ → services/, entities/

### Infrastructure Layer:
- api/ → services/, types/
- database/ → entities/, services/
- auth/ → services/, entities/

### Presentation Layer:
- components/ → hooks/, utils/
- pages/ → components/, services/
- hooks/ → services/, types/
\`\`\`

### 3. AI-Friendly Code Documentation
\`\`\`typescript
/**
 * @module UserService
 * @description Handles all user-related business operations
 * 
 * @dependencies
 * - UserEntity (core/entities/User.ts)
 * - DatabaseService (infrastructure/database/DatabaseService.ts)
 * - AuthService (infrastructure/auth/AuthService.ts)
 * 
 * @consumers
 * - UserController (infrastructure/api/UserController.ts)
 * - ProfilePage (presentation/pages/ProfilePage.tsx)
 * - UserHooks (presentation/hooks/useUser.ts)
 * 
 * @recent_changes
 * - Added email verification (2024-01-15)
 * - Refactored password validation (2024-01-10)
 */
export class UserService {
  // implementation
}
\`\`\`

## Large Project Workflow Patterns

### 1. Feature Branch Context
\`\`\`markdown
## FEATURE BRANCH: add-payment-system

### Scope:
- Add Stripe integration
- Create payment UI components
- Implement subscription logic
- Add payment history

### Files to Modify:
- src/core/services/PaymentService.ts (NEW)
- src/infrastructure/api/PaymentController.ts (NEW)
- src/presentation/pages/PaymentPage.tsx (NEW)
- src/core/entities/User.ts (MODIFY - add subscription)
- src/presentation/components/SubscriptionCard.tsx (NEW)

### Integration Points:
- UserService: Add subscription management
- AuthService: Add subscription-based access control
- Database: Add payments table migration
\`\`\`

### 2. Impact Analysis Template
\`\`\`markdown
## CHANGE IMPACT ANALYSIS

### Proposed Change:
[DESCRIBE_CHANGE]

### Direct Impact:
- File: [FILENAME] - [MODIFICATION_TYPE]
- File: [FILENAME] - [MODIFICATION_TYPE]

### Indirect Impact:
- File: [FILENAME] - [REASON_FOR_CHANGE]
- Tests: [TEST_FILES_TO_UPDATE]

### Risk Assessment:
- Breaking Changes: [YES/NO - DESCRIBE]
- Database Migration: [YES/NO - DESCRIBE]
- API Changes: [YES/NO - DESCRIBE]

### Testing Strategy:
- Unit Tests: [SPECIFIC_TESTS_NEEDED]
- Integration Tests: [INTEGRATION_SCENARIOS]
- E2E Tests: [USER_JOURNEYS_TO_TEST]
\`\`\``,
      type: 'practice',
      estimatedTime: 30,
      xp: 80
    }
  ],
  exercises: [
    {
      id: 'multi-context-project',
      title: 'Multi-Context Project Setup',
      description: 'Erstelle ein komplexes Multi-Context Projekt mit strukturierter Navigation',
      instructions: [
        'Plane ein Full-Stack Projekt (Frontend + Backend + Database)',
        'Erstelle vollständige Ordnerstruktur',
        'Definiere Module und ihre Dependencies',
        'Implementiere Context Handoff Dokumentation',
        'Baue erste Komponenten mit Cross-Module Integration'
      ],
      expectedOutput: 'Funktionsfähiges Multi-Context Projekt mit Dokumentation und Context Management',
      hints: [
        'Starte mit klarer Architektur-Planung',
        'Dokumentiere jeden Schritt für Context Preservation',
        'Teste die Context Switching zwischen Sessions'
      ],
      difficulty: 'hard',
      xp: 150,
      aiAssistance: true
    },
    {
      id: 'context-preservation',
      title: 'Context Preservation Challenge',
      description: 'Implementiere fortgeschrittene Context Preservation Strategien',
      instructions: [
        'Nimm ein bestehendes komplexes Projekt',
        'Analysiere die aktuelle Context-Situation',
        'Implementiere Project State Documentation',
        'Erstelle Session Handoff Templates',
        'Demonstriere effektive Context Switching'
      ],
      expectedOutput: 'Vollständiges Context Management System mit praktischen Templates',
      hints: [
        'Focus auf praktische, wiederverwendbare Templates',
        'Teste die Templates in echten Entwicklungsszenarien',
        'Optimiere für minimalen Overhead'
      ],
      difficulty: 'hard',
      xp: 200,
      aiAssistance: true
    }
  ],
  completionCriteria: [
    'Multi-Context Projekt erfolgreich erstellt',
    'Context Handoff Templates implementiert',
    'Dependency Mapping dokumentiert',
    'Session Transition demonstriert',
    'Large Codebase Navigation geübt'
  ],
  nextCommandment: 'v'
}