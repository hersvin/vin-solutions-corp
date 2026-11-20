# HRIS Web — Component & Module Spec (Vite + React 19 + shadcn/ui + Zustand + TanStack Query + Axios)

Aligned to: `.docs/folder-structure.md` §3 + `.docs/database-schema.md` §1–§10.

## 1. Tech stack (final)

| Concern            | Choice | Version target |
|---|---|---|
| Framework          | React | 19 |
| Build              | Vite | 6 |
| Language           | TypeScript (strict) | 5.7 |
| Styling            | Tailwind CSS + shadcn/ui | Tailwind 4, shadcn latest |
| Data fetching      | TanStack Query | 5 |
| Server state       | TanStack Query (not Zustand) | — |
| Client state       | Zustand | 5 |
| HTTP client        | Axios (configured, with interceptors) | 1.7+ |
| Router             | React Router DOM | 7 |
| Forms              | react-hook-form + zod (from `@hersvin/shared/validation`) | — |
| i18n               | i18next + react-i18next | — |
| Charts             | Recharts (styled with shadcn tokens) | 2.13 |
| Tables             | TanStack Table v8 (wrapped in shadcn DataGrid) | 8 |
| Testing            | Vitest + React Testing Library + Playwright (e2e) | — |

### Module → store map (Zustand)

Each module owns **one** `use<X>Store` that holds **client state only** (UI, filters, layout, selection, modal state).
Server data (lists, detail, mutations) lives in TanStack Query cache — never in Zustand.
Zustand stores are **not** passed down through prop-drilling; they are exposed via a per-module `<XProvider>` context that bundles:
- the Zustand store hook
- a **module-level context** with **global functions** for cross-component actions (`navigateToEmployee`, `openLeaveRequest`, `submitApproval`, …)

---

## 2. `src/api/` — Axios configuration

```
src/api/
├── client.ts                 # base axios instance + interceptors
├── interceptors/
│   ├── request.interceptor.ts   # auth, correlation id, retry-on-401
│   ├── response.interceptor.ts   # error normalization, auth-fail redirect
│   └── token.interceptor.ts     # refresh token rotation (silent 401)
├── sdk/                      # generated per-module typed client
│   ├── cms.ts
│   ├── hrms.ts
│   ├── payroll.ts
│   ├── attendance.ts
│   ├── leave.ts
│   ├── recruitment.ts
│   ├── documents.ts
│   ├── performance.ts
│   ├── assets.ts
│   ├── projects.ts
│   ├── notifications.ts
│   ├── approvals.ts
│   └── audit.ts
└── error.ts                  # ApiError, RetryableError, AuthError, NetworkError
```

### `client.ts` — base

```ts
import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
import { tokenStore } from "@/shared/auth/token-store";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "/api/v1",
  timeout: 30_000,
  withCredentials: false,
  headers: { "Content-Type": "application/json" },
});
```

### `request.interceptor.ts`

Responsibilities:
- attach `Authorization: Bearer <access>` from `tokenStore`
- attach `X-Correlation-Id` (new `crypto.randomUUID()` per request)
- retry transient 5xx/429 with exponential backoff (3 attempts, base 500 ms, jitter 250 ms) — only GETs
- **never** log response bodies that contain PII

### `response.interceptor.ts`

Responsibilities:
- unwrap `response.data.data` for envelope-style responses
- normalize to `ApiError { code, message, status, correlationId, cause }`
- on `401`: call `tokenStore.rotate()` (refresh token), re-issue the original request **once**
- on refresh failure: emit `event("auth:expired")` → router redirect to `/login`
- on `403`: emit `event("auth:denied")` → global toast

### `token.interceptor.ts`

- silent refresh via `POST /auth/refresh`
- token storage: **memory** (not `localStorage`) to mitigate XSS; re-fetched from a secure cookie on app boot

---

## 3. Provider tree (`src/app/providers/`)

```
<AppProvider>                 # i18n + theme + toast
  <AuthProvider>             # session, MFA state, login form
    <QueryProvider>          # TanStack QueryClient + global fetch options
      <RbacProvider>       # usePermissions(), useScopes()
        <ModuleProvider>     # composes 14 module contexts (below)
          <AppRouter/>
```

`<ModuleProvider>` renders all module contexts, each exposing:
1. a **Zustand store hook** (`useXStore()`)
2. a **global action context** (`useXActions()`)

Example — Leave module:

```tsx
// src/features/leave/leave.context.ts
const LeaveActionsCtx = createContext<LeaveActions | null>(null);

export function LeaveProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const actions: LeaveActions = useMemo(() => ({
    openRequest: (preselect?: { type?: string; dates?: [string, string] }) => {
      useLeaveStore.setState({ modal: { open: true, preselect } });
    },
    openLedger: (employeeId: string) => navigate(`/leave/ledger/${employeeId}`),
    invalidate: () => queryClient.invalidateQueries({ queryKey: ["leave"] }),
  }), [queryClient, navigate]);

  return (
    <LeaveActionsCtx.Provider value={actions}>
      {children}
    </LeaveActionsCtx.Provider>
  );
}

export const useLeaveActions = () =>
  useContext(LeaveActionsCtx)!;
```

### All 14 module contexts

| Module | Store hook | Actions context |
|---|---|---|
| CMS | `useCmsStore` | `useCmsActions` |
| HRMS | `useHrmsStore` | `useHrmsActions` |
| Payroll | `usePayrollStore` | `usePayrollActions` |
| Attendance | `useAttendanceStore` | `useAttendanceActions` |
| Leave | `useLeaveStore` | `useLeaveActions` |
| Recruitment | `useRecruitmentStore` | `useRecruitmentActions` |
| Documents | `useDocumentsStore` | `useDocumentsActions` |
| Performance | `usePerformanceStore` | `usePerformanceActions` |
| Assets | `useAssetsStore` | `useAssetsActions` |
| Projects | `useProjectsStore` | `useProjectsActions` |
| Notifications | `useNotificationsStore` | `useNotificationsActions` |
| Approvals | `useApprovalsStore` | `useApprovalsActions` |
| Audit | `useAuditStore` | `useAuditActions` |
| SelfService | `useSelfServiceStore` | `useSelfServiceActions` |

---

## 4. Feature folder template (every module)

```
src/features/leave/
├── index.ts                     # public API: re-export types, hooks, store, provider
├── leave.module.tsx            # composes <LeaveProvider> into <ModuleProvider>
├── leave.context.ts            # context + provider + useLeaveActions()
├── leave.store.ts              # Zustand (UI state only)
├── components/
│   ├── LeaveRequestDialog.tsx
│   ├── LeaveBalanceCard.tsx
│   ├── LeaveCalendar.tsx
│   ├── LeaveLedgerTable.tsx
│   ├── LeaveApprovalList.tsx
│   └── leave-detail-panel.tsx
├── pages/
│   ├── LeaveIndexPage.tsx       # balances + requests
│   ├── LeaveRequestPage.tsx     # create / amend / cancel
│   ├── LeaveApprovalsPage.tsx   # manager/HR inbox
│   ├── LeaveLedgerPage.tsx      # read-only ledger
│   └── LeaveCalendarPage.tsx    # team calendar
├── hooks/
│   ├── use-leave-balance.ts     # TanStack Query hooks
│   ├── use-leave-requests.ts
│   ├── use-leave-approvals.ts
│   ├── use-leave-ledger.ts
│   └── use-leave-types.ts
├── types.ts                     # re-export from @hersvin/shared
└── queries.ts                   # query keys + fetchers
```

---

## 5. Per-module component inventory

### 5.1 CMS — `src/features/cms/`

**Store (`useCmsStore`):** `selectedCompanyId`, `selectedDeptId`, `orgChartLayout` (top-down / left-right), `collapsedNodeIds`, `searchTerm`

**Components:**
- `OrgChartCanvas` — SVG tree, draggable nodes (react-flow / custom), click node → detail drawer
- `DepartmentTree` — nested list, breadcrumbs, collapse state
- `PositionDetailDrawer` — shadcn `Sheet` from right
- `OrgChartHistoryTimeline` — date scrubber (effective-date view)
- `LocationMap` — map lib (mapbox or leaflet) with location pins
- `CostCenterTable` — shadcn DataGrid, read-only
- `JobLevelMatrix` — grid of levels × companies

**Global actions:** `selectCompany`, `selectDept`, `expandNode`, `collapseAll`, `openPositionDrawer`, `navigateToOrgHistory(date)`

---

### 5.2 HRMS — `src/features/hrms/`

**Store:** `employeeFilter` (status, dept, location), `employeeSort`, `employeeView` (table | card), `selectedEmployeeId`, `profileTab` (overview | history | documents | compensation | performance | leave | assets)

**Components:**
- `EmployeeDirectoryTable` — shadcn DataGrid with server-side pagination via TanStack Query
- `EmployeeCardView` — grid of cards, same filters
- `EmployeeProfileDrawer` — tabbed detail panel
- `EmploymentHistoryTimeline` — vertical timeline (hire → transfers → current)
- `LifecycleEventList` — compact table of `employee_event` rows
- `EmployeeFormWizard` — multi-step (basic, contact, organization, contract, compensation, document checklist)
- `OnboardingChecklistCard` — progress bar + task list
- `EADuplicateCheckBanner` — inline alert when `employee_match_rule` fires

**Global actions:** `createEmployee`, `openProfile(empNo)`, `navigateToTab(tab)`, `startOnboarding(empId)`, `runDedupeCheck(payload)`

---

### 5.3 Payroll — `src/features/payroll/`

**Store:** `selectedPayGroup`, `runFilter` (status, period), `previewExpandRows: string[]`, `amsExportTab`

**Components:**
- `PayrollRunsTable` — shadcn DataGrid, status color-coded
- `PayrollRunDetail` — header (status, period, totals) + item table
- `PayrollRunItemTable` — server-side, row expand to show `component` breakdown
- `PayrollPreviewModal` — side-by-side before/after adjustments
- `PayslipPreview` — iframe/embedded PDF viewer (signed URL from backend)
- `AmsExportPanel` — batch selection, status badges, downloadable
- `PayrollExceptionList` — highlighted rows needing review
- `OvertimeRulesEditor` — table + rule builder (jurisdiction selector)

**Global actions:** `openRun(runId)`, `startRun(periodId)`, `approveRun(runId)`, `lockRun(runId)`, `exportRun(runId)`, `showPayslip(itemId)`

---

### 5.4 Attendance — `src/features/attendance/`

**Store:** `attendanceDateRange`, `attendanceFilter` (employee, status), `clockInGps`, `correctionModal: boolean`

**Components:**
- `AttendanceTodayWidget` — clock-in/out buttons, timezone-aware timer
- `AttendanceHistoryTable` — shadcn DataGrid with computed status chips (late, ot, absence)
- `CorrectionRequestDialog` — form + reason + attachment
- `CorrectionApprovalList` — manager inbox
- `WorkScheduleEditor` — per-location schedule grid (7 columns × time)
- `HolidayCalendar` — annual view + per-day detail
- `AttendanceExceptionList` — filterable, group by type
- `PeriodSummaryCard` — OT hours, late count, absences (read-only)

**Global actions:** `clockIn()`, `clockOut()`, `submitCorrection(entryId)`, `approveCorrection(id)`, `rejectCorrection(id, reason)`

---

### 5.5 Leave — `src/features/leave/`

**Store:** `leaveRequestModal: { open, preselect? }`, `leaveBalanceFilter`, `leaveCalendarRange`

**Components:**
- `LeaveBalanceCards` — grid of cards (accrued / used / available / carryover)
- `LeaveRequestForm` — date range, type, reason, supporting docs
- `LeaveRequestList` — my requests, status chips
- `LeaveApprovalInbox` — queue, approve/reject with comment
- `LeaveCalendar` — month view, team filter, leave-type color coding
- `LeaveLedgerTable` — read-only running ledger
- `LeaveTypeConfigPanel` — HR admin: rules, accrual, carryover
- `LeaveExpiryAlertBanner` — upcoming carryover deadlines

**Global actions:** `openRequest()`, `amendRequest(id)`, `cancelRequest(id)`, `approve(requestId)`, `reject(requestId, reason)`

---

### 5.6 Recruitment — `src/features/recruitment/`

**Store:** `pipelineColumnWidths`, `selectedRequisitionId`, `interviewCalendarDate`

**Components:**
- `RequisitionList` — table + status filter
- `RequisitionDetail` — header + linked candidates + headcount
- `CandidatePipelineBoard` — Kanban (react-beautiful-dnd or dnd-kit)
- `CandidateCard` — compact, stage badge, hover actions
- `CandidateDetailDrawer` — application history, interviews, offer
- `InterviewScheduleCalendar` — week view, time slots
- `OfferLetterPreview` — PDF preview + accept/decline tracking
- `ConsentBanner` — candidate data retention notice
- `StageFeedbackForm` — per-interview structured feedback

**Global actions:** `moveCandidate(id, stage)`, `scheduleInterview(id, round)`, `issueOffer(id)`, `convertToEmployee(candidateId)`, `openRequisition(reqId)`

---

### 5.7 Documents — `src/features/documents/`

**Store:** `documentLibraryFilter` (category, status, owner), `selectedDocumentId`, `uploadDragOver`

**Components:**
- `DocumentLibraryGrid` — thumbnail + metadata
- `DocumentUploader` — drag-drop, multi-file, progress per file
- `DocumentDetailDrawer` — version history, access log, expiry banner
- `DocumentDownloadButton` — signed-URL fetch, time-limited
- `ExpiryDashboard` — KPI cards (30/60/90-day buckets)
- `RenewalWorkflowStepper` — per-document checklist
- `LegalHoldBadge` — read-only lock icon + explanation
- `DisposalRequestForm` — authorized disposal with reason

**Global actions:** `uploadFiles(files)`, `downloadDocument(versionId)`, `requestExpiryRenewal(docId)`, `applyLegalHold(docId)`, `dispose(docId)`

---

### 5.8 Performance — `src/features/performance/`

**Store:** `selectedCycleId`, `reviewTab` (goals | assessment | calibration), `calibrationDragState`

**Components:**
- `CycleConfigurator` — wizard: period, participants, deadlines, template
- `ReviewWizard` — per-participant multi-step (self → manager → peer → HR)
- `GoalTrackerCard` — progress bars, milestones
- `CompetencyRadar` — radar chart of competency scores
- `CalibrationBoard` — draggable matrix (employee × rating)
- `ReviewHistoryTimeline` — past cycles
- `AssessmentResponseForm` — structured JSON form from template
- `ReviewCommentThread` — nested comments

**Global actions:** `startCycle(config)`, `openReview(id)`, `submitAssessment(reviewId, answers)`, `finalizeReview(reviewId)`

---

### 5.9 Assets — `src/features/assets/`

**Store:** `assetFilter` (status, category, custodian), `inventoryTab`

**Components:**
- `AssetRegisterTable` — shadcn DataGrid with status chips
- `AssetDetailDrawer` — full lifecycle history (assignment, transfer, maintenance)
- `AssetAssignmentForm` — assign/return with acknowledgement capture
- `InventoryCheckWizard` — location-scoped, barcode-scan ready
- `MaintenanceLog` — timeline
- `WarrantyBanner` — auto-computed from `warranty_until`
- `AssetTransferForm` — move between locations/custodians
- `DisposalRequestForm` — final state with reason + authorized_by

**Global actions:** `assignAsset(assetId, employeeId)`, `returnAsset(assignmentId)`, `transferAsset(assetId, fromLoc, toLoc)`, `logMaintenance(assetId, entry)`

---

### 5.10 Projects — `src/features/projects/`

**Store:** `projectView` (board | list | calendar), `selectedProjectId`, `boardColumn` (status), `taskModal: { open, taskId? }`

**Components:**
- `ProjectList` — shadcn DataGrid + KPI cards
- `ProjectDetail` — header + tabs (overview, board, calendar, reporting)
- `TaskBoard` — dnd-kit Kanban, columns = status
- `TaskDetailModal` — shadcn `Dialog`, full task + subtasks + comments
- `TaskList` — filterable table
- `ProjectCalendar` — month view, task bars
- `MilestoneTimeline` — horizontal Gantt-lite
- `WorkloadChart` — per-assignee, stacked bar
- `OverdueReportTable` — highlight + owner
- `CommentThread` — nested, markdown render
- `AttachmentList` — file list + upload

**Global actions:** `createTask(projectId, payload)`, `moveTask(taskId, newStatus)`, `openTask(taskId)`, `addComment(taskId, body)`

---

### 5.11–5.14 Shared modules

**Notifications** — `NotificationCenter` (bell dropdown), `NotificationList` (full page, filter by type), unread badge in top-bar.

**Approvals** — `ApprovalInbox` (universal queue), `ApprovalDetailCard` (entity-specific form), `DecisionButtons` (approve/reject + comment).

**Audit** — `AuditTrailViewer` (read-only table, filters by module + actor + time), `AuditDetailDrawer`.

**SelfService (ESS portal)** — `EssHome` (role-aware dashboard: today's attendance, leave balance, my tasks, my docs, my payslips, my performance cycle), `MyPayslipList`, `MyDocumentsList`.

---

## 6. Page inventory (route → page → components)

```
/login                      → LoginPage
/sso/callback              → SsoCallbackPage
/app/overview              → DashboardPage (role-aware)
/app/self-service          → EssHomePage
/app/employees            → EmployeeDirectoryPage
/app/employees/:empNo    → EmployeeProfilePage
/app/org                  → OrgChartPage
/app/recruitment          → RequisitionListPage
/app/recruitment/pipeline  → CandidatePipelinePage
/app/attendance           → AttendanceHistoryPage
/app/attendance/corrections → CorrectionInboxPage
/app/leave                → LeaveIndexPage
/app/leave/approvals      → LeaveApprovalsPage
/app/leave/ledger        → LeaveLedgerPage
/app/leave/calendar       → LeaveCalendarPage
/app/payroll              → PayrollRunsPage
/app/payroll/runs/:id    → PayrollRunDetailPage
/app/payroll/ams-export  → AmsExportPage
/app/documents            → DocumentLibraryPage
/app/documents/expiring  → ExpiryDashboardPage
/app/performance          → PerformanceCyclesPage
/app/performance/goals    → GoalBoardPage
/app/performance/calibration → CalibrationBoardPage
/app/assets               → AssetRegisterPage
/app/assets/inventory     → InventoryCheckPage
/app/projects             → ProjectListPage
/app/projects/:id        → ProjectDetailPage
/app/approvals            → ApprovalInboxPage
/app/notifications        → NotificationListPage
/app/audit                → AuditTrailPage
/admin/users             → UserAdminPage
/admin/roles             → RoleAdminPage
/admin/permissions       → PermissionAdminPage
```

---

## 7. Shared UI (`src/shared/ui/`) — shadcn/ui inventory

| Component | Use |
|---|---|
| `Button`, `Input`, `Label`, `Form` (via RHF) | all forms |
| `Dialog`, `AlertDialog`, `Sheet` | detail panels, confirmation |
| `Table`, `DataGrid` (shadcn-data-grid) | all list views |
| `Tabs`, `Accordion` | profile detail |
| `Badge`, `Avatar`, `Tooltip`, `Progress` | KPI + status chips |
| `Command` (cmdk) | global search (employees, projects, assets) |
| `Calendar` | leave calendar, interview scheduling |
| `Kanban` (custom, dnd-kit) | recruitment pipeline, project board |
| `Chart` (recharts wrapper) | workload, competency radar |
| `Toast` (shadcn) | global feedback |
| `Skeleton` | loading states |
| `EmptyState` | empty state |
| `ErrorBoundary` | async error state |
| `DatePicker` | date range inputs |
| `FileUpload` | DMS + interview evidence |
| `StatusChip` | domain status enum → color mapping |

---

## 8. Global state map (what goes where)

| Data | Where | Why |
|---|---|---|
| Auth session, tokens | `AuthProvider` + `tokenStore` (memory) | security |
| Permissions, scopes | `RbacProvider` (TanStack Query cache) | shared read |
| Selected company (CMS scoping) | `useCmsStore` (Zustand) | UI state |
| Leave modal open / preselect | `useLeaveStore` (Zustand) | UI state |
| Attendance clock-in state | `useAttendanceStore` | UI state |
| Employee list / detail | TanStack Query cache | server data |
| Payroll run detail | TanStack Query cache | server data |
| Notifications unread count | TanStack Query (polling) | server data |
| Org chart layout / collapsed | `useCmsStore` | UI state |
| Project board drag state | TanStack Query (optimistic) | server data |
| Global command search index | TanStack Query (per-module) | server data |

---

## 9. Resilience: four-state coverage per async boundary

Every TanStack Query-driven view MUST implement all four states:

| State | shadcn primitive | When |
|---|---|---|
| **Loading** | `Skeleton` rows | `isPending && !data` |
| **Success** | full render | `isSuccess` |
| **Empty** | `EmptyState` with CTA | `isSuccess && data.length === 0` |
| **Error** | `AlertCircle` + retry button | `isError` |

No "loading only" views. No unhandled `error` without retry affordance.

---

## 10. Conventions

- **File names:** `kebab-case.tsx` for components, `camelCase.ts` for hooks.
- **Barrel exports:** each `features/<module>/index.ts` exports store, provider, hooks, components.
- **Type imports:** all entities via `@hersvin/shared/types/entities/<module>`.
- **Query keys:** nested arrays, first segment = module. `["leave", "requests", filter]`.
- **Optimistic updates:** TanStack `onMutate` + rollback. Used for: leave approve/reject, task board drag, notification mark-read.
- **Zustand:** store state **UI-only**; every field documented in the module store file header comment.
- **No prop drilling > 2 levels**: extract to a feature-local hook.
- **i18n:** all visible strings via `useTranslation()`.
- **CLS**: every `<img>`, `<video>`, PDF preview has `aspect-ratio` + `width`/`height` set.
- **Focus**: all shadcn components ship `focus-visible` rings; custom components must add `outline-2 outline-offset-2`.
