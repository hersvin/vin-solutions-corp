---
name: "source-command-monorepo-sync"
description: "Migrated source command `monorepo-sync`"
---

# source-command-monorepo-sync

Use this skill when the user asks to run the migrated source command `monorepo-sync`.

## Command Template

# /monorepo-sync Command

Syncs shared dependency versions across workspaces.

---

## 1. Identity & Execution

- **Lead Agent:** Gandalf
- **Specialist Agent:** monorepo-architect
- **Category:** DevOps

---

## 2. Trigger Syntax

```bash
/monorepo-sync
```

---

## 3. Workflow Protocol

1. **Step 1:** Analyze target request and verify prerequisite context.
2. **Step 2:** Execute Monorepo Package Dependency Sync protocol adhering strictly to domain rules.
3. **Step 3:** Verify output against quality standards and pass verification.

---

## 4. Hard Verification Gates

- Enforce strict type-safety and defensive boundary checks.
- Verify zero regressions before completion.
