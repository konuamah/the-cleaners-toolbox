---
name: clean-tests
description: Use when writing, fixing, editing, or refactoring tests. Enforces Clean Code principles—fast tests, boundary coverage, one assertion per test.
when_to_use: |
  Also trigger on: slow or flaky tests, skipped tests without a clear reason, tests that only cover the happy path, tests with multiple assertions about different concepts, missing boundary cases (empty input, off-by-one, page zero), or asks about "coverage gap", "edge case", "did we test".
---

# Clean Tests

## T1: Insufficient Tests

Test everything that could possibly break. Use coverage tools as a guide, not a goal.

```
// Bad — only tests happy path
test("divide"):
    assert divide(10, 2) == 5

// Good — tests edge cases too
test("divide normal"):
    assert divide(10, 2) == 5

test("divide by zero"):
    assert divide(10, 0) throws Error

test("divide negative"):
    assert divide(-10, 2) == -5
```

## T2: Use a Coverage Tool

Coverage tools report gaps in your testing strategy. Don't ignore them.

Run your test framework with coverage enabled. Aim for meaningful coverage, not 100%.

## T3: Don't Skip Trivial Tests

Trivial tests document behavior and catch regressions. They're worth more than their cost.

```
// Worth having — documents expected behavior
test("user default role"):
    user = User("Alice")
    assert user.role == "member"
```

## T4: An Ignored Test Is a Question About an Ambiguity

Don't skip tests to hide problems. Either fix the test or delete it.

```
// Bad — hiding a problem
skip("async operation"):  // flaky, fix later
    ...

// Good — document why it's skipped
skip("cache invalidation — requires Redis (see CONTRIBUTING.md)"):
    ...
```

## T5: Test Boundary Conditions

Bugs congregate at boundaries. Test them explicitly.

```
test("pagination boundaries"):
    items = range(100)

    assert paginate(items, page=1, size=10) == items[0:10]    // First page
    assert paginate(items, page=10, size=10) == items[90:100] // Last page
    assert paginate(items, page=11, size=10) == []            // Beyond last page
    assert paginate(items, page=0, size=10) throws Error      // Invalid page
    assert paginate([], page=1, size=10) == []                // Empty list
```

## T6: Exhaustively Test Near Bugs

When you find a bug, write tests for all similar cases. Bugs cluster.

```
// Found bug: off-by-one in date calculation
// Now test ALL date boundaries
test("month boundaries"):
    assert lastDayOfMonth(2024, 1) == 31  // January
    assert lastDayOfMonth(2024, 2) == 29  // Leap year February
    assert lastDayOfMonth(2023, 2) == 28  // Non-leap February
    assert lastDayOfMonth(2024, 4) == 30  // 30-day month
    assert lastDayOfMonth(2024, 12) == 31 // December
```

## T7: Patterns of Failure Are Revealing

When tests fail, look for patterns. They often point to deeper issues.

If all async tests fail intermittently, the problem isn't the tests — it's the async handling.

## T8: Test Coverage Patterns Can Be Revealing

Look at which code paths are untested. Often they reveal design problems.

If you can't easily test a function, it probably does too much. Refactor for testability.

## T9: Tests Should Be Fast

Slow tests don't get run. Keep unit tests under 100ms each.

```
// Bad — hits real database
test("user creation"):
    db = connectToDatabase()  // Slow!
    user = db.createUser("Alice")
    assert user.name == "Alice"

// Good — uses mock or in-memory
test("user creation"):
    db = InMemoryDatabase()
    user = db.createUser("Alice")
    assert user.name == "Alice"
```

## T10: Feature Flag Tests

Any code gated behind a feature flag must have tests that verify behavior with the flag both enabled and disabled. This prevents the flag itself from being the source of bugs.

```
// Bad — only tests with flag enabled
test("checkout with new flow"):
    enableFlag("new-checkout-flow")
    result = checkout(cart)
    assert result.success

// Good — tests both states
test("checkout with new flow enabled"):
    enableFlag("new-checkout-flow")
    result = checkout(cart)
    assert result.success
    assert result.receiptId != null

test("checkout with new flow disabled"):
    disableFlag("new-checkout-flow")
    result = checkout(cart)
    assert result.success
    assert result.receiptId == null  // old flow doesn't return receipt
```

When testing flagged code:
- **Default-off**: Test the default state (users who haven't received the flag)
- **Default-on**: Test the released state (users who have the flag)
- **Toggle at boundaries**: Test flipping the flag at runtime if supported
- **Cleanup**: Reset flag state between tests to avoid cross-test contamination

## Test Organization

### F.I.R.S.T. Principles

- **Fast**: Tests should run quickly
- **Independent**: Tests shouldn't depend on each other
- **Repeatable**: Same result every time, any environment
- **Self-Validating**: Pass or fail, no manual inspection
- **Timely**: Written before or with the code, not after

### One Concept Per Test

```
// Bad — testing multiple things
test("user"):
    user = User("Alice", "alice@example.com")
    assert user.name == "Alice"
    assert user.email == "alice@example.com"
    assert user.isValid()
    user.activate()
    assert user.isActive

// Good — one concept each
test("user stores name"):
    user = User("Alice", "alice@example.com")
    assert user.name == "Alice"

test("user stores email"):
    user = User("Alice", "alice@example.com")
    assert user.email == "alice@example.com"

test("new user is valid"):
    user = User("Alice", "alice@example.com")
    assert user.isValid()

test("user can be activated"):
    user = User("Alice", "alice@example.com")
    user.activate()
    assert user.isActive
```

## Quick Reference

| Rule | Principle |
|------|-----------|
| T1 | Test everything that could break |
| T2 | Use coverage tools |
| T3 | Don't skip trivial tests |
| T4 | Ignored test = ambiguity question |
| T5 | Test boundary conditions |
| T6 | Exhaustively test near bugs |
| T7 | Look for patterns in failures |
| T8 | Check coverage when debugging |
| T9 | Tests must be fast (<100ms) |
| T10 | Feature flag tests (flag on/off) |
