import { lazy, Suspense, type ComponentType } from "react";
import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import { MODULES } from "@/moduleManifest";

type LazyModule = { default: ComponentType };
type LazyLoader = () => Promise<LazyModule>;

const moduleParents = import.meta.glob<LazyModule>("./modules/*/index.tsx");
const submodulePages = import.meta.glob<LazyModule>("./modules/*/pages/*.tsx");

function getLazyPage(loaders: Record<string, LazyLoader>, path: string) {
  const loader = loaders[path];
  return loader ? lazy(loader) : null;
}

export function AppRoutes() {
  return (
    <Suspense fallback={<div className="routes-loading" role="status">Loading workspace…</div>}>
      <Routes>
        <Route path="/" element={<Navigate to={`/modules/${MODULES[0].id}`} replace />} />
        {MODULES.map((module) => {
          const parentPath = `./modules/${module.id}/index.tsx`;
          const Parent = getLazyPage(moduleParents, parentPath);
          if (!Parent) return null;

          return (
            <Route key={module.id} path={`/modules/${module.id}`} element={<Parent />}>
              <Route
                index
                element={<Navigate to={module.submodules[0].id} replace />}
              />
              {module.submodules.map((page) => {
                const pagePath = `./modules/${module.id}/pages/${page.id}.tsx`;
                const Page = getLazyPage(submodulePages, pagePath);
                if (module.id === "configurations" && page.children?.length) {
                  return (
                    <Route key={page.id} path={page.id} element={<Outlet />}>
                      {Page && <Route index element={<Page />} />}
                      {page.children.map((child) => {
                        const childPath = `./modules/${module.id}/pages/${child.id}.tsx`;
                        const ChildPage = getLazyPage(submodulePages, childPath);
                        return ChildPage ? (
                          <Route key={child.id} path={child.id} element={<ChildPage />} />
                        ) : null;
                      })}
                    </Route>
                  );
                }
                return Page ? (
                  <Route key={page.id} path={page.id} element={<Page />} />
                ) : null;
              })}
              <Route path="*" element={<Navigate to={module.submodules[0].id} replace />} />
            </Route>
          );
        })}
        <Route path="*" element={<Navigate to={`/modules/${MODULES[0].id}`} replace />} />
      </Routes>
    </Suspense>
  );
}
