# HRIS Folder Structure

One monorepo: `backend/` (NestJS), `frontend/web` (React + Vite), `frontend/mobile` (React Native + Expo).
Modules mirror PRD §5.1 + schema `.docs/database-schema.md`. Per-module ownership: each Nest module owns its controllers/services; each React module owns routes; shared kernel holds cross-cutting code.

---

## 1. Root

```
hersvin/
├── .docs/
│   ├── product-requirements-document.md
│   ├── database-schema.md
│   └── architecture.md
├── backend/                        # NestJS monolith, modular
├── frontend/
│   ├── web/                       # React + Vite SPA
│   └── mobile/                    # React Native (Expo)
├── shared/
│   ├── types/                     # TS interfaces shared via package
│   ├── constants/
│   └── validation/                # zod schemas exported to all 3 apps
├── docker/
│   ├── docker-compose.yml         # postgres, redis, minio, backend, web
│   └── minio/policies/
├── .github/workflows/             # ci.yml, cd-web.yml, cd-mobile.yml
├── .env.example
├── tsconfig.base.json
├── pnpm-workspace.yaml
└── README.md
```

Workspace: pnpm (or npm workspaces). `shared/` package: `@hersvin/shared` — single source for DTO types + zod.

---

## 2. Backend — NestJS (`backend/`)

Modular monolith. Each PRD module = one Nest module with entities, services, controllers, DTOs. `@nestjs/terminus` for health, `@nestjs/config` for env, `@nestjs/jwt`+passport for auth, `typeorm` (Prisma alternative; keep swap-able via repositories) + `@nestjs/throttler`.

```
backend/
├── src/
│   ├── main.ts
│   ├── app.module.ts
│   ├── config/
│   │   ├── app.config.ts
│   │   └── db.config.ts
│   │
│   ├── common/                                  # cross-cutting, no business logic
│   │   ├── decorators/        # @Roles, @FieldMask, @Audit, @Scope
│   │   ├── guards/            # JwtGuard, RolesGuard, ScopingGuard, MaskGuard
│   │   ├── interceptors/      # AuditInterceptor, ScopeInterceptor, FieldMaskInterceptor
│   │   ├── filters/           # global exception filter
│   │   ├── pipes/             # validation, soft-delete filter
│   │   ├── audit/             # audit_event writer (interceptor + event bus)
│   │   ├── pagination/        # cursor + offset
│   │   ├── permissions/       # field-level + record-level engine (§10/§11)
│   │   └── soft-delete/       # base entity, mixin
│   │
│   ├── core/
│   │   ├── database/          # typeorm config, migrations runner, seeds
│   │   ├── events/            # in-app event bus (audit, notifications)
│   │   ├── integrations/
│   │   │   ├── ams/           # payroll journal export, cost-center sync
│   │   │   ├── ims/          # asset catalog sync
│   │   │   ├── idp/          # SSO + JML (joiner/mover/leaver) lifecycle
│   │   │   └── notification/ # email/sms/webhook out
│   │   └── storage/           # minio/S3 client, signed URLs, malware scan hook
│   │
│   │
│   ├── modules/
│   │   ├── auth/              # user, login, MFA, session, token refresh
│   │   │   ├── auth.module.ts / controller / service
│   │   │   ├── strategies/    # jwt, oidc (idp)
│   │   │   └── dto/
│   │   │
│   │   ├── rbac/              # role, user_role, role_permission, entity_scope,
│   │   │                      # data_mask_rule + permission engine API
│   │   │
│   │   ├── cms/               # Module 1 — legal_entity, company, branch, location,
│   │   │                      # department, team, position, job_level,
│   │   │                      # employment_type, work_location_type, cost_center,
│   │   │                      # org_chart_snapshot
│   │   │   ├── entities/
│   │   │   ├── cms.controller.ts
│   │   │   ├── cms.service.ts
│   │   │   ├── org-chart.service.ts     # current + historical structure
│   │   │   └── dto/
│   │   │
│   │   ├── hrms/              # Module 2 — employee, user, employee_contact,
│   │   │                      # employment_record, compensation_record, contract,
│   │   │                      # employee_event, checklist_*, employee_match_rule,
│   │   │                      # er_case
│   │   │   ├── entities/
│   │   │   ├── hrms.controller.ts
│   │   │   ├── hrms.service.ts
│   │   │   ├── lifecycle.service.ts     # onboarding/offboarding/checklist engine
│   │   │   ├── dedupe.service.ts        # configurable matching
│   │   │   └── dto/
│   │   │
│   │   ├── payroll/           # Module 3 — pay_group, pay_period, salary_component,
│   │   │                      # payroll_run(_item), payroll_adjustment, payslip,
│   │   │                      # ams_payroll_journal, *_rule
│   │   │   ├── entities/
│   │   │   ├── payroll.controller.ts
│   │   │   ├── run.service.ts           # prepare → preview → approve → lock
│   │   │   ├── calculation/            # jurisdiction rule engine (pluggable)
│   │   │   ├── ams-export.service.ts    # approved journal out
│   │   │   ├── payslip.service.ts       # PDF gen
│   │   │   └── dto/
│   │   │
│   │   ├── attendance/        # Module 4 — work_schedule, shift, holiday*,
│   │   │                      # attendance_entry, attendance_adjustment,
│   │   │                      # attendance_exception, period_attendance_summary
│   │   │   ├── entities/
│   │   │   ├── attendance.controller.ts
│   │   │   ├── punch.service.ts         # web/mobile clock-in + device/import adapters
│   │   │   ├── correction.service.ts    # approval flow, original preserved
│   │   │   ├── summary.service.ts       # daily/weekly/period views
│   │   │   ├── device/                  # integration adapters (biometric optional)
│   │   │   └── dto/
│   │   │
│   │   ├── leave/             # Module 5 — leave_type, leave_balance,
│   │   │                      # leave_request, leave_approval, leave_ledger_entry
│   │   │   ├── entities/
│   │   │   ├── leave.controller.ts
│   │   │   ├── request.service.ts       # draft/submit/amend/cancel
│   │   │   ├── policy.service.ts        # rules: accrual, carryover, conflicts, balances
│   │   │   ├── approval.service.ts      # manager + HR routing
│   │   │   ├── ledger.service.ts        # post approved decisions
│   │   │   └── dto/
│   │   │
│   │   ├── recruitment/       # Module 6 — job_requisition, job_posting, candidate,
│   │   │                      # application, interview, offer, candidate_consent
│   │   │   ├── entities/
│   │   │   ├── recruitment.controller.ts
│   │   │   ├── requisition.service.ts
│   │   │   ├── pipeline.service.ts      # stage machine + feedback
│   │   │   ├── offer.service.ts         # offer → hire → employee record (dedupe)
│   │   │   ├── consent.service.ts       # retention/deletion policy
│   │   │   └── dto/
│   │   │
│   │   ├── documents/         # Module 7 — document_category, document,
│   │   │                      # document_version, document_access_log,
│   │   │                      # document_expiry_rule, document_disposal
│   │   │   ├── entities/
│   │   │   ├── documents.controller.ts
│   │   │   ├── upload.service.ts        # storage + virus scan + hash
│   │   │   ├── versioning.service.ts
│   │   │   ├── expiry.service.ts        # alerts + renewal workflow
│   │   │   ├── retention.service.ts      # legal hold + disposal
│   │   │   └── dto/
│   │   │
│   │   ├── performance/       # Module 8 — review_cycle, evaluation_template,
│   │   │                      # rating_scale, review_participant, review,
│   │   │                      # review_response, goal, competency,
│   │   │                      # calibration_session
│   │   │   ├── entities/
│   │   │   ├── performance.controller.ts
│   │   │   ├── cycle.service.ts         # config/assign/finalize state machine
│   │   │   ├── assessment.service.ts    # self/manager/peer/hr
│   │   │   ├── calibration.service.ts
│   │   │   ├── goal.service.ts
│   │   │   └── dto/
│   │   │
│   │   ├── assets/            # Module 9 — asset_category, asset, asset_assignment,
│   │   │                      # asset_transfer, asset_maintenance,
│   │   │                      # asset_inventory_check
│   │   │   ├── entities/
│   │   │   ├── assets.controller.ts
│   │   │   ├── lifecycle.service.ts     # available→assigned→in_use→returned/disposed
│   │   │   ├── inventory.service.ts
│   │   │   ├── ims-sync.service.ts      # catalog reference (IMS)
│   │   │   └── dto/
│   │   │
│   │   ├── projects/          # Module 10 — project, project_member,
│   │   │                      # project_visibility, milestone, task,
│   │   │                      # task_dependency, task_comment, task_attachment,
│   │   │                      # task_activity, project_notification_pref
│   │   │   ├── entities/
│   │   │   ├── projects.controller.ts
│   │   │   ├── project.service.ts
│   │   │   ├── task.service.ts          # status machine + board/list/calendar
│   │   │   ├── dependency.service.ts    # topological + overdue detection
│   │   │   ├── reporting.service.ts     # progress, overdue, workload
│   │   │   └── dto/
│   │   │
│   │   ├── notifications/     # cross-cutting: notification entity + dispatch
│   │   │   ├── notification.controller.ts
│   │   │   ├── dispatch.service.ts      # fan-out to email/sms/webhook
│   │   │   └── trigger/               # event-driven creation from other modules
│   │   │
│   │   ├── approvals/         # cross-cutting: approval_request + routing engine
│   │   │   ├── approvals.controller.ts
│   │   │   └── approval-engine.service.ts  # leave, attendance corrections,
│   │   │                                   # payrolls, reqs — unified routing
│   │   │
│   │   └── audit/             # audit_event read + reporting (writes via common)
│   │
│   ├── migrations/            # typeorm migrations (or prisma/ if swapped)
│   │   └── versions/
│   ├── seeds/                 # reference data: leave types, job levels, roles
│   └── tests/                 # e2e + unit mirrors src/ layout
├── prisma/                    # if Prisma chosen instead of TypeORM
├── test/
├── .env.example
├── nest-cli.json
├── package.json
└── tsconfig.json
```

### API route map (controllers)

```
/auth, /rbac,
/cms/**,                        # legal entities, departments, positions, org chart
/hrms/**,                       # employees, employment, lifecycle events, checklists
/payroll/**,                    # runs, previews, approvals, payslips, AMS export
/attendance/**,                 # punches, corrections, schedules, summaries
/leave/**,                      # requests, balances, ledger
/recruitment/**,                # reqs, candidates, pipeline, offers
/documents/**,                  # documents, versions, expiry
/performance/**,                # cycles, reviews, goals, calibration
/assets/**,                     # assets, assignments, inventory
/projects/**,                   # projects, tasks, boards, reporting
/notifications/**, /approvals/**, /audit/**
```

Versioned: `/api/v1`. OpenAPI 3 auto-gen (via nestjs/swagger).

### Cross-module contracts

- **Event bus (`core/events`):** modules publish domain events (`EmployeeHired`, `PayrollLocked`, `LeaveApproved`, `AssetReturned`, `TaskCompleted`). Subscribers: notifications, audit, AMS export, IdP lifecycle, BIS.
- **Approval engine:** single routing table; business modules call `approvalEngine.submit({module, entity, rules})`.
- **Field masking:** one interceptor; rules from `data_mask_rule` + role grants. Applied to every serialized DTO.

---

## 3. Frontend — Web (`frontend/web/`)

React + Vite + TypeScript. Router: `react-router-dom`. State: TanStack Query (server) + Zustand (client). Forms: react-hook-form + zod (`@hersvin/shared/validation`). UI: `shadcn/ui` + Tailwind v4. Charts: Recharts. Tables: TanStack Table. i18n: i18next.

```
frontend/web/
├── public/
├── src/
│   ├── main.tsx
│   ├── app/
│   │   ├── App.tsx                  # provider tree
│   │   ├── providers/
│   │   │   ├── auth.provider.tsx
│   │   │   ├── query.provider.tsx
│   │   │   ├── i18n.provider.tsx
│   │   │   └── toast.provider.tsx
│   │   └── router/
│   │       ├── index.tsx            # route table + lazy chunks
│   │       └── guards/              # AuthGuard, RoleGuard, ScopeGuard
│   │
│   ├── api/                         # generated from backend OpenAPI
│   │   ├── client.ts                # fetch + auth + retry + interceptor
│   │   └── sdk/                     # per-module typed client (codegen)
│   │
│   ├── features/                    # per-module feature folders
│   │   ├── auth/                    # login, MFA, profile, password
│   │   ├── rbac/                    # users, roles, permissions, scopes
│   │   ├── cms/                     # departments, teams, positions, org chart
│   │   ├── hrms/                    # employee directory, profile, lifecycle
│   │   ├── payroll/                 # runs, previews, payslips, AMS export
│   │   ├── attendance/              # clock-in widget, corrections, reports
│   │   ├── leave/                   # request, balances, ledger, calendar
│   │   ├── recruitment/             # reqs, pipeline (kanban), interviews, offers
│   │   ├── documents/               # library, upload, versions, expiry dashboard
│   │   ├── performance/             # cycles, review wizard, goals, calibration
│   │   ├── assets/                  # asset register, assignment, inventory
│   │   ├── projects/                # projects, board/list/calendar views
│   │   ├── notifications/           # notification center
│   │   ├── approvals/               # unified approval inbox
│   │   ├── audit/                   # audit trail viewer (read-only)
│   │   └── self-service/            # ESS portal (employee home, payslips, leave, docs)
│   │
│   │   # each feature folder:
│   │   #   └── <feature>/
│   │   #       ├── index.ts         # public API
│   │   #       ├── components/
│   │   #       ├── pages/           # routes live here
│   │   #       ├── hooks/           # use<Feature>… query hooks
│   │   #       └── types.ts        # re-exported from @hersvin/shared
│   │
│   ├── shared/
│   │   ├── ui/                       # design-system primitives
│   │   ├── layouts/                  # AppShell, ModuleNav, TopBar
│   │   ├── forms/                    # form helpers, zod integration
│   │   ├── tables/                   # data-grid wrapper
│   │   ├── charts/                   # recharts themes
│   │   ├── date-time/                # tz-aware helpers
│   │   └── hooks/                    # useAuth, usePermissions, useScopes, useFeatureFlags
│   │
│   ├── styles/                       # tailwind, tokens, dark-mode
│   └── config/
│       ├── env.ts
│       └── feature-flags.ts
├── .env.example
├── vite.config.ts
├── tsconfig.json
└── package.json
```

### Route map

```
/login, /sso/callback, /mfa
/app
  /overview                          # role-aware dashboard
  /self-service                     # ESS home (employee)
  /employees, /employees/:empNo, /employees/:empNo/history
  /org, /org/chart
  /recruitment, /recruitment/:reqId, /recruitment/pipeline
  /attendance, /attendance/corrections, /attendance/reports
  /leave, /leave/balances, /leave/ledger, /leave/calendar
  /payroll, /payroll/runs/:id, /payroll/payslips, /payroll/ams-export
  /documents, /documents/:docId, /documents/expiring
  /performance, /performance/cycles/:id, /performance/goals, /performance/calibration
  /assets, /assets/inventory, /assets/checks
  /projects, /projects/:id, /projects/:id/board, /projects/:id/calendar, /projects/:id/reporting
  /approvals, /notifications, /audit
/admin/users, /admin/roles, /admin/permissions
```

Route guard reads `usePermissions()` + `useScopes()`. Unknown-scoped routes 403, not hidden.

---

## 4. Frontend — Mobile (`frontend/mobile/`)

React Native + Expo. Focus: **clock-in (attendance), leave request/approval, notification inbox, payslips, documents, self-service profile**. No payroll run UI on mobile (read-only payslip view only).

```
frontend/mobile/
├── app/                              # expo-router (file-based)
│   ├── _layout.tsx                   # root stack + providers
│   ├── index.tsx                     # splash → auth
│   ├── auth/
│   │   ├── sign-in.tsx
│   │   ├── mfa.tsx
│   │   └── sso-callback.tsx
│   ├── (app)/                        # authed area
│   │   ├── _layout.tsx
│   │   ├── home.tsx                  # role-aware home: attendance, leave, requests
│   │   ├── attendance/
│   │   │   ├── index.tsx             # today's clock + history
│   │   │   ├── clock-in.tsx          # GPS + optional device handoff
│   │   │   └── corrections.tsx       # submit / track
│   │   ├── leave/
│   │   │   ├── index.tsx             # balances + calendar
│   │   │   ├── request.tsx
│   │   │   └── approvals.tsx         # manager view
│   │   ├── payslips/
│   │   │   ├── index.tsx
│   │   │   └── [id].tsx
│   │   ├── documents/
│   │   │   ├── index.tsx
│   │   │   └── [id].tsx             # signed-URL download, no local store
│   │   ├── projects/
│   │   │   ├── index.tsx            # my tasks
│   │   │   └── [id].tsx             # task detail + board (mobile)
│   │   ├── notifications/
│   │   │   ├── index.tsx
│   │   │   └── [id].tsx
│   │   └── profile/
│   │       ├── index.tsx
│   │       └── settings.tsx
│   └── +not-found.tsx
│
├── src/
│   ├── api/                          # same generated SDK as web (from @hersvin/shared)
│   ├── features/
│   │   ├── auth/
│   │   ├── attendance/
│   │   ├── leave/
│   │   ├── payslips/
│   │   ├── documents/
│   │   ├── projects/
│   │   ├── notifications/
│   │   └── profile/
│   ├── shared/
│   │   ├── components/              # design system primitives
│   │   ├── hooks/
│   │   └── theme/                   # light/dark
│   └── config/
│       ├── env.ts
│       └── flags.ts
├── assets/
├── app.config.ts                     # expo config (eas build profiles)
├── eas.json                          # build profiles: dev, preview, prod (ios+android)
├── package.json
└── tsconfig.json
```

### Mobile-specific

- **Push:** Firebase Cloud Messaging + APNs; deep-link routing via expo-router; silent payload for leave reminders.
- **Offline:** attendance punches queue locally (SQLite) and sync when back online (idempotent `correlation_id`).
- **Security:** app-lock (biometric), encrypted token storage (Keychain/Keystore), no document cache.
- **Biometric device handoff:** optional; §5.3 excludes until privacy/consent defined — keep UI hook.

---

## 5. Shared package (`shared/`)

```
shared/
├── types/
│   ├── entities/                     # mirrors schema tables (DTO types only)
│   │   ├── cms.ts
│   │   ├── hrms.ts
│   │   ├── payroll.ts
│   │   ├── attendance.ts
│   │   ├── leave.ts
│   │   ├── recruitment.ts
│   │   ├── documents.ts
│   │   ├── performance.ts
│   │   ├── assets.ts
│   │   ├── projects.ts
│   │   ├── rbac.ts
│   │   └── audit.ts
│   ├── api/                         # request/response envelopes
│   └── events/                      # domain event contracts
├── constants/
│   ├── status-codes.ts              # enums per entity
│   └── permissions.ts              # resource + action constants
└── validation/
    └── schemas/                     # zod per entity; imported by web/mobile forms
        ├── cms.zod.ts
        ├── hrms.zod.ts
        └── …
package.json                          # name: @hersvin/shared
```

Generated client types: backend OpenAPI → `shared/types/api` (via `openapi-typescript`) on PR to backend.

---

## 6. Module → artifact map (alignment check)

| PRD §5.1 Module | Backend | Web | Mobile |
|---|---|---|---|
| 1 CMS | `modules/cms` | `features/cms` (org chart) | profile (work location) |
| 2 HRMS | `modules/hrms` | `features/hrms`, `features/self-service` | `features/profile` |
| 3 Payroll | `modules/payroll` | `features/payroll` | `features/payslips` (read-only) |
| 4 Attendance | `modules/attendance` | `features/attendance` | `features/attendance` (clock) |
| 5 Leave | `modules/leave` | `features/leave` | `features/leave` (request/approve) |
| 6 Recruitment | `modules/recruitment` | `features/recruitment` | — |
| 7 Documents | `modules/documents` | `features/documents` | `features/documents` (own docs) |
| 8 Performance | `modules/performance` | `features/performance` | — |
| 9 Assets | `modules/assets` | `features/assets` | — |
| 10 Projects | `modules/projects` | `features/projects` | `features/projects` (my tasks) |
| Shared: auth/rbac/notifications/approvals/audit | `modules/*` + `common/*` | `features/*`, `features/approvals` | `features/notifications` |
| AMS export | `modules/payroll/ams-export` | — | — |
| IdP JML | `core/integrations/idp` | — | — |

---

## 7. Build / tooling

- **Backend:** NestJS 10, `@nestjs/cli`, TypeORM + `@nestjs/terminus`, `nestjsx-otpgen` (MFA TOTP), `nestjs-pino` (logs), Jest + Supertest, ESLint + Prettier + Husky + lint-staged, `conventional commits`.
- **Web:** Vite 6, React 19, TypeScript 5, Tailwind 4, shadcn/ui, TanStack Query v5 + Table v8, Zustand 5, i18next, Vitest + Playwright (e2e).
- **Mobile:** Expo SDK 53+, expo-router v5, nativewind, Zustand 5, TanStack Query 5 (RN), React Native 0.7x, EAS builds (dev/preview/prod), Firebase for push + analytics, Sentry RN.
- **CI:** GitHub Actions — matrix: `backend` (lint+test+build), `web` (lint+test+build), `mobile` (lint+test, EAS preview on PR), `docker` (build+scan+push).
- **Secrets:** Vault or AWS SSM (not env files in repo). `.env.example` placeholders only.

---

## 8. Conventions

1. **Naming:** `camelCase` TS, `snake_case` wire, `PascalCase` components/classes, modules named per PRD.
2. **Layering:** `controller → service → repository → entity`. No cross-module service imports; cross-module calls via event bus or a shared `service-port` (interface).
3. **DTOs:** one-way mappers (`entity → dto`) at the controller boundary; zod from `@hersvin/shared` for every public input.
4. **Testing:** unit per service, e2e per controller + auth flow; mobile: jest-expo + Detox (smoke).
5. **Feature flags:** `src/config/feature-flags.ts` mirrors backend `FeatureFlagService`; off-by-default for §5.2 extras (training, benefits, ER cases, workforce planning).
6. **No secrets in repo:** `.env.example` only; `env-validate` skill on CI.
7. **Migrations:** forward-only; seeds idempotent; rollback scripts reviewed by `samwise` (git state).
