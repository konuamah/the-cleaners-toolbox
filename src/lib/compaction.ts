export function createCompactionContext(): string {
  return [
    "## Active Clean Code Standards",
    "",
    "The following clean-code rules are active constraints on this project. All code produced must satisfy these standards:",
    "",
    "| Category | Rules | Key Principle |",
    "|----------|-------|---------------|",
    "| Comments | C1-C5 | No metadata, no redundancy, no commented-out code |",
    "| Functions | F1-F4 | Max 3 params, no flag args, return not mutate |",
    "| General | G5, G16, G23, G25, G30, G36 | DRY, clear intent, polymorphism, named constants, single responsibility, Law of Demeter |",
    "| Names | N1-N7 | Descriptive, unambiguous, no encodings |",
    "| Tests | T1-T9 | Fast, boundary-tested, one concept per test |",
    "| Debugging | D1-D4 | Reproduce, verify, one fix at a time, regression test |",
    "| Planning | P1-P3 | Design first, written plans, validate against standards |",
    "",
    "Run `review-code` on files before marking implementation tasks as complete.",
  ].join("\n")
}
