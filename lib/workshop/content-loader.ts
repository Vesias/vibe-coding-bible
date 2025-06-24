import { WorkshopData, WorkshopLesson, WorkshopExercise } from './types'
import fs from 'fs'
import path from 'path'

interface MarkdownSection {
  title: string
  content: string
  type: 'theory' | 'practice' | 'exercise' | 'reflection'
  estimatedTime?: number
  xp?: number
}

interface ParsedWorkshopContent {
  title: string
  description: string
  overview: string
  sections: MarkdownSection[]
  exercises: Array<{
    title: string
    description: string
    instructions: string[]
    expectedOutput: string
    hints: string[]
    difficulty: 'easy' | 'medium' | 'hard'
  }>
}

export class WorkshopContentLoader {
  private contentDir: string

  constructor(contentDir: string = 'content') {
    this.contentDir = contentDir
  }

  /**
   * Parse markdown content and extract workshop structure
   */
  parseMarkdownContent(markdownContent: string): ParsedWorkshopContent {
    const lines = markdownContent.split('\n')
    const sections: MarkdownSection[] = []
    const exercises: any[] = []
    
    let currentSection: MarkdownSection | null = null
    let title = ''
    let description = ''
    let overview = ''
    let currentContent = ''
    let inExercise = false
    let currentExercise: any = null

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]
      
      // Extract main title (first h1)
      if (line.startsWith('# ') && !title) {
        title = line.substring(2).replace(/[🔮⚡🗣️🔄🔍🤝💰👥]/g, '').trim()
        continue
      }

      // Extract description (text after title before first h2)
      if (!title) continue
      
      if (!description && line.trim() && !line.startsWith('#') && !line.startsWith('>')) {
        description = line.trim()
        continue
      }

      // Section headers (h2)
      if (line.startsWith('## ')) {
        // Save previous section
        if (currentSection) {
          currentSection.content = currentContent.trim()
          sections.push(currentSection)
        }

        const sectionTitle = line.substring(3).trim()
        
        // Determine section type based on title patterns
        let type: 'theory' | 'practice' | 'exercise' | 'reflection' = 'theory'
        if (sectionTitle.toLowerCase().includes('übung') || sectionTitle.toLowerCase().includes('exercise')) {
          type = 'exercise'
          inExercise = true
        } else if (sectionTitle.toLowerCase().includes('praxis') || sectionTitle.toLowerCase().includes('practice')) {
          type = 'practice'
        } else if (sectionTitle.toLowerCase().includes('reflexion') || sectionTitle.toLowerCase().includes('reflection')) {
          type = 'reflection'
        }

        currentSection = {
          title: sectionTitle,
          content: '',
          type,
          estimatedTime: this.extractTimeFromTitle(sectionTitle),
          xp: this.extractXPFromTitle(sectionTitle)
        }
        currentContent = ''
        continue
      }

      // Exercise parsing
      if (inExercise && line.startsWith('### ') && line.toLowerCase().includes('übung')) {
        if (currentExercise) {
          exercises.push(currentExercise)
        }
        
        currentExercise = {
          title: line.substring(4).trim(),
          description: '',
          instructions: [],
          expectedOutput: '',
          hints: [],
          difficulty: 'medium' as const
        }
        continue
      }

      // Accumulate content
      currentContent += line + '\n'

      // Parse exercise components
      if (currentExercise) {
        if (line.startsWith('**Aufgabe:**') || line.startsWith('**Task:**')) {
          const nextLines = []
          let j = i + 1
          while (j < lines.length && !lines[j].startsWith('**') && !lines[j].startsWith('###')) {
            if (lines[j].trim()) nextLines.push(lines[j].trim())
            j++
          }
          currentExercise.description = nextLines.join(' ')
        }
        
        if (line.startsWith('**Anweisungen:**') || line.startsWith('**Instructions:**')) {
          const instructions = []
          let j = i + 1
          while (j < lines.length && !lines[j].startsWith('**') && !lines[j].startsWith('###')) {
            if (lines[j].trim().startsWith('- ') || lines[j].trim().match(/^\d+\./)) {
              instructions.push(lines[j].trim().replace(/^- |\d+\.\s*/, ''))
            }
            j++
          }
          currentExercise.instructions = instructions
        }
        
        if (line.startsWith('**Erwartetes Ergebnis:**') || line.startsWith('**Expected Output:**')) {
          let j = i + 1
          const outputLines = []
          while (j < lines.length && !lines[j].startsWith('**') && !lines[j].startsWith('###')) {
            if (lines[j].trim()) outputLines.push(lines[j].trim())
            j++
          }
          currentExercise.expectedOutput = outputLines.join(' ')
        }
        
        if (line.startsWith('**Tipps:**') || line.startsWith('**Hints:**')) {
          const hints = []
          let j = i + 1
          while (j < lines.length && !lines[j].startsWith('**') && !lines[j].startsWith('###')) {
            if (lines[j].trim().startsWith('- ')) {
              hints.push(lines[j].trim().substring(2))
            }
            j++
          }
          currentExercise.hints = hints
        }
      }
    }

    // Save last section
    if (currentSection) {
      currentSection.content = currentContent.trim()
      sections.push(currentSection)
    }

    // Save last exercise
    if (currentExercise) {
      exercises.push(currentExercise)
    }

    // Extract overview from first section or create one
    overview = sections.length > 0 ? sections[0].content.substring(0, 200) + '...' : description

    return {
      title,
      description,
      overview,
      sections,
      exercises
    }
  }

  /**
   * Load and parse a workshop markdown file
   */
  async loadWorkshopMarkdown(commandmentId: string): Promise<ParsedWorkshopContent | null> {
    try {
      const filePath = path.join(process.cwd(), this.contentDir, `workshop-commandment-${commandmentId}.md`)
      
      if (!fs.existsSync(filePath)) {
        console.warn(`Workshop markdown file not found: ${filePath}`)
        return null
      }

      const markdownContent = fs.readFileSync(filePath, 'utf-8')
      return this.parseMarkdownContent(markdownContent)
    } catch (error) {
      console.error(`Error loading workshop markdown for ${commandmentId}:`, error)
      return null
    }
  }

  /**
   * Merge structured workshop data with markdown content
   */
  async enhanceWorkshopWithMarkdown(workshop: WorkshopData): Promise<WorkshopData> {
    const markdownContent = await this.loadWorkshopMarkdown(workshop.id)
    
    if (!markdownContent) {
      return workshop // Return original if no markdown found
    }

    // Enhance lessons with markdown content
    const enhancedLessons: WorkshopLesson[] = workshop.lessons.map((lesson, index) => {
      const markdownSection = markdownContent.sections[index]
      if (markdownSection) {
        return {
          ...lesson,
          content: markdownSection.content || lesson.content,
          estimatedTime: markdownSection.estimatedTime || lesson.estimatedTime,
          xp: markdownSection.xp || lesson.xp
        }
      }
      return lesson
    })

    // Add additional lessons from markdown if they exist
    const additionalLessons: WorkshopLesson[] = markdownContent.sections
      .slice(workshop.lessons.length)
      .map((section, index) => ({
        id: `markdown-lesson-${index + 1}`,
        title: section.title,
        content: section.content,
        type: section.type,
        estimatedTime: section.estimatedTime || 15,
        xp: section.xp || 25
      }))

    // Enhance exercises with markdown content
    const enhancedExercises: WorkshopExercise[] = workshop.exercises.map((exercise, index) => {
      const markdownExercise = markdownContent.exercises[index]
      if (markdownExercise) {
        return {
          ...exercise,
          title: markdownExercise.title || exercise.title,
          description: markdownExercise.description || exercise.description,
          instructions: markdownExercise.instructions.length > 0 ? markdownExercise.instructions : exercise.instructions,
          expectedOutput: markdownExercise.expectedOutput || exercise.expectedOutput,
          hints: markdownExercise.hints.length > 0 ? markdownExercise.hints : exercise.hints,
          difficulty: markdownExercise.difficulty || exercise.difficulty
        }
      }
      return exercise
    })

    // Add additional exercises from markdown
    const additionalExercises: WorkshopExercise[] = markdownContent.exercises
      .slice(workshop.exercises.length)
      .map((exercise, index) => ({
        id: `markdown-exercise-${index + 1}`,
        title: exercise.title,
        description: exercise.description,
        instructions: exercise.instructions,
        expectedOutput: exercise.expectedOutput,
        hints: exercise.hints,
        difficulty: exercise.difficulty,
        xp: 50,
        aiAssistance: true
      }))

    return {
      ...workshop,
      description: markdownContent.description || workshop.description,
      lessons: [...enhancedLessons, ...additionalLessons],
      exercises: [...enhancedExercises, ...additionalExercises]
    }
  }

  /**
   * Extract time estimate from section title
   */
  private extractTimeFromTitle(title: string): number {
    const timeMatch = title.match(/\((\d+)\s*min\)/i)
    return timeMatch ? parseInt(timeMatch[1]) : 15
  }

  /**
   * Extract XP from section title  
   */
  private extractXPFromTitle(title: string): number {
    const xpMatch = title.match(/\((\d+)\s*xp\)/i)
    return xpMatch ? parseInt(xpMatch[1]) : 25
  }

  /**
   * Generate all enhanced workshops
   */
  async generateEnhancedWorkshops(workshops: WorkshopData[]): Promise<WorkshopData[]> {
    const enhancedWorkshops = await Promise.all(
      workshops.map(workshop => this.enhanceWorkshopWithMarkdown(workshop))
    )
    
    return enhancedWorkshops
  }
}

// Export instance for use
export const workshopContentLoader = new WorkshopContentLoader()