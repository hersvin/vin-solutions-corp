---
name: "source-command-sql-query"
description: "Migrated source command `sql-query`"
---

# source-command-sql-query

Use this skill when the user asks to run the migrated source command `sql-query`.

## Command Template

# /sql-query Command

Writes parameterized SQL queries with joins and CTEs.

---

## 1. Identity & Execution

- **Lead Agent:** Gimli
- **Specialist Agent:** sql-optimizer
- **Category:** Database

---

## 2. Trigger Syntax

```bash
/sql-query
```

---

## 3. Workflow Protocol

1. **Step 1:** Analyze target request and verify prerequisite context.
2. **Step 2:** Execute Optimized Raw SQL Query Builder protocol adhering strictly to domain rules.
3. **Step 3:** Verify output against quality standards and pass verification.

---

## 4. Hard Verification Gates

- Enforce strict type-safety and defensive boundary checks.
- Verify zero regressions before completion.
