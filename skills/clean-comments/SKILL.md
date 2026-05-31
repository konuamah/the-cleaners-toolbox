---
name: clean-comments
description: Use when writing, fixing, editing, or reviewing code comments. Enforces Clean Code principles—no metadata, no redundancy, no commented-out code.
when_to_use: |
  Also trigger on: commented-out code blocks, TODO/FIXME banners, author/ticket/date metadata in comments, documentation that no longer matches the code, redundant comments that restate the code (e.g. `i += 1  // increment i`), or asks like "is this comment useful", "why is this block commented".
---

# Clean Comments

## C1: No Inappropriate Information

Comments shouldn't hold metadata. Use version control for author names, change history,
ticket numbers, and dates. Comments are for technical notes about code only.

## C2: Delete Obsolete Comments

If a comment describes code that no longer exists or works differently,
delete it immediately. Stale comments become "floating islands of
irrelevance and misdirection."

## C3: No Redundant Comments

```
// Bad — the code already says this
i += 1  // increment i
save(user)  // save the user

// Good — explains WHY, not WHAT
i += 1  // offset for zero-indexed display
```

## C4: Write Comments Well

If a comment is worth writing, write it well:
- Choose words carefully
- Use correct grammar
- Don't ramble or state the obvious
- Be brief

## C5: Never Commit Commented-Out Code

```
// DELETE THIS
// function calculateTax(income) {
//   return income * 0.15
// }
```

Who knows how old it is? Who knows if it's meaningful? Delete it.
Version control remembers everything.

## C6: Write Comments as a Scannable Narrative

Write comments so someone can read **only the comments** and understand
the full code flow — like a table of contents for the code.

### Rules

- Add a brief section header comment before each logical block
- Use consistent prefixes so comments are scannable (plain sentences work)
- Every function gets a one-line intent comment above it
- Avoid deep technical jargon — comments should be readable by any developer

### Example: Scannable

```ts
// Load user from database
const user = await User.findById(id)

// Reject if account is locked or inactive
if (!user || user.locked) return res.status(401).end()

// Verify password with constant-time comparison
const valid = await bcrypt.compare(password, user.passwordHash)
if (!valid) return res.status(401).end()

// Generate short-lived session token
const token = jwt.sign({ id: user.id }, secret, { expiresIn: '15m' })

// Return user profile (excluding sensitive fields)
res.json({ token, name: user.name, email: user.email })
```

### Example: Not Scannable

```ts
// Load user
const user = await User.findById(id)

// Check it
if (!user || user.locked) return res.status(401).end()

// If here, compare
const valid = await bcrypt.compare(password, user.passwordHash)
if (!valid) return res.status(401).end()

// Gen token
const token = jwt.sign({ id: user.id }, secret, { expiresIn: '15m' })

// Send
res.json({ token, name: user.name, email: user.email })
```

The first example tells a story. The second is cryptic — you'd need
to read every line of code to understand what's happening.

## The Goal

The best comment is the code itself. If you need a comment to explain
what code does, refactor first, comment last.

When you do write comments, make them scannable — the reader should
grasp the full flow from comments alone.
