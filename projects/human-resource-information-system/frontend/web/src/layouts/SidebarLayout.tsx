import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { LayoutGroup, motion } from "motion/react";
import { NavLink } from "react-router-dom";
import { RuneIcon } from "runeicons-react";
import { MODULES } from "@/moduleManifest";
import { FONT } from "@/utils/FONT";
import { THEME } from "@/utils/THEME";
import "@/layouts/SidebarLayout.css";

type SidebarCustomProperties = CSSProperties & { "--sidebar-accent": string };
const sidebarStyle: SidebarCustomProperties = {
  fontFamily: FONT.body.family,
  "--sidebar-accent": THEME.primary.main,
};

type SidebarLayoutProps = {
  mobileOpen: boolean;
  onClose: () => void;
};

export function SidebarLayout({ mobileOpen, onClose }: SidebarLayoutProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const sections = ["Primary modules", "Independent modules"] as const;

  useEffect(() => {
    if (!mobileOpen) return;
    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== "Tab") return;
      const focusableElements = Array.from(
        document.querySelectorAll<HTMLElement>(
          "#sidebar-navigation button:not(:disabled), #sidebar-navigation a[href]",
        ),
      );
      const firstElement = closeButtonRef.current;
      const lastElement = focusableElements.at(-1);
      if (!firstElement || !lastElement) return;

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [mobileOpen, onClose]);

  return (
    <aside
      className={`sidebar-layout${isCollapsed ? " is-collapsed" : ""}${mobileOpen ? " is-mobile-open" : ""}`}
      style={sidebarStyle}
      aria-label="HRIS modules"
      role={mobileOpen ? "dialog" : undefined}
      aria-modal={mobileOpen || undefined}
      aria-labelledby={mobileOpen ? "sidebar-title" : undefined}
    >
      <div className="sidebar-heading">
        <div className="sidebar-heading__copy">
          <span className="sidebar-heading__eyebrow">Workspace</span>
          <span className="sidebar-heading__title" id="sidebar-title">
            Modules
          </span>
        </div>

        <button
          className="sidebar-collapse-button"
          type="button"
          aria-label={isCollapsed ? "Expand sidebar" : "Minimize sidebar"}
          aria-expanded={!isCollapsed}
          aria-controls="sidebar-navigation"
          title={isCollapsed ? "Expand sidebar" : "Minimize sidebar"}
          onClick={() => setIsCollapsed((collapsed) => !collapsed)}
        >
          <RuneIcon
            name={
              isCollapsed ? "layouts-panel-left" : "layouts-panel-left-close"
            }
            type="normal"
            size={20}
          />
        </button>
      </div>
      <nav
        className="sidebar-navigation"
        id="sidebar-navigation"
        aria-label="Modules"
      >
        <LayoutGroup id="sidebar-module-selection">
          {sections.map((section) => {
            const items = MODULES.filter(
              (module) => module.group === section && !module.hiddenFromNavigation,
            );
            return (
              <section className="sidebar-section" key={section}>
                <h2 className="sidebar-section__title">{section}</h2>
                <ul className="sidebar-section__list">
                  {items.map((item) => (
                    <li key={item.id}>
                      <NavLink
                        className="sidebar-module"
                        to={`/modules/${item.id}`}
                        aria-label={item.label}
                        title={isCollapsed ? item.label : undefined}
                        end={false}
                        onClick={onClose}
                      >
                        {({ isActive }) => (
                          <>
                            {isActive && (
                              <>
                                <motion.span
                                  className="sidebar-module__active-fill"
                                  layoutId="sidebar-active-fill"
                                  transition={{
                                    type: "spring",
                                    stiffness: 520,
                                    damping: 42,
                                  }}
                                  aria-hidden="true"
                                />
                                <motion.span
                                  className="sidebar-module__active-indicator"
                                  layoutId="sidebar-active-indicator"
                                  transition={{
                                    type: "spring",
                                    stiffness: 520,
                                    damping: 42,
                                  }}
                                  aria-hidden="true"
                                />
                              </>
                            )}
                            <span
                              className="sidebar-module__icon"
                              aria-hidden="true"
                            >
                              <RuneIcon
                                name={item.icon}
                                type="normal"
                                size={20}
                              />
                            </span>
                            <span className="sidebar-module__label">
                              {item.label}
                            </span>
                          </>
                        )}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}
        </LayoutGroup>
      </nav>
    </aside>
  );
}
