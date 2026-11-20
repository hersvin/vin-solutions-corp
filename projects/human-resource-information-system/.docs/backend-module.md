# HRIS Backend — Module Spec (NestJS + TypeORM + PostgreSQL + MinIO/S3)

Aligned to: `.docs/folder-structure.md` §2 + `.docs/database-schema.md`.
Stack confirmed: **PostgreSQL only**, **TypeORM decorators + migrations**, **local JWT + MFA**, **MinIO/S3**.

## 1. Tech stack (final)

| Concern             | Choice | Notes |
|---|---|---|
| Runtime            | Node.js LTS | 20+ |
| Framework          | NestJS | 10 |
| Language           | TypeScript (strict) | 5.7 |
| ORM                | TypeORM | 0.3, decorators + `migration:generate` |
| Database           | PostgreSQL | 15+ (single engine, no polyglot) |
| Cache / session    | In-process TTL (node-cache) — no Redis for MVP | add Redis in Release 2 |
| Auth               | `@nestjs/jwt` + passport, TOTP MFA (`otplib`) | local, IdP SSO later |
| File storage       | MinIO / S3 (minio-js) | signed URLs, time-limited |
| Logging            | nestjs-pino → structured JSON | correlation id, PII redaction |
| Validation         | class-validator + class-transformer | DTOs |
| API docs           | `@nestjs/swagger` | OpenAPI 3, codegen source for frontends |
| Testing            | Jest + Supertest + Testcontainers (postgres) | e2e |
| Jobs / events      | in-process EventEmitter + `@nestjs/bull`-less | domain event bus |

**Multi-database:** Not required. PostgreSQL covers all relational modules. JSONB handles fluid shapes (calibration outcomes, evaluation answers, consent metadata). Files live in MinIO/S3, not in DB rows.

---

## 2. Repository layout (mirror `folder-structure.md` §2)

```
backend/src/
├── main.ts
├── app.module.ts
├── config/
├── common/                 # guards, interceptors, pipes, audit writer, permissions
├── core/
│   ├── database/          # TypeORM DataSource, migration runner, seeds
│   ├── events/            # in-process domain event bus
│   ├── integrations/      # ams, ims, idp, notification
│   └── storage/           # minio/s3 client, signed URLs, virus-scan hook
├── modules/
│   ├── auth/
│   ├── rbac/
│   ├── cms/
│   ├── hrms/
│   ├── payroll/
│   ├── attendance/
│   ├── leave/
│   ├── recruitment/
│   ├── documents/
│   ├── performance/
│   ├── assets/
│   ├── projects/
│   ├── notifications/
│   ├── approvals/
│   └── audit/
├── entities/              # shared TypeORM entities (one file per schema table)
├── migrations/
└── seeds/
```

---

## 3. TypeORM configuration

### `core/database/typeorm.config.ts`

```ts
export default registerAs("typeorm", () => ({
  type: "postgres",
  host: process.env.DB_HOST ?? "localhost",
  port: Number(process.env.DB_PORT ?? 5432),
  username: process.env.DB_USER ?? "hersvin",
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME ?? "hersvin",
  entities: [__dirname + "/../../entities/**/*.entity{.ts,.js}"],
  migrations: [__dirname + "/../../migrations/*{.ts,.js}"],
  synchronize: false,                 // always false in prod; migrations only
  migrationsRun: false,              // run explicitly via CLI
  logging: process.env.NODE_ENV !== "production",
  timezone: "UTC",
  namingStrategy: new SnakeCaseNamingStrategy(),
  extra: { max: 10 },               // pool size
}));
```

### `.env` (placeholders, no secrets in repo)

```
DB_HOST=localhost
DB_PORT=5432
DB_USER=hersvin
DB_PASSWORD=          # from secret store
DB_NAME=hersvin
JWT_SECRET=           # from secret store
JWT_ACCESS_TTL=15m
JWT_REFRESH_TTL=7d
MINIO_ENDPOINT=localhost:9000
MINIO_BUCKET=hersvin-docs
MINIO_ACCESS_KEY=     # from secret store
MINIO_SECRET_KEY=     # from secret store
MINIO_SIGNED_URL_TTL=3600   # seconds
```

### NestJS `TypeOrmModule` wiring

```ts
TypeOrmModule.forRootAsync({
  imports: [ConfigModule],
  useFactory: getOrmConfig,   // reads .env
})
```

**Entity style:** decorators only.
```ts
@Entity("employee")
@Unique("UQ_employee_emp_no", ["empNo"])
export class Employee {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ name: "emp_no", unique: true })
  empNo: string;
  // ...
}
```

**Migrations:** `migration:generate` from entity diffs; forward-only; seed scripts idempotent.
```
pnpm --filter backend migration:generate src/migrations
pnpm --filter backend migration:run
```

---

## 4. Module spec (per PRD module)

Each module = Nest module with `entities/` (TypeORM entities), `*.service.ts`, `*.controller.ts`, `dto/`.
Layering: **Controller → Service → Repository (TypeORM)**. Controllers contain zero DB queries.
Multi-table writes wrapped in `dataSource.transaction()`.

### Common entities (shared `entities/`)

`BaseEntity` — `id` (UUID), `createdAt`, `updatedAt`, `deletedAt` (soft delete).
`AuditableEntity extends BaseEntity` — `changedBy`, `changedAt`.

---

### 4.1 auth

**Entities:** `user`
**Controller routes:**
- `POST /auth/login` → `{ accessToken, refreshToken, mfaRequired }`
- `POST /auth/mfa/verify`
- `POST /auth/refresh` → rotate
- `POST /auth/logout`
- `GET  /auth/me`
- `PUT  /auth/password`
**Service:** `AuthService` (JWT sign/verify, TOTP MFA), `TokenService` (refresh rotation, revocation).
**Notes:** refresh token stored hashed in DB (`user.refresh_token_hash`); access in memory only.

---

### 4.2 rbac

**Entities:** `role`, `user_role`, `role_permission`, `role_group`, `entity_scope`, `data_mask_rule`
**Controller:**
- `GET/POST/PUT/DELETE /rbac/roles`, `/rbac/permissions`, `/rbac/users/:id/roles`
- `GET /rbac/resolve` → effective permissions + scopes + field masks for current user (cached)
**Service:** `PermissionService` (record-level scoping + field-level mask resolution), consumed by `ScopingGuard` + `MaskInterceptor` (in `common/`).
**Notes:** System Administrator role does **not** auto-grant confidential HR content (§11) — enforce via explicit grants.

---

### 4.3 cms

**Entities:** `legal_entity`, `company`, `branch`, `location`, `department`, `team`, `position`, `job_level`, `employment_type`, `work_location_type`, `cost_center`, `manager_assignment`, `org_chart_snapshot`
**Controller:**
- CRUD on departments, teams, positions, locations, cost centers
- `GET /cms/org-chart?asOf=...` → current + historical structure
**Service:** `CmsService`, `OrgChartService` (effective-date queries: `WHERE valid_from <= asOf AND (valid_to IS NULL OR valid_to > asOf)`).
**Audit:** all org mutations via `AuditInterceptor`.

---

### 4.4 hrms

**Entities:** `employee`, `employee_contact`, `employment_record`, `compensation_record`, `contract`, `employee_event`, `checklist_*`, `employee_match_rule`, `er_case`
**Controller:**
- `GET/POST /hrms/employees`, `GET/PUT /hrms/employees/:empNo`
- `POST /hrms/employees/:id/events` (transfer/promote/terminate)
- `GET /hrms/employees/:id/history` → chronological employment
- `POST /hrms/dedupe-check`
**Service:** `HrmsService`, `LifecycleService` (checklist engine + effective-dated transitions, wrapped in transaction), `DedupeService` (configurable matching rules).
**Notes:** compensation fields behind `MaskGuard` (field mask on `compensation_record`).

---

### 4.5 payroll

**Entities:** `pay_group`, `pay_period`, `salary_component`, `payroll_run`, `payroll_run_item`, `payroll_adjustment`, `payslip`, `ams_payroll_journal`, `overtime_rule`, `deduction_rule`
**Controller:**
- `GET /payroll/runs`, `POST /payroll/runs` (prepare)
- `POST /payroll/runs/:id/preview`
- `POST /payroll/runs/:id/approve`, `/lock`
- `GET /payroll/runs/:id/payslips`, `POST /payslips/:id/generate`
- `POST /payroll/runs/:id/export-ams`
**Service:** `RunService` (state machine open→preview→approved→locked→paid), `CalculationService` (pluggable jurisdiction rule engine — reads `salary_component.calculation_rule` + `overtime_rule`/`deduction_rule`), `AmsExportService`, `PayslipService` (PDF gen → MinIO).
**Transactions:** run preparation + item writes in one `dataSource.transaction()`.
**Security:** payroll data masked for non-Payroll Officer roles; separate prepare/approve/lock permissions (§11).
**Notes:** statutory calculations must be validated before production (acceptance gate).

---

### 4.6 attendance

**Entities:** `work_schedule`, `shift`, `holiday_calendar`, `holiday`, `attendance_entry`, `attendance_adjustment`, `attendance_exception`, `period_attendance_summary`
**Controller:**
- `POST /attendance/punch` (web/mobile clock-in)
- `GET /attendance/entries?from=&to=&employeeId=`
- `POST /attendance/corrections` → routes to approval
- `GET /attendance/summaries?period=`
**Service:** `PunchService` (originals immutable; `is_original=true`), `CorrectionService` (creates `attendance_adjustment`, preserves original), `SummaryService` (materialized period rollup).
**Device:** `device/` adapters for optional biometric import (out of MVP scope §5.3 — keep hook).
**Partitioning:** `attendance_entry` monthly range.

---

### 4.7 leave

**Entities:** `leave_type`, `leave_balance`, `leave_request`, `leave_approval`, `leave_ledger_entry`
**Controller:**
- `POST /leave/requests` (draft/submit/amend/cancel)
- `GET /leave/balances?employeeId=`
- `POST /leave/requests/:id/approve|reject`
- `GET /leave/ledger?employeeId=`
**Service:** `RequestService` (validate against policy: conflicts, overlaps, balance), `PolicyService` (accrual/carryover rules from `leave_type` JSONB), `ApprovalService` (manager + HR routing), `LedgerService` (post approved decisions → running ledger + balance, transactional).
**Notes:** every decision traceable via `leave_approval`; approved leave flows to attendance + payroll inputs (event bus).

---

### 4.8 recruitment

**Entities:** `job_requisition`, `job_posting`, `candidate`, `application`, `interview`, `offer`, `candidate_consent`
**Controller:**
- CRUD requisitions; `POST /recruitment/candidates/:id/stage`
- `POST /recruitment/interviews`, `PUT /interviews/:id/feedback`
- `POST /recruitment/offers/:id/accept|decline`
- `POST /recruitment/candidates/:id/convert` → employee (calls HRMS dedupe + onboarding)
**Service:** `RequisitionService`, `PipelineService` (stage machine), `OfferService`, `ConsentService` (retention/deletion policy, §6.7).
**Notes:** candidate data restricted to assigned participants (record scoping via `entity_scope`).

---

### 4.9 documents

**Entities:** `document_category`, `document`, `document_version`, `document_access_log`, `document_expiry_rule`, `document_disposal`
**Controller:**
- `POST /documents` (metadata + upload to MinIO)
- `GET /documents/:id/versions`
- `GET /documents/:id/download` → signed URL
- `POST /documents/:id/versions`
- `GET /documents/expiring?days=`
- `POST /documents/:id/hold|dispose`
**Service:** `UploadService` (store to MinIO, compute hash, run virus-scan hook), `VersioningService`, `ExpiryService` (alerts + renewal), `RetentionService` (legal hold + disposal).
**Storage:** files in MinIO/S3, `storage_key` + `file_hash` in DB. **Never binary in DB rows.**
**Notes:** access logged to `document_access_log`; time-limited download links.

---

### 4.10 performance

**Entities:** `review_cycle`, `evaluation_template`, `rating_scale`, `review_participant`, `review`, `review_response`, `goal`, `competency`, `calibration_session`
**Controller:**
- `POST /performance/cycles` (config), `POST /cycles/:id/participants`
- `POST /performance/reviews/:id/submit` (self/manager/peer/hr)
- `POST /performance/cycles/:id/calibrate`
- `POST /performance/reviews/:id/finalize`
**Service:** `CycleService` (config→active→finalizing→closed state machine), `AssessmentService`, `CalibrationService`, `GoalService`.
**Notes:** sensitive review content restricted + auditable; JSONB for answers/competencies.

---

### 4.11 assets

**Entities:** `asset_category`, `asset`, `asset_assignment`, `asset_transfer`, `asset_maintenance`, `asset_inventory_check`
**Controller:**
- CRUD assets; `POST /assets/:id/assign|return|transfer`
- `POST /assets/maintenance`
- `GET /assets/inventory-check`
**Service:** `LifecycleService` (state machine available→assigned→in_use→returned/disposed), `InventoryService`, `ImsSyncService` (catalog ref).
**Notes:** assignment links to onboarding checklist (`checklist_assignment`); acknowledgement recorded.

---

### 4.12 projects

**Entities:** `project`, `project_member`, `project_visibility`, `milestone`, `task`, `task_dependency`, `task_comment`, `task_attachment`, `task_activity`, `project_notification_pref`
**Controller:**
- CRUD projects; `POST /projects/:id/tasks`
- `PATCH /tasks/:id` (status move)
- `POST /tasks/:id/comments`
- `GET /projects/:id/reporting` (progress, overdue, workload)
**Service:** `ProjectService`, `TaskService` (status machine), `DependencyService` (topological + overdue detection), `ReportingService`.
**Notes:** board/list/calendar views served by same task endpoint + view param.

---

### 4.13 notifications / approvals / audit

**notifications:** `notification` entity + `DispatchService` (fan-out email/sms/webhook) + event-driven creation from other modules.
**approvals:** `approval_request` + `ApprovalEngineService` — unified routing for leave, attendance corrections, payrolls, requisitions. Business modules call `approvalEngine.submit({module, entity, rules})`.
**audit:** `audit_event` (append-only, monthly partitioned). Writes via `AuditInterceptor` (actor, module, entity, before/after JSONB, ip, correlationId). Read-only report controller.

---

## 5. Cross-cutting (`common/`)

- **Guards:** `JwtGuard`, `RolesGuard`, `ScopingGuard` (record-level via `entity_scope`), `MaskGuard` (field-level via `data_mask_rule`).
- **Interceptors:** `AuditInterceptor` (writes `audit_event`), `ScopeInterceptor` (injoins `entity_scope`), `FieldMaskInterceptor` (strips masked fields from serialized DTOs).
- **Pipes:** validation (class-validator), soft-delete filter (`deleted_at IS NULL` default).
- **Error filter:** global → `{ code, message, status, correlationId }` JSON.
- **Permissions engine:** one resolver returning `{ actions[], fieldMasks{}, scopes[] }` for a user+resource; consumed by guards + interceptors.

---

## 6. Domain event bus (`core/events`)

In-process `EventEmitter2`. Published events:
`EmployeeHired`, `EmployeeTerminated`, `PayrollLocked`, `PayrollExported`, `LeaveApproved`, `LeaveCancelled`, `AttendanceCorrected`, `AssetAssigned`, `AssetReturned`, `TaskCompleted`, `DocumentExpired`.

Subscribers:
- `notifications` (fan-out)
- `audit` (trace)
- `ams` export (payroll journals, cost centers)
- `idp` JML (joiner/mover/leaver account lifecycle)
- `attendance`/`payroll` (approved leave → inputs)

---

## 7. Conventions

- **Layering:** Controller (HTTP parse + status mapping, zero DB) → Service (business + transactions + events) → Repository (TypeORM find/query). No SQL in controllers.
- **Transactions:** every multi-table mutation inside `dataSource.transaction(async (tx) => {...})`; rollback on exception.
- **N+1:** list queries use `find({ where, relations: "join" })` or `IN (...)` batching; never per-row loops.
- **Bounded queries:** all list endpoints accept `limit` (default 50, max 200) + cursor or offset.
- **Caching:** in-process `node-cache` for RBAC resolve + org chart (deterministic TTL); invalidate on mutation. No Redis in MVP.
- **Logging:** nestjs-pino, single-line JSON, ISO ts + level + correlationId; PII (gov id, compensation) redacted.
- **Validation:** zod from `@hersvin/shared` for public inputs where shared; class-validator for internal DTOs.
- **Migrations:** forward-only; seeds idempotent; rollback reviewed.
- **Field masking:** `data_mask_rule` applied uniformly by interceptor; confidential compensation / gov id / disciplinary / medical leave default-masked.

---

## 8. Module → artifact alignment

| PRD §5.1 | Backend module | Key services |
|---|---|---|
| 1 CMS | `cms` | CmsService, OrgChartService |
| 2 HRMS | `hrms` | HrmsService, LifecycleService, DedupeService |
| 3 Payroll | `payroll` | RunService, CalculationService, AmsExportService, PayslipService |
| 4 Attendance | `attendance` | PunchService, CorrectionService, SummaryService |
| 5 Leave | `leave` | RequestService, PolicyService, ApprovalService, LedgerService |
| 6 Recruitment | `recruitment` | RequisitionService, PipelineService, OfferService, ConsentService |
| 7 Documents | `documents` | UploadService, VersioningService, ExpiryService, RetentionService |
| 8 Performance | `performance` | CycleService, AssessmentService, CalibrationService |
| 9 Assets | `assets` | LifecycleService, InventoryService, ImsSyncService |
| 10 Projects | `projects` | ProjectService, TaskService, DependencyService, ReportingService |
| Shared | `auth`, `rbac`, `notifications`, `approvals`, `audit` | TokenService, PermissionService, DispatchService, ApprovalEngineService, AuditInterceptor |
| AMS export | `payroll`/ams-export | AmsExportService |
| IdP JML | `core/integrations/idp` | IdpService |

---

## 9. Open items to confirm before coding

1. **Jurisdiction payroll rule set** — which country/state? Determines `salary_component` rule JSONB + `overtime_rule`/`deduction_rule` seed content.
2. **PDF generation** — payslip template library (e.g. `@nestjs/pdf` + pdf-lib, or a template service). Confirm tool.
3. **Org chart rendering** — server returns flat position list; frontends build the tree. Confirm no server-side layout (recommended).
4. **Rate limiting** — per-IP + per-user throttle values for public endpoints (SSO callback, clock-in).
5. **Retention periods** — audit_event monthly partitions + disposal schedule per `document_category.retention_years`. Confirm defaults.
6. **AMS payload contract** — exact journal/summary schema the accounting system expects. Blocker for `AmsExportService`.
