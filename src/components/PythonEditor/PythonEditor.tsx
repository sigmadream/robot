'use client'

import { useState, useEffect, useRef, useCallback } from 'react'

interface PythonEditorProps {
  initialCode: string
  generatedCode: string
  onRunCode: (code: string) => Promise<void>
  isRunning: boolean
  onCodeChange?: (code: string) => void
}

declare global {
  interface Window {
    loadPyodide: () => Promise<any>
    pyodide: any
  }
}

export default function PythonEditor({
  initialCode,
  generatedCode,
  onRunCode,
  isRunning,
  onCodeChange,
}: PythonEditorProps) {
  const [code, setCode] = useState(initialCode)
  const [output, setOutput] = useState<string[]>([])
  const [pyodideReady, setPyodideReady] = useState(false)
  const [pyodideLoading, setPyodideLoading] = useState(false)
  const [useGeneratedCode, setUseGeneratedCode] = useState(true)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Pyodide 로드
  useEffect(() => {
    const loadPyodideScript = async () => {
      if (window.pyodide) {
        setPyodideReady(true)
        return
      }

      if (pyodideLoading) return
      setPyodideLoading(true)

      // Pyodide 스크립트 로드
      const script = document.createElement('script')
      script.src = 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.js'
      script.async = true
      script.onload = async () => {
        try {
          const pyodide = await window.loadPyodide()
          window.pyodide = pyodide
          setPyodideReady(true)
          setOutput(prev => [...prev, '# Pyodide 로드 완료! Python 실행 준비됨'])
        } catch (error) {
          setOutput(prev => [...prev, `# Pyodide 로드 실패: ${error}`])
        }
        setPyodideLoading(false)
      }
      document.head.appendChild(script)
    }

    loadPyodideScript()
  }, [pyodideLoading])

  // 생성된 코드가 변경되면 업데이트
  useEffect(() => {
    if (useGeneratedCode && generatedCode) {
      setCode(generatedCode)
    }
  }, [generatedCode, useGeneratedCode])

  const handleCodeChange = useCallback((newCode: string) => {
    setCode(newCode)
    setUseGeneratedCode(false)
    if (onCodeChange) {
      onCodeChange(newCode)
    }
  }, [onCodeChange])

  const syncWithBlocks = () => {
    setCode(generatedCode)
    setUseGeneratedCode(true)
  }

  const runCode = async () => {
    setOutput([])
    setOutput(prev => [...prev, '# 실행 중...'])

    try {
      await onRunCode(code)
      setOutput(prev => [...prev, '# 실행 완료!'])
    } catch (error) {
      if ((error as Error).message === 'STOP_REQUESTED') {
        setOutput(prev => [...prev, '# 중지됨'])
      } else {
        setOutput(prev => [...prev, `# 오류: ${error}`])
      }
    }
  }

  const clearOutput = () => {
    setOutput([])
  }

  // 줄 번호 계산
  const lineCount = code.split('\n').length

  return (
    <div className="flex flex-col h-full bg-gray-900">
      {/* 툴바 */}
      <div className="flex items-center justify-between px-3 py-2 bg-gray-800 border-b border-gray-700">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-white">Python 에디터</span>
          {!pyodideReady && (
            <span className="text-xs text-yellow-400 animate-pulse">
              (Pyodide 로딩 중...)
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={syncWithBlocks}
            className="px-3 py-1 text-xs bg-gray-700 hover:bg-gray-600 text-gray-300 rounded transition-colors"
            title="블록에서 생성된 코드로 동기화"
          >
            블록 동기화
          </button>
          <button
            onClick={clearOutput}
            className="px-3 py-1 text-xs bg-gray-700 hover:bg-gray-600 text-gray-300 rounded transition-colors"
          >
            출력 지우기
          </button>
        </div>
      </div>

      {/* 에디터 영역 */}
      <div className="flex-1 flex overflow-hidden">
        {/* 코드 에디터 */}
        <div className="flex-1 flex overflow-hidden">
          {/* 줄 번호 */}
          <div className="bg-gray-800 text-gray-500 text-xs font-mono py-3 px-2 select-none overflow-hidden border-r border-gray-700">
            {Array.from({ length: lineCount }, (_, i) => (
              <div key={i} className="leading-6 text-right pr-2">
                {i + 1}
              </div>
            ))}
          </div>

          {/* 텍스트 에디터 */}
          <textarea
            ref={textareaRef}
            value={code}
            onChange={(e) => handleCodeChange(e.target.value)}
            className="flex-1 bg-gray-900 text-green-400 font-mono text-sm p-3 resize-none outline-none leading-6"
            style={{ tabSize: 4 }}
            spellCheck={false}
            placeholder="# Python 코드를 작성하세요..."
          />
        </div>
      </div>

      {/* 출력 영역 */}
      <div className="h-32 bg-gray-800 border-t border-gray-700 overflow-auto">
        <div className="px-3 py-1 bg-gray-700 text-xs text-gray-400 sticky top-0">
          출력
        </div>
        <pre className="p-3 text-xs font-mono text-gray-300 whitespace-pre-wrap">
          {output.length > 0 ? output.join('\n') : '# 실행 결과가 여기에 표시됩니다'}
        </pre>
      </div>
    </div>
  )
}
