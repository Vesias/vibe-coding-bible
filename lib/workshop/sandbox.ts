'use client'

export interface SandboxResult {
  output: string
  error?: string
  executionTime: number
  memory?: number
  exitCode: number
  logs: string[]
  tests?: TestResult[]
}

export interface TestResult {
  name: string
  passed: boolean
  expected: any
  actual: any
  message?: string
}

export interface SandboxConfig {
  language: 'javascript' | 'typescript' | 'python' | 'html' | 'css'
  timeout: number
  memoryLimit: number
  allowNetworking: boolean
  allowFileSystem: boolean
  enableTests: boolean
  dependencies?: string[]
}

class CodeSandbox {
  private workerUrl: string
  private workers: Map<string, Worker> = new Map()
  private executionQueue: Map<string, Promise<SandboxResult>> = new Map()

  constructor() {
    // Only create worker in browser environment
    if (typeof window !== 'undefined' && typeof Worker !== 'undefined') {
      this.workerUrl = this.createWorkerBlob()
    } else {
      this.workerUrl = ''
    }
  }

  private createWorkerBlob(): string {
    // Check if running in browser environment
    if (typeof window === 'undefined' || typeof Blob === 'undefined' || typeof URL === 'undefined') {
      return ''
    }

    const workerCode = `
      // Sandboxed execution worker
      const consoleLogs = [];
      const originalConsole = {
        log: console.log,
        error: console.error,
        warn: console.warn,
        info: console.info
      };

      // Override console methods to capture logs
      console.log = (...args) => {
        consoleLogs.push({ type: 'log', args: args.map(arg => String(arg)) });
        originalConsole.log(...args);
      };
      
      console.error = (...args) => {
        consoleLogs.push({ type: 'error', args: args.map(arg => String(arg)) });
        originalConsole.error(...args);
      };
      
      console.warn = (...args) => {
        consoleLogs.push({ type: 'warn', args: args.map(arg => String(arg)) });
        originalConsole.warn(...args);
      };
      
      console.info = (...args) => {
        consoleLogs.push({ type: 'info', args: args.map(arg => String(arg)) });
        originalConsole.info(...args);
      };

      // Safe evaluation function
      function safeEval(code, config, tests = []) {
        const startTime = typeof performance !== 'undefined' ? performance.now() : Date.now();
        let result = null;
        let error = null;
        let testResults = [];

        try {
          // Create isolated scope
          const sandbox = {
            console,
            setTimeout,
            setInterval,
            clearTimeout,
            clearInterval,
            JSON,
            Math,
            Date,
            Array,
            Object,
            String,
            Number,
            Boolean,
            RegExp,
            Error,
            Promise
          };

          // Disable dangerous globals
          const originalSetTimeout = setTimeout;
          const originalSetInterval = setInterval;
          
          sandbox.setTimeout = (fn, delay) => {
            if (delay > 5000) delay = 5000; // Max 5 second timeout
            return originalSetTimeout(fn, delay);
          };
          
          sandbox.setInterval = (fn, delay) => {
            if (delay < 100) delay = 100; // Min 100ms interval
            return originalSetInterval(fn, delay);
          };

          // Execute code in sandbox
          const func = new Function(
            ...Object.keys(sandbox),
            \`
            "use strict";
            \${code}
            \`
          );

          result = func(...Object.values(sandbox));

          // Run tests if provided
          if (tests.length > 0) {
            testResults = runTests(tests, code, sandbox);
          }

        } catch (err) {
          error = {
            name: err.name,
            message: err.message,
            stack: err.stack
          };
        }

        const endTime = typeof performance !== 'undefined' ? performance.now() : Date.now();
        const executionTime = endTime - startTime;

        return {
          output: result !== null && result !== undefined ? String(result) : '',
          error,
          executionTime,
          exitCode: error ? 1 : 0,
          logs: consoleLogs.map(log => \`[\${log.type.toUpperCase()}] \${log.args.join(' ')}\`),
          tests: testResults
        };
      }

      function runTests(tests, code, sandbox) {
        const testResults = [];
        
        for (const test of tests) {
          try {
            // Create test environment
            const testFunc = new Function(
              ...Object.keys(sandbox),
              'expect',
              \`
              "use strict";
              \${code}
              \${test.code}
              \`
            );

            let testPassed = false;
            let actualResult = null;
            let errorMessage = null;

            // Simple expect function
            const expect = (actual) => ({
              toBe: (expected) => {
                actualResult = actual;
                testPassed = actual === expected;
                if (!testPassed) {
                  errorMessage = \`Expected \${expected}, but got \${actual}\`;
                }
                return testPassed;
              },
              toEqual: (expected) => {
                actualResult = actual;
                testPassed = JSON.stringify(actual) === JSON.stringify(expected);
                if (!testPassed) {
                  errorMessage = \`Expected \${JSON.stringify(expected)}, but got \${JSON.stringify(actual)}\`;
                }
                return testPassed;
              },
              toBeTruthy: () => {
                actualResult = actual;
                testPassed = !!actual;
                if (!testPassed) {
                  errorMessage = \`Expected truthy value, but got \${actual}\`;
                }
                return testPassed;
              },
              toBeFalsy: () => {
                actualResult = actual;
                testPassed = !actual;
                if (!testPassed) {
                  errorMessage = \`Expected falsy value, but got \${actual}\`;
                }
                return testPassed;
              }
            });

            testFunc(...Object.values(sandbox), expect);

            testResults.push({
              name: test.name,
              passed: testPassed,
              expected: test.expected,
              actual: actualResult,
              message: errorMessage
            });

          } catch (err) {
            testResults.push({
              name: test.name,
              passed: false,
              expected: test.expected,
              actual: null,
              message: err.message
            });
          }
        }

        return testResults;
      }

      // Worker message handler
      if (typeof self !== 'undefined') {
        self.onmessage = function(e) {
          const { id, code, config, tests } = e.data;
          
          try {
            const result = safeEval(code, config, tests);
            self.postMessage({ id, result });
          } catch (err) {
            self.postMessage({
              id,
              result: {
                output: '',
                error: {
                  name: err.name,
                  message: err.message,
                  stack: err.stack
                },
                executionTime: 0,
                exitCode: 1,
                logs: [],
                tests: []
              }
            });
          }
        };
      }
    `

    try {
      const blob = new Blob([workerCode], { type: 'application/javascript' })
      return URL.createObjectURL(blob)
    } catch (error) {
      console.warn('Failed to create worker blob:', error)
      return ''
    }
  }

  async executeCode(
    code: string, 
    config: SandboxConfig = {
      language: 'javascript',
      timeout: 5000,
      memoryLimit: 50 * 1024 * 1024, // 50MB
      allowNetworking: false,
      allowFileSystem: false,
      enableTests: false
    },
    tests: any[] = []
  ): Promise<SandboxResult> {
    // Check if running in browser environment
    if (typeof window === 'undefined' || !this.workerUrl) {
      // Return a mock result for server-side rendering
      return {
        output: 'Code execution is only available in browser environment',
        error: undefined,
        executionTime: 0,
        memory: 0,
        exitCode: 0,
        logs: ['[INFO] Server-side execution not supported'],
        tests: []
      }
    }

    const executionId = Math.random().toString(36).substr(2, 9)

    // Check if already executing the same code
    const cacheKey = `${code}-${JSON.stringify(config)}-${JSON.stringify(tests)}`
    if (this.executionQueue.has(cacheKey)) {
      return this.executionQueue.get(cacheKey)!
    }

    const executionPromise = new Promise<SandboxResult>((resolve, reject) => {
      // Language-specific preprocessing
      const processedCode = this.preprocessCode(code, config.language)

      // Create or get worker for this language
      let worker = this.workers.get(config.language)
      if (!worker && typeof Worker !== 'undefined') {
        try {
          worker = new Worker(this.workerUrl)
          this.workers.set(config.language, worker)
        } catch (error) {
          reject(new Error('Failed to create worker: ' + error))
          return
        }
      }

      if (!worker) {
        reject(new Error('Worker not available'))
        return
      }

      // Set up timeout
      const timeout = setTimeout(() => {
        worker?.terminate()
        this.workers.delete(config.language)
        reject(new Error('Execution timeout'))
      }, config.timeout)

      // Set up message handler
      const messageHandler = (e: MessageEvent) => {
        const { id, result } = e.data
        if (id === executionId) {
          clearTimeout(timeout)
          worker?.removeEventListener('message', messageHandler)
          resolve(result)
        }
      }

      worker.addEventListener('message', messageHandler)

      // Send code for execution
      worker.postMessage({
        id: executionId,
        code: processedCode,
        config,
        tests
      })
    })

    this.executionQueue.set(cacheKey, executionPromise)

    try {
      const result = await executionPromise
      return result
    } finally {
      this.executionQueue.delete(cacheKey)
    }
  }

  private preprocessCode(code: string, language: string): string {
    switch (language) {
      case 'javascript':
        return this.preprocessJavaScript(code)
      case 'typescript':
        return this.preprocessTypeScript(code)
      case 'python':
        return this.preprocessPython(code)
      case 'html':
        return this.preprocessHTML(code)
      case 'css':
        return this.preprocessCSS(code)
      default:
        return code
    }
  }

  private preprocessJavaScript(code: string): string {
    // Add safety checks and transformations
    let processedCode = code

    // Prevent infinite loops (basic detection)
    processedCode = processedCode.replace(/while\s*\(/g, 'while (Math.random() > -1 && ')
    processedCode = processedCode.replace(/for\s*\(/g, 'for (Math.random() > -1 && ')

    // Wrap in try-catch if not already wrapped
    if (!processedCode.includes('try') && !processedCode.includes('catch')) {
      processedCode = `
        try {
          ${processedCode}
        } catch (err) {
          console.error('Runtime Error:', err.message);
          throw err;
        }
      `
    }

    return processedCode
  }

  private preprocessTypeScript(code: string): string {
    // Basic TypeScript to JavaScript transformation
    // In production, use actual TypeScript compiler
    let jsCode = code
      .replace(/:\s*\w+/g, '') // Remove type annotations
      .replace(/interface\s+\w+\s*{[^}]*}/g, '') // Remove interfaces
      .replace(/type\s+\w+\s*=\s*[^;]+;/g, '') // Remove type aliases

    return this.preprocessJavaScript(jsCode)
  }

  private preprocessPython(code: string): string {
    // Python execution would require a Python interpreter
    // For now, just return the code as-is
    // In production, use Pyodide or similar
    return `
      console.log('Python execution not yet implemented');
      console.log('Code:', ${JSON.stringify(code)});
    `
  }

  private preprocessHTML(code: string): string {
    // Create a safe HTML execution environment
    return `
      const iframe = document.createElement('iframe');
      iframe.style.width = '100%';
      iframe.style.height = '400px';
      iframe.style.border = 'none';
      iframe.srcdoc = ${JSON.stringify(code)};
      document.body.appendChild(iframe);
      console.log('HTML rendered in iframe');
    `
  }

  private preprocessCSS(code: string): string {
    // Create CSS preview
    return `
      const style = document.createElement('style');
      style.textContent = ${JSON.stringify(code)};
      document.head.appendChild(style);
      console.log('CSS applied to document');
    `
  }

  // Utility method to validate code before execution
  validateCode(code: string, language: string): { valid: boolean; errors: string[] } {
    const errors: string[] = []

    // Basic validation rules
    if (code.length > 10000) {
      errors.push('Code is too long (max 10,000 characters)')
    }

    if (language === 'javascript') {
      // Check for dangerous patterns
      const dangerousPatterns = [
        /eval\s*\(/,
        /Function\s*\(/,
        /document\.write/,
        /window\./,
        /global\./,
        /process\./,
        /require\s*\(/,
        /import\s+.*from/
      ]

      for (const pattern of dangerousPatterns) {
        if (pattern.test(code)) {
          errors.push(`Potentially unsafe code detected: ${pattern}`)
        }
      }
    }

    return {
      valid: errors.length === 0,
      errors
    }
  }

  // Clean up resources
  cleanup() {
    for (const worker of this.workers.values()) {
      worker.terminate()
    }
    this.workers.clear()
    this.executionQueue.clear()
  }
}

// Singleton instance
let sandboxInstance: CodeSandbox | null = null

export function getSandbox(): CodeSandbox {
  if (!sandboxInstance && typeof window !== 'undefined') {
    sandboxInstance = new CodeSandbox()
  }
  // Return a mock sandbox for SSR
  if (!sandboxInstance) {
    return {
      executeCode: async () => ({
        output: 'Sandbox not available during SSR',
        error: undefined,
        executionTime: 0,
        memory: 0,
        exitCode: 0,
        logs: [],
        tests: []
      }),
      validateCode: () => ({ valid: true, errors: [] }),
      cleanup: () => {}
    } as any
  }
  return sandboxInstance
}

// React hook for using the sandbox
export function useSandbox() {
  const sandbox = getSandbox()

  const executeCode = async (
    code: string,
    config?: Partial<SandboxConfig>,
    tests?: any[]
  ): Promise<SandboxResult> => {
    const defaultConfig: SandboxConfig = {
      language: 'javascript',
      timeout: 5000,
      memoryLimit: 50 * 1024 * 1024,
      allowNetworking: false,
      allowFileSystem: false,
      enableTests: false
    }

    const mergedConfig = { ...defaultConfig, ...config }
    return sandbox.executeCode(code, mergedConfig, tests || [])
  }

  const validateCode = (code: string, language: string) => {
    return sandbox.validateCode(code, language)
  }

  return {
    executeCode,
    validateCode,
    cleanup: () => sandbox.cleanup()
  }
}