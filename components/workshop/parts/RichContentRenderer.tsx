'use client'

interface RichContentRendererProps {
  content: string
  className?: string
}

export function RichContentRenderer({ content, className = '' }: RichContentRendererProps) {
  const renderContent = (text: string) => {
    // Process markdown-like content
    return text.split('\n').map((line, index) => {
      if (line.startsWith('# ')) {
        return <h1 key={index} className="text-3xl font-bold mb-6 text-white">{line.slice(2)}</h1>
      } else if (line.startsWith('## ')) {
        return <h2 key={index} className="text-2xl font-semibold mb-4 text-blue-100 mt-8">{line.slice(3)}</h2>
      } else if (line.startsWith('### ')) {
        return <h3 key={index} className="text-xl font-semibold mb-3 text-blue-200 mt-6">{line.slice(4)}</h3>
      } else if (line.startsWith('```')) {
        const nextClosingIndex = text.split('\n').findIndex((l, i) => i > index && l.startsWith('```'))
        if (nextClosingIndex > -1) {
          const codeLines = text.split('\n').slice(index + 1, nextClosingIndex)
          return (
            <div key={index} className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm overflow-x-auto my-4 border border-green-500/20">
              <pre>{codeLines.join('\n')}</pre>
            </div>
          )
        }
      } else if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
        return (
          <li key={index} className="text-blue-100 mb-2 ml-4">
            {line.trim().slice(2)}
          </li>
        )
      } else if (line.trim()) {
        return <p key={index} className="mb-4 text-blue-100 leading-relaxed">{line}</p>
      }
      return <br key={index} />
    })
  }

  return (
    <div className={`prose prose-invert max-w-none ${className}`}>
      {renderContent(content)}
    </div>
  )
}