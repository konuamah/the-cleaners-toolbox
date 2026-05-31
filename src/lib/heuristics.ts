import { extname } from "path"
import { isCodeFile, isCommentLine, detectCommentMarkers } from "./utils"

export interface Violation {
  rule: string
  line: number
  severity: "info" | "warn" | "error"
  message: string
  suggestion: string
}

export interface CheckContext {
  filePath: string
  content: string
  lines: string[]
}

const MAGIC_EXCEPTIONS = /^(0|1|-1|0\.0|1\.0|100|100\.0)$/

export function checkMagicValues(ctx: CheckContext): Violation[] {
  const result: Violation[] = []

  for (let i = 0; i < ctx.lines.length; i++) {
    const line = ctx.lines[i]
    const trimmed = line.trim()

    if (!trimmed || trimmed.startsWith("//") || trimmed.startsWith("#") || trimmed.startsWith("/*") || trimmed.includes("*/")) {
      continue
    }

    const magicMatch = trimmed.match(
      /[=:]\s*(-?\d+(?:\.\d+)?)\s*(?:$|[+\-*/),;\]}])/
    )
    if (!magicMatch) continue

    const value = magicMatch[1]
    if (MAGIC_EXCEPTIONS.test(value)) continue

    const lineNum = i + 1
    result.push({
      rule: "G25",
      line: lineNum,
      severity: "warn",
      message: `Magic number \`${value}\` on line ${lineNum}`,
      suggestion: `Extract \`${value}\` into a named constant with a descriptive name`,
    })
  }

  return result
}

export function checkTooManyParams(ctx: CheckContext): Violation[] {
  const result: Violation[] = []
  const funcDefPattern = /(?:function|def|fn|fun|func)\s+\w+\s*\(([^)]*)\)/

  for (let i = 0; i < ctx.lines.length; i++) {
    const line = ctx.lines[i]
    const match = line.match(funcDefPattern)
    if (!match) continue

    const params = match[1].split(",").filter((p) => p.trim().length > 0 && !p.includes("..."))
    if (params.length > 3) {
      const lineNum = i + 1
      result.push({
        rule: "F1",
        line: lineNum,
        severity: "warn",
        message: `Function has ${params.length} parameters (max 3 allowed)`,
        suggestion: "Group related parameters into a single data structure (object/struct/dataclass)",
      })
    }
  }

  return result
}

const SINGLE_LETTER_PATTERN = /[^a-zA-Z]\b([a-z])\s*[=:]/g

export function checkSingleLetterNames(ctx: CheckContext): Violation[] {
  const result: Violation[] = []

  for (let i = 0; i < ctx.lines.length; i++) {
    const line = ctx.lines[i]
    const trimmed = line.trim()

    if (!trimmed || trimmed.startsWith("//") || trimmed.startsWith("#") || trimmed.startsWith("/*")) {
      continue
    }

    if (/for\s*\(?\s*[a-z]\s*(?:in|of|;)/.test(trimmed)) continue

    let match
    SINGLE_LETTER_PATTERN.lastIndex = 0

    while ((match = SINGLE_LETTER_PATTERN.exec(line)) !== null) {
      const name = match[1]
      if (name === "i" || name === "j" || name === "k") continue

      const beforeChar = match[0][0]
      if (".:".includes(beforeChar)) continue

      const lineNum = i + 1
      result.push({
        rule: "N1",
        line: lineNum,
        severity: "warn",
        message: `Single-letter variable \`${name}\` on line ${lineNum}`,
        suggestion: `Rename \`${name}\` to a descriptive name that reveals intent`,
      })
      break
    }
  }

  return result
}

export function checkFlagArgs(ctx: CheckContext): Violation[] {
  const result: Violation[] = []
  const callPattern = /(\w+)\s*\(([^)]*)\)/g

  for (let i = 0; i < ctx.lines.length; i++) {
    const line = ctx.lines[i]
    const trimmed = line.trim()

    if (!trimmed || trimmed.startsWith("//") || trimmed.startsWith("#") || trimmed.startsWith("/*")) continue

    let match
    while ((match = callPattern.exec(trimmed)) !== null) {
      const call = match[0]
      if (/function|def|fn|fun|func/.test(call)) continue

      const args = match[2].split(",").map((a) => a.trim())
      const boolFlags = args.filter((a) => a === "true" || a === "false")

      if (boolFlags.length > 0) {
        const lineNum = i + 1
        result.push({
          rule: "F3",
          line: lineNum,
          severity: "warn",
          message: `Boolean flag argument in call to \`${match[1]}\` on line ${lineNum}`,
          suggestion: "Split into two named functions instead of using a boolean flag parameter",
        })
        break
      }
    }
  }

  return result
}

export function checkCommentedOutCode(ctx: CheckContext): Violation[] {
  const result: Violation[] = []
  const markers = detectCommentMarkers(ctx.content)

  let commentBlock = 0
  let blockStartLine = 0

  for (let i = 0; i < ctx.lines.length; i++) {
    const line = ctx.lines[i]
    const trimmed = line.trim()

    if (!trimmed) {
      commentBlock = 0
      continue
    }

    if (isCommentLine(line, markers)) {
      const codeIndicators = [
        /\(/, /\)/, /{/, /}/, /=/, /;$/,
        /\b(function|def|if|for|while|return|class|import|const|let|var)\b/,
      ]
      const looksLikeCode = codeIndicators.some((p) => p.test(trimmed))

      if (looksLikeCode) {
        if (commentBlock === 0) blockStartLine = i + 1
        commentBlock++
      } else {
        commentBlock = 0
      }
    } else {
      if (commentBlock >= 3) {
        result.push({
          rule: "C5",
          line: blockStartLine,
          severity: "error",
          message: `${commentBlock}-line block of commented-out code starting at line ${blockStartLine}`,
          suggestion: "Delete commented-out code entirely. Version control preserves history.",
        })
      }
      commentBlock = 0
    }
  }

  if (commentBlock >= 3) {
    result.push({
      rule: "C5",
      line: blockStartLine,
      severity: "error",
      message: `${commentBlock}-line block of commented-out code starting at line ${blockStartLine}`,
      suggestion: "Delete commented-out code entirely. Version control preserves history.",
    })
  }

  return result
}

export function checkDeepNesting(ctx: CheckContext): Violation[] {
  const result: Violation[] = []

  for (let i = 0; i < ctx.lines.length; i++) {
    const line = ctx.lines[i]
    const trimmed = line.trim()

    if (!trimmed || trimmed.startsWith("//") || trimmed.startsWith("#") || trimmed.startsWith("/*")) continue

    const indent = line.length - line.trimStart().length
    const depth = Math.floor(indent / 2)

    if (depth >= 4) {
      const lineNum = i + 1
      result.push({
        rule: "G30",
        line: lineNum,
        severity: "warn",
        message: `Deep nesting (level ${depth}) on line ${lineNum}`,
        suggestion: "Extract inner logic into a well-named function, use guard clauses, or early returns",
      })
      break
    }
  }

  return result
}

export function checkDeadFunctions(ctx: CheckContext): Violation[] {
  const result: Violation[] = []
  const defPattern = /(?:function|def|fn|fun|func)\s+(\w+)/g
  const callPattern = /\b(\w+)\s*\(/g

  const defined = new Set<string>()
  const called = new Set<string>()
  let currentFunc = ""

  for (const line of ctx.lines) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith("//") || trimmed.startsWith("#")) continue

    let m: RegExpExecArray | null
    defPattern.lastIndex = 0
    while ((m = defPattern.exec(trimmed)) !== null) {
      if (m.index === 0 || /^[\s(]/.test(trimmed[m.index - 1] || "")) {
        if (!trimmed.includes(".prototype.")) {
          defined.add(m[1])
          currentFunc = m[1]
        }
      }
    }

    callPattern.lastIndex = 0
    while ((m = callPattern.exec(trimmed)) !== null) {
      if (m[1] !== currentFunc) {
        called.add(m[1])
      }
    }
  }

  const builtins = new Set([
    "if", "for", "while", "switch", "catch", "function", "def",
    "return", "throw", "typeof", "instanceof", "delete", "void",
    "describe", "it", "test", "expect", "assert",
  ])

  for (const name of defined) {
    if (!builtins.has(name) && !called.has(name) && name !== "main" && !name.startsWith("_")) {
      const defLines = ctx.lines
        .map((l, i) => ({ line: l, num: i + 1 }))
        .filter((l) => l.line.includes(`function ${name}`) || l.line.includes(`def ${name}`))

      if (defLines.length > 0) {
        result.push({
          rule: "F4",
          line: defLines[0].num,
          severity: "warn",
          message: `Function \`${name}\` defined but never called`,
          suggestion: "Remove dead functions. Version control preserves history if needed later.",
        })
      }
    }
  }

  return result
}

export function runAllChecks(ctx: CheckContext): Violation[] {
  return [
    ...checkMagicValues(ctx),
    ...checkTooManyParams(ctx),
    ...checkSingleLetterNames(ctx),
    ...checkFlagArgs(ctx),
    ...checkCommentedOutCode(ctx),
    ...checkDeepNesting(ctx),
    ...checkDeadFunctions(ctx),
  ]
}
