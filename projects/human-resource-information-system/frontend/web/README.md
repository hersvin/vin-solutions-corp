# HRIS Web Application

The HRIS web application is the browser client for the Hersvin Human Resource Information System. It uses React, TypeScript, and Vite.

## Current status

The application currently contains the default Vite and React starter screen. HRIS features, API integration, routing, and authentication are not implemented yet. The [web module specification](../../.docs/web-module.md) describes the planned application architecture; its proposed tools may differ from the dependencies currently installed in this package.

## Requirements

- Node.js compatible with the installed Vite version
- npm

## Start development

Run these commands from `projects/human-resource-information-system/frontend/web`:

```sh
npm install
npm run dev
```

Vite prints the local development URL in the terminal. Edit `src/App.tsx` to update the starter page. Vite provides hot module replacement while the development server runs.

## Available scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Vite development server. |
| `npm run build` | Type-check the TypeScript project and build production assets. |
| `npm run preview` | Serve the production build locally for review. Run `npm run build` first. |
| `npm run lint` | Run ESLint across the package. |

## Project structure

```text
src/
  assets/       Images and bundled SVG assets
  App.tsx       Root application component
  App.css       Application component styles
  index.css     Global styles
  main.tsx      React application entry point
public/         Static files served from the site root
```

## Main dependencies

- React and React DOM for the user interface
- TypeScript for static type checking
- Vite for local development and production builds
- Tailwind CSS for utility styling
- TanStack Query for server state
- Zustand for client state
- Axios for HTTP requests

See `package.json` for the complete dependency and script list. Backend setup and environment configuration are documented in the [HRIS project README](../../README.md) and [environment example](../../.env.example).

## Related documentation

- [HRIS web module specification](../../.docs/web-module.md)
- [HRIS product requirements](../../.docs/product-requirements-document.md)
- [HRIS backend application](../../backend/README.md)
