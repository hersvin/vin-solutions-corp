---
name: "source-command-queue-worker"
description: "Migrated source command `queue-worker`"
---

# source-command-queue-worker

Use this skill when the user asks to run the migrated source command `queue-worker`.

## Command Template

# /queue-worker Command

Scaffolds job queue workers with exponential backoff.

---

## 1. Identity & Execution

- **Lead Agent:** Gimli
- **Specialist Agent:** backend-engineer
- **Category:** Backend

---

## 2. Trigger Syntax

```bash
/queue-worker <job-name>
```

---

## 3. Workflow Protocol

1. **Step 1:** Analyze target request and verify prerequisite context.
2. **Step 2:** Execute Background Job Worker Scaffolder protocol adhering strictly to domain rules.
3. **Step 3:** Verify output against quality standards and pass verification.

---

## 4. Hard Verification Gates

- Enforce strict type-safety and defensive boundary checks.
- Verify zero regressions before completion.
