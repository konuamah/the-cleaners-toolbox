import { tool } from "@opencode-ai/plugin"
import { runAllChecks, type Violation } from "./heuristics"
import { collectFiles, isCodeFile } from "./utils"
import { extname, join, resolve, win32, sep } from "path"
import { existsSync } from "fs"

function resolvePath(input: string, base: string): string {
  const normalized = input.replace(/\\/g, "/")
  const isWinAbs = /^[A-Za-z]:\//.test(normalized)
  const isUnixAbs = normalized.startsWith("/")
  if (isWinAbs || isUnixAbs) {
    return input.replace(/\//g, "\\")
  }
  return join(base, input)
}

export interface ReviewResult {
  file: string
  violations: (Violation & { file: string })[]
  summary: {
    total: number
    byRule: Record<string, number>
    bySeverity: Record<string, number>
  }
}

function formatResults(results: ReviewResult[]): string {
  const allViolations = results.flatMap((r) => r.violations)
  if (allViolations.length === 0) {
    return "## review-code: No violations found\n\nClean code standards check passed."
  }

  const byRule: Record<string, number> = {}
  const bySeverity: Record<string, number> = {}
  for (const v of allViolations) {
    byRule[v.rule] = (byRule[v.rule] || 0) + 1
    bySeverity[v.severity] = (bySeverity[v.severity] || 0) + 1
  }

  const lines: string[] = [
    "## review-code: Violation Report",
    "",
    `Found **${allViolations.length}** potential issue(s):`,
    "",
    "### Summary",
    `- By rule: ${Object.entries(byRule).map(([k, v]) => `${k}: ${v}`).join(", ")}`,
    `- By severity: ${Object.entries(bySeverity).map(([k, v]) => `${k}: ${v}`).join(", ")}`,
    "",
    "### Details",
  ]

  const grouped: Record<string, (Violation & { file: string })[]> = {}
  for (const v of allViolations) {
    if (!grouped[v.file]) grouped[v.file] = []
    grouped[v.file].push(v)
  }

  for (const [file, violations] of Object.entries(grouped)) {
    lines.push(`**${file}:**`)
    for (const v of violations) {
      const icon = v.severity === "error" ? "🔴" : v.severity === "warn" ? "🟡" : "🔵"
      lines.push(`- ${icon} [${v.rule}] Line ${v.line}: ${v.message}`)
      lines.push(`  → ${v.suggestion}`)
    }
    lines.push("")
  }

  return lines.join("\n")
}

export const reviewCodeTool = tool({
  description: "Scan files for clean-code violations. Detects magic numbers (G25), too many parameters (F1), flag arguments (F3), commented-out code (C5), single-letter names (N1), deep nesting (G30), and dead functions (F4). Run this before marking implementation tasks as complete.",
  args: {
    path: tool.schema.string().describe("File or directory path to scan"),
  },
  async execute(args, context) {
    const { directory, worktree } = context
    const basePath = worktree || directory || "."
    const targetPath = resolvePath(args.path, basePath)

    const files = collectFiles(targetPath, (p) => isCodeFile(extname(p)))

    if (files.length === 0) {
      return `No code files found at \`${targetPath}\`.`
    }

    const results: ReviewResult[] = files.map((f) => {
      const violations = runAllChecks({
        filePath: f.path,
        content: f.content,
        lines: f.lines,
      })

      return {
        file: f.path,
        violations: violations.map((v) => ({ ...v, file: f.path })),
        summary: violations.reduce(
          (acc, v) => {
            acc.total++
            acc.byRule[v.rule] = (acc.byRule[v.rule] || 0) + 1
            acc.bySeverity[v.severity] = (acc.bySeverity[v.severity] || 0) + 1
            return acc
          },
          { total: 0, byRule: {} as Record<string, number>, bySeverity: {} as Record<string, number> },
        ),
      }
    })

    return formatResults(results)
  },
})
