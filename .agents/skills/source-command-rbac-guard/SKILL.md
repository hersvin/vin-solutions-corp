---
name: "source-command-rbac-guard"
description: "Migrated source command `rbac-guard`"
---

# source-command-rbac-guard

Use this skill when the user asks to run the migrated source command `rbac-guard`.

## Command Template

# /rbac-guard Command

Enforces role and permission gates on protected actions.

---

## 1. Identity & Execution

- **Lead Agent:** Boromir
- **Specialist Agent:** auth-specialist
- **Category:** Security

---

## 2. Trigger Syntax

```bash
/rbac-guard <role>
```

---

## 3. Workflow Protocol

1. **Step 1:** Analyze target request and verify prerequisite context.
2. **Step 2:** Execute Role-Based Access Control Rule protocol adhering strictly to domain rules.
3. **Step 3:** Verify output against quality standards and pass verification.

---

## 4. Hard Verification Gates

- Enforce strict type-safety and defensive boundary checks.
- Verify zero regressions before completion.
