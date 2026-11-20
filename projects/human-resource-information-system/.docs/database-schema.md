# HRIS Database Schema

Source: `.docs/product-requirements-document.md` (v1.0).
Modules aligned to PRD §5.1 (MVP, 10 modules) + §5.2 (recommended).
Conventions: PostgreSQL 14+, snake_case, UUID PKs, `created_at`/`updated_at`/`deleted_at` (soft delete), effective dating for org & HR history, enum types for status fields, FK `ON DELETE RESTRICT` unless noted.

## Conventions

- **IDs:** UUIDv7 PKs. Surrogate employee number `emp_no` (unique, human-facing).
- **Time:** `timestamptz` UTC. Effective-date pairs (`valid_from`, `valid_to`) on org + HR history entities.
- **Audit:** append-only `audit_event` table + per-table `changed_by`/`changed_at` on sensitive records.
- **Permissions:** RBAC (`user_role`, `role_permission`, `role_group`), record-level scoping via `entity_scope` and field-level masks enforced in application layer.
- **Money:** `numeric(14,2)` + `currency` code. No floats.
- **Files:** DMS rows store metadata + object-storage pointer (`storage_key`), never binary in DB.

---

## Module 1 — CMS (Company Management)

**Legal entity & geography**

| Table | Key columns | Notes |
|---|---|---|
| `legal_entity` | id, name, tax_id, registry_no, country, is_active | Multi-company root. |
| `company` | id, legal_entity_id, name, short_code, is_active | Operating company. |
| `branch` | id, company_id, name, code | |
| `location` | id, branch_id, name, address, geo_lat/lon, tz_name, is_active | IANA timezone. |
| `department` | id, company_id, branch_id, name, code, manager_user_id, valid_from/to | Effective-dated. |
| `team` | id, department_id, name, manager_user_id, valid_from/to | |
| `position` | id, company_id, department_id, job_level_id, employment_type, title, code, reports_to_position_id, valid_from/to | Org chart node. |

**Configuration dictionaries**

| Table | Notes |
|---|---|
| `job_level` | id, company_id, code, name, grade, band. |
| `employment_type` | id, code, name (full-time, contract, intern…). |
| `work_location_type` | office/remote/hybrid. |
| `cost_center` | id, company_id, code, name, ams_ref — integration key to AMS. |

**Reporting relationships**

- `manager_assignment` — id, position_id, manager_user_id, valid_from, valid_to (see Module 2, owned by CMS but HR-facing).
- `org_chart_snapshot` — id, company_id, taken_at, payload(jsonb) — point-in-time structure history.

---

## Module 2 — HRMS (Human Resource Management)

**Identity & profile**

- `user` — auth subject: id, email, full_name, password_hash, mfa_secret_ref, is_active, last_login_at.
- `employee` — id, user_id (nullable), emp_no (unique), first/middle/last, date_of_birth, gender_code, nationality, gov_id_masked, emergency_contact(jsonb), status(enum: preboard/active/suspended/separated), hire_date, exit_date, photo_storage_key.
- `employee_contact` — id, employee_id, type(enum: personal/office/mobile), value, is_primary, valid_from/to.
- `employee_document` — see Module 8 (linked here for lifecycle).

**Employment record (effective-dated, one active row per employee)**

- `employment_record` — id, employee_id, company_id, branch_id, location_id, department_id, team_id, position_id, manager_user_id, employment_type_id, cost_center_id, start_date, end_date, employment_status, termination_reason_code.
- `compensation_record` — id, employment_record_id, pay_group_id, base_salary, currency, pay_frequency, effective_date, is_confidential (field mask).
- `contract` — id, employee_id, title, start_date, end_date, file_ref (DMS), status.

**Lifecycle events (append-only)**

- `employee_event` — id, employee_id, event_type(enum: onboard/transfer/promote/suspend/terminate/rehire), effective_date, payload(jsonb), initiated_by, audit refs.

**Onboarding / offboarding checklists (§5.2)**

- `checklist_template`, `checklist_item`, `checklist_assignment` (employee_id, template_id, owner_user_id, due_date, status, completed_at).

**Dedupe checks**

- `employee_match_rule` — id, field, operator, threshold; applied on candidate→employee conversion and new-record create.

**Employee relations & cases (§5.2, restricted)**

- `er_case` — id, employee_id, category, status, description, opened_by, access_grant_user_ids(uuid[]) — extra safeguards per §11.

---

## Module 3 — Payroll

- `pay_group` — id, company_id, code, currency, pay_period_type(enum: weekly/biweekly/semimonthly/monthly), next_run_date.
- `pay_period` — id, pay_group_id, start_date, end_date, status(enum: open/preview/approved/locked/paid), approval_user_id, approved_at.
- `salary_component` — id, company_id, code, name, type(enum: earnings/deduction/allowance), taxable, is_default, calculation_rule(jsonb: jurisdiction rules).
- `payroll_run` — id, pay_period_id, currency, status, prepared_by, approved_by, locked_at.
- `payroll_run_item` — id, payroll_run_id, employee_id, component_id, qty, rate, amount, is_adjustment, source_ref(jsonb: attendance/leave/OT refs).
- `payroll_adjustment` — id, payroll_run_item_id, reason, amount, approved_by, valid_from (audit-trail row).
- `payslip` — id, payroll_run_item_id, pdf_storage_key, issued_at, delivered_at.
- `ams_payroll_journal` — id, payroll_run_id, ams_batch_ref, exported_at, status — export to AMS (§9).
- `overtime_rule`, `deduction_rule` — jurisdiction-validated computation tables (§6.3 statutory validation gate).

## Module 4 — Attendance

- `work_schedule` — id, name, location_id, starts_at/ends_at, days_of_week, grace_minutes, valid_from/to.
- `shift` — id, work_schedule_id, name, starts_at, ends_at, is_overtime_cap, break_minutes.
- `holiday_calendar` + `holiday` — id, company_id, date, name, applies_to_locations(uuid[]).
- `attendance_entry` — id, employee_id, shift_id, clocked_in_at, clocked_out_at, source(enum: web/mobile/device/import), is_original (immutable), computed fields: late_minutes, undertime_minutes, ot_hours, absence_flag, break_minutes.
- `attendance_adjustment` — id, attendance_entry_id, reason, applied_by, approval_status, applied_at — original preserved (§6.4).
- `attendance_exception` — id, employee_id, entry_id, type, description, resolution_status.
- `period_attendance_summary` — id, employee_id, period_start/end, totals(jsonb) — materialized for payroll import.

## Module 5 — Leave

- `leave_type` — id, company_id, code, name, is_paid, accrual_rule(jsonb: rate/period/cap), carryover_rule, requires_documents, requires_hr_review.
- `leave_balance` — id, employee_id, leave_type_id, period, accrued, used, carryover, available (denormalized, reconciled to ledger).
- `leave_request` — id, employee_id, leave_type_id, start_date, end_date, hours, status(enum: draft/submitted/manager_review/hr_review/approved/rejected/canceled), doc_requirements(jsonb), submitted_at, decided_at.
- `leave_approval` — id, request_id, approver_user_id, role_at_decision, decision, comment, decided_at.
- `leave_ledger_entry` — id, employee_id, leave_type_id, request_id, effective_date, delta_days, balance_after, posted_at — running ledger (§6.6).

## Module 6 — Recruitment

- `job_requisition` — id, position_id, company_id, hiring_manager_user_id, headcount, budget_ref(AMS), status(enum: draft/approved/filled/canceled), opened_at, closed_at.
- `job_posting` — id, requisition_id, channel, external_ref, posted_at, closed_at.
- `candidate` — id, requisition_id, first/last, email, phone, consent_at, consent_ref, retention_until, status(enum: screening/interview/offer/hired/rejected/withdrawn), source_channel.
- `application` — id, candidate_id, requisition_id, stage, submitted_at, screening_result(jsonb).
- `interview` — id, application_id, round, scheduled_at, interviewers(uuid[]), feedback(jsonb), outcome.
- `offer` — id, application_id, compensation_snapshot(jsonb), sent_at, accepted_at, declined_at, expires_at.
- `candidate_consent` — id, candidate_id, consent_type, granted_at, revoked_at (deletion policy §6.7).

## Module 7 — Documents (DMS)

- `document_category` — id, name, retention_years, default_access_level.
- `document` — id, owner_user_id, employee_id (nullable), category_id, title, access_level(enum: public/internal/confidential/restricted), status(enum: draft/active/expired/under_hold/disposed), version_count, effective_date, expiry_date, retention_until, legal_hold_flag.
- `document_version` — id, document_id, version_no, file_storage_key, file_hash, size_bytes, uploaded_by, uploaded_at, scan_status.
- `document_access_log` — id, document_id, user_id, action, ip, at.
- `document_expiry_rule` — id, category_id, alert_days_before, renewal_reminder_days.
- `document_disposal` — id, document_id, reason, authorized_by, disposed_at (GDPR/retention §11).

## Module 8 — Performance

- `review_cycle` — id, company_id, name, period_start/end, status(enum: config/active/finalizing/closed), calibration_required, deadline.
- `evaluation_template` — id, name, rating_scale_id, competencies(jsonb), is_active.
- `rating_scale` — id, name, levels(jsonb).
- `review_participant` — id, review_cycle_id, employee_id, rater_role(enum: self/manager/peer/hr), assigned_at, status, submitted_at.
- `review` — id, review_cycle_id, employee_id, template_id, status(enum: pending/self_done/manager_done/peer_done/calibrated/finalized), final_rating_code, finalized_by, finalized_at.
- `review_response` — id, review_id, participant_id, answers(jsonb), comments, evidence_refs(uuid[]), submitted_at.
- `goal` — id, employee_id, review_id (nullable), title, target_date, status, progress_pct, milestones(jsonb).
- `competency` — id, code, name, description (dictionary).
- `calibration_session` — id, review_cycle_id, held_at, participants(uuid[]), outcomes(jsonb).

## Module 9 — Assets

- `asset_category` — id, parent_id, name, im_catalog_ref (IMS integration §9).
- `asset` — id, tag_no (unique), serial_no, category_id, name, purchase_date, purchase_cost, vendor, warranty_until, condition_code, location_id, status(enum: available/assigned/in_use/maintenance/disposed).
- `asset_assignment` — id, asset_id, employee_id, assigned_at, acknowledged_at, acknowledged_by, returned_at, return_condition, notes.
- `asset_transfer` — id, asset_id, from_location, to_location, moved_at, moved_by.
- `asset_maintenance` — id, asset_id, date, description, cost, vendor, next_due.
- `asset_inventory_check` — id, location_id, checked_at, results(jsonb), discrepancies(uuid[]).
- Onboarding hook: assignment rows reference `checklist_assignment` (asset step in onboarding checklist §6.9).

## Module 10 — Projects & Tasks

- `project` — id, company_id, workspace_id, name, code, owner_user_id, description, start_date, due_date, status(enum: planning/active/paused/completed/canceled), visibility(enum: private/project/company), budget_ref(AMS, nullable).
- `project_member` — id, project_id, user_id, role, granted_at.
- `project_visibility` — id, project_id, principal_type(user/role/department), principal_id, access_level(view/comment/assign).
- `milestone` — id, project_id, title, due_date, status, progress_pct.
- `task` — id, project_id, milestone_id, parent_task_id (subtasks), title, description, owner_user_id, due_date, priority(enum: low/med/high/critical), status(enum: todo/in_progress/blocked/done), progress_pct.
- `task_dependency` — id, task_id, depends_on_task_id, type(enum: finish_start/finish_finish/start_start).
- `task_comment` — id, task_id, author_user_id, body, created_at.
- `task_attachment` — id, task_id, storage_key, mime, size, uploaded_by.
- `task_activity` — id, task_id, actor_user_id, action, at, payload(jsonb) — history feed (§6.10).
- `project_notification_pref` — id, user_id, project_id, events(jsonb).

## Shared / Cross-Cutting

**Identity & access**

- `role` — id, code, name, is_system, scope(enum: system/module/record/field).
- `user_role` — id, user_id, role_id, granted_at, expires_at, assigned_by.
- `role_permission` — id, role_id, resource_code, action(enum: read/write/approve/delete/export), field_mask(jsonb: nullable → full fields).
- `role_group` / `group_member` — scoping buckets (e.g., "HR of Company X").
- `entity_scope` — id, user_id, scope_type(company/department/branch/team), entity_id, derived grants.
- `data_mask_rule` — id, field_name, roles(uuid[]), mask_type(code/hash/full) — §11 masking.

**Audit & events (all modules)**

- `audit_event` — id, actor_user_id, module, entity_type, entity_id, action, before(jsonb), after(jsonb), ip, at, correlation_id. Append-only, retention policy.
- `notification` — id, user_id, channel(in-app/email/sms), subject, body, link, read_at, payload(jsonb), created_at — notifications for leave/attendance/reviews/approvals.
- `approval_request` — id, requester_user_id, approver_user_id, module, entity_type, entity_id, status, decided_at, comment — generic approval routing (used by leave, attendance adjustments, reqs, payrolls).

**External integration references** (columns, not tables — §9)

- `user.external_idp_ref`, `cost_center.ams_ref`, `ams_payroll_journal.ams_batch_ref`, `asset_category.im_catalog_ref`, `employee_event.bis_metric_ref`.

**Indexes (guidance)**

- `(employee_id, valid_from desc)` on `employment_record`.
- `(user_id, read_at is null)` on `notification`.
- `(project_id, status, due_date)` on `task`.
- `(asset_id, assigned_at desc) where returned_at is null` on `asset_assignment`.
- BRIN on `audit_event(at)` after partitioning by month (audit partitioning: monthly, `audit_event_YYYYMM`).

**Partitioning**

- `audit_event` — monthly range.
- `attendance_entry` — monthly range (high-volume).
- `notification` — monthly, expired rows pruned.
