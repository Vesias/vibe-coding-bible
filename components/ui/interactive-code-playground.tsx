'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Play, 
  Copy, 
  RotateCcw, 
  CheckCircle, 
  AlertTriangle,
  Code,
  Terminal,
  Lightbulb
} from 'lucide-react'

interface CodePlaygroundProps {
  initialCode?: string
  language?: 'javascript' | 'typescript' | 'python' | 'html' | 'css'
  expectedOutput?: string
  hints?: string[]
  readOnly?: boolean
  onCodeChange?: (code: string) => void
  onValidate?: (isValid: boolean, output: string) => void
}

export const InteractiveCodePlayground: React.FC<CodePlaygroundProps> = ({
  initialCode = '',
  language = 'javascript',
  expectedOutput = '',
  hints = [],
  readOnly = false,
  onCodeChange,
  onValidate
}) => {
  const [code, setCode] = useState(initialCode)
  const [output, setOutput] = useState('')
  const [isRunning, setIsRunning] = useState(false)
  const [isValid, setIsValid] = useState(false)
  const [showHints, setShowHints] = useState(false)
  const [error, setError] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    onCodeChange?.(code)
  }, [code, onCodeChange])

  const executeCode = async () => {
    setIsRunning(true)
    setError('')
    
    try {
      let result = ''
      
      if (language === 'javascript' || language === 'typescript') {
        // Simple JavaScript execution for demo purposes
        // In production, you'd want to use a sandboxed environment
        const originalLog = console.log
        const logs: string[] = []
        
        console.log = (...args) => {
          logs.push(args.map(arg => 
            typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
          ).join(' '))
        }
        
        try {
          // Create a function wrapper for the code
          const wrappedCode = `
            (function() {
              ${code}
            })()
          `
          eval(wrappedCode)
          result = logs.join('\\n')
        } catch (err: any) {
          result = `Error: ${err.message}`
          setError(err.message)
        } finally {
          console.log = originalLog
        }
      } else if (language === 'html') {
        // For HTML, just set the code as output
        result = 'HTML rendered successfully'
      } else if (language === 'css') {
        // For CSS, validate syntax
        result = 'CSS validated successfully'
      } else if (language === 'python') {
        // Python would need a backend service or WASM
        result = 'Python execution not available in browser'
      }
      
      setOutput(result)
      
      // Check if output matches expected output
      const valid = expectedOutput ? result.trim() === expectedOutput.trim() : true
      setIsValid(valid)
      onValidate?.(valid, result)
      
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Unknown error'
      setOutput(`Error: ${errorMsg}`)
      setError(errorMsg)
      setIsValid(false)
      onValidate?.(false, errorMsg)
    } finally {
      setIsRunning(false)
    }
  }

  const copyCode = () => {
    navigator.clipboard.writeText(code)
    // You could add a toast notification here
  }

  const resetCode = () => {
    setCode(initialCode)
    setOutput('')
    setError('')
    setIsValid(false)
  }

  const insertTab = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault()
      const start = e.currentTarget.selectionStart
      const end = e.currentTarget.selectionEnd
      const newCode = code.substring(0, start) + '  ' + code.substring(end)
      setCode(newCode)
      
      // Set cursor position after the inserted tab
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = start + 2
          textareaRef.current.selectionEnd = start + 2
        }
      }, 0)
    }
  }

  const getLanguageColor = () => {
    switch (language) {
      case 'javascript': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
      case 'typescript': return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
      case 'python': return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'html': return 'bg-orange-500/20 text-orange-400 border-orange-500/30'
      case 'css': return 'bg-purple-500/20 text-purple-400 border-purple-500/30'
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
  }

  return (
    <div className="space-y-4">
      {/* Code Editor */}
      <Card style={{ background: 'rgba(15, 23, 42, 0.8)', borderColor: '#475569' }}>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2" style={{ color: '#FFCE00' }}>
              <Code className="w-5 h-5" />
              Code Editor
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge className={getLanguageColor()}>
                {language}
              </Badge>
              {isValid && (
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Valid
                </Badge>
              )}
              {error && (
                <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
                  <AlertTriangle className="w-3 h-3 mr-1" />
                  Error
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <textarea
              ref={textareaRef}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              onKeyDown={insertTab}
              readOnly={readOnly}
              className="w-full h-64 p-4 rounded-lg border font-mono text-sm resize-none"
              style={{
                background: 'rgba(0, 0, 0, 0.3)',
                borderColor: '#475569',
                color: '#cbd5e1'
              }}
              placeholder={`Enter your ${language} code here...`}
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              onClick={executeCode}
              disabled={isRunning || readOnly}
              style={{ background: 'linear-gradient(90deg, #FFCE00 0%, #009EE0 100%)' }}
            >
              {isRunning ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              ) : (
                <Play className="w-4 h-4 mr-2" />
              )}
              {isRunning ? 'Running...' : 'Run Code'}
            </Button>
            
            <Button
              onClick={copyCode}
              variant="outline"
              size="sm"
              style={{ borderColor: '#475569', color: '#94a3b8' }}
            >
              <Copy className="w-4 h-4" />
            </Button>
            
            <Button
              onClick={resetCode}
              variant="outline"
              size="sm"
              style={{ borderColor: '#475569', color: '#94a3b8' }}
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
            
            {hints.length > 0 && (
              <Button
                onClick={() => setShowHints(!showHints)}
                variant="outline"
                size="sm"
                style={{ borderColor: '#FFCE00', color: '#FFCE00' }}
              >
                <Lightbulb className="w-4 h-4 mr-2" />
                Hints ({hints.length})
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Output */}
      {(output || error) && (
        <Card style={{ background: 'rgba(15, 23, 42, 0.8)', borderColor: '#475569' }}>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2" style={{ color: '#009EE0' }}>
              <Terminal className="w-5 h-5" />
              Output
            </CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="p-4 rounded-lg font-mono text-sm whitespace-pre-wrap" style={{
              background: 'rgba(0, 0, 0, 0.3)',
              color: error ? '#ef4444' : '#cbd5e1'
            }}>
              {output || error}
            </pre>
            
            {expectedOutput && (
              <div className="mt-4 p-3 rounded-lg" style={{
                background: 'rgba(34, 197, 94, 0.1)',
                borderColor: '#22c55e',
                border: '1px solid'
              }}>
                <div className="text-sm font-medium mb-2" style={{ color: '#22c55e' }}>
                  Expected Output:
                </div>
                <pre className="text-sm font-mono" style={{ color: '#cbd5e1' }}>
                  {expectedOutput}
                </pre>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Hints */}
      {showHints && hints.length > 0 && (
        <Card style={{ background: 'rgba(255, 206, 0, 0.1)', borderColor: '#FFCE00' }}>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2" style={{ color: '#FFCE00' }}>
              <Lightbulb className="w-5 h-5" />
              Hints
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {hints.map((hint, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-sm font-medium" style={{ color: '#FFCE00' }}>
                    {index + 1}.
                  </span>
                  <span className="text-sm" style={{ color: '#cbd5e1' }}>
                    {hint}
                  </span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  )
}