import { StrictMode } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import type { CSSProperties } from "react";
import "@/index.css";
import "@/main.css";
import { useTheme } from "@/hooks/useTheme";
import { HeaderLayout } from "@/layouts/HeaderLayout";
import { SidebarLayout } from "@/layouts/SidebarLayout";
import { AppRoutes } from "@/routes";
import { THEME } from "@/utils/THEME";

type ScrollbarProperties = CSSProperties & {
  "--scrollbar-thumb": string;
  "--scrollbar-thumb-hover": string;
  "--scrollbar-track": string;
};

function WebApp() {
  const { theme, isDark, toggleTheme } = useTheme();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const mobileMenuButtonRef = useRef<HTMLButtonElement>(null);
  const scrollbarColors = isDark ? THEME.scrollbar.dark : THEME.scrollbar.light;
  const scrollbarStyle: ScrollbarProperties = {
    "--scrollbar-thumb": scrollbarColors.thumb,
    "--scrollbar-thumb-hover": scrollbarColors.thumbHover,
    "--scrollbar-track": scrollbarColors.track,
  };
  const closeMobileSidebar = useCallback(() => {
    setMobileSidebarOpen(false);
    if (window.matchMedia("(max-width: 760px)").matches) {
      window.requestAnimationFrame(() => mobileMenuButtonRef.current?.focus());
    }
  }, []);

  useEffect(() => {
    const desktopQuery = window.matchMedia("(min-width: 761px)");
    const closeOnDesktop = (event: MediaQueryListEvent) => {
      if (event.matches) setMobileSidebarOpen(false);
    };
    desktopQuery.addEventListener("change", closeOnDesktop);
    return () => desktopQuery.removeEventListener("change", closeOnDesktop);
  }, []);
  const toggleMobileSidebar = useCallback(() => {
    if (mobileSidebarOpen) {
      closeMobileSidebar();
      return;
    }
    setMobileSidebarOpen(true);
  }, [closeMobileSidebar, mobileSidebarOpen]);

  return (
    <div className="app-shell" style={scrollbarStyle}>
      <HeaderLayout
        theme={theme}
        isDark={isDark}
        onThemeToggle={toggleTheme}
        mobileSidebarOpen={mobileSidebarOpen}
        onMobileSidebarToggle={toggleMobileSidebar}
        mobileMenuButtonRef={mobileMenuButtonRef}
      />
      <div className="app-workspace">
        {mobileSidebarOpen && <button className="sidebar-backdrop" type="button" aria-label="Close module navigation" onClick={closeMobileSidebar} />}
        <SidebarLayout mobileOpen={mobileSidebarOpen} onClose={closeMobileSidebar} />
        <main className="app-content themed-scrollbar"><AppRoutes /></main>
      </div>
    </div>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter><WebApp /></BrowserRouter>
  </StrictMode>,
);
