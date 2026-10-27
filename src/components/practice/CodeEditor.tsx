import { useMemo, useRef, type CSSProperties, type KeyboardEvent, type UIEvent } from 'react'
import { cn } from '@/utils/cn'

interface CodeEditorProps {
  value: string
  onChange?: (value: string) => void
  filename?: string
  statusText?: string
  fontSize?: number
  readOnly?: boolean
  onRun?: () => void
  onSave?: () => void
  className?: string
  minHeight?: number
}

const keywords = new Set([
  'and',
  'as',
  'assert',
  'break',
  'class',
  'continue',
  'def',
  'del',
  'elif',
  'else',
  'except',
  'False',
  'finally',
  'for',
  'from',
  'global',
  'if',
  'import',
  'in',
  'is',
  'lambda',
  'None',
  'nonlocal',
  'not',
  'or',
  'pass',
  'raise',
  'return',
  'True',
  'try',
  'while',
  'with',
  'yield',
])

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

function highlightPython(code: string) {
  const tokenPattern =
    /(#.*$)|("""[\s\S]*?"""|'''[\s\S]*?'''|"(?:\\.|[^"\\\n])*"|'(?:\\.|[^'\\\n])*')|\b(\d+(?:\.\d+)?)\b|\b([A-Za-z_]\w*)\b/gm
  let result = ''
  let cursor = 0
  let match: RegExpExecArray | null

  while ((match = tokenPattern.exec(code))) {
    result += escapeHtml(code.slice(cursor, match.index))
    const [full, comment, string, number, identifier] = match
    if (comment) {
      result += `<span class="tok-comment">${escapeHtml(comment)}</span>`
    } else if (string) {
      result += `<span class="tok-string">${escapeHtml(string)}</span>`
    } else if (number) {
      result += `<span class="tok-number">${escapeHtml(number)}</span>`
    } else if (identifier) {
      const after = code.slice(match.index + full.length)
      if (keywords.has(identifier)) {
        result += `<span class="tok-keyword">${identifier}</span>`
      } else if (/^\s*\(/.test(after)) {
        result += `<span class="tok-function">${identifier}</span>`
      } else {
        result += escapeHtml(identifier)
      }
    }
    cursor = match.index + full.length
  }
  result += escapeHtml(code.slice(cursor))
  return result
}

export function CodeEditor({
  value,
  onChange,
  filename = 'main.py',
  statusText = 'Python 3 · 已自动保存',
  fontSize = 14,
  readOnly = false,
  onRun,
  onSave,
  className,
  minHeight = 280,
}: CodeEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const highlightRef = useRef<HTMLPreElement>(null)
  const gutterRef = useRef<HTMLDivElement>(null)
  const lineCount = Math.max(1, value.split('\n').length)
  const highlighted = useMemo(() => highlightPython(value), [value])

  const syncScroll = (event: UIEvent<HTMLTextAreaElement>) => {
    const target = event.currentTarget
    if (highlightRef.current) {
      highlightRef.current.scrollTop = target.scrollTop
      highlightRef.current.scrollLeft = target.scrollLeft
    }
    if (gutterRef.current) {
      gutterRef.current.style.transform = `translateY(-${target.scrollTop}px)`
    }
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
      event.preventDefault()
      onRun?.()
      return
    }
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 's') {
      event.preventDefault()
      onSave?.()
      return
    }
    if (event.key === 'Tab' && !readOnly) {
      event.preventDefault()
      const target = event.currentTarget
      const start = target.selectionStart
      const end = target.selectionEnd
      const nextValue = `${value.slice(0, start)}    ${value.slice(end)}`
      onChange?.(nextValue)
      window.requestAnimationFrame(() => {
        target.selectionStart = target.selectionEnd = start + 4
      })
    }
  }

  return (
    <section
      className={cn('code-editor', className)}
      style={
        {
          '--editor-font-size': `${fontSize}px`,
          '--editor-min-height': `${minHeight}px`,
        } as CSSProperties
      }
    >
      <header className="code-editor-topbar">
        <span className="code-editor-filename">{filename}</span>
        <span className="code-editor-status">{statusText}</span>
      </header>
      <div className="code-editor-main">
        <div className="code-editor-gutter" aria-hidden="true">
          <div ref={gutterRef} className="code-editor-gutter-inner">
            {Array.from({ length: lineCount }, (_, index) => (
              <span key={index}>{index + 1}</span>
            ))}
          </div>
        </div>
        <div className="code-editor-scroll">
          <pre ref={highlightRef} className="code-editor-highlight" aria-hidden="true">
            <code dangerouslySetInnerHTML={{ __html: `${highlighted}\n` }} />
          </pre>
          <textarea
            ref={textareaRef}
            className="code-editor-textarea"
            value={value}
            readOnly={readOnly}
            spellCheck={false}
            autoCapitalize="off"
            autoCorrect="off"
            aria-label="Python 代码编辑器"
            onChange={(event) => onChange?.(event.target.value)}
            onScroll={syncScroll}
            onKeyDown={handleKeyDown}
          />
        </div>
      </div>
    </section>
  )
}
