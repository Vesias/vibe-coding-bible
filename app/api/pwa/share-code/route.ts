import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const title = formData.get('title') as string
    const text = formData.get('text') as string
    const url = formData.get('url') as string
    const files = formData.getAll('code_file') as File[]

    // Get authenticated user
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      // For non-authenticated users, redirect to auth
      return NextResponse.redirect(new URL('/auth/signin?redirect=/share-code', request.url))
    }

    // Process shared content
    let sharedCode = text || ''
    let fileName = 'shared-code.txt'
    
    // If files were shared, process the first one
    if (files.length > 0) {
      const file = files[0]
      fileName = file.name
      sharedCode = await file.text()
    }

    // Determine programming language from file extension
    const fileExtension = fileName.split('.').pop()?.toLowerCase()
    const languageMap: Record<string, string> = {
      js: 'javascript',
      ts: 'typescript',
      jsx: 'javascript',
      tsx: 'typescript',
      py: 'python',
      java: 'java',
      cpp: 'cpp',
      c: 'c',
      cs: 'csharp',
      php: 'php',
      rb: 'ruby',
      go: 'go',
      rs: 'rust',
      kt: 'kotlin',
      swift: 'swift'
    }
    
    const detectedLanguage = languageMap[fileExtension || ''] || 'text'

    // Save shared content to database
    const { data: sharedContent, error } = await supabase
      .from('shared_code')
      .insert({
        user_id: user.id,
        title: title || fileName,
        content: sharedCode,
        language: detectedLanguage,
        file_name: fileName,
        source_url: url,
        shared_via: 'pwa_share_target',
        is_public: false // Default to private, user can change later
      })
      .select()
      .single()

    if (error) {
      throw error
    }

    // Redirect to code sharing page with the new content
    const redirectUrl = new URL('/community/share', request.url)
    redirectUrl.searchParams.set('shared_id', sharedContent.id)
    
    return NextResponse.redirect(redirectUrl)

  } catch (error) {
    console.error('Share target error:', error)
    
    // Redirect to error page or fallback
    const errorUrl = new URL('/community', request.url)
    errorUrl.searchParams.set('error', 'share_failed')
    
    return NextResponse.redirect(errorUrl)
  }
}

export async function GET(request: NextRequest) {
  // Handle GET requests to the share endpoint
  const { searchParams } = new URL(request.url)
  const sharedId = searchParams.get('shared_id')
  
  if (!sharedId) {
    return NextResponse.redirect(new URL('/community', request.url))
  }

  try {
    const supabase = createClient()
    
    // Get shared content
    const { data: sharedContent, error } = await supabase
      .from('shared_code')
      .select('*')
      .eq('id', sharedId)
      .single()

    if (error || !sharedContent) {
      throw new Error('Shared content not found')
    }

    // Return HTML page for shared content
    const html = `
<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Geteilter Code - ${sharedContent.title}</title>
  <link rel="manifest" href="/manifest.json">
  <meta name="theme-color" content="#FFD700">
  <style>
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      background: linear-gradient(135deg, #0A0A0A 0%, #1A1A2E 50%, #16213E 100%);
      color: #E8E9EA;
      margin: 0;
      padding: 20px;
      min-height: 100vh;
    }
    
    .container {
      max-width: 800px;
      margin: 0 auto;
      background: rgba(0, 0, 0, 0.4);
      backdrop-filter: blur(10px);
      border-radius: 20px;
      border: 1px solid rgba(255, 215, 0, 0.3);
      padding: 30px;
    }
    
    .header {
      text-align: center;
      margin-bottom: 30px;
    }
    
    .title {
      font-size: 2rem;
      font-weight: 700;
      background: linear-gradient(135deg, #FFD700, #00BFFF);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      margin-bottom: 10px;
    }
    
    .meta {
      display: flex;
      gap: 20px;
      justify-content: center;
      margin-bottom: 20px;
      font-size: 0.9rem;
      color: #B0B3B8;
    }
    
    .code-container {
      background: #1E1E1E;
      border-radius: 12px;
      padding: 20px;
      border: 1px solid rgba(255, 215, 0, 0.2);
      margin-bottom: 20px;
    }
    
    .code {
      font-family: 'Fira Code', 'Courier New', monospace;
      font-size: 0.9rem;
      line-height: 1.5;
      white-space: pre-wrap;
      overflow-x: auto;
      color: #E8E9EA;
    }
    
    .actions {
      display: flex;
      gap: 15px;
      justify-content: center;
      flex-wrap: wrap;
    }
    
    .button {
      display: inline-block;
      padding: 12px 24px;
      background: linear-gradient(135deg, #FFD700, #FFA500);
      color: #000;
      text-decoration: none;
      border-radius: 12px;
      font-weight: 600;
      transition: all 0.3s ease;
      border: none;
      cursor: pointer;
    }
    
    .button:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(255, 215, 0, 0.3);
    }
    
    .button.secondary {
      background: transparent;
      border: 2px solid #FFD700;
      color: #FFD700;
    }
    
    @media (max-width: 768px) {
      .container { padding: 20px; }
      .title { font-size: 1.5rem; }
      .meta { flex-direction: column; gap: 10px; }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 class="title">${sharedContent.title}</h1>
      <div class="meta">
        <span>📁 ${sharedContent.file_name}</span>
        <span>💻 ${sharedContent.language}</span>
        <span>📅 ${new Date(sharedContent.created_at).toLocaleDateString('de-DE')}</span>
      </div>
    </div>
    
    <div class="code-container">
      <pre class="code">${sharedContent.content}</pre>
    </div>
    
    <div class="actions">
      <a href="/community" class="button">
        🏠 Zur Community
      </a>
      <button onclick="copyCode()" class="button secondary">
        📋 Code kopieren
      </button>
      <a href="/ai-mentor" class="button secondary">
        🤖 Mit AI analysieren
      </a>
    </div>
  </div>
  
  <script>
    function copyCode() {
      const code = document.querySelector('.code').textContent;
      navigator.clipboard.writeText(code).then(() => {
        alert('Code in die Zwischenablage kopiert!');
      });
    }
    
    // Register service worker if available
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js');
    }
  </script>
</body>
</html>
    `

    return new NextResponse(html, {
      headers: {
        'Content-Type': 'text/html',
      },
    })

  } catch (error) {
    console.error('Get shared content error:', error)
    return NextResponse.redirect(new URL('/community?error=content_not_found', request.url))
  }
}