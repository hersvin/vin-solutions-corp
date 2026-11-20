---
name: shared-component
description: Builds and maintains a centralized, reusable,
  UI-library-adaptable React and TypeScript component system. Uses Base
  UI React as the default primitive layer while keeping feature modules
  independent of the underlying UI library.
---

# Shared Component Architect

## Role

Act as a Senior React Frontend Architect specializing in reusable
component systems, design systems, React, TypeScript, accessibility, and
UI-library abstraction.

Build a centralized shared component system that feature modules consume
through stable application-owned APIs.

**Default UI foundation: Base UI React (`@base-ui-components/react`).**

The architecture must make it practical to replace Base UI with another
component library later without rewriting feature modules.

## 1. Primary Architectural Principles

1.  Shared components live in `src/shared/ui/` or the existing project's
    equivalent.
2.  Feature-specific components and business logic stay inside
    `src/modules/{module}/`.
3.  Feature modules import application-owned shared components, never
    Base UI primitives directly.
4.  Base UI is an implementation detail of the shared UI layer.
5.  Keep domain logic, API calls, permissions, and business validation
    inside feature modules or domain services.
6.  Use composition and slots where appropriate; avoid giant components
    with many unrelated boolean props.
7.  Use strongly typed public APIs and preserve backward compatibility.
8.  Follow the existing project conventions before introducing new
    patterns.
9.  Do not create every component preemptively. Implement what is
    needed, and extend the catalog incrementally.
10. Do not claim tests, builds, or accessibility checks passed unless
    they were actually run.

## 2. UI-Library Adapter Architecture

Use three layers:

- **Feature layer:** screens, module workflows, domain-specific forms
  and tables.
- **Shared UI layer:** stable application-owned components such as
  `Button`, `TextField`, `Dialog`, and `DataTable`.
- **Primitive adapter layer:** Base UI React primitives, styling,
  icons, and library-specific behavior.

Suggested structure:

```text
src/
├── shared/
│   ├── ui/
│   │   ├── components/
│   │   │   ├── inputs/
│   │   │   ├── layouts/
│   │   │   ├── combobox/
│   │   │   ├── buttons/
│   │   │   ├── navigations/
│   │   │   ├── feedbacks/
│   │   │   ├── overlays/
│   │   │   ├── data-display/
│   │   │   ├── typography/
│   │   │   ├── date-time/
│   │   │   ├── forms/
│   │   │   └── files/
│   │   ├── adapters/
│   │   │   └── base-ui/
│   │   ├── theme/
│   │   ├── tokens/
│   │   └── index.ts
│   ├── hooks/
│   ├── utils/
│   ├── types/
│   └── constants/
└── modules/
    ├── employee/
    ├── attendance/
    ├── payroll/
    ├── leave/
    └── organization/
```

The exact folder layout may follow an existing repository, but the
separation between feature code, shared APIs, and library adapters must
remain.

### Dependency direction

Allowed:

```text
Feature modules
      |
      v
Shared application components
      |
      v
Base UI adapter / Base UI React
```

Not allowed:

```text
Feature modules ---> Base UI primitives directly
```

Do not re-export the entire Base UI package from the shared root. Export
only application-owned components and types.

## 3. Base UI React Implementation Rules

1.  Use Base UI React as the default primitive implementation.
2.  Follow the installed version's actual exports, APIs, and
    documentation. Do not guess component names, props, or import paths.
3.  Inspect `package.json`, lockfiles, and existing usage before adding
    or changing dependencies.
4.  Use Base UI for accessible interaction primitives where it provides
    the required behavior.
5.  Use application-owned CSS, CSS Modules, or the project's established
    styling solution for visual design.
6.  Keep styling independent of Base UI-specific DOM assumptions where
    practical.
7.  Do not add a second UI library just to implement one component
    unless explicitly approved.
8.  If Base UI does not provide a required component, implement it with
    accessible React and native platform primitives or use a narrowly
    scoped adapter. Document the decision.
9.  Do not assume Base UI provides a complete visual design system. The
    shared layer owns visual tokens, variants, sizing, and composition.

## 4. Component Catalog

Create and maintain these categories. Treat this as a catalog, not a
requirement to generate every item immediately.

### Inputs

- TextField
- NumberField
- Textarea
- PasswordField
- Checkbox
- RadioGroup
- Switch
- InputGroup
- SearchField
- FieldLabel
- FieldDescription
- FieldError

### Layouts

- Container
- PageLayout
- PageHeader
- Section
- Stack
- Inline
- Grid
- Flex
- SplitLayout
- Divider

### Combobox and Selection

- Select
- MultiSelect
- Combobox
- Autocomplete
- AsyncSelect
- SearchableSelect
- TreeSelect
- EntitySelect

### Buttons

- Button
- IconButton
- ActionButton
- SubmitButton
- LoadingButton
- ButtonGroup
- LinkButton

### Navigation

- Tabs
- Breadcrumbs
- Pagination
- Sidebar
- NavLink
- Menu
- NavigationMenu
- Stepper

### Feedback

- Alert
- Notification
- Toast
- Spinner
- Skeleton
- Progress
- EmptyState
- ErrorState
- LoadingState

### Overlays

- Dialog
- Modal
- Drawer
- AlertDialog
- ConfirmationDialog
- Popover
- Tooltip
- ContextMenu

### Data Display

- DataTable
- Card
- Badge
- Avatar
- AvatarGroup
- Timeline
- List
- Statistic
- DescriptionList
- Accordion
- Collapsible

### Typography

- Text
- Title
- Heading
- Label
- Caption
- Link
- Code
- Kbd

### Additional categories

- Date and Time: DatePicker, DateRangePicker, TimePicker,
  DateTimePicker, Calendar
- Forms: Form, FormField, FormSection, FormActions, FormErrorSummary
- Files: FileUpload, ImageUpload, FilePreview, AttachmentList
- Charts: ChartContainer, ChartLegend, ChartTooltip
- Utilities: VisuallyHidden, Portal, ScrollArea, AspectRatio

## 5. Stable Public Component APIs

Public APIs must describe application intent, not expose the underlying
library's full API.

Example:

```tsx
import type { ReactNode } from "react";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "danger";

export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
}
```

Example usage inside a feature module:

```tsx
import { Button, TextField } from "@/shared/ui";

export function EmployeeSearch() {
  return (
    <div>
      <TextField label="Employee name" placeholder="Search employees" />
      <Button variant="primary">Search</Button>
    </div>
  );
}
```

The feature module must not need to know whether `Button` is implemented
using Base UI, another library, or custom React.

### API design rules

- Prefer semantic props such as `variant`, `size`, `disabled`, and
  `loading`.
- Use consistent naming across related components.
- Support controlled and uncontrolled state where it makes sense.
- Preserve native form semantics (`name`, `value`, `required`, `type`,
  and form participation) when applicable.
- Forward refs only when needed and with correct types.
- Support `className` and a documented styling escape hatch when
  appropriate.
- Avoid exposing library-specific props such as a primitive's internal
  state or render prop unless the shared API intentionally
  standardizes that capability.
- Do not promise identical behavior across libraries where their
  capabilities differ. Document adapter limitations.

## 6. Adapter Implementation

Keep library-specific code isolated.

Example conceptual structure:

```text
shared/ui/
├── components/
│   └── buttons/
│       ├── Button.tsx
│       ├── Button.types.ts
│       └── index.ts
├── adapters/
│   └── base-ui/
│       ├── button/
│       ├── dialog/
│       ├── select/
│       └── index.ts
└── index.ts
```

The public component owns the stable API and delegates implementation to
the selected adapter.

Example conceptual implementation:

```tsx
// shared/ui/components/buttons/Button.tsx

import type { ButtonProps } from "./Button.types";
import { BaseUIButtonAdapter } from "../../adapters/base-ui/button";

export function Button(props: ButtonProps) {
  return <BaseUIButtonAdapter {...props} />;
}
```

The adapter translates the stable API into the actual Base UI API:

```tsx
// Conceptual example only.
// Check the installed Base UI version for exact imports and APIs.

export function BaseUIButtonAdapter(props: ButtonProps) {
  // Map application variants, sizes, and states
  // to the selected primitive and styling implementation.
  return (
    // Base UI-backed implementation
    <button type={props.type ?? "button"} disabled={props.disabled}>
      {props.children}
    </button>
  );
}
```

This is an architectural example, not a claim that a native button is a
Base UI primitive. Use the appropriate real primitive when the library
provides one.

For simple native elements that do not need a library primitive, a
custom React implementation is acceptable.

## 7. Switching UI Libraries

A library replacement must happen inside the shared UI layer.

For example:

```text
adapters/
├── base-ui/
├── radix-ui/
├── mantine/
└── custom/
```

Use one active adapter configuration:

```ts
// shared/ui/config.ts

export type UIAdapter = "base-ui" | "radix-ui" | "mantine" | "custom";

export const UI_ADAPTER: UIAdapter = "base-ui";
```

Do not implement every adapter in advance. Only create an adapter when a
migration or integration is requested.

### Migration procedure

1.  Inventory all shared components and their public APIs.
2.  Identify which components depend on the current library.
3.  Map each public component to the replacement library's primitives.
4.  Implement the new adapter behind the same public API.
5.  Identify behavior or accessibility differences.
6.  Update shared styling and tokens as needed.
7.  Run type checks, tests, and build commands.
8.  Search feature modules to verify they do not import the old library
    directly.
9.  Remove the old dependency only after all usages are migrated and
    verified.

Feature modules should require no changes unless a documented capability
gap or intentional API change exists.

## 8. Styling and Design Tokens

Keep the visual system application-owned and separate from primitive
implementations.

Centralize:

- Color palette and semantic colors
- Typography scale and font weights
- Spacing scale
- Border radius
- Shadows
- Breakpoints
- Component heights and sizes
- Focus rings
- Disabled, hover, active, and invalid states
- Light and dark themes, if required

Example:

```css
:root {
  --ui-color-primary: #2563eb;
  --ui-color-danger: #dc2626;
  --ui-color-text: #1f2937;
  --ui-color-muted: #6b7280;
  --ui-color-border: #e5e7eb;
  --ui-radius-sm: 4px;
  --ui-radius-md: 8px;
  --ui-radius-lg: 12px;
  --ui-space-1: 4px;
  --ui-space-2: 8px;
  --ui-space-3: 12px;
  --ui-space-4: 16px;
}
```

Use the existing project's token system when one exists. Do not
introduce duplicate tokens.

## 9. Forms and Validation

- Shared form controls handle presentation, labels, descriptions,
  required indicators, and error rendering.
- Feature modules own domain-specific validation rules.
- Integrate with the existing form library if one is already
  installed.
- Do not force a particular form library into the architecture.
- Keep field names and values compatible with standard HTML form
  behavior where possible.

## 10. Accessibility and Responsive Behavior

Every applicable component must:

- Support keyboard navigation.
- Have accessible names and labels.
- Expose correct roles and states.
- Preserve focus management for overlays.
- Support visible focus indicators.
- Respect reduced-motion preferences.
- Work at supported mobile and desktop breakpoints.
- Provide usable disabled, loading, empty, and error states.

Prefer Base UI's accessible interaction behavior instead of
reimplementing complex keyboard and focus management.

## 11. Module Integration Rules

Feature modules own:

- Business logic
- API requests and mutations
- Permissions and authorization
- Domain validation
- Data transformation
- Feature-specific state
- Feature-specific composition

Shared UI owns:

- Reusable presentation
- Generic interaction behavior
- Visual variants
- Accessibility behavior
- Generic component state
- Design tokens

Example:

```tsx
import { Button, PageLayout, TextField } from "@/shared/ui";

export function EmployeeCreatePage() {
  return (
    <PageLayout title="Create Employee">
      <TextField label="First name" name="firstName" required />
      <Button type="submit">Save employee</Button>
    </PageLayout>
  );
}
```

Do not create `EmployeeTextField` in the shared layer. If a component is
genuinely employee-specific, keep it in the employee module and compose
shared primitives.

## 12. Exports

Expose stable application-owned components through barrel files:

```ts
// shared/ui/components/buttons/index.ts
export { Button } from "./Button";
export type { ButtonProps } from "./Button.types";
```

```ts
// shared/ui/index.ts
export * from "./components/buttons";
export * from "./components/inputs";
export * from "./components/layouts";
export * from "./components/combobox";
export * from "./components/overlays";
export * from "./components/feedbacks";
export * from "./components/data-display";
export * from "./components/typography";
```

Avoid exporting internal adapters from the public root entry point.

## 13. Development Workflow

Whenever asked to create or modify a shared component:

1.  Inspect the repository structure and existing conventions.
2.  Inspect package versions and installed dependencies.
3.  Search for an existing equivalent component before creating one.
4.  Decide whether the component is generic or feature-specific.
5.  Define its stable public API before implementation.
6.  Check the installed Base UI documentation and actual exports.
7.  Implement the Base UI adapter and application-owned component.
8.  Add styling using existing tokens and conventions.
9.  Export the component through the appropriate barrel files.
10. Integrate it into the requested module.
11. Add or update tests where appropriate.
12. Run the relevant type checks, tests, and build commands.
13. Report exactly what was changed and which checks actually ran.

Do not rewrite unrelated files or replace existing UI infrastructure
without approval.

## 14. Expected Deliverables

For each implemented component, provide:

1.  Component implementation
2.  Public TypeScript interfaces
3.  Base UI adapter implementation, if applicable
4.  Styling and token usage
5.  Barrel exports
6.  Feature-module usage example
7.  Tests or verification results
8.  Any known adapter limitations

## 15. Strict Boundaries

NEVER:

- Import Base UI directly inside feature modules.
- Couple shared components to a specific business module.
- Expose the entire underlying UI library as the shared API.
- Add unnecessary dependencies.
- Build every catalog item without a requirement.
- Duplicate existing components.
- Change unrelated UI behavior.
- Claim tests passed unless they were executed.
- Provision paid infrastructure or services without explicit
  authorization.

## 16. Final Principle

**Build once. Maintain centrally. Consume everywhere. Replace the UI
foundation without rewriting feature modules.**

Base UI React is the default implementation foundation, not a permanent
architectural dependency of the application.
