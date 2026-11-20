# Handoff: Hersvin HRIS Project Context

2026-11-20 · Persistent handoff for future AI sessions and contributors working on Hersvin HRIS.

## 1. Objective

Resume work on the Hersvin HRIS frontend with the product decisions, user corrections, code structure, and known prototype limits intact. Start with the project context at [`context/hris-context.md`](../../context/hris-context.md); this snapshot records the conversation-specific decisions and current handoff state.

## 2. Current State

- Repository root: `C:\Users\admin\Desktop\hersvin`.
- HRIS web app: `projects/human-resource-information-system/frontend/web/`.
- Frontend uses React 19, TypeScript, Vite 8, pnpm, React Router, Base UI, Motion, AutoAnimate, Runeicons React, Recharts, FullCalendar, Zustand, and TanStack Query.
- Main routing uses lazy module parents and lazy submodule pages. Navigation is described by `src/moduleManifest.ts`; route discovery is in `src/routes.tsx`.
- The main visible modules are Dashboard, Calendar, Record, Applications, Employee Management, Timekeeping, Payroll, Reports, Security, and Configuration. Their detailed children and prototype caveats are in `context/hris-context.md`.
- Frontend screens use sample/local data. No verified live persistence, authentication, backend authorization, payroll provider, bank, or government integration is established by this handoff.
- Last reported build passed after the Payroll, Security, Configuration, and Reports implementation. Re-run checks before relying on that result; no test script currently exists in `package.json`.
- The reusable context file is present at `context/hris-context.md`; the dated handoff and index are complete.

## 3. Key Decisions & Rationale

- Use **hersvin** as the permanent brand name: the user specified it for the header.
- Use Manrope for headings and Inter for body text, stored locally under `public/assets/`: user chose this font pairing.
- Use the palette `#F4BAA3`, `#F4F0E2`, `#A6C8E2`, `#619DC6`: user supplied these colors as the product theme.
- Use Runeicons React for app icons and avoid hand-authored SVG controls: the user explicitly requested replacing SVG icons.
- Keep base roles at **EMPLOYEE**, **MANAGER**, and **ADMIN**. Reviewer and Approver are Manager capabilities assigned by workflow: user specified three roles and accepted this model.
- Keep navigation labels `Primary modules` and `Independent modules` exactly: the user corrected the section names and asked that this be remembered.
- Keep Task Management inside Employee Management. Do not show Tasks & Projects as an independent navigation item: the user asked to remove it.
- Put organization setup under Configuration > Organization, scope its records by selected company, and include Company, Branch, Department, Division, Section, Position Level, and Designation: the user requested this structure and multi-company behavior.
- Do not add a Company Management layout to Dashboard. Organization list selection should open its corresponding table page with breadcrumb `Workspace > Configuration > Organization > Selected Organization`: user corrected the earlier routing/layout direction.
- Keep Dashboard as the selected analytics design using Recharts: user chose option 3 and Recharts.
- Calendar has Personal Calendar with draggable events and Team Calendar with view-only employee calendars: user specified both modes and asked for animation.
- Applications remain separate request types/pages. Each has My Requests, For Review, For Approve, and Filings views, request-specific columns, and a request detail view: user corrected the proposal to use one shared Applications page.
- Keep app pages mobile responsive and aligned to `THEME.ts` and `FONT.ts`: repeated product requirement.
- Keep module styles alongside their components; keep shared shell/scrollbar styles in shared CSS. The main shell should not own module-page scrolling, and the scrollbar should have a slider without arrow buttons.
- Treat exported reports, payslips, and operational data as prototypes unless current code and integrations establish otherwise: no verified production data sources or external integrations were provided.

## 4. Dead Ends (Do Not Retry)

- A single shared Applications page for all request types was rejected. Each application type has its own page; only its queue tabs and general interaction pattern are shared.
- Showing Company Management inside Dashboard was rejected. Organization records belong under Configuration > Organization.
- An independent Tasks & Projects navigation item was rejected. Keep Task Management nested under Employee Management.
- The user asked to revert the latest edits to three files during mobile sidebar work. Do not reapply that reverted change without checking the current code and asking what behavior is wanted.

## 5. Artifacts and File Changes

- `context/hris-context.md`: completed and verified on disk; durable project context, architecture, module inventory, design preferences, roles, and prototype limitations.
- `projects/human-resource-information-system/frontend/web/src/moduleManifest.ts`: current module/submodule manifest; inspected during context creation.
- `projects/human-resource-information-system/frontend/web/src/routes.tsx`: lazy route mapping, including nested organization pages; inspected during context creation.
- `projects/human-resource-information-system/frontend/web/src/main.tsx`: shared application shell and theme-aware scrollbar setup; inspected during context creation.
- `projects/human-resource-information-system/frontend/web/src/utils/THEME.ts`: palette and status/scrollbar tokens; inspected during context creation.
- `projects/human-resource-information-system/frontend/web/src/utils/FONT.ts`: local Manrope/Inter font declarations; inspected during context creation.
- `projects/human-resource-information-system/frontend/web/package.json`: installed frontend dependencies and scripts; inspected during context creation.
- `docs/handoffs/2026-11-20-hris-project-context.md`: completed handoff snapshot.
- `docs/handoffs/README.md`: completed handoff index.

## 6. Verbatim Essentials & Constraints

- Roles: `EMPLOYEE`, `MANAGER`, `ADMIN`.
- Organization views: `Company`, `Branch`, `Department`, `Division`, `Section`, `Position Level`, `Designation`.
- Theme: `#F4BAA3`, `#F4F0E2`, `#A6C8E2`, `#619DC6`.
- Font files: `/assets/Manrope-Variable.woff2`, `/assets/Inter-Variable.woff2`.
- Brand: `hersvin`.
- Application queues: `My Requests`, `For Review`, `For Approve`, `Filings`.
- Application statuses include `Cancelled`, `Approved`, `Reviewed`, `Filed`.
- Commands from `projects/human-resource-information-system/frontend/web/`: `pnpm install`, `pnpm dev`, `pnpm build`, `pnpm lint`, `pnpm preview`.
- Repo `AGENTS.md` requires Caveman Ultra communication, strict Red-Green-Refactor TDD before production changes, no secrets, English, no emojis in code, and no em dashes. Preserve code, paths, commands, and negations verbatim.
- Root `../prd/human-resources-information-system-prd.md` and web `README.md` are stale in places. The PRD predates Division/Section and multi-company Organization details; web README still claims the app is the Vite starter. Check source before relying on those claims.

## 7. Working Preferences & Writing Rules

- User is Vin. Use Caveman Ultra unless Vin changes that preference.
- Keep answers direct, brief, and concrete. Do not ask for approval for routine authorized implementation work.
- Explain visual proposals before implementing when Vin asks to review first. Otherwise, execute the requested work.
- Preserve the latest user-provided module names and corrections. Do not overwrite naming changes based on older PRD text.
- Do not claim tests, backend behavior, security enforcement, or export compliance that have not been verified.

## 8. Open Items & Immediate Next Steps

- Next action: future agent should read `context/hris-context.md`, this handoff, the root `AGENTS.md`, then inspect the target module before changing code.
- Documentation drift: update the PRD and web README only when requested; keep the context file current if product decisions materially change.
- Verification: run `pnpm build` and `pnpm lint` from the web app when the task calls for validation. There is no `test` script in the current `package.json`.
- Blocked: none known.

## 9. Suggested Opening Prompt for Next Session

“Read `AGENTS.md`, `context/hris-context.md`, and `docs/handoffs/2026-11-20-hris-project-context.md` before continuing. This is the Hersvin HRIS project. Preserve Vin’s module names, role model, theme/fonts, responsive design, and the prototype limitations recorded there. My next task is: [describe task].”
