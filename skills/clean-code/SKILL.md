---
name: clean-code
description: Use when writing, fixing, editing, reviewing, or refactoring any code. Enforces Robert Martin's complete Clean Code catalog—naming, functions, comments, DRY, and boundary conditions.
---

# Clean Code: Complete Reference

Enforces all Clean Code principles from Robert C. Martin's Chapter 17.

## Comments (C1-C5)
- C1: No metadata in comments (use Git)
- C2: Delete obsolete comments immediately
- C3: No redundant comments
- C4: Write comments well if you must
- C5: Never commit commented-out code

## Environment (E1-E8)
- E1: One command to build the project
- E2: One command to run all tests
- E3: One CI command to verify — lint, typecheck, test, and build must run in a single automated pipeline before merge
- E4: Feature flags for new capabilities — deployment must not equal release. Every new feature ships behind a flag, toggle, or gate until verified
- E5: Isolate blast radius — design services, modules, and feature boundaries so a failure in one cannot crash unrelated systems
- E6: Observable by default — structured logs with request IDs at every module edge, error boundaries that surface actionable diagnostics, and metrics for throughput, latency, and error rate
- E7: Staging verified before production — every deployment must pass validation in a production-like environment first
- E8: Gradual rollout with rollback plan — releases must support canary or progressive rollout, and every release must have a tested rollback procedure

## Functions (F1-F4)
- F1: Maximum 3 arguments (use a data structure for more)
- F2: No output arguments (return new values instead of mutating inputs)
- F3: No flag arguments (split into separate functions)
- F4: Delete dead functions

## General (G1-G36)
- G1: One language per file
- G2: Implement expected behavior
- G3: Handle boundary conditions
- G4: Don't override safeties
- G5: DRY — no duplication
- G6: Consistent abstraction levels
- G7: Base types don't know their subtypes
- G8: Minimize public interface
- G9: Delete dead code
- G10: Variables near usage
- G11: Be consistent
- G12: Remove clutter
- G13: No artificial coupling
- G14: No feature envy
- G15: No selector arguments
- G16: No obscured intent
- G17: Code where expected
- G18: Prefer instance methods
- G19: Use explanatory variables
- G20: Function names say what they do
- G21: Understand the algorithm
- G22: Make dependencies physical
- G23: Prefer polymorphism to if/else chains
- G24: Follow conventions (language style guide + linter/formatter)
- G25: Named constants, not magic numbers/strings
- G26: Be precise
- G27: Structure over convention
- G28: Encapsulate conditionals
- G29: Avoid negative conditionals
- G30: Functions do one thing
- G31: Make temporal coupling explicit
- G32: Don't be arbitrary
- G33: Encapsulate boundary conditions
- G34: One abstraction level per function
- G35: Config at high levels
- G36: Law of Demeter (no train wrecks)

## Debugging (D1-D4)
- D1: Reproduce and isolate — replicate consistently, binary search, minimize footprint
- D2: Verify assumptions — use a debugger, read errors, run `review-code`, rubber duck
- D3: Apply one fix at a time — single hypothesis, minimal change, verify before moving on
- D4: Validate with regression test — prove the fix, write a test, clean up diagnostics

## Planning (P1-P4)
- P1: Design before code — explore, present approach, get approval before implementing
- P2: Write plans, not wishes — every multi-step task gets a written plan with complete code and verification steps
- P3: Validate against standards — verify code meets clean-code rules before marking any task done
- P4: Plan UX + System happy and negative paths — document user-facing and system-facing success and failure flows scaled by complexity

## Names (N1-N7)
- N1: Choose descriptive names
- N2: Right abstraction level
- N3: Use standard nomenclature
- N4: Unambiguous names
- N5: Name length matches scope
- N6: No encodings (no Hungarian notation)
- N7: Names describe side effects

## Tests (T1-T10)
- T1: Test everything that could break
- T2: Use coverage tools
- T3: Don't skip trivial tests
- T4: Ignored test = ambiguity question
- T5: Test boundary conditions
- T6: Exhaustively test near bugs
- T7: Look for patterns in failures
- T8: Check coverage when debugging
- T9: Tests must be fast (< 100ms each)
- T10: Feature flag tests — any code gated behind a flag must have tests that verify behavior with the flag both enabled and disabled

## Quick Reference Table

| Category | Rule | One-Liner |
|----------|------|-----------|
| **Comments** | C1 | No metadata (use Git) |
| | C3 | No redundant comments |
| | C5 | No commented-out code |
| **Functions** | F1 | Max 3 arguments |
| | F3 | No flag arguments |
| | F4 | Delete dead functions |
| **General** | G5 | DRY—no duplication |
| | G9 | Delete dead code |
| | G16 | No obscured intent |
| | G23 | Polymorphism over if/else |
| | G25 | Named constants, not magic values |
| | G30 | Functions do one thing |
| | G36 | Law of Demeter (one dot) |
| **Names** | N1 | Descriptive names |
| | N5 | Name length matches scope |
| **Debugging** | D1 | Reproduce and isolate |
| | D2 | Verify assumptions with tooling |
| | D3 | One fix at a time |
| | D4 | Validate with regression test |
| **Planning** | P1 | Design before code |
| | P2 | Write plans, not wishes |
| | P3 | Validate against standards |
| | P4 | Plan UX + System happy and negative paths |
| **Tests** | T5 | Test boundary conditions |
| | T9 | Tests must be fast |
| | T10 | Feature flag tests (flag on/off) |
| **Environment** | E3 | CI pipeline must verify |
| | E4 | Feature flags before merge |
| | E6 | Observable by default |

## Anti-Patterns (Don't → Do)

| Don't | Do |
|-------|-----|
| Comment every line | Delete obvious comments |
| Helper for one-liner | Inline the code |
| Wildcard imports everywhere | Explicit imports |
| Magic value `86400` | Named constant `SECONDS_PER_DAY` |
| `process(data, true)` | `processWithTax(data)` / `process_verbose(data)` |
| Deep nesting | Guard clauses, early returns |
| `obj.a.b.c.value` | `obj.getValue()` |
| 100+ line function | Split by responsibility |
| Deploy to all users at once | Gradual rollout with canary (E8) |
| Release without a flag | Feature flag with default-off (E4) |
| Merge without CI passing | Automated CI pipeline must pass (E3) |
| No logs on failure | Structured log with request ID (E6) |
| Rollback plan = "revert the PR" | Tested rollback procedure (E8) |

## AI Behavior

When reviewing code, identify violations by rule number (e.g., "G5 violation: duplicated logic").
When fixing or editing code, report what was fixed (e.g., "Fixed: extracted magic number to `SECONDS_PER_DAY` (G25)").
