---
name: "source-command-audit-deps"
description: "Migrated source command `audit-deps`"
---

# source-command-audit-deps

Use this skill when the user asks to run the migrated source command `audit-deps`.

## Command Template

# /audit-deps Command

Verifies lockfile immutability and scans for transitive vulnerabilities.

---

## 1. Identity & Execution

- **Lead Agent:** Boromir
- **Specialist Agent:** dependency-auditor
- **Category:** Security

---

## 2. Trigger Syntax

```bash
/audit-deps
```

---

## 3. Workflow Protocol

1. **Step 1:** Run package audit across production dependencies.
2. **Step 2:** Flag high and critical CVEs with upgrade remedies.
3. **Step 3:** Verify lockfile matches package declarations.

---

## 4. Hard Verification Gates

- Block deployment if unresolved high CVE exists.
