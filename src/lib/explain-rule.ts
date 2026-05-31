import { tool } from "@opencode-ai/plugin"
import { lookupRule, RULE_CATALOG } from "./utils"

export const explainRuleTool = tool({
  description: "Look up a clean-code rule by ID (e.g., G25, D2, F1, N1, P3, C5, T5) and return its description, category, and severity.",
  args: {
    rule: tool.schema.string().describe("Rule ID (e.g., G25, F1, N1, C5, D2, P3, T5)"),
  },
  async execute(args) {
    const ruleId = args.rule.toUpperCase().trim()
    const entry = lookupRule(ruleId)

    if (!entry) {
      const allIds = RULE_CATALOG.map((r) => r.id).join(", ")
      return [
        `Unknown rule: \`${ruleId}\`.`,
        "",
        `Valid rule IDs: ${allIds}`,
      ].join("\n")
    }

    const severityLabel =
      entry.severity === "error" ? "🔴 Error" : entry.severity === "warn" ? "🟡 Warning" : "🔵 Info"

    return [
      `## ${entry.id}: ${entry.category}`,
      "",
      `**Principle:** ${entry.principle}`,
      `**Severity:** ${severityLabel}`,
      "",
    ].join("\n")
  },
})
