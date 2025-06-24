'use client'

import React, { useState } from 'react'
import { Play, RotateCcw, Copy, Check } from 'lucide-react'

interface CodePlaygroundProps {
  initialCode?: string
  language?: 'javascript' | 'typescript' | 'python' | 'html'
  title?: string
  description?: string
  expectedOutput?: string
  className?: string
}

export const CodePlayground: React.FC<CodePlaygroundProps> = ({
  initialCode = '',
  language = 'javascript',
  title = 'Code Playground',
  description,
  expectedOutput,
  className = ''
}) => {
  const [code, setCode] = useState(initialCode)
  const [output, setOutput] = useState('')
  const [isRunning, setIsRunning] = useState(false)
  const [copied, setCopied] = useState(false)

  const runCode = async () => {
    setIsRunning(true)
    
    // Simulate code execution
    try {
      // This is a simplified simulation - in a real implementation,
      // you would use a proper code execution service
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      if (language === 'javascript') {
        // Simple eval for demonstration (not recommended for production)
        try {
          const result = eval(code)
          setOutput(result?.toString() || 'Code executed successfully')
        } catch (error) {
          setOutput(`Error: ${error instanceof Error ? error.message : String(error)}`)
        }
      } else {
        setOutput('Code execution simulation completed')
      }
    } catch (error) {
      setOutput(`Error: ${error instanceof Error ? error.message : String(error)}`)
    }
    
    setIsRunning(false)
  }

  const resetCode = () => {
    setCode(initialCode)
    setOutput('')
  }

  const copyCode = async () => {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy code:', error)
    }
  }

  return (
    <div className={`border border-gray-200 rounded-lg overflow-hidden ${className}`}>
      {/* Header */}
      <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-gray-800">{title}</h3>
            {description && (
              <p className="text-sm text-gray-600 mt-1">{description}</p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={copyCode}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded-md transition-colors"
              aria-label="Code kopieren"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </button>
            <button
              onClick={resetCode}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded-md transition-colors"
              aria-label="Code zurücksetzen"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={runCode}
              disabled={isRunning}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              aria-label="Code ausführen"
            >
              <Play className="w-4 h-4" />
              {isRunning ? 'Läuft...' : 'Ausführen'}
            </button>
          </div>
        </div>
      </div>

      {/* Code Editor */}
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[400px]">
        <div className="relative">
          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full h-full p-4 font-mono text-sm resize-none border-none outline-none focus:ring-2 focus:ring-blue-500"
            placeholder={`Schreibe deinen ${language} Code hier...`}
            spellCheck={false}
            aria-label="Code Editor"
          />
        </div>

        {/* Output Panel */}
        <div className="border-l border-gray-200 bg-gray-50">
          <div className="p-4 border-b border-gray-200 bg-gray-100">
            <h4 className="font-medium text-gray-700">Ausgabe</h4>
          </div>
          <div className="p-4">
            {isRunning ? (
              <div className="flex items-center gap-2 text-blue-600">
                <div className="animate-spin w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
                Code wird ausgeführt...
              </div>
            ) : output ? (
              <pre className="text-sm text-gray-800 whitespace-pre-wrap font-mono">
                {output}
              </pre>
            ) : (
              <p className="text-gray-500 text-sm italic">
                Klicke auf "Ausführen" um deinen Code zu testen
              </p>
            )}
          </div>
          
          {expectedOutput && (
            <div className="border-t border-gray-200 p-4 bg-green-50">
              <h5 className="font-medium text-green-800 mb-2">Erwartete Ausgabe:</h5>
              <pre className="text-sm text-green-700 font-mono">
                {expectedOutput}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CodePlayground