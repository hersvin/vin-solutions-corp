---
name: "source-command-nginx-conf"
description: "Migrated source command `nginx-conf`"
---

# source-command-nginx-conf

Use this skill when the user asks to run the migrated source command `nginx-conf`.

## Command Template

# /nginx-conf Command

Builds production Nginx config with gzip and SSL.

---

## 1. Identity & Execution

- **Lead Agent:** Gimli
- **Specialist Agent:** devops-engineer
- **Category:** DevOps

---

## 2. Trigger Syntax

```bash
/nginx-conf
```

---

## 3. Workflow Protocol

1. **Step 1:** Analyze target request and verify prerequisite context.
2. **Step 2:** Execute Reverse Proxy Nginx Configurator protocol adhering strictly to domain rules.
3. **Step 3:** Verify output against quality standards and pass verification.

---

## 4. Hard Verification Gates

- Enforce strict type-safety and defensive boundary checks.
- Verify zero regressions before completion.
