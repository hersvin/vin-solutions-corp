# HRIS Mobile — Component & Module Spec (Expo + React Native + NativeWind + Zustand + TanStack Query + Context)

Aligned to: `.docs/folder-structure.md` §4 + `.docs/database-schema.md` §1–§10.

## 1. Tech stack (final)

| Concern          | Choice | Notes |
|---|---|---|
| Framework        | React Native + Expo | SDK 53+, EAS builds |
| Router           | expo-router | file-based, deep-link ready |
| Styling          | NativeWind (Tailwind for RN) + StyleSheet (for native-only props) | — |
| Data fetching    | TanStack Query v5 | server state |
| Client state     | Zustand v5 | UI state per module |
| HTTP             | Axios (configured, interceptors mirror web) | — |
| Push notifications | Firebase (FCM + APNs) | silent payload for leave reminders |
| Offline queue    | SQLite via `expo-sqlite` | attendance punch queue, sync on reconnect |
| Storage          | `expo-secure-store` (Keychain/Keystore) | tokens |
| App lock         | `expo-local-authentication` (biometric) | security requirement |
| i18n             | i18next + react-i18next | — |
| Testing          | jest-expo + Detox (smoke) | — |
| Analytics/crash  | Sentry React Native | — |

---

## 2. `src/api/` — Axios configuration (same pattern as web)

```
src/api/
├── client.ts                    # base axios instance
├── interceptors/
│   ├── request.interceptor.ts   # auth header, correlation id
│   ├── response.interceptor.ts  # ApiError, 401 rotation, offline queuing
│   └── token.interceptor.ts     # silent refresh (expires_at check)
├── sdk/                         # shared generated client (from @hersvin/shared)
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
└── offline/
    ├── queue.ts                # SQLite queue for failed mutations (punches, leave requests)
    └── sync.ts                # replay queue on reconnect, idempotent via correlation_id
```

### `client.ts`

```ts
import axios from "axios";
import { secureToken } from "@/shared/auth/secure-token";

export const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:4000/api/v1",
  timeout: 30_000,
  headers: { "Content-Type": "application/json" },
});
```

### `request.interceptor.ts`

- attach `Authorization: Bearer <access>` from `secureToken`
- attach `X-Correlation-Id` per request
- check `expires_at`; if < 60 s left, await silent refresh before dispatch

### `response.interceptor.ts`

- unwrap envelope
- on `401`: rotate via `POST /auth/refresh` → re-dispatch original request once
- on `401` + refresh failed: `emit("auth:expired")` → router redirect to `/auth/sign-in`
- on network error + mutating request: enqueue in offline queue, show toast, don't throw

### `offline/queue.ts`

- stores failed mutations in SQLite: `{ correlationId, path, method, body, enqueuedAt, retries }`
- `sync.ts` replays on `AppState` active / network available
- idempotent: server deduplicates by `correlationId`

---

## 3. Module store + context map

Each module (mobile focus subset only):

| Module | Zustand store | Context actions |
|---|---|---|
| Attendance | `useAttendanceStore` | `useAttendanceActions` |
| Leave | `useLeaveStore` | `useLeaveActions` |
| Payslips | `usePayslipStore` | `usePayslipActions` |
| Documents | `useDocsStore` | `useDocsActions` |
| Projects | `useProjectsStore` | `useProjectsActions` |
| Notifications | `useNotifsStore` | `useNotifsActions` |
| Profile | `useProfileStore` | `useProfileActions` |

**What lives in mobile (not all 10 modules):**

Mobile is the **employee self-service + manager approval** surface. HR admin, payroll run preparation, recruitment pipeline, performance calibration, and audit trail are **web-only**.

| PRD module | Mobile presence | Why |
|---|---|---|
| CMS | read-only (work location, dept) | org config is admin |
| HRMS | profile + own record | self-service |
| Payroll | payslip list + view (read-only) | no run prep on mobile |
| Attendance | clock-in/out, history, corrections | primary use case |
| Leave | request, approvals (manager), balances, calendar | self-service + manager |
| Recruitment | none | recruiter workflow |
| Documents | own documents, download | no admin upload |
| Performance | goal tracking, self-assessment form | employee input |
| Assets | my assigned assets | custodian view |
| Projects | my tasks, board view (mobile-optimized) | task execution |
| Notifications | inbox | all users |
| Approvals | leave, corrections, assets | manager/HR on-the-go |

---

## 4. Feature folder template (mobile)

```
src/features/leave/
├── index.ts                    # public API
├── leave.context.tsx          # context + provider + useLeaveActions()
├── leave.store.ts             # Zustand (UI state only)
├── components/
│   ├── LeaveBalanceCard.tsx
│   ├── LeaveRequestForm.tsx
│   ├── LeaveStatusBadge.tsx
│   └── LeaveCalendar.tsx
├── screens/                   # expo-router pages
│   ├── index.tsx              // /app/leave
│   ├── request.tsx            // /app/leave/request
│   └── approvals.tsx          // /app/leave/approvals
├── hooks/
│   ├── use-leave-balance.ts   # TanStack Query
│   ├── use-leave-requests.ts
│   └── use-leave-approvals.ts
└── types.ts
```

---

## 5. Per-module component inventory

### 5.1 Attendance

**Store (`useAttendanceStore`):** `clockInState` (idle | pending | success | error), `gpsCoords`, `deviceName`, `todayEntry`

**Components:**
- `ClockInCard` — large tap-to-punch button, GPS status indicator, timer
- `PunchHistoryList` — flat list, computed status (late, on-time, OT)
- `CorrectionForm` — date picker, reason, photo (optional), submit
- `CorrectionStatusBadge` — submitted / approved / rejected
- `TodaySummaryRow` — hours in, break taken, OT

**Global actions:** `clockIn()`, `clockOut()`, `submitCorrection(entryId, payload)`, `checkGps()`

**Offline:** clock-in/out mutations queue in SQLite when offline; `correlationId` ensures idempotency on replay.

### 5.2 Leave

**Store (`useLeaveStore`):** `selectedLeaveType`, `dateRange: [Date, Date] | null`, `approvalsTab`

**Components:**
- `BalanceCards` — grid of balance cards (type, available, carryover deadline)
- `LeaveRequestForm` — type, date range, reason, document attach
- `MyRequestsList` — compact list, status chips
- `ApprovalsList` — queue, swipe approve/reject (gesture)
- `LeaveCalendarMonth` — month view, team toggle, leave-type colors
- `ExpiryAlertBanner` — carryover deadline countdown

**Global actions:** `openRequest()`, `amend(id)`, `cancel(id)`, `approve(reqId)`, `reject(reqId, reason)`

### 5.3 Payslips

**Store:** `payslipPeriodFilter`

**Components:**
- `PayslipList` — period, net amount, status chips
- `PayslipDetailSheet` — embedded PDF viewer (signed URL, no local cache)
- `CompensationBreakdown` — earnings / deductions expandable rows

**Global actions:** `openPayslip(id)`, `downloadPayslip(id)` (save to device)

### 5.4 Documents

**Store:** `docsFilter` (category, status)

**Components:**
- `DocumentList` — own docs only, expiry badge
- `DocumentDetailSheet` — download button (signed URL, time-limited), version history
- `ExpiryWarningBanner` — documents expiring within 30 days
- `UploadButton` — upload own documents only (contract, tax ID, etc.)

**Global actions:** `downloadDocument(versionId)`, `uploadDocument(category, file)`, `openDocument(id)`

### 5.5 Projects / Tasks

**Store:** `taskView` (list | board), `selectedProjectId`

**Components:**
- `MyTasksList` — active tasks, due date, priority chip
- `TaskBoardMobile` — horizontal-swipe columns, compact cards
- `TaskDetailSheet` — description, subtasks, comments, attachments
- `OverdueBanner` — count + top 3 overdue tasks

**Global actions:** `openTask(id)`, `updateStatus(taskId, status)`, `addComment(taskId, body)`

### 5.6 Notifications

**Store:** `notifFilter` (all | unread | type)

**Components:**
- `NotificationList` — compact, unread dot
- `NotificationDetailSheet` — full body + deep link
- `BellBadge` — unread count in top bar

**Global actions:** `markRead(id)`, `openLink(id)` (navigate via expo-router)

### 5.7 Profile

**Store:** `activeProfileTab`

**Components:**
- `ProfileHeader` — avatar, name, emp_no, dept, location
- `PersonalInfoForm` — contact, emergency contact (read-only for gov ID)
- `WorkInfoCard` — position, manager, hire date, status
- `SecuritySettings` — app-lock toggle, MFA status, active sessions
- `SignOutButton` — clears tokens, resets app state

**Global actions:** `editProfile()`, `toggleAppLock(enabled)`, `signOut()`

---

## 6. Screen inventory (expo-router)

```
/app/(auth)/
  sign-in.tsx            # email + password + MFA
  mfa.tsx
  sso-callback.tsx

/app/(app)/
  index.tsx              # role-aware home
  attendance/
    index.tsx            # today + history
    clock-in.tsx         # tap-to-punch
    corrections.tsx
  leave/
    index.tsx            # balances + my requests
    request.tsx
    approvals.tsx        # manager view
  payslips/
    index.tsx
    [id].tsx
  documents/
    index.tsx
    [id].tsx
  projects/
    index.tsx            # my tasks
    [id].tsx
  notifications/
    index.tsx
    [id].tsx
  profile/
    index.tsx
    settings.tsx
```

---

## 7. NativeWind + StyleSheet split

**NativeWind** covers all Tailwind-compatible styling (spacing, colors, flexbox, typography, dark mode).
**StyleSheet.create** is used only for:
- `elevation` (Android shadows)
- `transform` animations not expressible in NativeWind
- native `StyleSheet.absoluteFill`

```tsx
// NativeWind
<View className="rounded-xl bg-white p-4 shadow-sm dark:bg-zinc-800">
  <Text className="text-lg font-semibold">Leave balance</Text>
</View>

// StyleSheet (native-only)
const sheet = StyleSheet.create({
  shadow: {
    elevation: 4,       // Android
    shadowColor: "#000", // iOS
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
});
```

---

## 8. Global state map

| Data | Where |
|---|---|
| Auth tokens | `expo-secure-store` (Keychain/Keystore) |
| Permissions / scopes | TanStack Query + RbacProvider |
| GPS coords for clock-in | `useAttendanceStore` |
| Punch queue state | SQLite + Zustand sync status |
| Unread notification count | TanStack Query (polling 60s) |
| Leave modal open / preselect | `useLeaveStore` |
| Task board active tab | `useProjectsStore` |

---

## 9. Resilience: four-state per async boundary

Same rule as web: every `useQuery`-driven screen implements **Loading, Success, Empty, Error**.

| State | RN primitive |
|---|---|
| Loading | `ActivityIndicator` / `SkeletonRow` (nativewind pulse) |
| Success | full render |
| Empty | `EmptyState` with CTA button |
| Error | error icon + `RetryButton` |

---

## 10. Conventions

- **Screen files:** `kebab-case.tsx` in `screens/`
- **Component files:** `PascalCase.tsx` in `components/`
- **Hook files:** `use-<feature>.ts` in `hooks/`
- **NativeWind classes:** prefer Tailwind utilities; `className` prop for static, `cn()` for conditional
- **No `Alert.alert`** — use `react-native-dialog` (shadcn-rn equivalent)
- **All visible strings** via `useTranslation()`
- **Images:** always `width` + `height` set (CLS equivalent: no layout shift)
- **Push deep links:** `expo-router` named routes; silent payloads handled in `notificationService.ts`
- **Offline detection:** `net-info` from `react-native`; `offline/queue.ts` auto-flush on reconnect
