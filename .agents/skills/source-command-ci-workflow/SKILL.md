---
name: "source-command-ci-workflow"
description: "Migrated source command `ci-workflow`"
---

# source-command-ci-workflow

Use this skill when the user asks to run the migrated source command `ci-workflow`.

## Command Template

# /ci-workflow Command

Scaffolds lint, typecheck, and test matrix pipeline.

---

## 1. Identity & Execution

- **Lead Agent:** Merry
- **Specialist Agent:** release-manager
- **Category:** DevOps

---

## 2. Trigger Syntax

```bash
/ci-workflow
```

---

## 3. Workflow Protocol

1. **Step 1:** Analyze target request and verify prerequisite context.
2. **Step 2:** Execute GitHub Actions CI Pipeline Builder protocol adhering strictly to domain rules.
3. **Step 3:** Verify output against quality standards and pass verification.

---

## 4. Hard Verification Gates

- Enforce strict type-safety and defensive boundary checks.
- Verify zero regressions before completion.
