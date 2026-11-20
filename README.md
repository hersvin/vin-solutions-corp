# Hersvin Company Systems

Hersvin Company Systems is a monorepo for the company's operational software. Each product lives in its own directory under `projects/`, with project requirements and implementation documentation alongside the code.

## Products

| Product | Description |
| --- | --- |
| [Accounting Management System](projects/accounting-management-system/.docs/product-requirements-document.md) | Product requirements and planning for accounting operations. |
| [Business Intelligence System](projects/business-intelligent-system/.docs/product-requirements-document.md) | Product requirements and planning for business intelligence. |
| [Human Resource Information System](projects/human-resource-information-system/.docs/product-requirements-document.md) | HR platform with web, mobile, and backend applications. |
| [Inventory Management System](projects/inventory-management-system/.docs/product-requirements-document.md) | Product requirements and planning for inventory operations. |
| [Point of Sales](projects/point-of-sales/.docs/product-requirements-document.md) | Product requirements and planning for point of sale operations. |

## Repository layout

```text
projects/
  accounting-management-system/
  business-intelligent-system/
  human-resource-information-system/
    backend/
    frontend/
      mobile/
      web/
  inventory-management-system/
  point-of-sales/
```

Each product is an independently organized project. The Human Resource Information System currently contains the implemented applications; the other project directories contain product documentation.

## Human Resource Information System

The HRIS includes a NestJS backend, a React web application, and an Expo/React Native mobile application. See its [project documentation](projects/human-resource-information-system/.docs/) for module details, folder structure, and database schema.

### Prerequisites

- Node.js and npm
- PostgreSQL and any services configured by the backend environment
- Expo-supported tooling for mobile development

### Local development

Run commands from each application's directory:

```powershell
# Backend
cd projects/human-resource-information-system/backend
npm install
npm run start:dev

# Web app, in a separate terminal
cd projects/human-resource-information-system/frontend/web
npm install
npm run dev

# Mobile app, in a separate terminal
cd projects/human-resource-information-system/frontend/mobile
npm install
npm start
```

Configure backend environment variables using `projects/human-resource-information-system/.env.example`. Keep credentials in local environment files and never commit secrets.

The backend package also provides `npm run db:init` for database initialization, migrations, and seed data. Review its environment configuration before running it against a database.

## Common commands

Run these from the relevant package directory:

| App | Build | Lint | Tests |
| --- | --- | --- | --- |
| Backend | `npm run build` | `npm run lint` | `npm test` |
| Web | `npm run build` | `npm run lint` | Not configured |
| Mobile | Not configured | `npm run lint` | Not configured |

There is no root-level JavaScript workspace or root package command. Install dependencies and run scripts within each application package.

## Documentation

- [Repository agent guidance](AGENTS.md)
- [HRIS product requirements](projects/human-resource-information-system/.docs/product-requirements-document.md)
- [HRIS backend module](projects/human-resource-information-system/.docs/backend-module.md)
- [HRIS web module](projects/human-resource-information-system/.docs/web-module.md)
- [HRIS mobile module](projects/human-resource-information-system/.docs/mobile-module.md)
- [HRIS database schema](projects/human-resource-information-system/.docs/database-schema.md)
- [HRIS folder structure](projects/human-resource-information-system/.docs/folder-structure.md)
