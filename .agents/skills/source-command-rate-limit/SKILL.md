---
name: "source-command-rate-limit"
description: "Migrated source command `rate-limit`"
---

# source-command-rate-limit

Use this skill when the user asks to run the migrated source command `rate-limit`.

## Command Template

# /rate-limit Command

Implements sliding-window rate limiting per IP or token.

---

## 1. Identity & Execution

- **Lead Agent:** Gimli
- **Specialist Agent:** backend-engineer
- **Category:** Backend

---

## 2. Trigger Syntax

```bash
/rate-limit
```

---

## 3. Workflow Protocol

1. **Step 1:** Analyze target request and verify prerequisite context.
2. **Step 2:** Execute API Rate Limiting Guard protocol adhering strictly to domain rules.
3. **Step 3:** Verify output against quality standards and pass verification.

---

## 4. Hard Verification Gates

- Enforce strict type-safety and defensive boundary checks.
- Verify zero regressions before completion.
