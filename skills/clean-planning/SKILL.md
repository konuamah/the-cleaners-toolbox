---
name: clean-planning
description: Use before writing any code — when starting new work, designing solutions, building features, adding functionality, or implementing changes that require more than a few lines. Enforces design-first discipline, written plans, and validation against clean-code standards.
when_to_use: |
  Also trigger on: "build", "create", "implement", "add a", "new feature", "develop", "write code for", "scaffold", "set up", or any request that implies 10+ minutes of implementation work. Do NOT trigger for single-function edits, quick bug fixes, trivial refactors, or debugging sessions — those are served by boy-scout and clean-debugging.
---

# Clean Planning

> "A programmer who doesn't plan is a programmer who doesn't know what they're building."
> — Adapted from Robert C. Martin

## The Discipline

Planning is not bureaucracy. Planning is the act of thinking before doing. The cost of changing a design is zero before code exists. The cost triples the moment the first line is written.

These rules ensure every non-trivial piece of work starts with understanding, proceeds with a written map, and ends with code that meets the clean-code standards.

## P1: Design Before Code

Do not write implementation code until you have explored the problem and the user has approved the approach. The amount of design effort scales with the work — not all designs require a document.

### How to Design

1. **Understand the context** — Check existing files, patterns, recent commits, and relevant skills
2. **Explore the approach** — Ask clarifying questions if the request is vague. Propose options with trade-offs if there are reasonable alternatives
3. **Present and confirm** — Show the intended approach briefly and get user approval before writing code

### Scale Appropriately

```
// Simple: a new utility function in an existing module
"Add this to utils. Format: ISO-8601. Using built-in date library."
→ 15 seconds. No document needed. Just confirm the approach.
Path docs: Optional — 1 sentence or note "no meaningful negative paths"

// Medium: a new API endpoint
"I'll add a GET /orders/:id endpoint following the existing router pattern.
Response shape: { id, status, items, total }. Auth check at route level."
→ 1 minute. Describe the approach. Confirm before coding.
Path docs: Required — happy path UX+System + 2-3 negative paths

// Complex: a new subsystem
Design doc → `docs/plans/<topic>-design.md`
→ 5-10 minutes. Architecture, components, data flow, error handling.
→ Save, commit, get user review before implementation.
Path docs: Full table format for all paths
```

### Hard Gate

```
DO NOT invoke any implementation skill or write any feature code
until the user has approved the approach. This applies to every
project regardless of perceived simplicity.
```

### Relationship to Other Skills

| Phase | Skill |
|-------|-------|
| Before coding — design | `clean-planning` (P1) |
| Before coding — plan | `clean-planning` (P2) |
| During implementation | `clean-functions`, `clean-names`, `clean-comments`, `clean-general` |
| While editing existing code | `boy-scout` |
| Testing | `clean-tests` |
| Debugging | `clean-debugging` |

---

## P2: Write Plans, Not Wishes

Every multi-step implementation task gets a written plan before execution starts. A plan is not a TODO list — it's a complete, executable specification.

### Plan Requirements

- **File structure** — Which files will be created or modified and what each one is responsible for
- **Bite-sized tasks** — Each task is 2-5 minutes of work with a single, clear outcome
- **Complete code** — Every code step includes the actual code, not placeholders or TODOs
- **Verification steps** — How to verify each task produced the correct result
- **Exact file paths** — No ambiguity about where changes go
- **Paths** — Plans must satisfy the path documentation requirements in P4 (UX + System happy/negative paths)
- **Safe delivery** — Plans must satisfy environment and rollout requirements in E3-E8 (CI, feature flags, isolation, observability, staging, gradual rollout, rollback)

### Plan File Format

Save plans to `docs/plans/<topic>.md`:

```markdown
# [Feature] Implementation Plan

## Task 1: [Component]

**Files:**
- Create: `src/path/to/file.ext`
- Modify: `src/path/to/existing.ext:40-55`

- [ ] **Write the failing test**
  ```code
  // actual test code
  ```

- [ ] **Run test to verify it fails**
  Command: `...`
  Expected: FAIL with ...

- [ ] **Write minimal implementation**
  ```code
  // actual implementation code
  ```

- [ ] **Run test to verify it passes**
  Command: `...`
  Expected: PASS

- [ ] **Commit**
  `git add ... && git commit -m "feat: description"`
```

### Anti-Patterns

| Don't | Do |
|-------|-----|
| "Add error handling" (no details) | Show the exact try/catch, return types, error messages |
| "Implement the rest similarly" | Repeat the pattern for each distinct piece |
| "Fix edge cases later" | Include edge case handling in the plan |
| "TBD", "TODO", "fill in later" | Complete the plan before starting execution |
| Plan saved nowhere (in your head only) | Write it to `docs/plans/<topic>.md` |

---

## P3: Validate Against Standards

Before marking any task as done, verify the code meets clean-code standards. Fix violations as you go — do not batch validation at the end.

### What to Check

| Category | Rules | How |
|----------|-------|-----|
| Comments | C1-C5 | No metadata, no redundant comments, no commented-out code |
| Functions | F1-F4 | Max 3 params, no flag args, no output mutation, no dead code |
| General | G5, G9, G16, G23, G25, G30, G36 | DRY, dead code removed, clear intent, polymorphism, named constants, single responsibility, Law of Demeter |
| Names | N1-N7 | Descriptive, right abstraction, unambiguous, no encodings |
| Tests | T1-T9 | Fast, boundary-tested, one concept per test |

### Automated Check

Use the `review-code` tool to run heuristic scans against written code:

```
review-code(path)
```

This checks for: magic values (G25), excessive parameters (F1), flag arguments (F3), commented-out code (C5), single-letter names (N1), deep nesting (G30). Address any findings before marking the task complete.

### The Rule

```
Every task's output must pass clean-code review.
If it doesn't, fix it before moving to the next task.
No exceptions, no "I'll clean it up later."
```

---

## P4: Plan UX + System Happy & Negative Paths

Every feature plan documents both the user-facing and system-facing journey for success and failure. This ensures the implementation covers flows before writing code.

### Path Documentation Requirements

Scale follows the same tiers as P1:

| Tier | Requirement |
|------|-------------|
| **Simple** (config, README, one-file change with no logic) | Optional — 1 sentence or note "no meaningful negative paths" |
| **Medium** (new public API surface: endpoint, exported function, CLI command) | Required — happy path UX+System inline + 2-3 negative paths |
| **Complex** (subsystem, multi-file feature) | Required — full table format for all paths |

### Happy Path

Document from both perspectives:

- **UX Layer** — What the user sees, clicks, and experiences:
  ```
  User opens form → fills valid data → submits → sees success toast → redirected to dashboard
  ```
- **System Layer** — What the backend does and what state it transitions through:
  ```
  POST /orders → validator pass → DB insert → 201 → notification queued
  ```

### Negative Paths

Two categories with different recovery audiences:

| Category | Description | Recovery Audience |
|----------|-------------|-------------------|
| **Expected** | Handled gracefully — part of normal operation (validation errors, 404s, auth failures, rate limits, conflicts) | **User recovers** — error message with fix instructions, inline field errors, retry button |
| **Exceptional** | Shouldn't happen but must be safe (DB connection drop, downstream timeout, out-of-memory, partial writes) | **System recovers** — circuit breaker, retry policy, rollback, fallback response |

For each negative path, document:

| Field | UX Layer | System Layer |
|-------|----------|--------------|
| **Detection** | How does the user perceive the problem? (toast, inline error, modal, disabled state, banner) | How is the condition detected? (error code, timeout, exception type, status check) |
| **Behavior** | What UX elements does the user see and interact with? (field highlights, button states, retry flows, navigation) | What happens internally? (retry, fallback, rollback, queue, circuit open) |
| **Recovery** | How does the user get back on track? (edit field, retry, relogin, contact support) | What's the resulting system state? (consistent, degraded, safe, idempotent) |

### Rollout & Rollback Paths

For medium and complex features, document how this feature reaches users and how it can be removed:

| Aspect | What to Document | Related Rule |
|--------|------------------|--------------|
| **Feature flag** | What flag gates this feature? What are its possible states (on/off/percentage)? | E4 |
| **Isolation** | What modules/services does this feature touch? If it fails, what else breaks? | E5 |
| **Rollout plan** | What rollout strategy? (internal → 1% → 5% → 20% → 100%) What metrics gate each step? | E8 |
| **Rollback procedure** | How do you revert this? Flip a flag? Revert a commit? Migrate data backward? | E8 |
| **Observability** | What logs, metrics, and traces let you know this feature is working or broken in production? | E6 |
| **Staging validation** | How will you validate this in a staging environment before production? | E7 |

### Escape Hatch

```
If a feature has no meaningful negative paths, note that explicitly
to confirm you checked. The goal is thinking, not box-ticking.
```

### Optional Plan Template

For medium/complex plans, add `## Paths` and `## Safe Delivery` sections after the tasks:

```markdown
## Paths

### Happy Path
- **UX**: user opens form → fills valid data → submits → sees success toast → redirected
- **System**: POST /orders → validator OK → DB insert → 201 → notification queued

### Negative Paths — Expected
| Layer | Detection | Behavior | Recovery |
|-------|-----------|----------|----------|
| **UX** | Inline error "Email taken" | Field highlighted red, button disabled | User edits → inline re-validation |
| **System** | Unique constraint error | Catch → 409 response | No state change, idempotent |

### Negative Paths — Exceptional
| Layer | Detection | Behavior | Recovery |
|-------|-----------|----------|----------|
| **UX** | "Something went wrong" banner | Form data preserved, retry button | User clicks retry → resubmits |
| **System** | DB connection timeout | Retry 3x exponential backoff → 503 | Connection pool restored on next request |

## Safe Delivery

### Feature Flag
- Flag name: `new-checkout-flow`
- States: off (default) → internal → 1% → 5% → 20% → 100%
- Metrics gate: conversion rate >= current baseline at each step

### Blast Radius
- Module: `src/checkout/` — touches Order, Payment, Inventory services
- If failed: Order service isolated, payment retries, inventory unaffected

### Rollback
- Primary: flip flag to `off` — instant, no data migration
- Fallback: revert PR #1234 — requires DB migration revert script
```

### References

- P4 applies to Medium and Complex plans per P1's scaling guide
- Paths inform test cases (T5: boundary conditions, T10: feature flag tests)
- Paths inform error handling implementation (G3: handle boundary conditions)
- Paths inform user-facing error messages and states
- Safe delivery requirements in E3-E8 (CI, feature flags, isolation, observability, staging, gradual rollout, rollback)

---

## When This Skill Does Not Apply

- **Quick fixes** (one function, one change) → `boy-scout` handles these
- **Debugging sessions** → `clean-debugging` has its own investigation-first process
- **Trivial refactors** (rename, extract, inline) → No plan needed
## Skill Priority

When both `clean-planning` and other skills match the context:
1. `clean-planning` runs first (design before code)
2. Then the implementation skills (`clean-functions`, etc.)
3. `clean-tests` runs during and after implementation
4. `clean-debugging` if bugs arise
