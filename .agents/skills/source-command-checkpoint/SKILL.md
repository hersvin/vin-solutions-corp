---
name: "source-command-checkpoint"
description: "Migrated source command `checkpoint`"
---

# source-command-checkpoint

Use this skill when the user asks to run the migrated source command `checkpoint`.

## Command Template

# /checkpoint Command

Saves active decisions, progress, and immediate next steps to disk.

---

## 1. Identity & Execution

- **Lead Agent:** Samwise
- **Specialist Agent:** state-keeper
- **Category:** Workflow

---

## 2. Trigger Syntax

```bash
/checkpoint
```

---

## 3. Workflow Protocol

1. **Step 1:** Inspect git status and staged diffs.
2. **Step 2:** Record settled architectural decisions.
3. **Step 3:** Save checkpoint document in docs/checkpoints/.

---

## 4. Hard Verification Gates

- Single-mention constraints must never be dropped.
