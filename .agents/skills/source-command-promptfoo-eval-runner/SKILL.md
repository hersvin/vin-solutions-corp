---
name: "source-command-promptfoo-eval-runner"
description: "Migrated source command `promptfoo-eval-runner`"
---

# source-command-promptfoo-eval-runner

Use this skill when the user asks to run the migrated source command `promptfoo-eval-runner`.

## Command Template

# /promptfoo-eval-runner Command

Builds stage-separated RAG evals with thresholds that block regressions.

---

## 1. Identity & Execution

- **Lead Agent:** Merry
- **Specialist Agent:** eval-gatekeeper
- **Category:** Testing

---

## 2. Trigger Syntax

```bash
/promptfoo-eval-runner <target>
```

---

## 3. Workflow Protocol

1. **Step 1:** Build retrieval eval with recall and relevance assertions.
2. **Step 2:** Build generation eval with factuality and answer relevance assertions.
3. **Step 3:** Wire the combined gate and prove it fails on injected regression.

---

## 4. Hard Verification Gates

- Set explicit thresholds per metric.
- Verify the gate trips on regression before CI enforcement.
