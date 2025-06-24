import { WorkshopData } from '../types'

export const commandmentVI: WorkshopData = {
  id: 'vi',
  commandmentNumber: 'VI',
  title: 'Göttliches Debugging',
  subtitle: 'Sacred Problem Solving',
  sacredSymbol: '🔍',
  description: 'Master the divine art of debugging and problem-solving with AI assistance. Learn to diagnose and fix issues systematically.',
  difficulty: 'Intermediate',
  totalXP: 300,
  estimatedTime: 80,
  sacredWisdom: '"Ein Bug ist nicht dein Feind, sondern ein Lehrer, der dir den Weg zur Wahrheit zeigt..."',
  prerequisites: ['i', 'ii', 'iii', 'v'],
  learningObjectives: [
    'Entwickle systematische Debugging-Strategien',
    'Nutze AI für effektive Problemanalyse',
    'Meistere Advanced Debugging Tools',
    'Implementiere präventive Debug-Strategien',
    'Optimiere Error Handling und Logging'
  ],
  lessons: [
    {
      id: 'debugging-philosophy',
      title: 'Die Philosophie des Göttlichen Debugging',
      content: `# Göttliches Debugging: Die Kunst der Problemlösung

## Was ist Göttliches Debugging?

Debugging ist mehr als nur Fehlersuche. Es ist ein systematischer Ansatz zur Problemlösung, der Logik, Intuition und die Kraft der KI kombiniert.

## Die Vier Säulen des Göttlichen Debugging

### 1. Observation (Beobachtung)
- Was passiert tatsächlich?
- Was sollte passieren?
- Wo liegt die Diskrepanz?

### 2. Hypothesis (Hypothesenbildung)
- Was könnte die Ursache sein?
- Welche Faktoren könnten beteiligt sein?
- Wie kann ich die Hypothese testen?

### 3. Experimentation (Experimentierung)
- Systematische Tests der Hypothesen
- Isolierung von Variablen
- Sammlung von Evidenz

### 4. Resolution (Lösung)
- Implementierung der Lösung
- Validierung der Behebung
- Präventive Maßnahmen

## Der Sacred Debugging Process

\`\`\`
1. REPRODUCE (Reproduzieren)
   ↓
2. ISOLATE (Isolieren)
   ↓
3. ANALYZE (Analysieren)
   ↓
4. HYPOTHESIZE (Hypothese bilden)
   ↓
5. TEST (Testen)
   ↓
6. FIX (Beheben)
   ↓
7. VERIFY (Verifizieren)
   ↓
8. PREVENT (Vorbeugen)
\`\`\`

## AI-Assisted Debugging Template

\`\`\`markdown
## BUG ANALYSIS REQUEST

### Problem Description:
[CLEAR_DESCRIPTION_OF_ISSUE]

### Expected Behavior:
[WHAT_SHOULD_HAPPEN]

### Actual Behavior:
[WHAT_IS_HAPPENING]

### Environment:
- OS: [OPERATING_SYSTEM]
- Browser/Runtime: [ENVIRONMENT]
- Version: [SOFTWARE_VERSION]

### Steps to Reproduce:
1. [STEP_1]
2. [STEP_2]
3. [STEP_3]

### Relevant Code:
\`\`\`[language]
[CODE_SNIPPET]
\`\`\`

### Error Messages:
\`\`\`
[EXACT_ERROR_MESSAGE]
\`\`\`

### What I've Tried:
- [ATTEMPTED_SOLUTION_1]
- [ATTEMPTED_SOLUTION_2]

AI, please help me:
1. Analyze potential root causes
2. Suggest debugging strategies
3. Recommend specific fixes
4. Identify prevention measures
\`\`\`

## Common Bug Categories

### 1. Logic Errors
- Incorrect algorithms
- Wrong conditions
- Faulty assumptions

### 2. Runtime Errors
- Null pointer exceptions
- Type mismatches
- Resource conflicts

### 3. Performance Issues
- Memory leaks
- Infinite loops
- Inefficient algorithms

### 4. Integration Errors
- API mismatches
- Data format issues
- Timing problems

### 5. Environmental Issues
- Configuration problems
- Dependency conflicts
- Platform differences`,
      type: 'theory',
      estimatedTime: 25,
      xp: 55
    },
    {
      id: 'systematic-debugging',
      title: 'Systematische Debugging-Techniken',
      content: `# Systematische Debugging-Strategien

## The Debugging Methodology

### 1. Binary Search Debugging
Halbiere das Problem systematisch:

\`\`\`markdown
## BINARY SEARCH DEBUGGING

### Full Code Path:
[START] → [STEP_1] → [STEP_2] → [STEP_3] → [ERROR]

### Test Middle Point:
- Working: [START] → [STEP_1] ✅
- Failing: [STEP_2] → [ERROR] ❌

### Focus: [STEP_1] → [STEP_2]
- Add logging/breakpoints between these steps
- Narrow down to exact failure point
\`\`\`

### 2. Rubber Duck Debugging mit AI
Erkläre das Problem Schritt für Schritt:

\`\`\`markdown
Ich erkläre dir mein Problem Schritt für Schritt. Hilf mir dabei, Denkfehler zu identifizieren:

1. Mein Code soll [EXPECTED_BEHAVIOR]
2. Dafür macht er folgendes: [STEP_BY_STEP_LOGIC]
3. An Stelle X passiert aber [UNEXPECTED_BEHAVIOR]
4. Ich denke das liegt daran, dass [MY_HYPOTHESIS]

Wo könnte mein Denkfehler liegen?
\`\`\`

### 3. Assumption Testing
Teste systematisch alle Annahmen:

\`\`\`typescript
// Example: API Call Debugging
async function fetchUserData(userId: string) {
  // Assumption 1: userId is valid
  console.log('Debug: userId =', userId, typeof userId)
  
  // Assumption 2: API endpoint is correct
  const url = \`/api/users/\${userId}\`
  console.log('Debug: API URL =', url)
  
  // Assumption 3: Network request succeeds
  try {
    const response = await fetch(url)
    console.log('Debug: Response status =', response.status)
    
    // Assumption 4: Response contains valid JSON
    const data = await response.json()
    console.log('Debug: Response data =', data)
    
    // Assumption 5: Data has expected structure
    console.log('Debug: User name =', data?.name)
    
    return data
  } catch (error) {
    console.error('Debug: Error occurred =', error)
    throw error
  }
}
\`\`\`

## Advanced Debugging Patterns

### 1. State Timeline Debugging
\`\`\`typescript
class StateTracker {
  private history: Array<{timestamp: number, state: any, action: string}> = []
  
  logState(state: any, action: string) {
    this.history.push({
      timestamp: Date.now(),
      state: JSON.parse(JSON.stringify(state)), // Deep clone
      action
    })
  }
  
  getStateTimeline() {
    return this.history
  }
  
  findStateChange(property: string) {
    for (let i = 1; i < this.history.length; i++) {
      const prev = this.history[i-1].state
      const curr = this.history[i].state
      
      if (prev[property] !== curr[property]) {
        return {
          from: prev[property],
          to: curr[property],
          action: this.history[i].action,
          timestamp: this.history[i].timestamp
        }
      }
    }
  }
}
\`\`\`

### 2. Conditional Debugging
\`\`\`typescript
function debugLog(condition: boolean, message: string, data?: any) {
  if (condition && process.env.NODE_ENV === 'development') {
    console.group(\`🐛 \${message}\`)
    if (data) {
      console.log('Data:', data)
      console.log('Type:', typeof data)
      console.log('Stack:', new Error().stack)
    }
    console.groupEnd()
  }
}

// Usage
const user = await fetchUser(id)
debugLog(!user, 'User not found', { id, fetchResult: user })
debugLog(user && !user.isActive, 'User is inactive', user)
\`\`\`

### 3. Performance Debugging
\`\`\`typescript
class PerformanceProfiler {
  private timers = new Map<string, number>()
  
  start(label: string) {
    this.timers.set(label, performance.now())
  }
  
  end(label: string) {
    const start = this.timers.get(label)
    if (start) {
      const duration = performance.now() - start
      console.log(\`⏱️ \${label}: \${duration.toFixed(2)}ms\`)
      this.timers.delete(label)
      return duration
    }
  }
  
  measure<T>(label: string, fn: () => T): T {
    this.start(label)
    const result = fn()
    this.end(label)
    return result
  }
}

// Usage
const profiler = new PerformanceProfiler()
const result = profiler.measure('data-processing', () => {
  return processLargeDataset(data)
})
\`\`\`

## AI-Powered Debugging Workflows

### 1. Stack Trace Analysis
\`\`\`markdown
Analysiere folgenden Stack Trace und erkläre:

Stack Trace:
[FULL_STACK_TRACE]

Code Context:
[RELEVANT_CODE]

Erkläre:
1. Was ist der Root Cause?
2. Welche Zeile verursacht den Fehler?
3. Warum tritt der Fehler auf?
4. Wie kann er behoben werden?
5. Wie kann er in Zukunft verhindert werden?
\`\`\`

### 2. Performance Bottleneck Analysis
\`\`\`markdown
Analysiere Performance-Problem:

Performance Data:
[PROFILING_RESULTS]

Code:
[SUSPECTED_SLOW_CODE]

System Info:
[SYSTEM_SPECS]

Identifiziere:
1. Hauptengpässe
2. Optimierungsmöglichkeiten
3. Quick Wins
4. Langfristige Verbesserungen
\`\`\``,
      type: 'practice',
      estimatedTime: 35,
      xp: 75
    },
    {
      id: 'preventive-debugging',
      title: 'Präventive Debug-Strategien',
      content: `# Präventive Debug-Strategien: Probleme vermeiden statt lösen

## Die Philosophie der Prävention

"Der beste Bug ist der, der nie entsteht." - Präventive Strategien reduzieren Debugging-Aufwand um 80%.

## Error-First Design

### 1. Defensive Programming
\`\`\`typescript
// Bad: Assuming inputs are valid
function calculateDiscount(price: number, percentage: number) {
  return price * (percentage / 100)
}

// Good: Defensive programming
function calculateDiscount(price: number, percentage: number): number {
  // Input validation
  if (typeof price !== 'number' || price < 0) {
    throw new Error(\`Invalid price: \${price}. Must be a positive number.\`)
  }
  
  if (typeof percentage !== 'number' || percentage < 0 || percentage > 100) {
    throw new Error(\`Invalid percentage: \${percentage}. Must be between 0-100.\`)
  }
  
  // Business logic validation
  if (price === 0) {
    return 0 // Early return for edge case
  }
  
  const discount = price * (percentage / 100)
  
  // Post-condition validation
  if (discount > price) {
    throw new Error('Discount cannot exceed original price')
  }
  
  return discount
}
\`\`\`

### 2. Type Safety
\`\`\`typescript
// Strict type definitions prevent many bugs
interface User {
  id: string
  email: string
  isActive: boolean
  lastLogin?: Date
}

interface UserRepository {
  findById(id: string): Promise<User | null>
  save(user: User): Promise<void>
  delete(id: string): Promise<boolean>
}

// Exhaustive pattern matching
type Status = 'pending' | 'approved' | 'rejected'

function handleStatus(status: Status): string {
  switch (status) {
    case 'pending':
      return 'Waiting for approval'
    case 'approved':
      return 'Request approved'
    case 'rejected':
      return 'Request rejected'
    default:
      // TypeScript will catch missing cases
      const exhaustiveCheck: never = status
      throw new Error(\`Unhandled status: \${exhaustiveCheck}\`)
  }
}
\`\`\`

### 3. Contract Programming
\`\`\`typescript
// Pre-conditions, post-conditions, invariants
class BankAccount {
  private _balance: number
  
  constructor(initialBalance: number) {
    // Pre-condition
    if (initialBalance < 0) {
      throw new Error('Initial balance cannot be negative')
    }
    
    this._balance = initialBalance
    
    // Post-condition
    this.assertInvariants()
  }
  
  withdraw(amount: number): void {
    // Pre-conditions
    if (amount <= 0) {
      throw new Error('Withdrawal amount must be positive')
    }
    
    if (amount > this._balance) {
      throw new Error('Insufficient funds')
    }
    
    const oldBalance = this._balance
    
    // Operation
    this._balance -= amount
    
    // Post-conditions
    if (this._balance !== oldBalance - amount) {
      throw new Error('Balance calculation error')
    }
    
    this.assertInvariants()
  }
  
  private assertInvariants(): void {
    if (this._balance < 0) {
      throw new Error('Invariant violation: balance cannot be negative')
    }
  }
  
  get balance(): number {
    this.assertInvariants()
    return this._balance
  }
}
\`\`\`

## Comprehensive Logging Strategy

### 1. Structured Logging
\`\`\`typescript
interface LogEntry {
  timestamp: string
  level: 'debug' | 'info' | 'warn' | 'error'
  message: string
  context: Record<string, any>
  traceId?: string
  userId?: string
}

class Logger {
  log(level: LogEntry['level'], message: string, context: Record<string, any> = {}) {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      context: {
        ...context,
        environment: process.env.NODE_ENV,
        version: process.env.npm_package_version
      }
    }
    
    // In production: send to logging service
    // In development: pretty print
    console.log(JSON.stringify(entry, null, 2))
  }
  
  debug(message: string, context?: Record<string, any>) {
    this.log('debug', message, context)
  }
  
  info(message: string, context?: Record<string, any>) {
    this.log('info', message, context)
  }
  
  warn(message: string, context?: Record<string, any>) {
    this.log('warn', message, context)
  }
  
  error(message: string, error?: Error, context?: Record<string, any>) {
    this.log('error', message, {
      ...context,
      error: error ? {
        name: error.name,
        message: error.message,
        stack: error.stack
      } : undefined
    })
  }
}
\`\`\`

### 2. Observability Patterns
\`\`\`typescript
// Request tracing
class RequestTracer {
  private static currentTrace = new Map<string, any>()
  
  static startTrace(traceId: string, operation: string) {
    this.currentTrace.set(traceId, {
      id: traceId,
      operation,
      startTime: Date.now(),
      events: []
    })
  }
  
  static addEvent(traceId: string, event: string, data?: any) {
    const trace = this.currentTrace.get(traceId)
    if (trace) {
      trace.events.push({
        timestamp: Date.now(),
        event,
        data,
        duration: Date.now() - trace.startTime
      })
    }
  }
  
  static endTrace(traceId: string) {
    const trace = this.currentTrace.get(traceId)
    if (trace) {
      trace.totalDuration = Date.now() - trace.startTime
      
      // Log complete trace
      logger.info('Request completed', {
        traceId,
        operation: trace.operation,
        duration: trace.totalDuration,
        events: trace.events
      })
      
      this.currentTrace.delete(traceId)
      return trace
    }
  }
}
\`\`\`

## Automated Error Detection

### 1. Health Checks
\`\`\`typescript
interface HealthCheck {
  name: string
  check(): Promise<boolean>
  recover?(): Promise<void>
}

class HealthMonitor {
  private checks: HealthCheck[] = []
  
  register(check: HealthCheck) {
    this.checks.push(check)
  }
  
  async runHealthChecks(): Promise<Map<string, boolean>> {
    const results = new Map<string, boolean>()
    
    for (const check of this.checks) {
      try {
        const result = await check.check()
        results.set(check.name, result)
        
        if (!result) {
          logger.warn(\`Health check failed: \${check.name}\`)
          
          // Attempt recovery
          if (check.recover) {
            try {
              await check.recover()
              logger.info(\`Recovery attempted for: \${check.name}\`)
            } catch (error) {
              logger.error(\`Recovery failed for: \${check.name}\`, error)
            }
          }
        }
      } catch (error) {
        logger.error(\`Health check error: \${check.name}\`, error)
        results.set(check.name, false)
      }
    }
    
    return results
  }
}

// Example health checks
const dbHealthCheck: HealthCheck = {
  name: 'database',
  async check() {
    try {
      await db.query('SELECT 1')
      return true
    } catch {
      return false
    }
  },
  async recover() {
    await db.reconnect()
  }
}
\`\`\``,
      type: 'practice',
      estimatedTime: 40,
      xp: 85
    }
  ],
  exercises: [
    {
      id: 'debugging-simulation',
      title: 'Complex Bug Hunting Simulation',
      description: 'Löse eine Serie von komplexen, realistischen Bugs mit systematischen Debugging-Techniken',
      instructions: [
        'Verwende den bereitgestellten buggy Code mit 5 verschiedenen Fehlern',
        'Wende systematische Debugging-Methoden an',
        'Dokumentiere deinen Debugging-Prozess',
        'Nutze AI für Hypothesenbildung und Validation',
        'Implementiere Fixes und präventive Maßnahmen'
      ],
      expectedOutput: 'Vollständig debuggte Anwendung mit Dokumentation des Debugging-Prozesses',
      hints: [
        'Beginne mit Reproduktion und Isolation',
        'Teste eine Hypothese nach der anderen',
        'Nutze Logging für bessere Insights'
      ],
      difficulty: 'hard',
      xp: 150,
      aiAssistance: true
    },
    {
      id: 'preventive-system',
      title: 'Präventives Debug-System',
      description: 'Implementiere ein umfassendes präventives Debug- und Monitoring-System',
      instructions: [
        'Erstelle robustes Logging System',
        'Implementiere Health Checks',
        'Baue Error Boundary System',
        'Entwickle Automated Testing für Edge Cases',
        'Teste das System unter verschiedenen Failure-Szenarien'
      ],
      expectedOutput: 'Funktionsfähiges präventives Debug-System mit Monitoring und Alerting',
      hints: [
        'Denke an Observability von Anfang an',
        'Automatisiere wo möglich',
        'Plane für verschiedene Failure-Modi'
      ],
      difficulty: 'hard',
      xp: 150,
      aiAssistance: true
    }
  ],
  completionCriteria: [
    'Systematische Debugging-Methode angewendet',
    'AI-Assisted Problem Analysis durchgeführt',
    'Präventive Debug-Strategien implementiert',
    'Comprehensive Logging System erstellt',
    'Complex Bug erfolgreich behoben'
  ],
  nextCommandment: 'vii'
}