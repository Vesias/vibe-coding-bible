import { WorkshopData } from '../types'

export const commandmentI: WorkshopData = {
  id: 'i',
  commandmentNumber: 'I',
  title: 'Die Heilige Vision',
  subtitle: 'Foundation of Sacred Development',
  sacredSymbol: '👁️',
  description: 'Master product conceptualization and market validation before touching any code. Learn to see the divine plan.',
  difficulty: 'Beginner',
  totalXP: 150,
  estimatedTime: 45,
  sacredWisdom: '"Wer ohne Vision zu programmieren beginnt, ist wie ein Wanderer in der Wüste ohne Kompass..."',
  prerequisites: [],
  learningObjectives: [
    'Entwickle kristallklare Produktvisionen',
    'Lerne die Sankt Claude Visionsrituale',
    'Meistere User Story Creation',
    'Definiere erfolgreiche MVPs',
    'Validiere Geschäftsideen systematisch'
  ],
  lessons: [
    {
      id: 'vision-intro',
      title: 'Die Prophezeiung der Produktidee',
      content: `In den heiligen Hallen der Softwareentwicklung gab es eine Zeit, da Entwickler Monate damit verbrachten, Code Zeile für Zeile zu schreiben. Diese Revolution heißt **Vibe Coding** – und ihr erstes Gebot lautet: **Die Heilige Vision**.

## Die drei Säulen der Heiligen Vision

### 1. Die Säule der Klarheit - Was?
Deine Vision muss so präzise sein, dass ein fremder Entwickler sie lesen und sofort verstehen könnte, was zu bauen ist.

### 2. Die Säule des Zwecks - Warum?
Jede große Softwarelösung löst ein echtes Problem. Nicht "weil es cool wäre", sondern mit konkreten Daten und Nutzen.

### 3. Die Säule der Vision - Wer?
Für wen baust du? Nicht "für alle", sondern für eine spezifische, definierte Zielgruppe.`,
      type: 'theory',
      estimatedTime: 15,
      xp: 25
    },
    {
      id: 'vision-ritual',
      title: 'Das Sankt Claude Visionsritual',
      content: `## Vision Refinement Template

\`\`\`markdown
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
\`\`\`

## Die Heilige Regel der Vision-Verfeinerung

Claude wird dir systematisch dabei helfen, aus deiner groben Idee eine kristallklare Vision zu schaffen. Dieser Prozess folgt einem bewährten Muster:

### Phase 1: Klarheit (Clarity)
- Was genau willst du bauen?
- Welches Problem löst es?
- Für wen löst es das Problem?

### Phase 2: Machbarkeit (Feasibility)
- Ist das technisch umsetzbar?
- Welche Tools und Technologien brauchst du?
- Wie lange würde die Entwicklung dauern?

### Phase 3: Validierung (Validation)
- Gibt es einen Markt dafür?
- Würden Menschen dafür bezahlen?
- Wie kannst du das testen, bevor du baust?`,
      type: 'theory',
      estimatedTime: 20,
      xp: 30
    }
  ],
  exercises: [
    {
      id: 'vision-creation',
      title: 'Erschaffe deine erste Heilige Vision',
      description: 'Verwende das Sankt Claude Visionsritual, um eine konkrete Produktidee zu entwickeln.',
      instructions: [
        'Denke an ein Problem, das du persönlich erlebst oder beobachtest',
        'Verwende das Vision Refinement Template',
        'Führe eine Conversation mit Claude durch',
        'Dokumentiere die verfeinerte Vision',
        'Identifiziere die ersten 3 Features für dein MVP'
      ],
      expectedOutput: 'Eine vollständig ausgearbeitete Produktvision mit MVP-Definition',
      hints: [
        'Beginne mit einem Problem, das dich persönlich betrifft',
        'Stelle Claude spezifische Fragen zu deiner Idee',
        'Denke in Lösungen, nicht in Features'
      ],
      difficulty: 'easy',
      xp: 50,
      aiAssistance: true
    },
    {
      id: 'vision-validation',
      title: 'Validiere deine Vision',
      description: 'Teste deine Produktvision systematisch bevor du mit der Entwicklung beginnst.',
      instructions: [
        'Erstelle eine einfache Landing Page für deine Idee',
        'Definiere 3 Kern-Hypothesen über deine Zielgruppe',
        'Führe 5 Interviews mit potenziellen Nutzern durch',
        'Sammle Feedback und iteriere deine Vision',
        'Dokumentiere deine Learnings'
      ],
      expectedOutput: 'Validierte Vision mit User-Feedback und überarbeiteter Feature-Liste',
      hints: [
        'Nutze Tools wie Figma für schnelle Mockups',
        'Stelle offene Fragen in den Interviews',
        'Höre mehr zu als du sprichst'
      ],
      difficulty: 'medium',
      xp: 75,
      aiAssistance: true
    }
  ],
  completionCriteria: [
    'Vision Template vollständig ausgefüllt',
    'MVP-Features definiert und priorisiert',
    'Mindestens 3 User-Interviews durchgeführt',
    'Feedback in Vision eingearbeitet',
    'Erste technische Machbarkeitsprüfung abgeschlossen'
  ],
  nextCommandment: 'ii'
}