import { WorkshopData } from '../types'

export const commandmentIII: WorkshopData = {
  id: 'iii',
  commandmentNumber: 'III',
  title: 'Die Prompt-Kunst',
  subtitle: 'Mastering AI Communication',
  sacredSymbol: '🗣️',
  description: 'Master the art of prompt engineering and AI communication. Learn to speak the language of artificial intelligence.',
  difficulty: 'Intermediate',
  totalXP: 225,
  estimatedTime: 60,
  sacredWisdom: '"Der richtige Prompt ist wie ein Schlüssel, der die Weisheit der KI entfesselt..."',
  prerequisites: ['i', 'ii'],
  learningObjectives: [
    'Verstehe Prompt Engineering Fundamentals',
    'Entwickle erweiterte Prompting-Techniken',
    'Lerne Context Window Management',
    'Meistere Chain-of-Thought Reasoning',
    'Implementiere Template-basierte Workflows'
  ],
  lessons: [
    {
      id: 'prompt-fundamentals',
      title: 'Die Grundlagen der Prompt-Kunst',
      content: `# Die Heilige Kunst des Prompt Engineering

## Was ist Prompt Engineering?

Prompt Engineering ist die Kunst und Wissenschaft, KI-Modelle durch präzise formulierte Anweisungen zu optimaler Leistung zu führen. Es ist wie das Dirigieren eines Orchesters – jedes Wort zählt.

## Die vier Säulen der Prompt-Kunst

### 1. Klarheit (Clarity)
- Sei spezifisch und eindeutig
- Vermeide Mehrdeutigkeiten
- Definiere gewünschte Ausgabeformate

### 2. Kontext (Context)
- Gib relevante Hintergrundinformationen
- Erkläre den Anwendungsfall
- Setze den richtigen Rahmen

### 3. Constraints (Beschränkungen)
- Definiere Grenzen und Regeln
- Spezifiziere gewünschte Länge
- Setze qualitative Standards

### 4. Chain-of-Thought
- Führe die KI durch logische Schritte
- Ermutige zu expliziertem Denken
- Bitte um Begründungen

## Prompt-Template Grundstruktur

\`\`\`
[ROLLE/PERSONA]
Du bist ein erfahrener [EXPERT_TYPE]...

[AUFGABE]
Deine Aufgabe ist es, [SPECIFIC_TASK]...

[KONTEXT]
Gegeben: [RELEVANT_CONTEXT]...

[CONSTRAINTS]
Beachte folgende Einschränkungen:
- [CONSTRAINT_1]
- [CONSTRAINT_2]

[OUTPUT_FORMAT]
Formatiere deine Antwort als:
- [FORMAT_SPECIFICATION]
\`\`\``,
      type: 'theory',
      estimatedTime: 25,
      xp: 40
    },
    {
      id: 'advanced-prompting',
      title: 'Erweiterte Prompting-Techniken',
      content: `# Erweiterte Prompt-Engineering Techniken

## Few-Shot Learning
Gib der KI Beispiele, um das gewünschte Verhalten zu demonstrieren:

\`\`\`
Erstelle Produktbeschreibungen im folgenden Stil:

Beispiel 1:
Produkt: Bluetooth Kopfhörer
Beschreibung: "Tauche ein in kristallklaren Sound mit unseren Premium Bluetooth Kopfhörern. 30 Stunden Akkulaufzeit für endlose Musik-Sessions."

Beispiel 2:
Produkt: Smartwatch
Beschreibung: "Dein intelligenter Begleiter am Handgelenk. Fitness-Tracking, Nachrichten und Apps – alles in einem eleganten Design."

Jetzt für: [DEIN_PRODUKT]
\`\`\`

## Chain-of-Thought Prompting
Führe die KI durch strukturiertes Denken:

\`\`\`
Löse folgendes Problem Schritt für Schritt:

Problem: [PROBLEM_BESCHREIBUNG]

Gehe vor wie folgt:
1. Analysiere das Problem
2. Identifiziere relevante Faktoren
3. Entwickle mögliche Lösungsansätze
4. Bewerte die Optionen
5. Empfehle die beste Lösung

Erkläre deine Überlegungen bei jedem Schritt.
\`\`\`

## Role-Based Prompting
Nutze spezifische Expertenpersonas:

\`\`\`
Du bist ein erfahrener Senior Software Architect mit 15 Jahren Erfahrung in der Entwicklung skalierbarer Webanwendungen. 

Analysiere folgende Architektur-Entscheidung aus der Perspektive von:
- Skalierbarkeit
- Wartbarkeit  
- Performance
- Kosten

[ARCHITEKTUR_BESCHREIBUNG]
\`\`\`

## Multi-Step Workflows
Erstelle mehrstufige Prozesse:

\`\`\`
Führe folgende Analyse in 3 Phasen durch:

Phase 1 - Datensammlung:
- Sammle alle relevanten Informationen
- Identifiziere fehlende Daten

Phase 2 - Analyse:
- Führe die Hauptanalyse durch
- Identifiziere Muster und Trends

Phase 3 - Empfehlungen:
- Leite konkrete Handlungsempfehlungen ab
- Priorisiere nach Wichtigkeit

Beginne mit Phase 1.
\`\`\``,
      type: 'practice',
      estimatedTime: 30,
      xp: 50
    },
    {
      id: 'context-management',
      title: 'Context Window Optimization',
      content: `# Context Window Management

## Was ist das Context Window?

Das Context Window ist die maximale Anzahl von Tokens (Wörtern/Zeichen), die ein KI-Modell in einer Sitzung verarbeiten kann. Bei Claude sind das derzeit etwa 200.000 Tokens.

## Strategien für Context Management

### 1. Information Hierarchie
Priorisiere Informationen nach Wichtigkeit:

\`\`\`
KRITISCH (immer beibehalten):
- Hauptaufgabe und Ziele
- Zentrale Anforderungen
- Aktuelle Arbeitsschritte

WICHTIG (wenn Platz verfügbar):
- Hintergrundinformationen
- Zusätzliche Beispiele
- Detaillierte Spezifikationen

OPTIONAL (erste Kürzungen):
- Ausführliche Erklärungen
- Mehrfach-Beispiele
- Redundante Informationen
\`\`\`

### 2. Context Chunking
Teile große Aufgaben in kleinere Chunks:

\`\`\`
Projekt: Vollständige Webanwendung

Chunk 1: Datenmodell Design
Chunk 2: API Endpoints Definition
Chunk 3: Frontend Komponenten
Chunk 4: Authentication System
Chunk 5: Deployment Strategy

Arbeite einzeln durch jeden Chunk.
\`\`\`

### 3. Context Compression
Komprimiere wiederholende Informationen:

\`\`\`
Statt:
"Das ist ein E-Commerce Projekt für Schuhe. Es soll Schuhe verkaufen. Die Zielgruppe sind Schuh-Liebhaber..."

Besser:
"E-Commerce Plattform für Schuhe | Zielgruppe: Schuh-Enthusiasten | Ziel: Online-Verkauf"
\`\`\`

### 4. State Management
Verwende kurze Zustandsübersichten:

\`\`\`
## Aktueller Stand:
- ✅ Datenmodell definiert
- ✅ API Routes geplant
- 🔄 Frontend Komponenten (in Arbeit)
- ⏳ Authentication (wartend)
- ⏳ Deployment (wartend)

Aktueller Focus: Frontend Komponenten
Nächster Schritt: Login Component
\`\`\``,
      type: 'practice',
      estimatedTime: 20,
      xp: 35
    }
  ],
  exercises: [
    {
      id: 'prompt-optimization',
      title: 'Prompt Optimization Challenge',
      description: 'Optimiere einen gegebenen Prompt für bessere Ergebnisse',
      instructions: [
        'Analysiere den bereitgestellten "schlechten" Prompt',
        'Identifiziere Verbesserungsmöglichkeiten',
        'Schreibe einen optimierten Prompt mit allen 4 Säulen',
        'Teste beide Prompts mit Claude',
        'Dokumentiere die Unterschiede in der Ausgabequalität'
      ],
      expectedOutput: 'Vergleichende Analyse mit optimiertem Prompt und Begründung der Verbesserungen',
      hints: [
        'Achte auf Klarheit, Kontext, Constraints und Chain-of-Thought',
        'Nutze spezifische Beispiele',
        'Definiere klare Ausgabeformate'
      ],
      difficulty: 'medium',
      xp: 75,
      aiAssistance: true
    },
    {
      id: 'workflow-design',
      title: 'Multi-Step Workflow Creation',
      description: 'Entwerfe einen mehrstufigen Prompt-Workflow für ein komplexes Problem',
      instructions: [
        'Wähle ein komplexes Entwicklungsproblem',
        'Teile es in 5-7 logische Schritte auf',
        'Erstelle für jeden Schritt einen spezialisierten Prompt',
        'Implementiere Übergabe-Mechanismen zwischen Schritten',
        'Teste den kompletten Workflow'
      ],
      expectedOutput: 'Vollständiger Workflow mit getesteten Prompts und Dokumentation',
      hints: [
        'Denke in Pipelines, nicht in einzelnen Anfragen',
        'Jeder Schritt sollte klar definierte Eingaben und Ausgaben haben',
        'Plane Fehlerbehandlung und Validierung'
      ],
      difficulty: 'hard',
      xp: 100,
      aiAssistance: true
    }
  ],
  completionCriteria: [
    'Mindestens 3 Prompt-Templates erstellt',
    'Advanced Techniques praktisch angewendet',
    'Context Management demonstriert',
    'Multi-Step Workflow funktionsfähig',
    'Prompt Optimization durchgeführt'
  ],
  nextCommandment: 'iv'
}