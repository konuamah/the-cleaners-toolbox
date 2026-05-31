---
name: boy-scout
description: Use when fixing, editing, changing, debugging, or working with any code. Applies the Boy Scout Rule—always leave code cleaner than you found it. Orchestrates other clean code skills as needed.
when_to_use: |
  Also trigger on: "while you're at it", "any quick wins", "improve this a bit", "anything else obviously wrong", or when editing existing code and an adjacent small cleanup is possible alongside the asked-for change.
---

# The Boy Scout Rule

> "Always leave the campground cleaner than you found it."
> — Robert Baden-Powell

> "Always check a module in cleaner than when you checked it out."
> — Robert C. Martin, *Clean Code*

## The Philosophy

You don't have to make every module perfect. You simply have to make it **a little bit better** than when you found it.

If we all followed this simple rule:
- Our systems would gradually get better as they evolved
- Teams would care for the system as a whole
- The relentless deterioration of software would end

## When Working on Code

Every time you touch code, look for **at least one small improvement**:

### Quick Wins (Do These Immediately)
- Rename a poorly named variable → triggers `clean-names`
- Delete a redundant comment → triggers `clean-comments`
- Remove dead code or unused imports
- Replace a magic value with a named constant
- Extract a deeply nested block into a well-named function

### Deeper Improvements (When Time Allows)
- Split a function that does multiple things → triggers `clean-functions`
- Remove duplication (DRY) → triggers `clean-general`
- Add missing boundary checks
- Improve test coverage → triggers `clean-tests`

## The Rule in Practice

```
// You're asked to fix a bug in this function:
function process(values, results, applyTax = false):
    // process data
    for each item in values:
        if item > 0:
            if applyTax:
                results.push(item * 1.0825)  // tax
            else:
                results.push(item)
    return results

// Don't just fix the bug and leave.
// Leave it cleaner:
TAX_RATE = 0.0825

function filterPositiveValues(values, applyTax = false):
    rate = 1 + TAX_RATE if applyTax else 1
    return values.filter(v => v > 0).map(v => v * rate)
```

**What changed:**
- Descriptive function name (N1)
- Clear parameter names (N1)
- No output argument mutation (F2)
- Named constant for magic number (G25)
- Useful documentation (C4)

## Skill Orchestration

This skill coordinates with specialized skills based on what you're doing:

| Task | Trigger Skill |
|------|---------------|
| Starting new work / designing solutions | `clean-planning` |
| Writing/reviewing any code | `clean-code` (master) |
| Naming variables, functions, classes | `clean-names` |
| Writing or editing comments | `clean-comments` |
| Creating or refactoring functions | `clean-functions` |
| Reviewing code quality | `clean-general` |
| Debugging or troubleshooting | `clean-debugging` |
| Building secure features / auth / API endpoints | `security-planner` |
| Writing or reviewing tests | `clean-tests` |

## The Mindset

**Don't:**
- Leave code worse than you found it
- Say "that's not my code"
- Wait for a dedicated refactoring sprint
- Make massive changes unrelated to your task

**Do:**
- Make one small improvement with every commit
- Fix what you see, even if you didn't break it
- Keep changes proportional to your task
- Leave a trail of quality improvements

## AI Behavior

When working on code:
1. Complete the requested task first
2. Identify at least one small cleanup opportunity
3. Apply the appropriate specialized skill
4. Note the improvement made (e.g., "Also cleaned up: renamed `x` to `results` for clarity")

When reviewing code:
1. Load `clean-code` for comprehensive rule checking
2. Flag violations by rule number
3. Suggest incremental improvements, not complete rewrites

## The Boy Scout Promise

Every piece of code you touch gets a little better. Not perfect — just better.

Over time, better compounds into excellent.
