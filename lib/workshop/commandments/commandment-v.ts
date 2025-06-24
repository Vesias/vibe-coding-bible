import { WorkshopData } from '../types'

export const commandmentV: WorkshopData = {
  id: 'v',
  commandmentNumber: 'V',
  title: 'Die Heilige Iteration',
  subtitle: 'Continuous Divine Improvement',
  sacredSymbol: '🔄',
  description: 'Master the sacred cycle of continuous improvement, testing, and iterative development with AI assistance.',
  difficulty: 'Intermediate',
  totalXP: 275,
  estimatedTime: 75,
  sacredWisdom: '"Perfektion ist nicht das Ziel, sondern kontinuierliche Verbesserung ist der Weg..."',
  prerequisites: ['i', 'ii', 'iii'],
  learningObjectives: [
    'Verstehe iterative Entwicklungsprinzipien',
    'Implementiere Test-Driven Development mit AI',
    'Meistere Refactoring-Strategien',
    'Entwickle kontinuierliche Verbesserungszyklen',
    'Optimiere Code Quality durch Iteration'
  ],
  lessons: [
    {
      id: 'iteration-principles',
      title: 'Prinzipien der Heiligen Iteration',
      content: `# Die Heilige Iteration: Der Weg zur Perfektion

## Was ist Heilige Iteration?

Die Heilige Iteration ist mehr als nur "Code schreiben und verbessern". Es ist ein systematischer Ansatz zur kontinuierlichen Verbesserung, der auf den Prinzipien von:
- **Rapid Feedback** - Schnelle Rückkopplung
- **Incremental Progress** - Schrittweise Verbesserung  
- **Quality Assurance** - Qualitätssicherung
- **Continuous Learning** - Ständiges Lernen

## Der Sacred Cycle of Improvement

\`\`\`
1. PLAN (Planung)
   ↓
2. CODE (Implementierung)
   ↓
3. TEST (Validierung)
   ↓
4. REVIEW (Bewertung)
   ↓
5. REFACTOR (Verbesserung)
   ↓
6. DEPLOY (Auslieferung)
   ↓
(Cycle repeats)
\`\`\`

## Die Vier Säulen der Iteration

### 1. Minimum Viable Progress (MVP)
Jede Iteration sollte einen messbaren Fortschritt liefern:
- Funktionierende Features, nicht perfekte Features
- User Value über Code Perfection
- Lerneffekt über Vollständigkeit

### 2. Fast Feedback Loops
Kurze Zyklen für schnelle Validierung:
- Unit Tests für sofortiges Feedback
- Integration Tests für System-Validierung
- User Feedback für Feature-Validierung
- Performance Tests für Skalierung

### 3. Quality Gates
Qualitätsstufen, die nie unterschritten werden:
- Code kompiliert und läuft
- Tests sind grün
- Code Review ist positiv
- Performance ist akzeptabel

### 4. Continuous Improvement
Jede Iteration macht das System besser:
- Code wird sauberer
- Tests werden umfassender
- Architektur wird robuster
- Team wird effizienter

## Iteration Template mit AI

\`\`\`markdown
## ITERATION PLANNING

### Current State:
- ✅ What's working: [LIST]
- ❌ What needs improvement: [LIST]
- 🔄 What's in progress: [LIST]

### This Iteration Goal:
[SPECIFIC_MEASURABLE_GOAL]

### Success Criteria:
1. [CRITERION_1]
2. [CRITERION_2] 
3. [CRITERION_3]

### AI Assistance Plan:
- Code Review: [AREAS_FOR_AI_REVIEW]
- Testing: [TEST_GENERATION_NEEDS]
- Refactoring: [REFACTORING_TARGETS]
- Documentation: [DOCS_TO_UPDATE]

### Risk Mitigation:
- Potential Issues: [IDENTIFIED_RISKS]
- Rollback Plan: [FALLBACK_STRATEGY]
\`\`\``,
      type: 'theory',
      estimatedTime: 25,
      xp: 50
    },
    {
      id: 'tdd-with-ai',
      title: 'Test-Driven Development mit AI',
      content: `# TDD mit AI: Die perfekte Symbiose

## Der TDD Cycle mit AI-Unterstützung

### Traditional TDD:
\`\`\`
Red → Green → Refactor
\`\`\`

### AI-Enhanced TDD:
\`\`\`
Red → AI-Assist → Green → AI-Review → Refactor
\`\`\`

## Phase 1: Test Design mit AI

### AI-Assisted Test Planning
\`\`\`markdown
Du bist ein erfahrener Test Engineer. Hilf mir bei der Testplanung für folgende Funktion:

Funktion: [FUNCTION_DESCRIPTION]
Input: [INPUT_PARAMETERS]
Expected Behavior: [EXPECTED_BEHAVIOR]

Erstelle einen umfassenden Testplan mit:
1. Happy Path Tests
2. Edge Cases
3. Error Conditions
4. Performance Considerations

Für jeden Test gib an:
- Test Name
- Input
- Expected Output
- Reasoning
\`\`\`

### Test Generation Template
\`\`\`typescript
// AI-Generated Test Structure
describe('[COMPONENT_NAME]', () => {
  
  describe('Happy Path Tests', () => {
    test('should [EXPECTED_BEHAVIOR] when [CONDITION]', () => {
      // AI helps generate this
    })
  })
  
  describe('Edge Cases', () => {
    test('should handle [EDGE_CASE]', () => {
      // AI identifies edge cases
    })
  })
  
  describe('Error Conditions', () => {
    test('should throw [ERROR_TYPE] when [ERROR_CONDITION]', () => {
      // AI suggests error scenarios
    })
  })
  
})
\`\`\`

## Phase 2: Implementation mit AI Guidance

### AI-Assisted Implementation
\`\`\`markdown
Ich habe folgende failing Tests:

[TEST_CODE]

Hilf mir bei der Implementierung. Folge dabei TDD-Prinzipien:
1. Implementiere nur das Minimum um Tests zum Laufen zu bringen
2. Keine Over-Engineering
3. Sauberer, lesbarer Code
4. Berücksichtige alle Test Cases

Zeige mir Schritt für Schritt die Implementierung.
\`\`\`

## Phase 3: Refactoring mit AI Review

### AI Code Review Template
\`\`\`markdown
Reviewe folgenden Code auf:

[CODE_TO_REVIEW]

Analysiere:
1. Code Quality (Readability, Maintainability)
2. Performance Implications
3. Security Considerations
4. Test Coverage
5. Design Patterns Usage

Gib spezifische Verbesserungsvorschläge mit Beispielen.
\`\`\`

## Advanced TDD Patterns mit AI

### 1. Property-Based Testing
\`\`\`markdown
Generiere Property-Based Tests für:

Function: [FUNCTION_SIGNATURE]
Properties: [MATHEMATICAL_PROPERTIES]

Beispiel:
- Kommutativität: f(a,b) === f(b,a)
- Assoziativität: f(f(a,b),c) === f(a,f(b,c))
- Identität: f(a, identity) === a
\`\`\`

### 2. Mutation Testing
\`\`\`markdown
Analysiere die Qualität meiner Tests durch Mutation Testing.

Original Code: [CODE]
Test Suite: [TESTS]

Schlage Mutationen vor und prüfe, ob Tests sie erkennen würden.
\`\`\`

### 3. Test Data Generation
\`\`\`markdown
Generiere realistische Testdaten für:

Schema: [DATA_SCHEMA]
Constraints: [BUSINESS_RULES]
Volume: [DATA_VOLUME]

Erstelle sowohl valide als auch invalide Daten für umfassende Tests.
\`\`\``,
      type: 'practice',
      estimatedTime: 30,
      xp: 65
    },
    {
      id: 'refactoring-strategies',
      title: 'Systematisches Refactoring mit AI',
      content: `# Systematisches Refactoring: Code Evolution

## Was ist Sacred Refactoring?

Refactoring ist die Kunst, Code zu verbessern ohne die Funktionalität zu ändern. Mit AI wird es zu einem systematischen, risikoarmen Prozess.

## Der AI-Assisted Refactoring Process

### 1. Code Analysis Phase
\`\`\`markdown
Analysiere folgenden Code auf Refactoring-Möglichkeiten:

[CODE_TO_ANALYZE]

Identifiziere:
1. Code Smells (Duplicated Code, Long Methods, etc.)
2. Design Pattern Opportunities
3. Performance Improvements
4. Readability Issues
5. Maintainability Concerns

Priorisiere nach Impact vs. Effort.
\`\`\`

### 2. Refactoring Planning
\`\`\`markdown
## REFACTORING PLAN

### Target: [SPECIFIC_CODE_SECTION]

### Current Issues:
- Issue 1: [DESCRIPTION + IMPACT]
- Issue 2: [DESCRIPTION + IMPACT]

### Proposed Solution:
[REFACTORING_STRATEGY]

### Risk Assessment:
- Breaking Changes: [LIKELIHOOD + MITIGATION]
- Performance Impact: [ANALYSIS]
- Test Coverage: [CURRENT_STATE + NEEDS]

### Step-by-Step Plan:
1. [STEP_1]
2. [STEP_2]
3. [STEP_3]

### Success Criteria:
- [MEASURABLE_IMPROVEMENT_1]
- [MEASURABLE_IMPROVEMENT_2]
\`\`\`

## Common Refactoring Patterns mit AI

### 1. Extract Method
\`\`\`typescript
// Before: Long method
function processUserData(userData: any) {
  // 50 lines of mixed logic
}

// AI Suggestion: Extract methods
function processUserData(userData: UserData): ProcessedUser {
  const validatedData = validateUserInput(userData)
  const enrichedData = enrichUserData(validatedData)
  const normalizedData = normalizeUserData(enrichedData)
  return saveUserData(normalizedData)
}
\`\`\`

### 2. Extract Class
\`\`\`typescript
// Before: God class
class User {
  // User properties
  // Authentication logic
  // Email functionality
  // Notification handling
  // Report generation
}

// AI Suggestion: Separate concerns
class User { /* user data */ }
class UserAuth { /* authentication */ }
class UserNotifications { /* notifications */ }
class UserReports { /* reporting */ }
\`\`\`

### 3. Strategy Pattern
\`\`\`typescript
// Before: Complex if/else chains
function calculatePrice(type: string, amount: number) {
  if (type === 'premium') {
    // premium logic
  } else if (type === 'standard') {
    // standard logic
  } else if (type === 'economy') {
    // economy logic
  }
}

// AI Suggestion: Strategy pattern
interface PricingStrategy {
  calculate(amount: number): number
}

class PremiumPricing implements PricingStrategy { /* */ }
class StandardPricing implements PricingStrategy { /* */ }
class EconomyPricing implements PricingStrategy { /* */ }
\`\`\`

## Refactoring Safety Net

### 1. Test-First Refactoring
\`\`\`markdown
## REFACTORING SAFETY PROTOCOL

### Before Refactoring:
1. ✅ All existing tests pass
2. ✅ Test coverage is adequate (>80%)
3. ✅ Behavioral tests exist for public interfaces
4. ✅ Performance baseline established

### During Refactoring:
1. 🔄 Make small, incremental changes
2. 🔄 Run tests after each change
3. 🔄 Commit frequently with clear messages
4. 🔄 Monitor performance impact

### After Refactoring:
1. ✅ All tests still pass
2. ✅ Performance maintained or improved
3. ✅ Code review completed
4. ✅ Documentation updated
\`\`\`

### 2. AI-Assisted Risk Assessment
\`\`\`markdown
Bewerte das Risiko folgender Refactoring-Änderung:

Before: [OLD_CODE]
After: [NEW_CODE]

Analysiere:
1. Breaking Change Potential (High/Medium/Low)
2. Performance Impact (Positive/Neutral/Negative)
3. Maintainability Impact (Better/Same/Worse)
4. Test Coverage Adequacy (Sufficient/Needs Work)

Empfehle zusätzliche Sicherheitsmaßnahmen falls nötig.
\`\`\``,
      type: 'practice',
      estimatedTime: 35,
      xp: 75
    }
  ],
  exercises: [
    {
      id: 'tdd-implementation',
      title: 'TDD Implementation Challenge',
      description: 'Implementiere eine komplexe Funktion mit vollständigem TDD-Cycle und AI-Unterstützung',
      instructions: [
        'Wähle eine nicht-triviale Funktion (z.B. URL Router, Data Validator, etc.)',
        'Plane umfassende Tests mit AI-Hilfe',
        'Implementiere TDD Cycle: Red → Green → Refactor',
        'Nutze AI für Code Review und Verbesserungsvorschläge',
        'Dokumentiere den kompletten Prozess'
      ],
      expectedOutput: 'Vollständig getestete Funktion mit Dokumentation des TDD-Prozesses',
      hints: [
        'Beginne mit den einfachsten Tests',
        'Implementiere nur das Minimum für grüne Tests',
        'Nutze AI für Edge Case Identifikation'
      ],
      difficulty: 'medium',
      xp: 125,
      aiAssistance: true
    },
    {
      id: 'refactoring-project',
      title: 'Legacy Code Refactoring',
      description: 'Refactore ein komplexes Legacy Code Stück systematisch mit AI-Unterstützung',
      instructions: [
        'Finde oder erstelle einen komplexen, schlecht strukturierten Code',
        'Analysiere Code Smells und Verbesserungsmöglichkeiten',
        'Erstelle umfassende Tests für aktuelles Verhalten',
        'Führe systematisches Refactoring durch',
        'Validiere Verbesserungen durch Metriken'
      ],
      expectedOutput: 'Refactored Code mit Before/After Vergleich und Metriken',
      hints: [
        'Sicherheit geht vor Perfektion',
        'Messbare Verbesserungen dokumentieren',
        'Tests sind dein Sicherheitsnetz'
      ],
      difficulty: 'hard',
      xp: 150,
      aiAssistance: true
    }
  ],
  completionCriteria: [
    'TDD Cycle erfolgreich demonstriert',
    'Komplexe Refactoring durchgeführt',
    'AI-Assisted Code Review implementiert',
    'Test Coverage signifikant verbessert',
    'Iteration Process dokumentiert'
  ],
  nextCommandment: 'vi'
}