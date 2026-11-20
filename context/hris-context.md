# HRIS Project Context

## Purpose

Hersvin HRIS is a workforce operations application for employee records, requests, timekeeping, payroll workflows, organization setup, and reporting. This file gives future contributors the current web-app context and records product decisions made with Vin.

## Project locations

- Repository: `projects/human-resource-information-system/`
- Web client: `projects/human-resource-information-system/frontend/web/`
- Current product requirements baseline: `.docs/human-resources-information-system-prd.md`
- The current frontend navigation and routes are defined in `frontend/web/src/moduleManifest.ts` and `frontend/web/src/routes.tsx`.

## Frontend stack

- React 19, TypeScript, Vite 8, pnpm
- React Router for nested routes and lazy-loaded module pages
- Base UI for accessible UI primitives
- Motion and AutoAnimate for interface transitions and list changes
- Runeicons React for icons. Do not hand-author SVG icons for app controls.
- Recharts for dashboard charts
- FullCalendar for calendar views and interactions
- Zustand and TanStack Query are installed for client and server state; use existing module patterns before adding another state library.
- PDF, spreadsheet, Word, and ZIP export dependencies include jsPDF, ExcelJS, docx, and fflate.

Useful commands, from `frontend/web/`:

```sh
pnpm install
pnpm dev
pnpm build
pnpm lint
pnpm preview
```

`package.json` currently has no test script. Do not claim a test suite exists without checking first.

## Source layout and conventions

- `src/main.tsx`: app bootstrap, theme setup, shared header/sidebar shell, and route mount.
- `src/routes.tsx`: lazy-loaded routes. It discovers module `index.tsx` files and submodule pages.
- `src/moduleManifest.ts`: module labels, navigation groups, submodules, descriptions, and nested configuration items. Keep this aligned with implemented routes.
- `src/modules/<module>/index.tsx`: module parent view, shared module navigation/breadcrumbs, and submodule outlet.
- `src/modules/<module>/pages/<PascalCase>.tsx`: submodule pages. Keep module components, hooks, state, and styles inside their owning module where practical.
- `src/layouts/`: shared header, sidebar, and module layout.
- `src/utils/THEME.ts` and `src/utils/FONT.ts`: shared design tokens.
- `src/index.css` and `src/main.css`: global styles and shared shell styles. Keep module-specific styles beside their module components.
- Use the existing `@/` path alias for imports.
- Keep pages responsive, keyboard usable, and consistent with the shared theme. Respect reduced-motion preferences for significant animation.

## Visual system and product preferences

- Brand name: **hersvin**.
- Heading font: Manrope, loaded from `public/assets/Manrope-Variable.woff2`.
- Body font: Inter, loaded from `public/assets/Inter-Variable.woff2`.
- Theme palette: peach `#F4BAA3`, cream `#F4F0E2`, light blue `#A6C8E2`, and blue `#619DC6`.
- `THEME.ts` also defines primary action, status, and light/dark scrollbar colors. Use these tokens/CSS variables instead of inventing a separate palette.
- Light and dark themes are supported. Maintain readable text, borders, controls, and status contrast in both.
- Keep the app mobile responsive. The mobile header has a menu button that opens the sidebar; desktop keeps the sidebar navigation visible and its minimize control usable.
- The main shell should not own module-page scrolling. Use the shared styled scrollbar for scrollable content; scrollbar should show a slider without arrow buttons.
- Prefer practical, restrained product UI over generic decorative dashboards. Keep actions, data hierarchy, and empty/loading/error states clear.

## Roles and access model

Three base roles:

- **EMPLOYEE**: own employee records, attendance, payslips and applicable loan ledger; submit and track own requests; view permitted calendars and assigned tasks.
- **MANAGER**: employee capabilities plus assigned review and/or approval responsibilities for their authorized team. Reviewer and Approver are manager capabilities, not separate base roles. A manager must not approve their own request.
- **ADMIN**: administer accounts, groups, configuration, and operational records according to explicitly granted permissions.

User groups refine module, record, and field permissions. Sensitive payroll, government identifiers, medical-related leave data, and disciplinary information require least-privilege access. Frontend visibility is not a substitute for backend authorization or audit logging.

## Current primary navigation

The visible primary modules are:

1. **Dashboard**: workforce and action overview with Recharts analytics.
2. **Calendar**: Personal Calendar (draggable personal events) and Team Calendar (view-only employee calendar).
3. **Record**: Attendance, Payslip, Loan Ledger.
4. **Applications**: Change of Schedule, Leave, Official Business, Missed Log, Overtime, Offset, Compensatory Time Off.
5. **Employee Management**: 201 Files and Task Management. Task Management stays here; do not restore a separate Tasks & Projects navigation entry.
6. **Timekeeping**: Employee Time Record, Leave Adjustments, Timekeeping Processing, Work Schedule.
7. **Payroll**: Loan Adjustment, Loan Application, Final Pay, Income and Deduction, 13th Month Process, Service Charge, Payroll Processing, Payroll Disbursement.
8. **Reports**: Human Resources, Timekeeping, Payroll, Government, Bank Export.
9. **Security**: Users, User Group.
10. **Configuration**: Organization, Cutoff Period, Holiday, Approval Setup, Scheduler Setup.

**Configuration > Organization** has Company, Branch, Department, Division, Section, Position Level, and Designation views. Organization is multi-company: company selection scopes the organization records shown. Do not put Company Management System in the Dashboard or create duplicate organization masters. The current PRD baseline has fewer organization children and calls the top-level module “Configurations”; code currently labels it “Configuration”. Follow the latest product decision and current manifest unless Vin changes it.

The manifest also contains retained modules marked hidden from navigation. Do not expose a hidden retained module in the sidebar unless the product owner asks. The independent “Tasks & Projects” entry was removed from the requested navigation; task management remains under Employee Management.

## Module behavior and prototype limits

- **Applications**: each request type has its own page and application-specific fields. Shared views include My Requests, For Review, For Approve, and Filings. Rows show document number, transaction date, status, attachment, and request-specific columns; selecting a row opens that request’s details. Statuses include Cancelled, Approved, Reviewed, and Filed with distinct theme-aligned colors. These views currently serve as prototype UI and are not permission enforcement.
- **Employee Management > 201 Files**: employee-card directory, Dicebear avatars for sample profiles, and a detailed employee profile including personal information, education, employment history/record, and benefits. Keep it responsive and avoid changing its rendering without checking the module’s existing component structure.
- **Employee Management > Task Management**: small Jira-inspired board and list views; tasks can be assigned to employees and change status.
- **Reports**: separate report catalogs for the five report areas. Users can preview/filter sample data and download PDF, Excel, Word, or all formats in a ZIP. Government and bank output formats require validation against the receiving institution’s current specifications before production use.
- **Record > Payslip**: sample payslips support PDF, Excel, and Word downloads.
- Calendar drag/drop and other local interactions operate on frontend sample state unless connected API behavior is explicitly implemented.

Current module screens are frontend prototypes using sample/local data. Do not describe them as connected to a live HRIS database, payroll provider, bank, government service, or authentication system unless the implementation has since been verified. Downloads reflect the data available in the UI. Server-side persistence, authorization, audit history, and integration behavior must be verified separately.

## Product requirements and known documentation drift

The PRD at `.docs/human-resources-information-system-prd.md` is an initial baseline. It describes the three roles and broad HRIS scope, but it predates some later product decisions: multi-company Organization children (Division and Section), the current Configuration label, and current frontend implementation details. The web README also still describes a default Vite starter screen and old file structure; that description is stale. Check the code before relying on either document for current implementation status. Update the PRD/README separately when asked; this context file does not replace them.

## Working guidance for future changes

1. Inspect the target module, manifest, route, and existing styles before editing.
2. Preserve Vin’s latest module names and navigation decisions; ask only if a requirement materially conflicts with the current product direction.
3. Reuse theme/font tokens, Runeicons, existing alias, and installed packages.
4. Keep module components and styles localized. Update routes and manifest together when adding or renaming a page.
5. Treat sample data as sample data. Never imply production-grade role enforcement or real export compliance without backend and format verification.
6. The repository `AGENTS.md` requires Caveman Ultra communication, strict Red-Green-Refactor TDD before production changes, and no secrets. Follow current repository guidance and user instructions.
