import { useCallback, useLayoutEffect, useState } from "react";
import { flushSync } from "react-dom";

export type ThemeMode = "light" | "dark";

const THEME_STORAGE_KEY = "hris-theme";

type ThemeToggleEvent = Pick<MouseEvent, "clientX" | "clientY">;

type ViewTransitionDocument = Document & {
  startViewTransition?: (callback: () => void) => {
    finished: Promise<void>;
  };
};

function getInitialTheme(): ThemeMode {
  const savedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);

  if (savedTheme === "light" || savedTheme === "dark") {
    return savedTheme;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export function useTheme() {
  const [theme, setTheme] = useState<ThemeMode>(getInitialTheme);

  useLayoutEffect(() => {
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  const toggleTheme = useCallback((event?: ThemeToggleEvent) => {
    const root = document.documentElement;
    const originX = event?.clientX || window.innerWidth / 2;
    const originY = event?.clientY || window.innerHeight / 2;

    root.style.setProperty("--theme-wipe-x", `${originX}px`);
    root.style.setProperty("--theme-wipe-y", `${originY}px`);

    const updateTheme = () => {
      flushSync(() => {
        setTheme((currentTheme) =>
          currentTheme === "light" ? "dark" : "light",
        );
      });
    };

    const transitionDocument = document as ViewTransitionDocument;
    if (!transitionDocument.startViewTransition) {
      updateTheme();
      root.style.removeProperty("--theme-wipe-x");
      root.style.removeProperty("--theme-wipe-y");
      return;
    }

    const transition = transitionDocument.startViewTransition(updateTheme);
    const clearWipeOrigin = () => {
      root.style.removeProperty("--theme-wipe-x");
      root.style.removeProperty("--theme-wipe-y");
    };

    void transition.finished.then(clearWipeOrigin, clearWipeOrigin);
  }, []);

  return {
    theme,
    setTheme,
    toggleTheme,
    isDark: theme === "dark",
  };
}
