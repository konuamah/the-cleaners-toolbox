---
name: feature-tracking
description: Use when tracking feature completion, generating checklists, auditing code for gaps, or mapping dependencies between features
---

# Feature Tracking

Generate `.md` files that live in your project, track feature completion, and catch incomplete work before shipping.

## SKILL 1: Generate Feature Checklist

**Input:** Feature description  
**Output:** `.md` file for `/.features/[feature-name].md`

### Prompt Template

```
You are a feature completion expert.

When given a feature description, generate a complete .md file 
that will be committed to the project and tracked in Git.

The file must include:
- Feature metadata (owner, status, dates, dependencies)
- Complete checklist (planning, backend, frontend, integration, deployment, sign-off)
- Blockers and known issues
- Links to PRs and docs

FILE FORMAT:

---
feature: [name]
owner: [person/team]
status: [PLANNED|IN_PROGRESS|READY_TO_SHIP|SHIPPED|BLOCKED]
created: [YYYY-MM-DD]
target_completion: [YYYY-MM-DD]
tags: [backend, frontend, full-stack, auth, api, data]
dependencies: [feature1, feature2]
blocks: [feature3, feature4]
---

# Feature: [Name]

## Overview
[1-2 sentence description of what this feature does]

## Acceptance Criteria
- [ ] User can do X
- [ ] System returns Y
- [ ] Z is integrated

## Planning & Design
- [ ] Requirements documented
- [ ] API endpoints defined
- [ ] UI/UX designed
- [ ] Database schema designed
- [ ] Security requirements identified
- [ ] Error scenarios documented

## Backend Implementation
- [ ] API endpoints implemented
- [ ] Database migrations
- [ ] ORM models & queries
- [ ] Input validation
- [ ] Auth/authorization checks
- [ ] Error handling
- [ ] Logging & monitoring
- [ ] Unit tests (70%+ coverage)
- [ ] Integration tests
- [ ] Security audit

## Frontend Implementation
- [ ] UI components built
- [ ] API integration
- [ ] Loading states & errors
- [ ] Form validation
- [ ] State management
- [ ] Mobile responsive
- [ ] Unit tests
- [ ] E2E tests
- [ ] Accessibility

## Integration & Cross-Layer
- [ ] Frontend correctly calls backend
- [ ] API responses match expectations
- [ ] Error handling end-to-end
- [ ] No breaking changes to other features
- [ ] Feature flag works
- [ ] Performance verified

## Deployment
- [ ] Documentation complete
- [ ] Runbook written
- [ ] Feature flag configured
- [ ] Rollback plan documented
- [ ] Monitoring & alerts set up

## Known Issues / Blockers
- [ ] Issue: [description]. Fix: [required]. ETA: [date]
- [ ] Blocker: [what's blocking]. Owner: [who]. ETA: [date]

## Dependencies
| Feature | Status | Blocking? |
|---------|--------|-----------|
| [Dep 1] | ✓ SHIPPED | NO |
| [Dep 2] | ~ IN_PROGRESS | YES |
| [Dep 3] | ✗ NOT STARTED | YES |

## Sign-Off
- [ ] Code review passed
- [ ] QA approved
- [ ] Product approved
Ready to ship? [YES / NO / BLOCKED]

## Implementation Notes
[Key decisions, approach, why things were done this way]

## Links
- PR: [link to PR]
- Design doc: [link]
- API schema: [link]
```

### Workflow

```
You: "Generate a feature checklist for: 'Add soil data upload'"

Claude: Creates /.features/soil-data-upload.md
```

---

## SKILL 2: Audit Codebase for Incomplete Features

**Input:** Code snapshot or project structure  
**Output:** Audit report showing gaps, orphaned code, integration mismatches

### Prompt Template

```
You are a codebase auditor. Find incomplete features that slipped through.

Given code (files, PR diff, or directory structure), identify:

INCOMPLETE FEATURES:
- API endpoints defined but unused by frontend
- Database schema changes without corresponding queries
- Frontend calling undefined endpoints
- Feature flags toggled but no code behind them
- Error handlers that don't properly respond
- Functions stubbed out (TODO, empty logic, placeholder code)

INTEGRATION GAPS:
- Orphaned code (defined, never called)
- Unused imports / dead code
- API response format doesn't match frontend expectations
- Missing auth middleware on protected routes
- Missing error handling between layers
- Frontend loading states missing

TECHNICAL DEBT:
- Zero test coverage on critical paths
- TODO/FIXME comments left in code
- TypeScript/linting errors
- Secrets hardcoded

SECURITY ISSUES:
- No auth checks on endpoints
- Input validation missing
- SQL injection vectors
- CORS not restricted

OUTPUT FORMAT:

## Audit Report: [Project/Feature]

### 🔴 CRITICAL (Ship Blockers)
[Issue 1]
- Location: [file:line]
- Problem: [what's wrong]
- Impact: [what breaks]
- Fix: [what to do]
- Owner: [who should fix]

### 🟠 HIGH PRIORITY (Fix Before Merge)
[Issue 1]
...

### 🟡 MEDIUM PRIORITY (Fix Before Ship)
[Issue 1]
...

### 🟢 TECHNICAL DEBT (Track for Later)
[Issue 1]
...

---

## Summary
| Severity | Count |
|----------|-------|
| Critical | N |
| High | N |
| Medium | N |
| Debt | N |

**Ready to ship?** YES / NO / [List blockers]
```

### Workflow

```
You: "Audit my code for the soil data feature. [Paste code or file list]"

Claude: Returns audit report of gaps, integration mismatches, blockers
```

---

## SKILL 3: Track Feature Dependencies

**Input:** Feature list or list of `.md` files  
**Output:** Dependency graph showing what blocks what

### Prompt Template

```
You are a feature dependency mapper.

Given a list of features (or feature .md files), create a dependency map showing:
1. What each feature depends on
2. What features depend on each feature
3. What can ship independently
4. What's blocking what

OUTPUT FORMAT:

---
project: [name]
generated: [date]
total_features: [n]
shipped: [n]
in_progress: [n]
blocked: [n]
---

# Dependency Map

## Feature Status Overview
- ✓ Shipped: [count]
- ~ In Progress: [count]
- ✗ Blocked: [count]

## Dependency Graph

[Tree showing which blocks which]

## Shipping Readiness

### Ready to Ship (No Blockers)
- Feature A
- Feature B

### Can Ship if Dependencies Done
- Feature C (blocked by D which is 50% done)

### Blocked (Can't Ship)
- Feature D (blocked by E which hasn't started)

## Timeline

Phase 1: [dates]
- Feature A (then unblocks C, D)

Phase 2: [dates]
- Feature C (then unblocks E)

Phase 3: [dates]
- Feature E
```

### Workflow

```
You: "Generate dependency map for all features. [List or paste /.features/*.md files]"

Claude: Shows what blocks what, what can ship next
```

---

## FILE STRUCTURE IN PROJECT

```
project-root/
├── .features/
│   ├── soil-data-upload.md
│   ├── authentication.md
│   ├── land-management.md
│   ├── export-report.md
│   ├── suitability-assessment.md
│   └── PROJECT_STATUS.md
├── src/
├── README.md
└── .cursorrules (reference .features/ here)
```

---

## ADD TO PROJECT RULES

```markdown
# Feature Tracking

This project uses feature checklists in /.features/

When asked about features:
1. Check /.features/PROJECT_STATUS.md for overview
2. Open /.features/[feature-name].md for details
3. Read blockers section, dependencies section, sign-off status

When starting a new feature:
- Generate a checklist using the "Generate Feature Checklist" skill
- Save as /.features/[feature-name].md
- Commit to Git
- Update as you build

When reviewing code:
- Use "Audit Codebase" skill to find gaps
- Reference feature checklist as acceptance criteria

When planning shipping:
- Use "Track Dependencies" skill
- Check /.features/PROJECT_STATUS.md for critical path
```

---

## SUMMARY

| Skill | When to Use | Output |
|-------|-------------|--------|
| Generate Feature Checklist | Starting new feature | `.features/[name].md` |
| Audit Codebase | Before code review | Gap report |
| Track Dependencies | Before shipping | Dependency graph |

No complexity. No embeddings. Just readable `.md` files in your project.
