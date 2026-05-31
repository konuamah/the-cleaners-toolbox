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

// Medium: a new API endpoint
"I'll add a GET /orders/:id endpoint following the existing router pattern.
Response shape: { id, status, items, total }. Auth check at route level."
→ 1 minute. Describe the approach. Confirm before coding.

// Complex: a new subsystem
Design doc → `docs/plans/<topic>-design.md`
→ 5-10 minutes. Architecture, components, data flow, error handling.
→ Save, commit, get user review before implementation.
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
