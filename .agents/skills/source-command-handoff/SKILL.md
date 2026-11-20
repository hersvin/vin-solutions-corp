---
name: "source-command-handoff"
description: "Migrated source command `handoff`"
---

# source-command-handoff

Use this skill when the user asks to run the migrated source command `handoff`.

## Command Template

# /handoff Command

Compresses session state for seamless continuation in new chat.

---

## 1. Identity & Execution

- **Lead Agent:** Samwise
- **Specialist Agent:** handoff-specialist
- **Category:** Workflow

---

## 2. Trigger Syntax

```bash
/handoff
```

---

## 3. Workflow Protocol

1. **Step 1:** Identify recipient type (new AI session or human teammate).
2. **Step 2:** Extract decisions, dead ends, artifacts, and working preferences.
3. **Step 3:** Generate paste-ready opening prompt for next session.

---

## 4. Hard Verification Gates

- Document must be readable within 2 to 3 minutes.
