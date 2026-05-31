import type { Plugin } from "@opencode-ai/plugin"
import { tool } from "@opencode-ai/plugin"
import { reviewCodeTool } from "./lib/review-code"
import { explainRuleTool } from "./lib/explain-rule"
import { createCompactionContext } from "./lib/compaction"

const PLUGIN_NAME = "clean-code"

const statusTool = tool({
  description: "Check if the Clean Code plugin is loaded and active. Use when the user greets the plugin, asks 'how is my favorite cleaner doing', wants to verify the plugin is working, or asks about clean-code plugin status.",
  args: {},
  async execute() {
    return [
      "🟢 Clean Code plugin is alive and watching!",
      "",
      "All systems clean. 44 rules loaded across 7 categories:",
      "- Comments (C1-C5) | Functions (F1-F4) | General (G1-G36)",
      "- Names (N1-N7) | Tests (T1-T9) | Debugging (D1-D4) | Planning (P1-P3)",
      "",
      "Tools ready: `review-code`, `explain-rule`",
      "Skills ready: 10 skills across 10 directories",
      "",
      "Leave it cleaner than you found it.",
    ].join("\n")
  },
})

export const CleanCodePlugin: Plugin = async ({ client }) => {
  await client.app.log({
    body: {
      service: PLUGIN_NAME,
      level: "info",
      message: "Clean Code plugin active — 44 rules across 7 categories (C, F, G, N, T, D, P). Run `review-code` to scan for violations.",
    },
  })

  return {
    tool: {
      "review-code": reviewCodeTool,
      "explain-rule": explainRuleTool,
      "clean-status": statusTool,
    },

    "experimental.session.compacting": async (_input, output) => {
      output.context.push(createCompactionContext())
    },

    "tool.execute.after": async (input, output) => {
      if (input.tool === "write" || input.tool === "edit") {
        const filePath = input.args?.filePath
        if (filePath && typeof filePath === "string") {
          try {
            const { readFileSync } = await import("fs")
            const { extname } = await import("path")
            const { isCodeFile, detectCommentMarkers } = await import("./lib/utils")
            const { runAllChecks } = await import("./lib/heuristics")

            if (isCodeFile(extname(filePath))) {
              const content = readFileSync(filePath, "utf-8")
              const lines = content.split("\n")
              const violations = runAllChecks({ filePath, content, lines })

              if (violations.length > 0) {
                const byRule: Record<string, number> = {}
                for (const v of violations) {
                  byRule[v.rule] = (byRule[v.rule] || 0) + 1
                }
                const summary = Object.entries(byRule)
                  .map(([r, c]) => `${r}:${c}`)
                  .join(", ")

                await client.app.log({
                  body: {
                    service: PLUGIN_NAME,
                    level: "warn",
                    message: `review-code found ${violations.length} issue(s) in ${filePath}: ${summary}`,
                    extra: { violations, filePath },
                  },
                })
              }
            }
          } catch {
            // non-blocking — don't fail the tool on heuristic errors
          }
        }
      }
    },
  }
}

export default CleanCodePlugin
