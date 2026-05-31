---
name: clean-general
description: Use when writing, fixing, editing, or reviewing code quality. Enforces Clean Code's core principles—DRY, single responsibility, clear intent, no magic values, proper abstractions.
when_to_use: |
  Also trigger on: duplicated logic across files or branches (G5), magic numbers or hardcoded values (G25), long if/else chains that should use polymorphism (G23), chained property access like `a.b.c.d` (G36), functions juggling multiple responsibilities (G30), clever one-liners whose intent is not obvious (G16).
---

# General Clean Code Principles

## Critical Rules

**G5: DRY (Don't Repeat Yourself)**

Every piece of knowledge has one authoritative representation.

```
// Bad — duplication
caTotal = subtotal * 1.0825
nyTotal = subtotal * 1.07

// Good — single source of truth
TAX_RATES = { CA: 0.0825, NY: 0.07 }
function calculateTotal(subtotal, state):
    return subtotal * (1 + TAX_RATES[state])
```

**G16: No Obscured Intent**

Don't be clever. Be clear.

```
// Bad — what does this do?
return (x & 0x0F) << 4 | (y & 0x0F)

// Good — obvious intent
return packCoordinates(x, y)
```

**G23: Prefer Polymorphism to If/Else**

```
// Bad — will grow forever
function calculatePay(employee):
    if employee.type == "SALARIED": return employee.salary
    elif employee.type == "HOURLY": return employee.hours * employee.rate
    elif employee.type == "COMMISSIONED": return employee.base + employee.commission

// Good — open/closed principle
// Each employee type implements calculatePay() in its own class/module
interface Employee:
    function calculatePay(): number

class SalariedEmployee:
    function calculatePay(): return this.salary

class HourlyEmployee:
    function calculatePay(): return this.hours * this.rate

class CommissionedEmployee:
    function calculatePay(): return this.base + this.commission
```

**G25: Replace Magic Values with Named Constants**

```
// Bad
if elapsedTime > 86400: ...

// Good
SECONDS_PER_DAY = 86400
if elapsedTime > SECONDS_PER_DAY: ...
```

**G30: Functions Should Do One Thing**

If you can extract another function, your function does more than one thing.

**G36: Law of Demeter (Avoid Train Wrecks)**

```
// Bad — reaching through multiple objects
outputDir = context.options.scratchDir.absolutePath

// Good — one dot (or a single method call)
outputDir = context.getScratchDir()
```

## Enforcement Checklist

When reviewing code, verify:
- [ ] No duplication (G5)
- [ ] Clear intent, no magic values (G16, G25)
- [ ] Polymorphism over conditionals (G23)
- [ ] Functions do one thing (G30)
- [ ] No Law of Demeter violations (G36)
- [ ] Boundary conditions handled (G3)
- [ ] Dead code removed (G9)
