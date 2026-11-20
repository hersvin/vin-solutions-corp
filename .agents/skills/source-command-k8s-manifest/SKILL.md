---
name: "source-command-k8s-manifest"
description: "Migrated source command `k8s-manifest`"
---

# source-command-k8s-manifest

Use this skill when the user asks to run the migrated source command `k8s-manifest`.

## Command Template

# /k8s-manifest Command

Scaffolds Deployment, Service, and Ingress YAML.

---

## 1. Identity & Execution

- **Lead Agent:** Gimli
- **Specialist Agent:** devops-engineer
- **Category:** DevOps

---

## 2. Trigger Syntax

```bash
/k8s-manifest <service>
```

---

## 3. Workflow Protocol

1. **Step 1:** Analyze target request and verify prerequisite context.
2. **Step 2:** Execute Kubernetes Deployment Manifests protocol adhering strictly to domain rules.
3. **Step 3:** Verify output against quality standards and pass verification.

---

## 4. Hard Verification Gates

- Enforce strict type-safety and defensive boundary checks.
- Verify zero regressions before completion.
