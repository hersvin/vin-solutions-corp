import { Suspense } from "react";
import { Tabs } from "@base-ui/react/tabs";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { getModule } from "@/moduleManifest";
import "@/layouts/ModulePageLayout.css";

type ModulePageLayoutProps = { moduleId: string; compactHeader?: boolean; notice?: string };

export function ModulePageLayout({ moduleId, compactHeader = false, notice }: ModulePageLayoutProps) {
  const module = getModule(moduleId);
  const location = useLocation();
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();
  if (!module) return null;
  const pathSegments = location.pathname.split("/").filter(Boolean);
  const isOrganizationRecord = moduleId === "configurations"
    && pathSegments[2] === "Organization"
    && pathSegments.length > 3;
  const routeSubmodule = location.pathname.split("/").filter(Boolean).at(-1);
  const currentSubmodule = module.submodules.find((item) => item.id === routeSubmodule)
    ?? module.submodules[0];
  if (!currentSubmodule) return <Outlet />;

  return (
    <section className="module-page" aria-labelledby={isOrganizationRecord ? undefined : "module-page-title"}>
      {!isOrganizationRecord && <nav className="module-breadcrumb" aria-label="Breadcrumb">
        <ol>
          <li><Link to="/">Workspace</Link></li>
          <li aria-hidden="true">/</li>
          <li><Link to={`/modules/${module.id}`}>{module.label}</Link></li>
          <li aria-hidden="true">/</li>
          <li aria-current="page">{currentSubmodule.label}</li>
        </ol>
      </nav>}

      {!compactHeader && !isOrganizationRecord && <header className="module-page__header">
        <p className="module-page__eyebrow">{module.group}</p>
        <h1 id="module-page-title">{module.label}</h1>
        <p>{currentSubmodule.description}</p>
      </header>}

      {!isOrganizationRecord && <Tabs.Root
        className="module-tabs"
        value={currentSubmodule.id}
        onValueChange={(value) => {
          if (typeof value === "string") navigate(`/modules/${module.id}/${value}`);
        }}
      >
        <Tabs.List className="module-tabs__list" aria-label={`${module.label} pages`}>
          {module.submodules.map((item) => (
            <Tabs.Tab className="module-tabs__tab" key={item.id} value={item.id}>
              {item.label}
            </Tabs.Tab>
          ))}
          <Tabs.Indicator className="module-tabs__indicator" />
        </Tabs.List>
      </Tabs.Root>}

      {notice && <p className="module-page__notice">{notice}</p>}

      <div className="module-page__content" aria-live="polite">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            className="module-page__route"
            key={location.pathname}
            initial={reduceMotion ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: -6 }}
            transition={{ duration: reduceMotion ? 0 : 0.2, ease: "easeOut" }}
          >
            <Suspense fallback={<div className="module-page__loading">Loading page…</div>}>
              <Outlet />
            </Suspense>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
