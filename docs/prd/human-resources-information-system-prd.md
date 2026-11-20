# Product Requirements Document (PRD)

## Human Resources Information System (HRIS)

**Document status:** Initial product baseline\
**Version:** 1.0\
**Product type:** Internal workforce and company operations platform\
**Primary objective:** Provide a single, secure source of truth for
organizational and employee lifecycle information.

## 1. Product overview

The Human Resources Information System manages company structure and
workforce operations from recruitment and onboarding through employment,
attendance, leave, payroll inputs, performance, documents, assets,
projects, and offboarding.

The primary navigation follows the module tree in Section 5. Existing
HRIS capabilities not named in that tree remain in scope and keep their
current requirements. Some capabilities, particularly asset and task
management, serve other departments and remain shared enterprise
modules integrated with HRIS.

## 2. Problem statement

Employee and organizational information is often spread across
spreadsheets and disconnected tools. This leads to duplicate records,
inconsistent employee data, manual approvals, weak document controls,
and limited visibility into workforce operations.

## 3. Goals and success measures

-   Maintain accurate employee and organization records.
-   Standardize recruitment, onboarding, leave, attendance, and
    performance workflows.
-   Provide employees and managers with self-service capabilities.
-   Supply approved employee and payroll inputs to the Accounting
    Management System.
-   Protect confidential employee data through strict access controls.

**Indicative metrics:** employee record completeness, time-to-hire,
onboarding completion, payroll input error rate, leave approval
turnaround, attendance exception rate, review completion rate, and
employee document expiry compliance.

## 4. Users and roles

The system has three base roles:

| Role | Access and responsibilities |
| --- | --- |
| **EMPLOYEE** | View their own employee records, attendance, payslips, and loan ledger where applicable. Submit and track their own applications. View permitted calendar events and assigned tasks. |
| **MANAGER** | Use employee capabilities for their own account. Review or approve assigned requests and records for employees within their authorized scope. Reviewer and approver are manager capabilities assigned by workflow, not separate base roles. Managers cannot approve their own requests. |
| **ADMIN** | Manage users, user groups, configuration, and operational records according to granted permissions. Sensitive access is explicit and audited. |

User Groups assign module, record, and field permissions within these
three roles. Groups do not create additional base roles. Apply least
privilege to compensation, government identifiers, disciplinary
records, and medical-related leave documentation. System administration
does not grant confidential HR access by itself.

## 5. Scope

### 5.1 Primary navigation and modules

The following tree defines the requested primary navigation and its
submodules. A repeated concept may link to the same authoritative record
from more than one workflow. It must not create duplicate employee,
attendance, leave, payroll, or organization records.

1. **Dashboard**
2. **Calendar**
3. **Record**
   - Attendance
   - Payslip
   - Loan Ledger
4. **Applications**
   - Change of Schedule
   - Leave
   - Official Business
   - Missed Log
   - Overtime
   - Offset
   - Compensatory Time Off
5. **Employee Management**
   - 201 Files
   - Task Management
6. **Timekeeping**
   - Employee Time Record
   - Leave Adjustments
   - Timekeeping Processing
   - Work Schedule
7. **Payroll**
   - Loan Adjustment
   - Loan Application
   - Final Pay
   - Income and Deduction
   - 13th Month Process
   - Service Charge
   - Payroll Processing
   - Payroll Disbursement
8. **Reports**
   - Human Resources
   - Timekeeping
   - Payroll
   - Government
   - Bank Export
9. **Security**
   - Users
   - User Group
10. **Configurations**
    - Organization: Company, Branch, Department, Position Level, and Designation
    - Cutoff Period
    - Holiday
    - Approval Setup
    - Scheduler Setup

### 5.2 Existing modules retained

Existing modules and requirements not named in Section 5.1 remain in
scope and stay as written in this PRD. This includes Company Management
System (CMS), recruitment, document management, performance management,
asset management, task and project management, Employee Self-Service,
onboarding and offboarding, training and certifications, benefits and
allowances, employee relations, and workforce planning. No existing
module is removed by the updated navigation list.

Configurations > Organization exposes the organization settings used
by CMS. CMS remains the authoritative organization data source; the
configuration screen must not create a second company, branch,
department, position-level, or designation master.

### 5.3 Out of scope for MVP

-   Automated legal interpretation of employment rules.
-   Biometric device support until device, privacy, and consent
    requirements are defined.
-   Full project portfolio accounting.
-   Direct salary disbursement unless a compliant payment provider
    integration is approved.

## 6. Functional requirements

### 6.1 Company Management System (CMS)

-   Maintain legal entities, companies, branches, locations,
    departments, teams, positions, and reporting relationships.
-   Support effective dates for organization changes.
-   Configure job levels, employment types, work locations, and cost
    centers.
-   Maintain an organization chart and historical structure.
-   Support multi-company boundaries and user access scoped to assigned
    entities.

**Acceptance criteria:** An authorized administrator can create a
department and position, assign a manager, and view both current and
historical organizational structure.

### 6.2 Human Resource Management (HRMS)

-   Maintain a unique employee profile and employee number.
-   Capture contact details, employment status, position, department,
    manager, hire date, employment type, work location, and emergency
    contact as policy permits.
-   Maintain employment history, contract metadata, compensation
    references, and status changes.
-   Support onboarding, transfers, promotion, suspension, separation,
    and rehire workflows.
-   Track employee lifecycle events with effective dates.
-   Prevent duplicate employee records using configurable matching
    checks.

**Acceptance criteria:** HR can create an employee, assign organization
details, record a transfer, and retrieve a chronological employment
history.

### 6.3 Payroll Management

-   Maintain pay groups, pay periods, salary components, allowances,
    deductions, and approved adjustments.
-   Import approved attendance, overtime, leave, and employee changes.
-   Calculate gross pay, deductions, and net pay using
    jurisdiction-specific, professionally validated rules.
-   Support payroll preview, exception review, approval, locking, and
    payslip generation.
-   Maintain payroll run history and adjustment audit trail.
-   Export approved payroll journals or summaries to AMS.
-   Restrict compensation data to authorized roles.

**Acceptance criteria:** Payroll staff can prepare a payroll run,
identify exceptions, obtain approval, lock the run, generate payslips,
and export a traceable summary. Statutory calculations must be validated
before production use.

### 6.4 Attendance Management

-   Configure work schedules, shifts, grace periods, holidays, and
    attendance policies.
-   Capture time entries through approved methods such as web/mobile
    clock-in, import, or integrated device.
-   Track late arrivals, undertime, absences, breaks, and overtime.
-   Support correction requests with manager/HR approval.
-   Provide daily, weekly, and period summaries.
-   Preserve original punches and record corrections as adjustments.

**Acceptance criteria:** An employee can view their attendance, submit a
correction request, and see the approved adjustment without loss of the
original record.

### 6.5 Performance Management System (PMS)

-   Configure review cycles, evaluation templates, competencies, goals,
    rating scales, and participant roles.
-   Support self-assessment, manager assessment, optional peer feedback,
    and HR review.
-   Track goals, milestones, comments, and evidence.
-   Enforce review deadlines and reminders.
-   Provide calibrated results and authorized reports.
-   Keep sensitive review content restricted and auditable.

**Acceptance criteria:** HR can configure a review cycle, assign
participants, collect assessments, finalize a review, and preserve the
review history.

### 6.6 Leave Management

-   Configure leave types, eligibility, accrual rules, carryover,
    balances, and supporting-document requirements.
-   Allow employees to request, amend, or cancel leave.
-   Route requests to managers and HR based on configurable policies.
-   Check date conflicts, overlapping requests, and available balances.
-   Reflect approved leave in attendance and payroll inputs.
-   Maintain leave ledger and balance history.

**Acceptance criteria:** A request is checked against configured rules,
approved leave updates the balance and calendar, and every decision is
traceable.

### 6.7 Recruitment Management

-   Create job requisitions with department, position, headcount, budget
    approval, and hiring manager.
-   Publish or record vacancies and capture candidate applications.
-   Track candidate stages, interview schedules, feedback, and
    decisions.
-   Support candidate consent, retention, and deletion policies.
-   Convert an accepted candidate into an employee record without
    unnecessary re-entry.
-   Restrict candidate information to assigned recruitment participants.

**Acceptance criteria:** A recruiter can move a candidate through
configured stages, record interview feedback, issue an offer status, and
initiate onboarding.

### 6.8 Document Management System (DMS)

-   Store employee and company documents with metadata, category, owner,
    effective date, expiry date, and access classification.
-   Support versioning, controlled downloads, and document status.
-   Configure expiry alerts and renewal workflows.
-   Record access and document changes.
-   Support retention, legal hold, and authorized disposal policies.
-   Store files in managed object storage rather than directly in
    relational database rows.

**Acceptance criteria:** An authorized user can upload a versioned
document, restrict access, and receive an expiry alert according to
configuration.

### 6.9 Asset Management

-   Register assets with asset tag, category, serial number, purchase
    details, condition, location, custodian, and status.
-   Assign and return assets using acknowledgement records.
-   Track transfers, maintenance, warranties, and disposal.
-   Support inventory checks and asset history.
-   Integrate asset assignment with employee onboarding/offboarding.
-   Keep financial depreciation authoritative in AMS if accounting
    treatment is managed there.

**Acceptance criteria:** An asset can be assigned to an employee,
acknowledged, transferred, returned, and audited through its full
lifecycle.

### 6.10 Task and Project Management

-   Create workspaces, projects, milestones, tasks, subtasks, and
    dependencies.
-   Assign owners, collaborators, due dates, priorities, and statuses.
-   Support comments, attachments, activity history, and notifications.
-   Provide list, board, and calendar views.
-   Configure project visibility and permissions.
-   Report progress, overdue work, and workload.

**Acceptance criteria:** A project manager can create a project, assign
tasks, track status, and view overdue work for authorized projects.

## 7. Core workflows

-   Recruitment: Requisition → Approval → Vacancy → Application →
    Screening → Interview → Offer → Hired → Onboarding.
-   Employee lifecycle: Preboarding → Active → Transfer/Promotion →
    Leave/Suspension where applicable → Offboarding.
-   Leave: Draft → Submitted → Manager Review → HR Review if required →
    Approved/Rejected → Posted to leave ledger.
-   Attendance correction: Submitted → Reviewed → Approved/Rejected →
    Adjustment posted.
-   Performance: Cycle Setup → Participant Assignment → Assessments →
    Calibration → Finalization.
-   Asset: Available → Assigned → In Use → Returned/Maintenance →
    Available/Disposed.

## 8. Data entities

Company, LegalEntity, Branch, Location, Department, Team, Position,
OrganizationRelationship, Employee, EmploymentRecord, EmployeeContact,
ManagerAssignment, Candidate, JobRequisition, JobPosting, Application,
Interview, Offer, WorkSchedule, Shift, AttendanceEntry,
AttendanceAdjustment, LeaveType, LeaveBalance, LeaveRequest,
LeaveLedgerEntry, ReviewCycle, EvaluationTemplate, Evaluation, Goal,
Competency, EmployeeDocument, Asset, AssetAssignment, Project, Task,
Milestone, ApprovalRequest, Notification, AuditEvent.

## 9. Integrations

-   AMS: approved payroll journals, employee cost centers, expense/asset
    accounting references.
-   IMS: stock and equipment inventory where the same asset/product
    catalog is shared.
-   Identity provider: employee joiner/mover/leaver account lifecycle.
-   Calendar/email: interviews, leave events, reminders, and
    notifications.
-   Biometric/time devices: optional, controlled integrations.
-   BIS: approved workforce and organizational metrics.

## 10. Non-functional requirements

-   Strict least-privilege access, including record- and field-level
    controls.
-   Encryption in transit and at rest where supported.
-   Secure file storage, malware scanning, and time-limited download
    links.
-   Audit logs for changes to employment, compensation, leave,
    attendance, and reviews.
-   Configurable retention and privacy controls.
-   Accessible, responsive employee and manager portals.
-   Reliable import/export with validation and error reports.
-   Backups and tested restoration.
-   Time-zone-aware schedules and effective dates.

## 11. Security and privacy

-   Do not expose confidential HR records to general system
    administrators by default.
-   Separate payroll preparation, approval, and release permissions.
-   Mask sensitive identifiers in screens and exports unless access is
    authorized.
-   Log access to sensitive records.
-   Define data retention, candidate consent, employee privacy notices,
    and deletion procedures with legal counsel.
-   Apply additional safeguards to sensitive leave or employee-relations
    records.

## 12. Risks and dependencies

-   Employment, payroll, privacy, and record-retention rules vary by
    jurisdiction.
-   Attendance devices and payroll rules require policy validation.
-   Poor organization master data affects permissions and reporting.
-   Project and asset modules may require enterprise-wide ownership and
    separate governance.
-   HRIS-to-AMS payroll integration needs a clear source-of-truth and
    reconciliation process.

## 13. Release plan

**Release 1:** CMS, employee directory, roles, onboarding basics,
attendance, leave, documents, audit trail.\
**Release 2:** recruitment, performance reviews, payroll preparation,
employee self-service.\
**Release 3:** asset lifecycle, project/task management, advanced
workforce analytics, device integrations.

## 14. Definition of done

Each module must meet its acceptance criteria, enforce privacy and
access rules, preserve history, include tests and operational
documentation, and be approved by its business owner.
