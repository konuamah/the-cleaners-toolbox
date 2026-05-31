---
name: clean-debugging
description: Use when encountering any bug, test failure, or unexpected behavior. Enforces a controlled, scientific debugging process—reproduce, isolate, verify, validate.
when_to_use: |
  Also trigger on: "debug", "bug", "broken", "not working", "unexpected behavior", "fix this error", "failing", "issue with", "doesn't work", "something is wrong", "crash", or any test failure output. Also trigger on "while you're at it" contexts where investigation is needed before a fix.
---

# Clean Debugging

> "Debugging is like being the detective in a crime movie where you're also the murderer."
> — Filipe Fortes

## The Iron Law

```
NO FIXES WITHOUT ROOT CAUSE INVESTIGATION FIRST
```

If you haven't completed the investigation phase, you cannot propose fixes.

## The Four Phases

### D1: Reproduce and Isolate

You cannot fix what you cannot replicate.

1. **Replicate consistently** — Identify the exact inputs, data, or sequence of actions that trigger the bug. If you can't reproduce it reliably, you don't know enough to fix it.

2. **Minimize the footprint** — Temporarily disable unrelated components or simplify the environment. Remove external factors that might be interfering.

3. **Divide and conquer** — Use binary search on the code (comment out half at a time, or bisect recent commits with `git bisect`) to narrow down the problem area.

```
// Instead of guessing which of 10 changes caused it:
git bisect start
git bisect bad          // current commit is broken
git bisect good <tag>   // last known good commit
// Git will check out the midpoint. Test it. Say good or bad.
// Repeat. In ~4 steps, you've found the exact commit.
```

### D2: Verify Assumptions

Do not trust your intuition about what the code is doing. Use tools to verify the exact state.

1. **Use your debugger** — Set breakpoints, step through code line-by-line, inspect variable state over time. Move beyond print statements.

2. **Read error messages completely** — Stack traces, line numbers, error codes. They often contain the exact solution. Don't skip past errors or warnings.

3. **Run `review-code`** — Scan the relevant files for structural issues (magic values, flag arguments, dead code, etc.). These may be contributing factors or reveal the root cause directly. Use this as a diagnostic input before attempting any fix.

4. **Rubber duck** — Explain the problem out loud step by step. Translating the issue into words forces your brain to skip fewer assumptions and often reveals the gap.

### D3: Apply the Fix

**The Golden Rule: change one thing at a time.**

If you make multiple changes simultaneously, you create new variables and make it impossible to identify what solved the bug — or what new problem you introduced.

```
// Bad — three changes, one commit
- Changed the query
- Added error handling
- Refactored the loop

// Good — three separate, verifiable changes
Commit 1: "fix: correct WHERE clause in user lookup"
Commit 2: "fix: add null check on query result"
Commit 3: "refactor: simplify result iteration"
```

**Before fixing:**
- Form a single hypothesis: "I think X is the root cause because Y"
- Make the smallest possible change to test it
- Verify the fix addresses the original reproduction case

**If the fix doesn't work:**
- Count how many fixes you've tried
- If fewer than 3: return to D2, re-analyze with new information
- If 3 or more: STOP. Question the architecture. Discuss with your team before more attempts.

### D4: Validate and Document

A fix isn't complete until it's proven and documented.

1. **Reproduce the fix** — Run the exact steps that previously triggered the bug. Verify it no longer occurs.

2. **Write a regression test** — Turn the bug's reproduction steps into a test. This ensures the bug never creeps back into the codebase.

3. **Clean up** — Remove temporary debug logging, print statements, and commented-out diagnostic code before committing.

## Quick Reference

| Phase | Key Activity | Gate |
|-------|-------------|------|
| D1 | Reproduce consistently, binary search | You can trigger the bug on demand |
| D2 | Use debugger, read errors, run `review-code`, rubber duck | You know the root cause |
| D3 | One change at a time, verify each | Bug is gone |
| D4 | Regression test, clean up diagnostics | Code is ready to commit |

## Anti-Patterns

| Don't | Do |
|-------|-----|
| Litter code with print statements | Use a debugger — step through, inspect state |
| Guess "maybe it's X" and try a fix | Verify your assumption first with evidence |
| Fix three things at once | One change at a time, verify each |
| "Quick fix for now, investigate later" | Every fix deserves root cause understanding |
| Skip the regression test | T3: trivial tests document behavior and catch regressions |
| Leave console.log behind | D4 requires cleanup before committing |
