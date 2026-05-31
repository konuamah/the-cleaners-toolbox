import { readFileSync } from "fs"
import { readdirSync, statSync } from "fs"
import { join, extname } from "path"

export interface RuleEntry {
  id: string
  category: string
  principle: string
  severity: "info" | "warn" | "error"
}

export const RULE_CATALOG: RuleEntry[] = [
  { id: "C1", category: "Comments", principle: "No metadata in comments (use version control)", severity: "warn" },
  { id: "C2", category: "Comments", principle: "Delete obsolete comments immediately", severity: "warn" },
  { id: "C3", category: "Comments", principle: "No redundant comments", severity: "warn" },
  { id: "C4", category: "Comments", principle: "Write comments well if you must", severity: "info" },
  { id: "C5", category: "Comments", principle: "Never commit commented-out code", severity: "error" },
  { id: "E1", category: "Environment", principle: "One command to build the project", severity: "info" },
  { id: "E2", category: "Environment", principle: "One command to run all tests", severity: "info" },
  { id: "F1", category: "Functions", principle: "Maximum 3 arguments (use a data structure for more)", severity: "warn" },
  { id: "F2", category: "Functions", principle: "No output arguments (return new values)", severity: "warn" },
  { id: "F3", category: "Functions", principle: "No flag arguments (split into separate functions)", severity: "warn" },
  { id: "F4", category: "Functions", principle: "Delete dead functions", severity: "warn" },
  { id: "G5", category: "General", principle: "DRY — no duplication", severity: "warn" },
  { id: "G9", category: "General", principle: "Delete dead code", severity: "warn" },
  { id: "G16", category: "General", principle: "No obscured intent", severity: "warn" },
  { id: "G23", category: "General", principle: "Prefer polymorphism to if/else chains", severity: "info" },
  { id: "G25", category: "General", principle: "Named constants, not magic numbers/strings", severity: "warn" },
  { id: "G30", category: "General", principle: "Functions do one thing", severity: "warn" },
  { id: "G36", category: "General", principle: "Law of Demeter (no train wrecks)", severity: "warn" },
  { id: "D1", category: "Debugging", principle: "Reproduce and isolate before fixing", severity: "info" },
  { id: "D2", category: "Debugging", principle: "Verify assumptions with tooling (debugger, review-code)", severity: "info" },
  { id: "D3", category: "Debugging", principle: "One fix at a time", severity: "info" },
  { id: "D4", category: "Debugging", principle: "Validate with a regression test", severity: "info" },
  { id: "P1", category: "Planning", principle: "Design before code — explore and get approval first", severity: "info" },
  { id: "P2", category: "Planning", principle: "Write plans, not wishes", severity: "info" },
  { id: "P3", category: "Planning", principle: "Validate output against clean-code standards", severity: "info" },
  { id: "N1", category: "Names", principle: "Choose descriptive names", severity: "warn" },
  { id: "N2", category: "Names", principle: "Right abstraction level", severity: "warn" },
  { id: "N3", category: "Names", principle: "Use standard nomenclature", severity: "info" },
  { id: "N4", category: "Names", principle: "Unambiguous names", severity: "warn" },
  { id: "N5", category: "Names", principle: "Name length matches scope", severity: "info" },
  { id: "N6", category: "Names", principle: "No encodings (no Hungarian notation)", severity: "warn" },
  { id: "N7", category: "Names", principle: "Names describe side effects", severity: "warn" },
  { id: "T1", category: "Tests", principle: "Test everything that could break", severity: "warn" },
  { id: "T2", category: "Tests", principle: "Use coverage tools", severity: "info" },
  { id: "T3", category: "Tests", principle: "Don't skip trivial tests", severity: "info" },
  { id: "T4", category: "Tests", principle: "Ignored test = ambiguity question", severity: "warn" },
  { id: "T5", category: "Tests", principle: "Test boundary conditions", severity: "warn" },
  { id: "T6", category: "Tests", principle: "Exhaustively test near bugs", severity: "info" },
  { id: "T7", category: "Tests", principle: "Look for patterns in failures", severity: "info" },
  { id: "T8", category: "Tests", principle: "Check coverage when debugging", severity: "info" },
  { id: "T9", category: "Tests", principle: "Tests must be fast (< 100ms each)", severity: "info" },
]

const RULE_MAP = new Map(RULE_CATALOG.map((r) => [r.id, r]))

export function lookupRule(id: string): RuleEntry | undefined {
  return RULE_MAP.get(id.toUpperCase())
}

export function isCodeFile(ext: string): boolean {
  const codeExtensions = new Set([
    ".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs",
    ".py", ".rb", ".go", ".rs", ".java", ".kt", ".scala",
    ".swift", ".c", ".cpp", ".h", ".hpp", ".cs",
    ".php", ".pl", ".ex", ".exs",
    ".sh", ".bash", ".zsh", ".ps1",
    ".vue", ".svelte", ".astro",
  ])
  return codeExtensions.has(ext.toLowerCase())
}

export function isCommentLine(line: string, commentMarkers: string[]): boolean {
  const trimmed = line.trimStart()
  return commentMarkers.some((m) => trimmed.startsWith(m))
}

export function detectCommentMarkers(content: string): string[] {
  const markers: string[] = []
  if (/\/\//.test(content)) markers.push("//")
  if (/#/.test(content)) markers.push("#")
  if (/--/.test(content)) markers.push("--")
  if (/;/.test(content)) markers.push(";")
  if (/%/.test(content)) markers.push("%")
  return markers.length > 0 ? markers : ["//", "#"]
}

export function readFileContent(filePath: string): string | null {
  try {
    return readFileSync(filePath, "utf-8")
  } catch {
    return null
  }
}

export interface FileEntry {
  path: string
  content: string
  lines: string[]
}

export function collectFiles(targetPath: string, predicate?: (p: string) => boolean): FileEntry[] {
  const results: FileEntry[] = []

  const walk = (dir: string) => {
    let entries: string[]
    try {
      entries = readdirSync(dir)
    } catch {
      return
    }
    for (const entry of entries) {
      const full = join(dir, entry)
      try {
        const st = statSync(full)
        if (st.isDirectory()) {
          if (!entry.startsWith(".") && entry !== "node_modules") {
            walk(full)
          }
        } else if (st.isFile()) {
          if (predicate && !predicate(full)) continue
          const content = readFileContent(full)
          if (content !== null) {
            results.push({ path: full, content, lines: content.split("\n") })
          }
        }
      } catch {
        // skip unreadable
      }
    }
  }

  const st = statSync(targetPath)
  if (st.isFile()) {
    const content = readFileContent(targetPath)
    if (content !== null) {
      results.push({ path: targetPath, content, lines: content.split("\n") })
    }
  } else if (st.isDirectory()) {
    walk(targetPath)
  }

  return results
}
