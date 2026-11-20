---
name: "source-command-db-seed"
description: "Migrated source command `db-seed`"
---

# source-command-db-seed

Use this skill when the user asks to run the migrated source command `db-seed`.

## Command Template

# /db-seed Command

Generates reproducible test fixtures and seed scripts.

---

## 1. Identity & Execution

- **Lead Agent:** Gimli
- **Specialist Agent:** database-admin
- **Category:** Database

---

## 2. Trigger Syntax

```bash
/db-seed
```

---

## 3. Workflow Protocol

1. **Step 1:** Analyze target request and verify prerequisite context.
2. **Step 2:** Execute Deterministic Database Seeder protocol adhering strictly to domain rules.
3. **Step 3:** Verify output against quality standards and pass verification.

---

## 4. Hard Verification Gates

- Enforce strict type-safety and defensive boundary checks.
- Verify zero regressions before completion.
