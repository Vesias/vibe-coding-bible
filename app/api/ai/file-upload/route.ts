import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getServerAIProvider } from '@/lib/ai/server-provider'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const personality = formData.get('personality') as string
    const analysisType = formData.get('analysisType') as string || 'general'
    
    // Get authenticated user
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json(
        { error: 'Authentication required for file analysis' },
        { status: 401 }
      )
    }
    
    // Validate file
    if (!file) {
      return NextResponse.json(
        { error: 'File is required' },
        { status: 400 }
      )
    }
    
    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File size must be less than 10MB' },
        { status: 400 }
      )
    }
    
    // Check file type
    const allowedTypes = [
      'text/plain',
      'text/javascript',
      'text/typescript',
      'text/html',
      'text/css',
      'application/json',
      'text/markdown',
      'text/x-python',
      'text/x-java-source',
      'text/x-c',
      'text/x-c++',
      'text/x-php'
    ]
    
    const fileExtension = file.name.split('.').pop()?.toLowerCase()
    const supportedExtensions = [
      'js', 'ts', 'jsx', 'tsx', 'py', 'java', 'c', 'cpp', 'php', 
      'html', 'css', 'json', 'md', 'txt', 'sql', 'go', 'rs', 'rb'
    ]
    
    if (!supportedExtensions.includes(fileExtension || '')) {
      return NextResponse.json(
        { error: 'Unsupported file type. Please upload code files (.js, .ts, .py, etc.)' },
        { status: 400 }
      )
    }
    
    // Read file content
    const fileContent = await file.text()
    
    if (fileContent.length > 50000) {
      return NextResponse.json(
        { error: 'File content is too large. Please upload files smaller than 50KB.' },
        { status: 400 }
      )
    }
    
    // Initialize AI provider
    const aiProvider = getServerAIProvider()
    
    // Analyze file content based on analysis type
    let analysisPrompt = ''
    
    switch (analysisType) {
      case 'code-review':
        analysisPrompt = `Bitte führe eine umfassende Code-Review für diese Datei durch:\n\nDateiname: ${file.name}\nInhalt:\n\`\`\`${fileExtension}\n${fileContent}\n\`\`\``
        break
      case 'security-audit':
        analysisPrompt = `Bitte führe ein Sicherheits-Audit für diese Datei durch und identifiziere potenzielle Sicherheitslücken:\n\nDateiname: ${file.name}\nInhalt:\n\`\`\`${fileExtension}\n${fileContent}\n\`\`\``
        break
      case 'optimization':
        analysisPrompt = `Bitte analysiere diese Datei und gib Optimierungsvorschläge für Performance und Code-Qualität:\n\nDateiname: ${file.name}\nInhalt:\n\`\`\`${fileExtension}\n${fileContent}\n\`\`\``
        break
      case 'documentation':
        analysisPrompt = `Bitte erstelle eine umfassende Dokumentation für diese Code-Datei:\n\nDateiname: ${file.name}\nInhalt:\n\`\`\`${fileExtension}\n${fileContent}\n\`\`\``
        break
      default:
        analysisPrompt = `Bitte analysiere diese Datei und gib eine detaillierte Bewertung ab:\n\nDateiname: ${file.name}\nInhalt:\n\`\`\`${fileExtension}\n${fileContent}\n\`\`\``
    }
    
    // Generate AI analysis
    const response = await aiProvider.generateResponse([
      {
        role: 'user',
        content: analysisPrompt
      }
    ], {
      personality: personality || 'King Solomon the Debugger',
      model: 'claude-3-5-sonnet',
      temperature: 0.3,
      maxTokens: 3000
    })
    
    // Extract code snippets if any
    const codeSnippets = response.codeSnippets || []
    
    // Save file analysis to database
    try {
      await supabase
        .from('file_analyses')
        .insert({
          user_id: user.id,
          filename: file.name,
          file_size: file.size,
          file_type: fileExtension,
          analysis_type: analysisType,
          personality: personality || 'King Solomon the Debugger',
          content_length: fileContent.length,
          analysis_result: {
            content: response.content,
            codeSnippets,
            model: response.model,
            tokensUsed: response.tokensUsed,
            executionTime: response.executionTime
          }
        })
    } catch (error) {
      console.warn('Failed to save file analysis:', error)
    }
    
    return NextResponse.json({
      filename: file.name,
      analysisType,
      personality: personality || 'King Solomon the Debugger',
      analysis: {
        content: response.content,
        codeSnippets,
        suggestions: [
          'Frage nach spezifischen Code-Abschnitten',
          'Bitte um Verbesserungsvorschläge',
          'Erkläre komplexe Funktionen',
          'Zeige alternative Implementierungen'
        ]
      },
      metadata: {
        model: response.model,
        tokensUsed: response.tokensUsed,
        executionTime: response.executionTime,
        fileSize: file.size,
        linesOfCode: fileContent.split('\n').length
      }
    })
    
  } catch (error) {
    console.error('File Upload API Error:', error)
    
    return NextResponse.json(
      { 
        error: 'Failed to analyze file',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'File Upload API is running',
    maxFileSize: '10MB',
    supportedFormats: [
      '.js', '.ts', '.jsx', '.tsx', '.py', '.java', '.c', '.cpp', '.php',
      '.html', '.css', '.json', '.md', '.txt', '.sql', '.go', '.rs', '.rb'
    ],
    analysisTypes: [
      'general',
      'code-review',
      'security-audit',
      'optimization',
      'documentation'
    ],
    features: [
      'Automated code review',
      'Security vulnerability detection',
      'Performance optimization suggestions',
      'Auto-documentation generation',
      'Best practices recommendations'
    ]
  })
}