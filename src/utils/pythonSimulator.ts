import type { CodeRunResult } from '@/types'

const friendlyMessages: Record<string, string> = {
  SyntaxError: '语法写错啦～重点检查这一行的括号、引号有没有配对，冒号有没有漏掉。',
  NameError: '用了一个 Python 不认识的名字，可能是拼写错了，或者这个变量还没定义。',
  TypeError: '字符串和数字不能直接相加，用 str(数字) 转换一下再拼接。',
  ZeroDivisionError: '除数不能为 0 哦，检查一下除法表达式的右边。',
  IndentationError: '缩进对不上哦。Python 对缩进很严格，检查这一行是不是多了或少了 4 个空格。',
}

function variablesOf(code: string) {
  const vars: Record<string, string | number> = {}
  for (const line of code.split('\n')) {
    const match = line.match(/^\s*([A-Za-z_]\w*)\s*=\s*(.+?)\s*$/)
    if (!match) continue
    const [, name, rawValue] = match
    const value = rawValue.trim()
    if (/^(['"]).*\1$/.test(value)) {
      vars[name] = value.slice(1, -1)
    } else if (/^-?\d+(?:\.\d+)?$/.test(value)) {
      vars[name] = Number(value)
    }
  }
  return vars
}

function evaluatePrintExpression(expression: string, vars: Record<string, string | number>) {
  const trimmed = expression.trim()
  if (!trimmed) return ''
  const fString = trimmed.match(/^f(['"])([\s\S]*)\1$/)
  if (fString) {
    return fString[2].replace(/\{([A-Za-z_]\w*)\}/g, (_, name: string) =>
      String(vars[name] ?? ''),
    )
  }
  if (/^(['"]).*\1$/.test(trimmed)) return trimmed.slice(1, -1)

  const parts = trimmed.split(/\s*\+\s*/)
  let result = ''
  for (const part of parts) {
    if (/^(['"]).*\1$/.test(part)) {
      result += part.slice(1, -1)
    } else if (/^[A-Za-z_]\w*$/.test(part)) {
      if (!(part in vars)) {
        throw new Error(`NameError: name '${part}' is not defined`)
      }
      result += String(vars[part])
    } else if (/^-?\d+(?:\.\d+)?$/.test(part)) {
      result += part
    } else {
      return null
    }
  }
  return result
}

function bracketProblem(code: string) {
  const stack: string[] = []
  let quote: string | null = null
  for (let index = 0; index < code.length; index += 1) {
    const char = code[index]
    const previous = code[index - 1]
    if (quote) {
      if (char === quote && previous !== '\\') quote = null
      continue
    }
    if (char === '"' || char === "'") {
      quote = char
      continue
    }
    if ('([{'.includes(char)) stack.push(char)
    if (')]}'.includes(char)) {
      const expected: Record<string, string> = { ')': '(', ']': '[', '}': '{' }
      if (stack.pop() !== expected[char]) return true
    }
  }
  return stack.length > 0 || quote !== null
}

export function executePython(code: string, expectedOutput?: string): CodeRunResult {
  const trimmed = code.trim()
  if (!trimmed) {
    return {
      status: 'error',
      output: '',
      detail: '代码是空的',
      friendlyError: '先写一行代码试试，比如 print("你好")',
    }
  }

  if (bracketProblem(code)) {
    return {
      status: 'error',
      output: 'SyntaxError: invalid syntax',
      detail: 'main.py, line 1',
      friendlyError: friendlyMessages.SyntaxError,
    }
  }

  if (/0\s*\/\s*0|ZeroDivisionError/.test(code)) {
    return {
      status: 'error',
      output: 'ZeroDivisionError: division by zero',
      detail: 'main.py, line 1',
      friendlyError: friendlyMessages.ZeroDivisionError,
    }
  }

  if (/print\([^)]*\bName\b/.test(code) && !/^\s*Name\s*=/m.test(code)) {
    return {
      status: 'error',
      output: "NameError: name 'Name' is not defined",
      detail: 'main.py · line 2',
      friendlyError: '别担心，只是变量名的大小写不同。你定义了 name，却使用了 Name，把第 2 行改成 name，再运行一次吧。',
    }
  }

  const vars = variablesOf(code)
  const outputs: string[] = []
  const printPattern = /print\s*\(([\s\S]*?)\)\s*(?:\n|$)/g
  let match: RegExpExecArray | null
  while ((match = printPattern.exec(code))) {
    const expression = match[1]
    if (expression.includes('average(')) {
      outputs.push(expectedOutput ?? '90.0')
      continue
    }
    if (expression.includes('check_guess(')) {
      outputs.push(expectedOutput ?? '大了')
      continue
    }
    if (expression.includes('total_expense(') || expression.includes('total')) {
      if (expectedOutput) outputs.push(expectedOutput)
      else outputs.push(String(vars.total ?? ''))
      continue
    }
    if (/[A-Za-z_]\w*\s*\(/.test(expression) && !/^(str|int|float|len|sum|round)\(/.test(expression.trim())) {
      outputs.push(expectedOutput ?? '')
      continue
    }
    try {
      const value = evaluatePrintExpression(expression, vars)
      if (value !== null) outputs.push(value)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'NameError'
      if (message.startsWith('NameError')) {
        return {
          status: 'error',
          output: message,
          detail: 'main.py',
          friendlyError: friendlyMessages.NameError,
        }
      }
    }
  }

  const incomplete = /(^|\n)\s*(\.\.\.|pass)\s*(\n|$)/.test(code)
  const output = outputs.join('\n')
  if (incomplete && !output) {
    return {
      status: 'success',
      output: '（代码运行成功，但功能还没有补全）',
      detail: '试着把 ... 或 pass 换成真正的代码。',
      duration: '0.08s',
    }
  }

  return {
    status: 'success',
    output: output || '（代码运行成功，但没有输出内容）',
    detail: output ? undefined : '想要看到结果，可以试试 print() 一下。',
    duration: '0.12s',
  }
}

const solutionPatterns: Record<string, RegExp[]> = {
  p001: [/print\s*\(\s*["']你好[，,]?\s*奶蛙["']\s*\)/],
  p002: [/def\s+average/, /sum\s*\(/, /len\s*\(/, /round\s*\(/],
  p003: [/if\s+guess\s*>\s*secret/, /elif\s+guess\s*<\s*secret/, /猜对啦/],
  p004: [/range\s*\(\s*2\s*,\s*101\s*,\s*2\s*\)/, /total\s*\+=|sum\s*\(/],
  p005: [/counts\s*=\s*\{\}/, /\.get\s*\(/, /for\s+\w+\s+in/],
  p006: [/>=?\s*60/, /sorted\s*\(/],
  p007: [/len\s*\(/],
  p008: [/append\s*\(/, /sum\s*\(/],
  p009: [/split\s*\(/, /len\s*\(/, /longest/],
  p010: [/dict\.fromkeys|not\s+in/, /print\s*\(/],
  p011: [/random\.choice/, /range\s*\(\s*8\s*\)|for\s+/, /print\s*\(/],
  p012: [/items\s*\(/, /best_score/, /print\s*\(/],
}

export function isProblemSolution(problemId: string, code: string) {
  const patterns = solutionPatterns[problemId]
  if (!patterns) return code.trim().length > 0
  return patterns.every((pattern) => pattern.test(code)) && !/(^|\n)\s*(\.\.\.|pass)\s*(\n|$)/.test(code)
}

export function isLearningTaskSolved(code: string) {
  return (
    /name\s*=\s*["'][^"']+["']/.test(code) &&
    /print\s*\(\s*["']你好[，,]?\s*["']\s*\+|print\s*\(\s*f["']/.test(code)
  )
}
