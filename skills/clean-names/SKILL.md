---
name: clean-names
description: Use when naming, renaming, or fixing names of variables, functions, classes, or modules. Enforces Clean Code principles—descriptive names, appropriate length, no encodings.
when_to_use: |
  Also trigger on: single-letter or cryptic identifiers (`d`, `x`, `proc`), Hungarian notation (`strName`, `arrUsers`, `iCount`), prefix conventions like `IUserRepository`, function names that hide side effects (e.g. `getConfig` that also writes a file), non-standard abbreviations, or asks like "rename this", "what does this variable mean", "clearer name".
---

# Clean Names

## N1: Choose Descriptive Names

Names should reveal intent. If a name requires a comment, it doesn't reveal its intent.

```
// Bad — what is d?
d = 86400

// Good — obvious meaning
SECONDS_PER_DAY = 86400

// Bad — what does this function do?
function proc(list):
    return filter(list, x => x > 0)

// Good — intent is clear
function filterPositiveNumbers(numbers):
    return filter(numbers, n => n > 0)
```

## N2: Choose Names at the Appropriate Level of Abstraction

Don't pick names that communicate implementation; choose names that reflect the level of abstraction of the class or function.

```
// Bad — too implementation-specific
function getMapOfUserIdsToNames(): ...

// Good — abstracts the data structure
function getUserDirectory(): ...
```

## N3: Use Standard Nomenclature Where Possible

Use terms from the domain, design patterns, or well-known conventions.

```
// Good — uses pattern name
class UserFactory:
    function create(data): ...

// Good — uses domain term
function calculateAmortization(principal, rate, term): ...
```

## N4: Unambiguous Names

Choose names that make the workings of a function or variable unambiguous.

```
// Bad — ambiguous
function rename(source, target): ...

// Good — clear what's being renamed
function renameFile(oldPath, newPath): ...
```

## N5: Use Longer Names for Longer Scopes

Short names are fine for tiny scopes. Longer scopes need longer, more descriptive names.

```
// Good — short name for tiny scope
total = sum(filter(list, x => x > 0))

// Good — longer name for module-level constant
MAX_RETRY_ATTEMPTS_BEFORE_FAILURE = 5

// Bad — short name at module level
MAX = 5
```

## N6: Avoid Encodings

Don't encode type or scope information into names. Modern editors make this unnecessary.

```
// Bad — Hungarian notation
strName = "Alice"
arrUsers = []
iCount = 0

// Good — clean names
name = "Alice"
users = []
count = 0

// Bad — interface prefix
class IUserRepository: ...

// Good — just name it
class UserRepository: ...
```

## N7: Names Should Describe Side Effects

If a function does something beyond what its name suggests, the name is misleading.

```
// Bad — name doesn't mention the side effect
function getConfig():
    if not configExists():
        createDefaultConfig()  // Hidden side effect!
    return loadConfig()

// Good — name reveals behavior
function getOrCreateConfig():
    if not configExists():
        createDefaultConfig()
    return loadConfig()
```

## Quick Reference

| Rule | Principle | Example |
|------|-----------|---------|
| N1 | Descriptive names | `SECONDS_PER_DAY` not `d` |
| N2 | Right abstraction level | `getUserDirectory()` not `getMapOf...` |
| N3 | Standard nomenclature | `UserFactory`, `calculateAmortization` |
| N4 | Unambiguous | `renameFile(oldPath, newPath)` |
| N5 | Length matches scope | Short for loops, long for globals |
| N6 | No encodings | `users` not `arrUsers` |
| N7 | Describe side effects | `getOrCreateConfig()` |
